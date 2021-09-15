import {
  describe,
  test, 
  jest,
  expect
} from '@jest/globals';
import {Routes} from '../../routes/Routes';
describe('#Routes test swith', ()=> {
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
  };
  describe('#setSocketInstance', ()=> {
    test('setSocket should store io instance', ()=>{
      const ioObj = { //é só pra simular.
        to: (id) => ioObj,
        emit: (event, message) => {}
      };
      Routes.setSocketInstance(ioObj);
      expect(Routes.io).toStrictEqual(ioObj);
    });
  });
  
  describe('#handler', ()=> {
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
      await Routes.handler(...params.values());
                                  //chamado com
      expect(params.response.end).toHaveBeenCalledWith('hello world');
    });
    test('#it should set any request with CORS enabled', async()=> {
      const params = {
        ...defaultParams,
      };
      params.request.method = 'inexistent';
      await Routes.handler(...params.values());
                                
      expect(params.response.setHeader)
      .toHaveBeenCalledWith('Access-Control-Allow-Origin','*');
    });
    test('#given method OPTIONS it should choose options route', async()=>{
      const params = {
        ...defaultParams,
      };
      params.request.method = 'OPTIONS';
      await Routes.handler(...params.values());
                                
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
      jest.spyOn(Routes, Routes.post.name).mockResolvedValue();
      await Routes.handler(...params.values());
      expect(Routes.post).toHaveBeenCalled();
    });
    test('#given method GET it should choose get route', async()=>{
      const params = {
        ...defaultParams,
      };
      params.request.method = 'GET';
      jest.spyOn(Routes, Routes.get.name).mockResolvedValue();
      await Routes.handler(...params.values());
                                
      expect(Routes.get).toHaveBeenCalled();
    });
  });

  describe('#get', ()=>{
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

      jest.spyOn(Routes.fileHelper, Routes.fileHelper.getFileStatus.name)
      .mockResolvedValue(filesStatusesMock);

      params.request.method = 'GET';
      await Routes.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(200);
      expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(filesStatusesMock));
    });
  });
})