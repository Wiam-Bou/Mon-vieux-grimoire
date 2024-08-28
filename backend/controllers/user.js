// Importation des bibliothèques nécessaires
const bcrypt = require("bcrypt"); // Pour le hachage des mots de passe
const jwt = require("jsonwebtoken"); // Pour la création et la gestion des JSON Web Tokens
const User = require("../models/User"); // Modèle de données utilisateur
const validator = require("validator"); // Pour la validation des données (comme les emails)

// Fonction pour l'inscription d'un nouvel utilisateur
exports.signUp = (req, res, next) => {
  // Vérification que l'email est au format valide
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ message: "Format d'email invalide." });
  }

  // Hachage du mot de passe fourni avec un "salt rounds" de 10
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      // Sauvegarde de l'utilisateur dans la base de données
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "Utilisateur créé avec succès !" })
        )
        .catch((error) => {
          // Gestion des erreurs lors de la sauvegarde de l'utilisateur
          if (error.code === 11000) {
            // Code d'erreur pour les doublons dans MongoDB
            return res
              .status(400)
              .json({ message: "Cet utilisateur existe déjà." });
          }
          res
            .status(500)
            .json({ message: "Erreur lors de la création de l'utilisateur." });
        });
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Erreur lors du hachage du mot de passe." })
    );
};

// Fonction pour la connexion d'un utilisateur
exports.login = (req, res, next) => {
  // Vérification que l'email est au format valide
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ message: "Format d'email invalide." });
  }

  // Recherche de l'utilisateur dans la base de données par email
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Si l'utilisateur n'existe pas, renvoyer une erreur
      if (!user) {
        return res.status(401).json({ message: "Compte inexistant." });
      }

      // Comparaison du mot de passe fourni avec le mot de passe haché dans la base de données
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si les mots de passe ne correspondent pas, renvoyer une erreur
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire identifiant/mot de passe incorrecte." });
          }

          // Vérification que la clé secrète JWT est définie
          if (!process.env.JWT_SECRET) {
            console.error("La clé secrète JWT est absente.");
            return res
              .status(500)
              .json({ message: "Erreur de configuration du serveur." });
          }

          // Création d'un token JWT avec l'ID de l'utilisateur, signé avec la clé secrète
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET, // Clé secrète pour signer le token
            { expiresIn: "24h" } // Le token expire après 24 heures
          );

          // Envoi de la réponse avec l'ID de l'utilisateur et le token
          res.status(200).json({ userId: user._id, token });
        })
        .catch((error) =>
          res
            .status(500)
            .json({
              message: "Erreur lors de la comparaison des mots de passe.",
            })
        );
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Erreur lors de la recherche de l'utilisateur." })
    );
};
