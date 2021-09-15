export class DragAndDropManager {
  constructor(){
    this.dropArea = document.getElementById('dropArea');
    this.onDropHandler = () => {};
  }

  initialize({onDropHandler}) {
    this.onDropHandler = onDropHandler;
    //desabilitando eventos habilitados
    this.disableDragAndDropEvents();

    //habilitando eventos necessarios
    this.enableHightLightOnDrag();
    this.enableDrop();
  }
  //desabilitando os eventos nativos do browser
  disableDragAndDropEvents(){
    const events = [
      'dragenter',
      'dragover',
      'dragleave',
      'drop'
    ];

    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    events.forEach((eventName)=>{
      this.dropArea.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);

    });
  }

  enableHightLightOnDrag(){
    const events = ['dragenter','dragover'];
    const hightLight = (e)=>{
      this.dropArea.classList.add('highlight');
      this.dropArea.classList.add('drop-area');
    };

    events.forEach((event)=>{
      this.dropArea.addEventListener(event, hightLight, false);
    });
  }

  enableDrop(e){
    const drop = (e) => {
      this.dropArea.classList.remove('drop-area');
      //pegando o arquivo do drop
      const files = e.dataTransfer.files;
      return this.onDropHandler(files);
    }
    this.dropArea.addEventListener('drop', drop, false);
  }
}