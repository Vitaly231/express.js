const {Router} = require('express')
const router = Router()
const Serials = require('../models/serials')
const auth = require('../middleware/auth')

function mapCartItems(cart) {
return cart.items.map( c => ({
    ...c.filmId._doc,
    id: c.filmId.id,
    count: c.count
    })
)
}

function computeVoice_Acting (serials){
    return serials.reduce( (total, film) => {
return total += film.voice_acting * film.count
    }, 0
    )
}

router.post('/add', auth, async (req, res) => {
const film = await Serials.findById(req.body.id).lean()
       await req.user.addToCart(film)
       res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req, res) => {
   await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.filmId').execPopulate()
    const serials = mapCartItems(user.cart)
    const cart = {
serials, voice_acting: computeVoice_Acting(serials)
    }

    res.status(200).json(cart)
})

router.get('/', auth, async (req, res) => {
    const user = await req.user
        .populate('cart.items.filmId')
            .execPopulate()

    const serials = mapCartItems(user.cart)
    res.render('card', {
        title: 'Корзина',
        isCard: true,
        serials: serials,
        voice_acting: computeVoice_Acting(serials)
    })
})

module.exports = router