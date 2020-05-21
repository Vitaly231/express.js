const {Schema, model} = require('mongoose')

const orderSchema = new Schema({
    serials: [
        {
            film: {
                type: Object,
                required: true,
            },
            count: Number,
        },
    ],
    user: {
        name: String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Order', orderSchema)