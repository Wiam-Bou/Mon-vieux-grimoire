const jwt = require('jsonwebtoken'); // Importation du module jsonwebtoken pour gérer les tokens JWT.

module.exports = (req, res, next) => {
    try {
        // Récupération de l'en-tête Authorization de la requête.
        const authorizationHeader = req.headers.authorization;
        
        // Vérification de la présence de l'en-tête Authorization.
        if (!authorizationHeader) {
            throw new Error('En-tête Authorization manquant');
        }

        // Extraction du token JWT de l'en-tête Authorization.
        const token = authorizationHeader.split(' ')[1];
        
        // Vérification de la présence du token dans l'en-tête Authorization.
        if (!token) {
            throw new Error('Token manquant');
        }

        // Vérification et décodage du token JWT avec la clé secrète.
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Extraction de l'ID utilisateur (userId) du token décodé.
        const userId = decodedToken.userId;
        
        // Ajout de l'ID utilisateur à l'objet req.auth pour l'utiliser dans les prochains middlewares ou contrôleurs.
        req.auth = { userId };
        
        // Passage au middleware ou contrôleur suivant.
        next();
    } catch (error) {
        // En cas d'erreur (par exemple, token invalide ou manquant), renvoie une réponse 401 Unauthorized avec un message d'erreur.
        res.status(401).json({ error: 'Requête non autorisée' });
    }
};