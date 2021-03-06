<?

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  //header('HTTP/1.1 500 Internal Server Error');
  header('HTTP/1.1 200 OK');
  $imageBlob = base64_decode(explode(',', $_POST['imagem'], 2)[1]);
  file_put_contents(time().'.jpg', $imageBlob);
  exit;
}

?>

<!doctype html>
<html lang="pt-BR">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Teste imguploader</title>
<link rel="stylesheet" href="imguploader.css">
</head>
<body>

<div id="upload">
  <input style="display: none;" id="inputImagem" type="file" multiple="true" accept="image/*" />
  <button onclick="document.getElementById('inputImagem').click();">Selecionar Fotos</button>
  <div id="imagensFila" class="imguploader"></div>
</div>

<script src="/imguploader.js" type="text/javascript"></script>
<script type="text/javascript">

// Others params
var formData = new FormData();
formData.append('userId', 10);
  
var uploader = new ImgUploader({
  inputFileId: 'inputImagem',
  reduceWidth: 1000,
  reduceHeight: 1000,
  target: window.location.href,
  containerId: 'imagensFila',
  paramName: 'imagem',
  formData: formData,
  btnCancelText: 'Cancelar',
  onQueueConclude: function(done) {
    console.log(done);
  },
  onItemConclude: function(item) {
    console.log(item);
  }
});

</script>

</body>
</html>
