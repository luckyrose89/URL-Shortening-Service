var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
    originalUrl: String,
    shortUrl: String
}, {
    timestamps: {
        createdAt: 'created_at'
    }
});

const urlModel = mongoose.model('shortUrl', urlSchema);

module.exports = urlModel;