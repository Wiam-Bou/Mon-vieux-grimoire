const express = require('express'); // Importer le module express 
const cors = require('cors');
const mongoose = require("mongoose");

const bookRoutes = require('./routes/book'); //importer la route des books
const userRoutes = require('./routes/user'); //importer la route des users

require('dotenv').config();

// Création de l'application express 
const app = express(); 

// Middleware pour parser le JSON
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
mongoose.connect(mongoUri)
  .then(() => console.log('Connexion à MongoDB réussie !')) // Message si la connexion est réussie
  .catch((err) => {
    console.error('Connexion à MongoDB échouée !', err); // Message si la connexion échoue
    process.exit(1); // Arrêt du processus en cas d'erreur
  });

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

 
    
 
    
console.log('MongoDB URI:', mongoUri);


// Démarrage du serveur
const PORT = 4000; 
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = app; // exporter pour pouvoir y accéder à partir d'autres fichiers