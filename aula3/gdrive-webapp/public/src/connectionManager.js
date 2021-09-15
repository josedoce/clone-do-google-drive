export class ConnectionManager {
  constructor({apiUrl}){
    this.apiUrl = apiUrl;
    
    this.ioClient = io.connect(apiUrl, {withCredentials: false});
    this.socketId = '';
    
  } 

  configureEvents({onProgress}){
    //por padrão, o io possui um evento chamado 'connect'
    //quando o evento connect acontecer, execute a função.
    this.ioClient.on('connect', this.onConnect.bind(this));
    this.ioClient.on('file-upload', onProgress);
  }

  onConnect(msg){
    console.log('connected!', this.ioClient.id);
    this.socketId = this.ioClient.id;
  }

  async uploadFile(file){
    const formData = new FormData();
    formData.append('files',file);
    const response = await fetch(`${this.apiUrl}?socketId=${this.socketId}`,{
      method: 'POST',
      body: formData,
    });
    return response.json();
  }

  async currentFiles(){
    const files = (await (await fetch(this.apiUrl)).json());
    return files;
  }
}