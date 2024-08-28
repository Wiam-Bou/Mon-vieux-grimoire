const express = require('express'); // importer le module express pour créer un router
const router = express.Router(); // instance crée pour défénir les routes

// importer les controllers pour traiter les req liées à la connex et l'inscription
const userCtrl = require('../controllers/user');

//définition des routes
router.post('/signUp', userCtrl.signUp)
router.post('/login', userCtrl.login)

module.exports = router;