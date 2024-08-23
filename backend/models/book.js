//creation d'un schema de données 

const mongoose = require('mongoose');

//schema de données pour l'évaluation
const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    grade: { type: Number, required: true }
});

//schema de données pour les livres
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
});

module.exports = mongoose.model('Book', bookSchema); // transformer en model utilisable