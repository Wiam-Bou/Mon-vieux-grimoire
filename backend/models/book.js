const mongoose = require('mongoose');

// Schéma de données pour l'évaluation
const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    grade: { type: Number, required: true }
});

// Schéma de données pour les livres
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [ratingSchema], // Ajouter les évaluations comme tableau d'objets
    averageRating: { type: Number, default: 0 } // Ajouter la note moyenne
});

module.exports = mongoose.model('Book', bookSchema); // Transformer en modèle utilisable