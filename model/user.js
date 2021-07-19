const mongoose = require('mongoose')

const User = mongoose.model('User', {
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    laporan: {
        type: Array,
    },
})

module.exports = User