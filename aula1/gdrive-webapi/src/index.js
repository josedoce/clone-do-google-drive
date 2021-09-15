import https from 'https';
import fs from 'fs';
import {logger} from './logger.js';
import {Server} from 'socket.io';
import { Routes } from './routes/Routes.js';

const PORT = process.env.PORT || 3000;

//configurações de ssl
const localHostSSL = { 
  key: fs.readFileSync('./certificates/key.pem'),
  cert: fs.readFileSync('./certificates/cert.pem'),
}

const server = https.createServer(
  localHostSSL,
  Routes.handler.bind(Routes)
)
//configs socket io
const io = new Server({
  cors: {
    origin: '*', //qualquer dominio pode acessar
    credentials: false, //não precisa de autenticação.
  }
});

io.on("connection",(socket)=>logger.info(`someone connected id: ${socket.id}`))


const startServer = () => {
  const { address, port } = server.address();
  logger.info(`app running at https://${address}:${port}`);
}

server.listen(PORT,startServer);