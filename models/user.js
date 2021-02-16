var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);
// var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    mobile: {
        type: Number,
        required: false,
    },
    file: { type: String },
    fileSource: { type: String }
});

module.exports = mongoose.model('users', UserSchema);