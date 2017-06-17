# ImgUploader
Javascript class to upload image. Resize img before send.

Class javascript para fazer upload de imagens:
- Sem dependência de bibliotecas
- Redimensiona a imagem antes de enviar, para poupar o servidor.
- Envia uma imagem de cada vez, para poupar o servidor.
- Barra de progresso.

# Exemplo de uso:

var uploader = new ImgUploader({
  inputFileId: 'anexos',
  MAX_WIDTH: 1000,
  MAX_HEIGHT: 1000,
  target: '/',
  containerId: 'anexosFila',
  paramName: 'anexo',
  btnCancelText: 'Cancelar',
  onQueueConclude: function(done) {
    console.log(done);
  },
  onItemConclude: function(item) {
    console.log(item);
  }
});
