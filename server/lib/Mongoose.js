const Config   = require('../config'),
      mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URL)

module.exports = mongoose