const express = require('express');
const router = express.Router(); // instance du routeur Express pour définir les routes des livres
const auth = require('../middleware/auth'); // Middleware d'authentification
const upload = require('../middleware/multer-config'); // Middleware pour gérer les fichiers (upload)
const resizeImage = require('../middleware/sharp-config'); // Middleware pour redimensionner les images
const bookCtrl = require('../controllers/book');



// Définition des routes avec les middlewares et les contrôleurs associés

// Route pour créer un livre (POST /api/books/)
// Authentification requise, suivi de l'upload de l'image, redimensionnement de l'image, puis appel du contrôleur
router.post('/', auth, upload.single('image'), resizeImage, bookCtrl.createBook);

// Route pour modifier un livre existant (PUT /api/books/:id)
// Authentification requise, suivi de l'upload de l'image, redimensionnement de l'image, puis appel du contrôleur
router.put('/:id', auth, upload.single('image'), resizeImage, bookCtrl.modifyBook);

// Route pour supprimer un livre (DELETE /api/books/:id)
// Authentification requise, puis appel du contrôleur pour supprimer le livre
router.delete('/:id', auth, bookCtrl.deleteBook);

// Route pour obtenir les livres les mieux notés (GET /api/books/bestrating)
// Aucun middleware d'authentification, le contrôleur récupère les livres avec les meilleures notes
router.get('/bestrating', bookCtrl.getBestRatedBooks);

// Route pour ajouter une note à un livre (POST /api/books/:id/rating)
// Authentification requise, puis appel du contrôleur pour ajouter la note
router.post('/:id/rating', auth, bookCtrl.rateBook);

// Route pour obtenir un livre spécifique (GET /api/books/:id)
// Aucune authentification, le contrôleur récupère un livre par son ID
router.get('/:id', bookCtrl.getOneBook);

// Route pour obtenir tous les livres (GET /api/books/)
// pas d'authentification, le contrôleur récupère tous les livres
router.get('/', bookCtrl.getAllBooks);

module.exports = router; // Exportation du routeur pour être utilisé dans l'application principale