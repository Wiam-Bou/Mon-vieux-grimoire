
const bcrypt = require('bcrypt'); // importer le package de cryptage
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// fonction pour l'enregistrement d'un utilisateur
exports.signUp = (req,res,next)=>{
bcrypt.hash(req.body.password, 10)
.then(hash =>{
    console.log("Hashed password:", hash);
    const user = new User({
        email: req.body.email,
        password : hash
    });
    user.save() // enregitrer le mp haché dans la BD *
    .then(() => res.status(201).json({message :"Utilisateur créé"}))
    .catch(error => res.status(500).json({error}));
})
.catch(error => res.status(400).json({error}))
}

//fonction pour la connexion d'un utilisateur existant

exports.login = (req,res,next)=>{
User.findOne({email:req.body.email})
.then( user =>{
    if (user === null){
        res.status(401).json({message : "Échec de la connexion : identifiant ou mot de passe erroné."});
    }else{
        bcrypt.compare(req.body.password, user.password)
        .then( valid => {
        if(!valid){
            res.status(401).json({message:"Échec de la connexion : identifiant ou mot de passe erroné."})
        }else{
            res.status(200).json({
                userId:user._id,
                token:jwt.sign( // on chiffre le token avec la fonction sign de jwt
                    {userId:user._id},
                    'secret_key-token',
                    {expiresIn:'24h'}
                )
            })
        }
        })
        .catch( error =>{
            res.status(500).json({error })
        })
    }
})
.catch(error => {
    res.status(500).json({error})
})

}