const {Router} = require('express')
const router = Router()
const {serialsValidators} = require('../utils/validators')
const {validationResult} = require('express-validator')
const Serials = require('../models/serials')
const auth = require('../middleware/auth')


router.get('/', auth, (req, res) => {
    res.render('serials', {
        title: 'Про сериалы',
        isSerials: true
    })
})
router.post('/', auth, serialsValidators, async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('serials', {
            title: "Добавить сериал",
            isSerials: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                voice_acting: req.body.voice_acting,
                img: req.body.img,
            }
        })
    }

    const serials = new Serials({
        title: req.body.title,
        voice_acting: req.body.voice_acting,
        img: req.body.img,
        userId: req.user
    })
    try {
        await serials.save()
        res.redirect('/news')
    } catch (e) {
        console.log(e)
    }
})


module.exports = router
