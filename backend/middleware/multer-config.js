const multer = require('multer');

// Configuration de `multer` pour utiliser la mémoire
const storage = multer.memoryStorage();

// Filtrage des fichiers pour n'accepter que certains types MIME
const fileFilter = (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Le fichier n\'est pas valide. Seuls les fichiers JPG, JPEG, PNG et WEBP sont acceptés.'), false);
    }
};

// Configuration de `multer` avec le stockage, le filtrage et les limites de taille
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 } // Limite de taille des fichiers
});

module.exports = upload;