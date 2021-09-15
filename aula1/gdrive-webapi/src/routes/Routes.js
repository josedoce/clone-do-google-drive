import { logger } from "../logger.js";
import { FileHelper } from "../utils/FileHelper.js";
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDownloadsFolder = resolve(__dirname, '../../',"downloads");

class Routes {
  io;
  constructor(downloadsFolder = defaultDownloadsFolder){
    this.downloadsFolder = downloadsFolder;
    this.fileHelper = FileHelper;
  }
  setSocketInstance(io) {
    this.io = io;
  }

  async defaultRoute(req, res){
    res.end("hello world");
  }

  async options(req, res){
    res.writeHead(204);
    res.end();
  }

  async post(req, res){
    logger.info('post');
    res.end();
  }

  async get(req, res){
    logger.info('get');
    const files = await this.fileHelper.getFileStatus(this.downloadsFolder);
    res.writeHead(200);
    res.end(JSON.stringify(files));
  }

  handler(req, res){//enviará o cabeçalho de permissão ao cors
    res.setHeader('Access-Control-Allow-Origin','*');
    //aqui ele direcionará para a rota.
    const chosen = this[req.method.toLowerCase()] || this.defaultRoute
    // obsmethod() == method.apply()
    return chosen.apply(this, [req, res]);
  }

}
const route = new Routes();
export {route as Routes};