(function () {
  'use strict';

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
  var createExtendedVideoContent = function (data) {

    const backgroundColor = data.serviceData.backgroundColor || '#e6a23c'; // Default background color

    return `
        <div class="extended-video" data-id="${data.id}" contenteditable="false">
            <div class="video-container" style="display: flex; align-items: center; height: 6em; padding: 10px; border-radius: 10px; font-size: 19px; border: 3px solid #000;">
              <div class="video_left" style="width: 90px;
                  height: 90px;
                  background: #000;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 10px;
                  clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px));">
                  <img class="video_left_icon" src="https://cos.dyjiaoyu.com/icon/video.png"> 
              </div>
                <div class="video_middle-container" data-url="${data.serviceData.uploadFile1 || ''}" style="position: relative; width: 100%; background: ${backgroundColor}; height: 100%; margin: 10px 0 10px 10px; clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px));">
                    <div style="font-size: 1.2em; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; height: 100%; margin: 0 3.6rem 0 1.375rem;">
                        <div class="type" style="height: 30px; color: #000; font-size: 19px; font-weight: bold;">${data.serviceData.type}</div>
                        <div class="title" style="height: 30px; color: #000; font-size: 16px;">
                            <div style="white-space: nowrap;">${data.serviceData.title}</div>
                        </div>
                    </div>
                     <div class="video_middle_icon"
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
        </div>
        `;
  };
  var showDialog = function (editor) {
    var editorData = getEditorData(editor);
    var initialData = editorData || {};
    console.log(initialData)
    var body = {
      type: 'panel',
      items: [
        {
          type: 'input',
          name: 'type',
          label: '<span style="color: red;">*</span> 类型',
        },
        {
          type: 'input',
          name: 'title',
          label: '<span style="color: red;">*</span> 标题',
        },
        {
          type: 'colorinput',
          name: 'backgroundColor',
          label: '背景颜色',
        },
        {
          type: 'urlinput',
          name: 'uploadFile1',
          filetype: 'media',
          label: '地址',
        },
      ],
    };
    var win = editor.windowManager.open({
      title: '添加扩展视频',
      size: 'medium',
      body: body,
      initialData:initialData,
      buttons: [
        {
          type: 'cancel',
          name: 'cancel',
          text: 'Cancel'
        },
        {
          type: 'submit',
          name: 'save',
          text: 'Save',
          primary: true
        }
      ],
      onSubmit: function (api) {
        const serviceData = api.getData()
        let obj = {
          serviceData:{
            ...serviceData,
            uploadFile1:serviceData?.uploadFile1?.value
          },
          id: Date.now(),
        }

        const content = createExtendedVideoContent(obj);
        editor.insertContent(content);
        api.close();
      },
      onChange: function (){
        console.debug(editor);
      }
    });
  }

  var registerMenuItem = function (editor) {
    editor.ui.registry.addMenuItem('extendVideo', {
      text: '插入扩展视频',
      onAction: function () {
        showDialog(editor);
      }
    });
  };

  var registerButton = function (editor) {
    editor.ui.registry.addButton('extendVideo', {
      tooltip: '插入扩展视频',
      icon: 'extendVideo',
      onAction: function () {
        showDialog(editor);
      },
    });
  };

  var getEditorData = function (editor) {
    var element = editor.selection.getNode();
    if (element.classList.contains('extended-video')) {
      var videoMiddleContainer = element.querySelector('.video_middle-container');
      var typeElement = element.querySelector('.type');
      var titleElement = element.querySelector('.title div');

      return {
        type: typeElement ? typeElement.textContent : '',
        title: titleElement ? titleElement.textContent : '',
        uploadFile1:{
          value:videoMiddleContainer.getAttribute('data-url') || ''
        },
        backgroundColor: videoMiddleContainer.style.backgroundColor || '#e77d7d',
      };
    }
    return null;
  };

  function Plugin() {
    global.add('extendVideo', function (editor) {
      registerMenuItem(editor);
      registerButton(editor);
      editor.on('dblclick', function (e) {
        var target = e.target.closest('.extended-video');
        if (target) {
          showDialog(editor); // 直接打开对话框
        }
      });
    });
  }

  Plugin();

}());
