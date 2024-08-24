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

// chercher un livre par son id et retourner ses détails
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: "Livre non trouvé" });
            }
            res.status(200).json(book);
        })
        .catch(error => res.status(400).json({ error }));
};

//fonction pour obtenir tous les livres 
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

// fonction pour permettre a l'utilisateur de noter un livre 
exports.rateBook = (req, res, next) => {
    const { userId, rating } = req.body;

    // Rechercher le livre par ID
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: "Livre non trouvé" });
            }

            // Vérifier si le livre est déjà noté 
            const existingRatingIndex = book.ratings.findIndex(r => r.userId.toString() === userId);
            if (existingRatingIndex !== -1) {
                return res.status(400).json({ message: "Vous avez déjà noté ce livre" });
            }

            // Ajouter la nouvelle note
            book.ratings.push({ userId, grade: rating });

            // Calculer la nouvelle moyenne des notes
            const averageRating = book.ratings.reduce((acc, curr) => acc + Number(curr.grade), 0) / book.ratings.length;
            book.averageRating = averageRating;

            // Sauvegarder les changements
            book.save()
                .then(() => res.status(200).json(book))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};