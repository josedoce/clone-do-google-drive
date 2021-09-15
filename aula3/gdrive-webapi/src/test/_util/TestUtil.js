import {Readable, Transform, Writable} from 'stream';
import {jest} from '@jest/globals';

class TestUtil {

  static mockDateNow(mockImplementationPeriods = []) {
   
    const now = jest.spyOn(global.Date, global.Date.now.name);
    mockImplementationPeriods.forEach((time) => {
      now.mockReturnValueOnce(time);
    });
  }

  static getTimeFromDate(dateString) {
    return new Date(dateString).getTime();
  }
  /**
   * Lé a fonte
  */
  static generateReadableStream(data) {
    return new Readable({
      objectMode: true, //pode retornar Sem ser buffer
      read() {
        for(const item of data) {
          this.push(item)
        }
        this.push(null)
      }
    });
  }

  /**
   * Escreve um novo
  */
  static generateWriteStream(onData) {
    return new Writable({
      objectMode: true,
      write(chunk, encoding, cb){
        onData(chunk);
        cb(null, chunk);
      }
    });
  }

  /**
   * Transformer
  */
  static generateTransformStream(onData) {
    return new Transform({
      objectMode: true,
      transform(chunk, encoding, cb){
        onData(chunk);
        cb(null, chunk);
      }
    })
  }
}

export {TestUtil};