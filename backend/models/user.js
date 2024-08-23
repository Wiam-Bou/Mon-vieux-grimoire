const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator')

// creation d'un schema de données pour user

const userSchema = mongoose.Schema({
    email:{type: String, required:true, unique:true}, // unique: s'inscrire avc un seul mail
    password:{type: String, required:true}
})

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema) 