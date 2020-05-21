const {Router} = require('express')
const Serials = require('../models/serials')
const router = Router()
const auth = require('../middleware/auth')
const {serialsValidators} = require('../utils/validators')
const {validationResult} = require('express-validator')

function isOwner (film, req) {
    return film.userId.toString() === req.user._id.toString()
    }

router.get('/:id', async (req, res) => {
    try {
        const film = await Serials.findById(req.params.id).lean()
        res.render('film', {
            layout: 'empty',
            title: `Сериал: ${film.title}`,
            film
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/', async (req, res) => {
    try {
        const serials = await Serials.find().lean()
            .populate('userId', "email name")
            .select('voice_acting title img')

        res.render('news', {
            title: 'События',
            isNews: true,
            userId: req.user ? req.user._id.toString() : null,
            serials
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/edit', auth, serialsValidators, async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/news/${req.body.id}/edit?allow=true`)
    }

    try {
        const film = await Serials.findById(req.body.id)
        if (!isOwner(film, req)) {
            return res.redirect('/news')
        }
        Object.assign(film, req.body)
        await film.save()
       //данная строка заменена выше 2-мя строками await Serials.findByIdAndUpdate(req.body.id, req.body).lean()
        res.redirect('/news')
    } catch (e) {
        console.log(e)
    }

})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const film = await Serials.findById(req.params.id).lean()
        if (!isOwner(film, req)) {
            return res.redirect('/news')
        }
        res.render('news-edit', {
            title: `Редактировать ${film.title}`,
            film
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Serials.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/news')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
