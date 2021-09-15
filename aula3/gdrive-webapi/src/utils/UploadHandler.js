import BusBoy from 'busboy';
import { pipeline } from 'stream/promises';
import fs from 'fs';
import { logger } from '../logger.js';
/**
 * Usando o busboy para saber e enviar progresso 
 */
class UploadHandler {
  constructor({io, socketId, downloadsFolder, messageTimeDelay = 200}){
    this.io = io;
    this.socketId = socketId;
    this.downloadsFolder = downloadsFolder;
    this.ON_UPLOAD_EVENT = 'file-upload';
    this.messageTimeDelay = messageTimeDelay;
  }
  /**
   * Bloqueador de envio de dados.
  */
  canExecute(lastExecution) {
    return (Date.now() - lastExecution) >= this.messageTimeDelay;
  }
  /**
   * Funil, essa classe enviará dados sobre a 
   * leitura de dados e escrita no disco para o usuário.
  */
  handleFileBytes(filename){
    
    this.lastMessageSent = Date.now();
    async function* handleData(source) {
      let processedAlready = 0;
      for await(const chunk of source) {
        yield chunk;
        processedAlready+= chunk.length; //somará o tamanho
        if(!this.canExecute(this.lastMessageSent)){
          continue;
        }
        this.lastMessageSent = Date.now();
        this.io.to(this.socketId).emit(this.ON_UPLOAD_EVENT, {processedAlready, filename});
        logger.info(`File [${filename}] got ${processedAlready} bytes to ${this.socketId}`);
      }
    }
    return handleData.bind(this);
  }

  async onFile(fieldname, file, filename) {
    /**
     * Onde será salvo.
    */
    const saveTo = `${this.downloadsFolder}/${filename}`;
    await pipeline(
      /**
       * pega a informação que veio da fonte de dados(readable stream). 
       * */
      file,
      /**
       * Filtrar, converter, transformar dados
      */
      this.handleFileBytes.apply(this, [filename]),
      /**
       * Saida do processo.
       */
      fs.createWriteStream(saveTo)
    );
    logger.info(`File [${filename}] fineshed`)

  }

  registerEvents(headers, onFinish) {
    const busBoy = new BusBoy({headers});
    busBoy.on('file',this.onFile.bind(this));
    busBoy.on('finish', onFinish);
    return busBoy;
  }
}

export {UploadHandler};