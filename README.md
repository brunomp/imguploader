# ImgUploader
Javascript class to upload image. Resize img before send.

Class javascript para fazer upload de imagens:
- Sem dependência de bibliotecas
- Redimensiona a imagem antes de enviar, para poupar o servidor.
- Envia uma imagem de cada vez, para poupar o servidor.
- Barra de progresso.
- Início automático.
- Possibilidade de cancelar o envio.

# Compatibilidade:
- Testado no Chrome 59.0.3071.104
- Escrito em ES5.
- Usa canvas, window.URL ou window.webkitURL

# Exemplo de uso:

```javascript
// Others params
var formData = new FormData();
formData.append('userId', 10);
  
var uploader = new ImgUploader({
  inputFileId: 'inputImagem',
  reduceWidth: 1000,
  reducetHeight: 1000,
  target: window.location.href,
  containerId: 'imagensFila',
  paramName: 'imagem',
  formData: formData,
  btnCancelText: 'Cancelar',
  onQueueConclude: function(done) {
    let itens = document.querySelectorAll('#imagensFila .queueItem');
    for (let i of itens) i.remove();
  },
  onItemConclude: function(item) {
    var divThumb = item.container.getElementsByClassName('thumb');
    if (item.status == 'sucess') {
      divThumb[0].innerHTML = '<div>Enviado!</div>';
    } else if (item.status == 'canceled') {
      divThumb[0].innerHTML = '<div>Cancelado!</div>';
    } else {
      divThumb[0].innerHTML = '<div>Erro!</div>';
    }
  }
});
```

# Instalação:
- JS: `<script src="/imguploader.js" type="text/javascript"></script>` antes do fechamento de body.
- CSS: `<link rel="stylesheet" href="imguploader.css">`
