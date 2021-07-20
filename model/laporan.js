const mongoose = require('mongoose')

const Laporan = mongoose.model('Laporan', {
    user: {
        type: String,
    },
    nama: {
        type: String,
    },
    staff: {
        type: String,
    },
    date: {
        type: String,
    },
    data: {
        s1: {
            datang: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            stokAwal: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            stok: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            masak: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number,
                f: Number
            },
            laku: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            etalase: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            simpan: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
        },
        s2: {
            datang: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            stokAwal: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            stok: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            masakS2: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number,
                f: Number
            },
            masak: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            lakuS2: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            laku: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            etalase: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
            simpan: {
                d: Number,
                pa: Number,
                pb: Number,
                s: Number
            },
        }
    }
})

module.exports = Laporan