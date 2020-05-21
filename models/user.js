const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExp: Date,
    avatarUrl: String,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                filmId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Serials',
                    required: true,
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function (film) {
    const items = [...this.cart.items]
    const idx = items.findIndex(c => {
        return c.filmId.toString() === film._id.toString()
    })
    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            filmId: film._id,
            count: 1
        })
    }
    /*  const newCart = {items: clonedItems}
      this.cart = newCart*/
    this.cart = {items}
    return this.save()
}

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items]
    const idx = items.findIndex(c =>  c.filmId.toString() === id.toString())
    if (items[idx].count === 1) {
        items = items.filter(c => c.filmId.toString() !== id.toString())
    } else {
        items[idx].count--
    }
    this.cart = {items}
    return this.save()
}
userSchema.methods.clearCart = function() {
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', userSchema)