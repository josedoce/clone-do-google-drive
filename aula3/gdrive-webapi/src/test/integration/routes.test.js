import {
  describe,
  jest,
  expect,
  beforeEach,
  test,
  beforeAll, //antes de tudo
  afterAll //depois de tudo
} from '@jest/globals';
/**
 * form-data serve para lidar com arquivos
 */
import FormData from 'form-data';
import fs from 'fs';
import { logger } from '../../logger';
import { Routes } from '../../routes/Routes';
import { TestUtil } from '../_util/testUtil';
import {tmpdir} from 'os';
import {join} from 'path';

describe('#Routes Integration Test',()=>{
  describe('#getFilesStatus', ()=>{
    let defaultDownloadsFolder = '';
    beforeAll(async()=>{//antes crie uma pasta.s
      defaultDownloadsFolder = await fs.promises.mkdtemp(join(tmpdir(), 'downloads-'))
    });
    afterAll(async()=>{//depois delete a pasta.
      //console.log('defaultDownloadsFolder',defaultDownloadsFolder); //para vê onde foi colocado o arquivo.
      await fs.promises.rm(defaultDownloadsFolder, {recursive: true})
    });
    beforeEach(()=>{
      jest.spyOn(logger, 'info').mockImplementation();
    });
    const ioObj = {
      to: (id) => ioObj,
      emit: (event, message) => {}
    };
   
    test('should upload file to the folder', async ()=> {
      const filename = 'code.png';
      const fileStream = fs.createReadStream(`./src/test/integration/mocks/${filename}`);
      const response = TestUtil.generateWriteStream(()=>{});
      const form = new FormData();
      form.append('phono', fileStream);
      const defaultParams = {
        request: Object.assign(form, {
          headers: form.getHeaders(),
          method: 'POST',
          url: '?socketId=10'
        }),
        response: Object.assign(response, {
          setHeader: jest.fn(),
          writeHead: jest.fn(),
          end: jest.fn(),
        }),
        values: () => Object.values(defaultParams)
      }

      const routes = new Routes(defaultDownloadsFolder); 
      routes.setSocketInstance(ioObj);
      const dirBeforeRan = await fs.promises.readdir(defaultDownloadsFolder);
      expect(dirBeforeRan).toEqual([])
      await routes.handler(...defaultParams.values());
      const dirAfterRan = await fs.promises.readdir(defaultDownloadsFolder);
      expect(dirAfterRan).toEqual([filename]);

      expect(defaultParams.response.writeHead).toHaveBeenCalledWith(200);

      const expectedResult = JSON.stringify({result: 'Files uploaded with success!'});
      expect(defaultParams.response.end).toHaveBeenCalledWith(expectedResult);
    });
  });
});