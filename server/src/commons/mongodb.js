
const CONFIG = require('../../config/config');
const mongoose = require('mongoose');

mongoose.connect(CONFIG.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})