

const express = require('express');
const bookCtrl = require('../controllers/book') ; 
const auth = require('../middleware/auth');
const upload = require('../middleware/multer-config')
const multer = require('../middleware/multer-config')
const router = express.Router(); // creation du router
// route pour creation de livre
router.post('/', auth, upload,bookCtrl.createBook)

//modification 
router.put('/', auth,upload,bookCtrl.modifyBook)

//route pour la suppression
router.delete('/', auth,bookCtrl.deleteBook)

//route pour avoir les infos d'un seul livre
router.get('/', auth,bookCtrl.getOneBook)

//route pour avoir les infos de tous les livres
router.get('/', auth,bookCtrl.getAllBooks)
module.exports = router;