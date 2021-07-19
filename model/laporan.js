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
    },
})

module.exports = Laporan