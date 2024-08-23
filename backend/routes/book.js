

const express = require('express');
const Book = require('../models/book');
const bookCtrl = require('../controllers/book') ; 
const auth = require('../middleware/auth');
const router = express.Router(); // creation du router
// route pour creation de livre
router.post('/', auth, bookCtrl.createBook)

//modification 
router.put('/', auth,bookCtrl.modifyBook)

//route pour la suppression
router.delete('/', auth,bookCtrl.deleteBook)

//route pour avoir les infos d'un seul livre
router.get('/', auth,bookCtrl.getOneBook)

//route pour avoir les infos de tous les livres
router.get('/', auth,bookCtrl.getAllBooks)
module.exports = router;