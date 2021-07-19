const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { get } = require('mongoose')

require('./utils/db')
const User = require('./model/user')
const Laporan = require('./model/laporan')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
)

app.post('/login', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    const getUser = User.findOne({ email: email })
        .then(getUser => {
            if (getUser) {
                if (password === getUser.password) {
                    token = jwt.sign({ email: getUser.email }, 'fradotech20012021.01082000.20052003', { expiresIn: '60m' })

                    res.cookie('token', token)
                    res.cookie('user', getUser)

                    res.redirect('/')

                } else {
                    res.render('login', {
                        layout: 'layouts/main-layout',
                        title: 'Radja Chicken',
                        message: 'Password salah! Coba lagi!',
                        messageClass: 'alert-danger',
                        user: null
                    })
                }
            } else {
                res.render('login', {
                    layout: 'layouts/main-layout',
                    title: 'Radja Chicken',
                    message: 'Email salah! Coba lagi!',
                    messageClass: 'alert-danger',
                    user: null
                })
            }
        })
})

app.get('/register', (req, res) => {
    res.render('register', {
        layout: 'layouts/main-layout',
        title: 'Radja Chicken',
        message: '',
        messageClass: 'alert-success',
        user: null
    })
})

app.post('/register', (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        laporan: []
    })

    user.save()
        .then(user => {
            res.render('login', {
                layout: 'layouts/main-layout',
                title: 'Radja Chicken',
                message: 'Pendaftaran berhasil! Silakan login!',
                messageClass: 'alert-success',
                user: null
            })
        })
        .catch(err => {
            res.json({
                status: 'Gagal Daftar'
            })
        })
})

//Admin Area

app.use( async (req, res, next) => {
    const token = await req.cookies['token']
    req.user = await req.cookies['user']
    if (req.user) {
        next()
    } else {
        res.render('login', {
            layout: 'layouts/main-layout',
            title: 'Radja Chicken',
            message: 'Anda perlu login dahulu!',
            messageClass: 'alert-danger',
            user: null
        })
    }
})

app.get('/', (req, res) => {
    Laporan.find({ user: req.user.email }).then(laporans => {
        res.render('index', {
            layout: 'layouts/main-layout',
            title: 'Radja Chicken',
            user: req.user,
            laporans
        })
    })
})

app.get('/tambah-laporan', (req, res) => {
    res.render('tambah-laporan', {
        layout: 'layouts/main-layout',
        title: 'Radja Chicken',
        user: req.user
    })
})

app.post('/tambah-laporan', async (req, res) => {
    const laporan = new Laporan (
    {
        user: req.user.email,
        nama: req.body.name,
        staff: req.body.staff,
        date: req.body.date,
        data: {}
    })
            
    laporan.save()
    .then(laporan => {
        res.redirect('/')
    })
    .catch(err => {
        res.json({
            status: 'Gagal'
        })
    })
})

app.get('/profile', (req, res) => {
    res.render('profile', {
        layout: 'layouts/main-layout',
        title: 'Radja Chicken',
        user: req.user
    })
})

app.get('/logout', (req, res) => {
    cookie = req.cookies
    for (let prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue
        }
        res.cookie(prop, '', { expires: new Date(0) })
    }
    res.redirect('/')
})

app.listen(port)