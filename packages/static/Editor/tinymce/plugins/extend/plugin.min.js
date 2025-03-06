
(function () {
  'use strict';

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
  const baseURL = window.VUE_APP_API_URL;
  var createExtendedReadingContent = function (data, nestedContent) {
    return `
     <div class="extended-reading" data-id="${data.id}" contenteditable="false" style="border: 2px solid transparent;">
       <div class="reading-container" style="display: flex;
              align-items: center;
              height: 6em;
              padding: 10px;
              border-radius: 10px;
              font-size: 19px;
              border: 3px solid #000;">
         <div class="extended_left" style="width: 90px;
              height: 90px;
              background: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 10px;
              clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px));">
          <img class="extended_left_icon" src="https://cos.dyjiaoyu.com/icon/read.png">
         </div>
         <div class="extended_middle" style="position: relative;
                width: calc(100% - 100px);
                background: ${data.backgroundColor};
                height: 100%;
                margin: 10px 0 10px 10px;
                clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px));">
           <div class="extended_middle_content" style="font-size: 1.2em;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                height: 100%;
                margin: 0 3.6rem 0 1.375rem;">
             <div class="extended_middle_type" style="height: 30px;
              letter-spacing: 5px;
              line-height: 30px;
              color: #000;
              font-size: 19px;
              font-weight: bold;
              text-align: left;
              border-bottom: 2px solid;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;">${data.type || '拓展阅读'}</div>
             <div class="extended_middle_title"
               style="width: 100%;
                height: 30px;
                line-height: 30px;
                font-size: 16px;
                color: #000;
                text-align: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;">
                 <div style="white-space: nowrap; width: fit-content;">${data.title}</div>
             </div>
           </div>
           <div class="extended_middle_icon"
                  style="position: absolute;
                  right: 20px;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 35px;
                  height: 35px;
                ">
           <img src="https://cos.dyjiaoyu.com/icon/play.png">
           </div>
         </div>
       </div>
       <div class="reading-content" style="display: none;">
            ${nestedContent}
       </div>
     </div>
  `;
  };

  var openDialog = function (editor, data = {}) {
    editor.windowManager.open({
      title: '添加/编辑扩展内容',
      size: 'large',
      initialData:data,
      body: {
        type: 'panel',
        items: [
          {
            type: 'input',
            name: 'type',
            label: '<span style="color: red;">*</span>类型',
          },
          {
            type: 'input',
            name: 'title',
            label: '<span style="color: red;">*</span>标题',
          },
          {
            type: 'colorinput',
            name: 'backgroundColor',
            label: '背景颜色',
          },
          {
            type: 'htmlpanel',
            label: '<span style="color: red;">*</span> 内容',
            html: `
              <div style="margin-top: 10px;">
                <textarea id="nested-editor"  class="tinymce-textarea" style="width: 100%; height: 300px;overflow-y: auto">${data.nestedContent || ''}</textarea>
              </div>
            `
          },
        ],
      },
      scrollIntoView: true,
      buttons: [
        { text: '确定', type: 'submit', primary: true },
        { text: '取消', type: 'cancel' },
      ],
      onSubmit: function (api) {
        const formData = api.getData();
        if (!formData.type || !formData.title) {
          editor.windowManager.alert('类型和标题是必填的！');
          return;
        }

        const nestedEditor = tinymce.get('nested-editor');
        const nestedContent = nestedEditor.getContent();
        const content = createExtendedReadingContent({ ...formData, id: data.id || Date.now() }, nestedContent);

        if (data.update) {
          const existingElement = editor.getBody().querySelector('.extended-reading[data-id="' + data.id + '"]');
          if (existingElement) {
            existingElement.outerHTML = content;
          }
        } else {
          editor.insertContent(content);
        }
        api.close();
      },
      onClose: function () {
        const nestedEditor = tinymce.get('nested-editor');
        if (nestedEditor) {
          nestedEditor.destroy();
        }
      },
    });

    tinymce.init({
      selector: '#nested-editor',
      height: 500,
      language: 'zh_CN',
      plugins: 'advlist anchor autolink codesample colorpicker colorpicker indent2em lineheight powerpaste formatpainter letterspacing charmap contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists nonbreaking noneditable pagebreak paste preview print save searchreplace autoresize tabfocus table template textcolor visualblocks visualchars wordcount importword kityformula-editor bubble',
      menubar: false,
      toolbar: ['preview searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent indent2em lineheight letterspacing ltr rtl formatpainter forecolor backcolor blockquote undo redo removeformat subscript superscript  codesample hr bullist numlist link bubble charmap anchor pagebreak image media table wordcount kityformula-editor importword netpaster fullscreen', 'formatselect fontselect fontsizeselect'],
      branding: false,
      file_picker_callback: function (callback, value, meta) {
        // 处理本地文件上传
        if (meta.filetype === 'image') {
          var input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');

          input.onchange = function () {
            var file = this.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
              // 将文件内容转换为 Base64
              callback(e.target.result, { alt: file.name });
            };
            reader.readAsDataURL(file);
          };

          input.click();
        }
      },
    });
  };

  var registerMenuItem = function (editor) {
    editor.ui.registry.addMenuItem('extend', {
      text: '插入扩展内容',
      onAction: function () {
        openDialog(editor);
      }
    });
  };

  var registerButton = function (editor) {
    editor.ui.registry.addButton('extend', {
      tooltip: '插入扩展内容',
      icon: 'extend',
      onAction: function () {
        openDialog(editor);
      },
    });
  };

  var registerContextMenu = function (editor) {
    editor.ui.registry.addContextMenu('extended', {
      update: function (element) {
        const target = element.target.closest('.extended-reading');
        if (target) {
          const readingData = {
            type: target.querySelector('.extended_middle_type').textContent,
            title: target.querySelector('.extended_middle_title').textContent,
            nestedContent: target.querySelector('.reading-content').innerHTML,
            id: target.getAttribute('data-id')
          };

          return [
            {
              text: '编辑扩展阅读',
              onAction: function () {
                openDialog(editor, { ...readingData, update: true });
              }
            },
            'deleteItem'
          ];
        }
        return [];
      }
    });
  };

  function Plugin() {
    global.add('extend', function (editor) {
      registerMenuItem(editor);
      registerButton(editor);
      registerContextMenu(editor);

      editor.on('dblclick', function (e) {
        const target = e.target.closest('.extended-reading');
        if (target) {
          const readingData = {
            type: target.querySelector('.extended_middle_type').textContent,
            title: target.querySelector('.extended_middle_title').textContent,
            nestedContent: target.querySelector('.reading-content').innerHTML,
            backgroundColor:getComputedStyle(target.querySelector('.extended_middle')).backgroundColor,
            id: target.getAttribute('data-id')
          };
          console.log(readingData)

          openDialog(editor, { ...readingData, update: true });
        }
      });
    });
  }

  Plugin();

}());
