const {Router} = require('express')
const router = Router()
const Order = require('../models/order')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({'user.userId': req.user._id})
    .populate('user.userId')

        res.render("orders", {
            isOrder: true,
            title: 'Заказы',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    voice_acting: o.serials.reduce( (total, f) => {
                        return total += f.count * f.film.voice_acting
                    }, 0)
                }
            })
        })
    } catch (e) {
        console.log(e)
    }

})
router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.filmId')
            .execPopulate()
        const serials = await user.cart.items.map( i => ({
            count: i.count,
            film: {...i.filmId._doc}
        }))
        const order = new Order ({
            user: {
                name: req.user.name,
                userId: req.user
            },
            serials: serials
        })

        await order.save()
        await req.user.clearCart()
        res.redirect('/orders')
    } catch (e) {
        console.log(e)
    }

})

module.exports = router