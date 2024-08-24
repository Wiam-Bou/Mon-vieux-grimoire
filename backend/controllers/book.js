const Book = require("../models/book");
const fs = require('fs');

// Fonction pour créer un nouveau book
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id; // On le supprime car l'ID est généré automatiquement
    delete bookObject._userId; // On utilise le userId qui vient du token
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        
    });
    console.log('Image URL:', book.imageUrl)

    // Sauvegarder le livre dans la BD 
    book.save()
        .then(() => res.status(201).json({ message: "Livre enregistré" }))
        .catch(error => res.status(400).json({ error }));
}

// Modifier un livre
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...JSON.parse(req.body.book) };

    delete bookObject._userId;

    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                return res.status(400).json({ message: "Non-autorisé" });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Livre modifié avec succès !" }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

// Suppression d'un livre 
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => { // vérifier si c'est le bon user qui demande de supprimer
            if (book.userId != req.auth.userId) {
                return res.status(401).json({ message: "Non-Autorisé" });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Livre supprimé avec succès !" }))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    // Code pour obtenir un seul livre
};

exports.getAllBooks = (req, res, next) => {
    // Code pour obtenir tous les livres
};