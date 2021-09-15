import {
  describe,
  test,
  expect,
  jest
} from '@jest/globals';
import fs from 'fs';
import { Routes } from '../../routes/Routes';
import { FileHelper } from '../../utils/FileHelper';

describe('#Filehelp', ()=>{
  describe('#getFileStatus',()=>{
    test('it should return files statuses in correct format', async()=>{
      const statMock = {
        dev: 847901439,
        mode: 33206,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 2814749768325973,
        size: 117499,
        blocks: 232,
        atimeMs: 1631049198054.1675,
        mtimeMs: 1628280407434.1519,
        ctimeMs: 1631047664658.693,
        birthtimeMs: 1631047654861.6987,
        atime: '2021-09-07T21:13:18.054Z',
        mtime: '2021-08-06T20:06:47.434Z',
        ctime: '2021-09-07T20:47:44.659Z',
        birthtime: '2021-09-07T20:47:34.862Z'
      };

      const mockUser = 'JoseNervoso';
      process.env.USER = mockUser;
      const filename = 'imagem.png';
      // jest.spyOn(instancia, nome_da_função_a_executar);
      jest.spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([filename]);

      jest.spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock);
      
      const result = await FileHelper.getFileStatus('/tmp');
      const expectedResult = [
        {
          size: "117 kB",
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename
        }
      ];
      //o metodo stat sera chamado com o parametro tmp/filename
      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`);
      //O result tem que ser igual o expectedResult.
      expect(result).toMatchObject(expectedResult);
    });
  });
});