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
    Laporan.find({ user: req.user.email }).sort({ date: -1 }).then(laporans => {
        res.render('index', {
            layout: 'layouts/main-layout',
            title: 'Radja Chicken',
            user: req.user,
            laporans
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
        data: {
            s1: {
                stok: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
                datang: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
                masak: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
                laku: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
                etalase: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
                simpan: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
            },
            s2: {
                stok: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
                datang: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
                masak: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
                laku: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
                etalase: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
                simpan: {
                    d: null,
                    pa: null,
                    pb: null,
                    s: null
                },
            }
        }
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

app.get('/edit-laporan/:id', (req, res) => {
    const laporan = Laporan.findOne({ _id: req.params.id })
    .then(laporan => {
        res.render('edit-laporan', {
            layout: 'layouts/main-layout',
            title: 'Radja Chicken',
            user: req.user,
            laporan
        })    
    })
})

app.post('/edit-laporan/:id', (req, res) => {
    const s1StokD = req.body.s1StokD * 1 + req.body.s1DatangD * 1
    const s1StokPA = req.body.s1StokPA * 1 + req.body.s1DatangPA * 1
    const s1StokPB = req.body.s1StokPB * 1 + req.body.s1DatangPB * 1
    const s1StokS = req.body.s1StokS * 1 + req.body.s1DatangS * 1

    const s1EtalaseD = req.body.s1MasakD * 1 - req.body.s1LakuD * 1
    const s1EtalasePA = req.body.s1MasakPA * 1 - req.body.s1LakuPA * 1
    const s1EtalasePB = req.body.s1MasakPB * 1 - req.body.s1LakuPB * 1
    const s1EtalaseS = req.body.s1MasakS * 1 - req.body.s1LakuS * 1

    const s1FreezerD = s1StokD * 1 - req.body.s1MasakD * 1
    const s1FreezerPA = s1StokPA * 1 - req.body.s1MasakPA * 1
    const s1FreezerPB = s1StokPB * 1 - req.body.s1MasakPB * 1
    const s1FreezerS = s1StokS * 1 - req.body.s1MasakS * 1
    
    // Shift 2

    const s2StokD = s1StokD * 1 + req.body.s2StokD + req.body.s2DatangD * 1
    const s2StokPA = s1StokPA * 1 + req.body.s2StokPA + req.body.s2DatangPA * 1
    const s2StokPB = s1StokPB * 1 + req.body.s2StokPB + req.body.s2DatangPB * 1
    const s2StokS = s1StokS * 1 + req.body.s2StokS + req.body.s2DatangS * 1

    const s2EtalaseD = req.body.s2MasakD * 1 - req.body.s2LakuD * 1 + s1EtalaseD * 1
    const s2EtalasePA = req.body.s2MasakPA * 1 - req.body.s2LakuPA * 1 + s1EtalasePA * 1
    const s2EtalasePB = req.body.s2MasakPB * 1 - req.body.s2LakuPB * 1 + s1EtalasePB * 1
    const s2EtalaseS = req.body.s2MasakS * 1 - req.body.s2LakuS * 1 + s1EtalaseS * 1

    const s2FreezerD = s2StokD * 1 - req.body.s2MasakD * 1 + s1FreezerD * 1
    const s2FreezerPA = s2StokPA * 1 - req.body.s2MasakPA * 1 + s1FreezerPA * 1
    const s2FreezerPB = s2StokPB * 1 - req.body.s2MasakPB * 1 + s1FreezerPB * 1
    const s2FreezerS = s2StokS * 1 - req.body.s2MasakS * 1 + s1FreezerS * 1

    const laporan = 
    {
        user: req.body.user,
        nama: req.body.nama,
        staff: req.body.staff,
        date: req.body.date,
        data: {
            s1: {
                stok: {
                    d: s1StokD,
                    pa: s1StokPA,
                    pb: s1StokPB,
                    s: s1StokS
                },
                datang: {
                    d: req.body.s1DatangD,
                    pa: req.body.s1DatangPA,
                    pb: req.body.s1DatangPB,
                    s: req.body.s1DatangS
                },
                masak: {
                    d: req.body.s1MasakD,
                    pa: req.body.s1MasakPA,
                    pb: req.body.s1MasakPB,
                    s: req.body.s1MasakS
                },
                laku: {
                    d: req.body.s1LakuD,
                    pa: req.body.s1LakuPA,
                    pb: req.body.s1LakuPB,
                    s: req.body.s1LakuS
                },
                etalase: {
                    d: s1EtalaseD,
                    pa: s1EtalasePA,
                    pb: s1EtalasePB,
                    s: s1EtalaseS
                },
                simpan: {
                    d: s1FreezerD,
                    pa: s1FreezerPA,
                    pb: s1FreezerPB,
                    s: s1FreezerS
                },
            },
            s2: {
                stok: {
                    d: s2StokD,
                    pa: s2StokPA,
                    pb: s2StokPB,
                    s: s2StokS
                },
                datang: {
                    d: req.body.s2DatangD,
                    pa: req.body.s2DatangPA,
                    pb: req.body.s2DatangPB,
                    s: req.body.s2DatangS
                },
                masak: {
                    d: req.body.s2MasakD,
                    pa: req.body.s2MasakPA,
                    pb: req.body.s2MasakPB,
                    s: req.body.s2MasakS
                },
                laku: {
                    d: req.body.s2LakuD,
                    pa: req.body.s2LakuPA,
                    pb: req.body.s2LakuPB,
                    s: req.body.s2LakuS
                },
                etalase: {
                    d: s2EtalaseD,
                    pa: s2EtalasePA,
                    pb: s2EtalasePB,
                    s: s2EtalaseS
                },
                simpan: {
                    d: s2FreezerD,
                    pa: s2FreezerPA,
                    pb: s2FreezerPB,
                    s: s2FreezerS
                },
            },
        }
    }

    Laporan.findOneAndUpdate({ _id: req.params.id }, laporan, { new: true }, async (err, doc) => {
        if(!err) {
            const laporan = Laporan.findOne({ _id: req.params.id })
            res.render('edit-laporan', {
                layout: 'layouts/main-layout',
                title: 'Radja Chicken',
                user: req.user,
                laporan
            })    
        }
        else {
            console.log(laporan)
        }
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