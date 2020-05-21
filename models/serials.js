const {Schema, model} = require('mongoose')

const serialsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    voice_acting: {
        type: Number,
        required: true
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

serialsSchema.method('toClient', function () {
    const film = this.toObject()
    film.id = film._id
    delete film._id
    return film
})

module.exports = model('Serials', serialsSchema)