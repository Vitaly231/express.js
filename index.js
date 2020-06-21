const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')
const app = express()
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const newsRoutes = require('./routes/news')
const serialsRoutes = require('./routes/serials')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const session = require('express-session')
const varMiddleware = require('./middleware/variables')
const MongoStore = require('connect-mongodb-session')(session)
const userMiddleware = require('./middleware/user')
const csrf = require('csurf')
const flash = require('connect-flash')
const keys = require('./keys')
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
})
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI,
})

app.engine('hbs', hbs.engine,)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, "public")))
app.use('/images', express.static(path.join(__dirname, "images")))

app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))

app.use(csrf())
app.use(flash())
app.use(helmet())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)


app.use(homeRoutes)
app.use('/news', newsRoutes)
app.use('/serials', serialsRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use(errorHandler)


const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()


