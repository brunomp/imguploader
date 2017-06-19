/*!
 * imguploader.js v1.0.2
 * https://github.com/brunomp/imguploader/
 * Date: 2017-06-18T20:32:05.335Z
 */
(function(window, document, undefined) {

  'use strict';

  window.URL = window.URL || window.webkitURL;

  function ImgUploader(opts) {

    var self = this;

    this.defaults = {
      target: window.location.href,
      formData: new FormData(),
      paramName: 'image',
      inputFileId: 'image',
      reduceWidth: 1000,
      reducetHeight: 1000,
      containerId: 'uploads',
      btnCancelText: 'CANCEL',
      onQueueConclude: function(){},
      onItemConclude: function() {}
    };

    this.opts = {};
    this.opts = extend({}, this.defaults, opts || {});

    this.inputFileElm = document.getElementById(this.opts.inputFileId);
    this.inputFileElm.accept = 'image/*';
    this.queue = [];
    this.done = [];

    this.inputFileElm.addEventListener("change", function(){
      var nFiles = this.files.length;
      for (var i = 0; i < nFiles; i++) {
        add(this.files[i]);
      }
    });

    function sendItem(item) {

      // if item is sending...
      if (item.xhr.readyState > 0) {
        return;
      }

      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext("2d");
      var width = item.image.width;
      var height = item.image.height;

      if (width > height) {
        if (width > self.opts.reduceWidth) {
          height *= self.opts.reduceWidth / width;
          width = self.opts.reduceWidth;
        }
      } else {
        if (height > self.opts.reducetHeight) {
          width *= self.opts.reducetHeight / height;
          height = self.opts.reducetHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(item.image, 0, 0, width, height);
      var dataurl = canvas.toDataURL(item.file.type);

      self.opts.formData.append(self.opts.paramName, dataurl);

      item.xhr.open("POST", self.opts.target, true);
      item.xhr.onload = function(){
        if (item.xhr.readyState == 4 
          && (item.xhr.status >= 200 && item.xhr.status <= 300)) {
          concludeItemWithSucess(item);
        } else {
          concludeItemWithError(item);
        }
      };
      item.xhr.upload.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
          item.progressBar.value = Math.round((evt.loaded / evt.total) * 100);
        }
      }, false);
      item.xhr.send(self.opts.formData);
    };
    function add(file) {

      if ( ! /^image\//.test(file.type)) {
        return;
      }

      var item = {};
      var divItem = document.createElement('div');
      var divThumb = document.createElement('div');
      var divProgress = document.createElement('div');
      var progressElm = document.createElement('progress');
      var divMenu = document.createElement('div');
      var btnCancel = document.createElement('button');
      divItem.classList.add('queueItem');
      divThumb.classList.add('thumb');
      divProgress.classList.add('progress');
      progressElm.max = 100;
      divMenu.classList.add('menu');
      btnCancel.innerText = self.opts.btnCancelText;
      btnCancel.classList.add('btnCancel');
      btnCancel.addEventListener('click', function(){
        cancelItem(item);
      });
      divProgress.appendChild(progressElm);
      divMenu.appendChild(btnCancel);
      divItem.appendChild(divThumb);
      divItem.appendChild(divProgress);
      divItem.appendChild(divMenu);

      var img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = function() {
        divThumb.style = 'background-image: url(\''+img.src+'\');';
        play();
      };

      item = {
        status: 'queue',
        file: file,
        image: img,
        xhr: new XMLHttpRequest(),
        container: divItem,
        progressBar: progressElm,
        btnCancel: btnCancel
      };

      document.getElementById(self.opts.containerId).appendChild(divItem);

      self.queue.push(item);
    };
    function play() {
      if (self.queue.length > 0) {
        if(self.queue[0].image.complete) {
          sendItem(self.queue[0]);
        }
      } else {
        onQueueConclude();
      }
    };
    function concludeItemWithSucess(item){
      item.status = 'sucess';
      item.container.classList.add('uploadSucess');
      self.done.push(item);
      self.queue.splice(self.queue.indexOf(item), 1);
      onItemConclude(item);
      play();
    };
    function concludeItemWithError(item){
      item.status = 'error';
      item.container.classList.add('uploadError');
      onItemConclude(item);
      play();
    };
    function cancelItem(item) {
      if (item.xhr.readyState == 4
        || item.status == 'canceled') {
        return;
      }
      item.status = 'canceled';
      item.container.classList.add('uploadCanceled');
      item.xhr.abort();
      item.progressBar.value = 0;
      onItemConclude(item);
      play();
    };
    function onItemConclude(item){
      item.btnCancel.disabled = 'disabled';
      self.done.push(item);
      self.queue.splice(self.queue.indexOf(item), 1);
      self.opts.onItemConclude(item);
    };
    function onQueueConclude(){
      self.opts.onQueueConclude(self.done);
      self.done = [];
    };

    function extend(dst, src) {
      each(arguments, function(obj) {
        if (obj !== dst) {
          each(obj, function(value, key){
            dst[key] = value;
          });
        }
      });
      return dst;
    };

    function each(obj, callback, context) {
      if (!obj) {
        return;
      }
      var key;
      if (typeof(obj.length) !== 'undefined') {
        for (key = 0; key < obj.length; key++) {
          if (callback.call(context, obj[key], key) === false) {
            return;
          }
        }
      } else {
        for (key in obj) {
          if (obj.hasOwnProperty(key) && callback.call(context, obj[key], key) === false) {
            return;
          }
        }
      }
    }
  }

  window.ImgUploader = ImgUploader;

})(window, document);
