const http = require('http');
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
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// fonction pour chercher les erreurs 
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
