const mongoose = require('mongoose');

// plugin  utilisé pour ajouter des validations de champ unique ( vérifiier l'unicité des valeurs d'un champs) 
const uniqueValidator = require('mongoose-unique-validator') 

// Crée un schéma Mongoose pour définir la structure des documents dans la collection MongoDB.
const userSchema = mongoose.Schema({
   // unique:adresse email unique. Cela empêche l'inscription de plsr users avec le même email.
    email:{type: String, required:true, unique:true}, 
    password:{type: String, required:true}
})

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema) 