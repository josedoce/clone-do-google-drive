import fs from 'fs';
import prettyBytes from 'pretty-bytes';
/**
 * Classe que gerencia os arquivos.
*/
class FileHelper {
  static async getFileStatus(downloadsFolder) {
    const currentFiles = await fs.promises.readdir(downloadsFolder);
    const statuses = await Promise.all(currentFiles.map(file=>fs.promises.stat(`${downloadsFolder}/${file}`)));
    
    const fileStatuses = [];
    for(const fileIndex in currentFiles) {
      const { birthtime, size } = statuses[fileIndex];
      fileStatuses.push({
        size: prettyBytes(size),
        file: currentFiles[fileIndex],
        lastModified: birthtime,
        owner: 'JoseNervoso'//deve vir de algum lugar ksksk
      })
    }
    return fileStatuses;
  }
}
export { FileHelper };