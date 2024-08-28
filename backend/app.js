const express = require('express'); // Importer le module express 
const cors = require('cors'); // midlleware pour gérer les req CORS ( req depuis domaines différents)
const mongoose = require("mongoose");
const path = require('path'); // module pour manipuler les chemins de fichiers et répertoires
const bookRoutes = require('./routes/book'); //importer la route des books
const userRoutes = require('./routes/user'); //importer la route des users

require('dotenv').config(); // chargement des variables d'environnement

// Création de l'application express 
const app = express(); 

//Middleware qui permet à Express de traiter les corps de requêtes au format JSON
app.use(express.json());

// Configuration CORS pour permettre les requêtes depuis un domaine spécifique
app.use(cors({
    origin: '*', // Autorise les requêtes qui proviennent du front-end
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes HTTP autorisées
    credentials: true // Autorise l'envoi de cookies ou d'en-têtes d'autorisation
}));

// Connexion à la base de données 
const mongoUri = process.env.MONGO_URI; // Récupération de l'URL de la base de données depuis les variables d'environnement
console.log(mongoUri)
mongoose.connect(mongoUri) // Fonction pour se connecter à la base de données MongoDB avec l'URI fourni.
  .then(() => console.log('Connexion à MongoDB réussie !')) // Message si la connexion est réussie
  .catch((err) => {
    console.error('Connexion à MongoDB échouée !', err); // Message si la connexion échoue
    process.exit(1); // Arrêt du processus en cas d'erreur
  });

app.use('/api/books', bookRoutes); //Toutes les requêtes à /api/books seront gérées par bookRoutes
app.use('/api/auth', userRoutes); //Toutes les requêtes à /api/auth seront gérées par userRoutes.

//Sert les fichiers statiques (images) à partir du répertoire images
app.use('/images', express.static(path.join(__dirname,'images')));

 
    
 
    
console.log('MongoDB URI:', mongoUri);



module.exports = app; // exporter pour pouvoir y accéder à partir d'autres fichiers