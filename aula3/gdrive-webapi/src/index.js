import https from 'https';
import http from 'http'; //o heroku usa o http, internamente.
import fs from 'fs';
import {logger} from './logger.js';
import {Server} from 'socket.io';
import { Routes } from './routes/Routes.js';

const PORT = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === "production";
process.env.USER = process.env.USER ?? 'system_user';

//configurações de ssl
const localHostSSL = { 
  key: fs.readFileSync('./certificates/key.pem'),
  cert: fs.readFileSync('./certificates/cert.pem'),
}

//se em produção, será http, senao, será https
const protocol = isProduction ? http : https;
const sslConfig = isProduction?{}:localHostSSL;

const routes = new Routes();
const server = protocol.createServer(
  sslConfig,
  routes.handler.bind(routes),
)
//configs socket io
const io = new Server(server, {
  cors: {
    origin: '*', //qualquer dominio pode acessar
    credentials: false, //não precisa de autenticação.
  }
});

routes.setSocketInstance(io);
io.on("connection",(socket)=>logger.info(`someone connected id: ${socket.id}`))


const startServer = () => {
  const { address, port } = server.address();
  const protocol = isProduction ? "http":"https";
  logger.info(`app running at ${protocol}://${address}:${port}`);
}

server.listen(PORT,startServer);