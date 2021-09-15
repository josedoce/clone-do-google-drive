import {
  describe,
  test, 
  jest,
  expect
} from '@jest/globals';
import {Routes} from '../../routes/Routes';
import {logger} from '../../logger.js';
import { TestUtil } from '../_util/testUtil';
import { UploadHandler } from '../../utils/UploadHandler';
describe('#Routes test swith', ()=> {
  const request = TestUtil.generateReadableStream(['some file bytes']);
  const response = TestUtil.generateWriteStream(()=>{});
  const defaultParams = {
    request: Object.assign(request, {
      headers : {
        'Content-Type':'multipart/form-data'
      },
      method: '',
      body: {}
    }),
    response: Object.assign(response, {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn(),
    }),
    values: () => Object.values(defaultParams)
  };
  beforeEach(()=>{
    jest.spyOn(logger, 'info').mockImplementation();
  });
  describe('#setSocketInstance', ()=> {
    test('setSocket should store io instance', ()=>{
      const routes = new Routes();
      const ioObj = { //é só pra simular.
        to: (id) => ioObj,
        emit: (event, message) => {}
      };
      routes.setSocketInstance(ioObj);
      expect(routes.io).toStrictEqual(ioObj);
    });
  });
  
  describe('#handler', ()=> {
    const routes = new Routes();
    const defaultParams = {
      request: {
        headers : {
          'Content-Type':'multipart/form-data'
        },
        method: '',
        body: {}
      },
      response: {
        setHeader: jest.fn(),
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      values: () => Object.values(defaultParams)
    }
    test('#given an inexistent route it should choose default route', async()=>{
      const params = {
        ...defaultParams,
      };
      params.request.method = 'inexistent';
      await routes.handler(...params.values());
                                  //chamado com
      expect(params.response.end).toHaveBeenCalledWith('hello world');
    });
    test('#it should set any request with CORS enabled', async()=> {
      const params = {
        ...defaultParams,
      };
      params.request.method = 'inexistent';
      await routes.handler(...params.values());
                                
      expect(params.response.setHeader)
      .toHaveBeenCalledWith('Access-Control-Allow-Origin','*');
    });
    test('#given method OPTIONS it should choose options route', async()=>{
      const params = {
        ...defaultParams,
      };
      params.request.method = 'OPTIONS';
      await routes.handler(...params.values());
                                
      expect(params.response.writeHead)
      .toHaveBeenCalledWith(204);
      expect(params.response.end).toHaveBeenCalled();
    });
    test('#given method POST it should choose post route', async()=> {
      const params = {
        ...defaultParams,
      };
      params.request.method = 'POST';
      //só quero saber que o post foi chamado pelo handler
      jest.spyOn(routes, routes.post.name).mockResolvedValue();
      await routes.handler(...params.values());
      expect(routes.post).toHaveBeenCalled();
    });
    test('#given method GET it should choose get route', async()=>{
      const params = {
        ...defaultParams,
      };
      params.request.method = 'GET';
      jest.spyOn(routes, routes.get.name).mockResolvedValue();
      await routes.handler(...params.values());
                                
      expect(routes.get).toHaveBeenCalled();
    });
  });

  describe('#get', ()=>{
    const routes = new Routes();
    test('given method GET it should list all files downloaded',async()=>{
      const params = {
        ...defaultParams
      };
      
      const filesStatusesMock = [
        {
          size: "117 kB",
          lastModified: '2021-09-07T20:47:34.862Z',
          owner: 'JoseNervoso',
          file: 'file.txt'
        }
      ];

      jest.spyOn(routes.fileHelper, routes.fileHelper.getFileStatus.name)
      .mockResolvedValue(filesStatusesMock);

      params.request.method = 'GET';
      await routes.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(200);
      expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(filesStatusesMock));
    });
  });

  describe('#post', ()=>{
    test('it should validate post route work flow', async () => {
      const routes = new Routes('/tmp');
      const options = {
        ...defaultParams,
      }
      options.request.method = 'POST';
      options.request.url = '?socketId=10';

      jest.spyOn(
        UploadHandler.prototype,
        UploadHandler.prototype.registerEvents.name
      ).mockImplementation((headers, onFinish) => {
        const writable = TestUtil.generateWriteStream(()=>{})
        writable.on("finish", onFinish);
        return writable;
      });

      await routes.handler(...options.values())
      expect(UploadHandler.prototype.registerEvents).toHaveBeenCalled();
      expect(options.response.writeHead).toHaveBeenCalledWith(200);

      const expectedResult = JSON.stringify({result: 'Files uploaded with success!'});
      expect(options.response.end).toHaveBeenCalledWith(expectedResult);
    });
  });
});