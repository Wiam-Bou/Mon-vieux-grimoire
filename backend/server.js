const http = require('http'); // module qui gére les req HTTP de notre appli
const app = require('./app'); // importer le fichier qui contient notre application express

// fonction pour renvoyer un port valide (nombre ou chaine )
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  // si port est nombre valide ( sup ou égal à 0) on le retourne
  if (port >= 0) {
    return port;
  }
  return false;// sinon false ( n° de port invalide)
};
const port = normalizePort(process.env.PORT ||'4000');
app.set('port', port); // définit sur quel port les requêtes sont écoutées

// fonction pour chercher les erreurs 
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES': //  se produit lorsque le serveur tente d'écouter sur un port qui nécessite des privilèges élevés
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE': // si le port est déja occupé 
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default: // pour toute erreur non spécéfiée 
      throw error;
  }
};

// création et gestion du serveur 
const server = http.createServer(app); // créer un serveur http et lui associé l'app express

server.on('error', errorHandler); // attache l'écouteur d'évenment error pour utiliser la fonction en cas d'erreur

// attache l'écouteur listening pour afficher un msg lors du début de l'écoute sur le port
server.on('listening', () => {
 // Obtient l'adresse et le port sur lesquels le serveur écoute
  const address = server.address();
  // Détermine si l'adresse est une chaîne (indiquant un "pipe") ou un objet (indiquant un port)
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
   // Affiche le message indiquant que le serveur écoute sur le port ou le pipe spécifié
  console.log('Listening on ' + bind);
});

server.listen(port);
