(function () {
  'use strict';

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var createChapterHeader = function (data) {
    return `
             <div contenteditable="false" class="chapter-header" style='padding: 10px; color: ${data.serviceData.textColor};background-color: ${data.serviceData.bgColor}; border: ${data.serviceData.borderWidth}px ${data.serviceData.borderStyle} ${data.serviceData.borderColor};'>
                <h2>${data.serviceData.headerText}</h2>
             </div>`;
  };
  var showDialog = function (editor) {
    var editorData = getEditorData(editor);
    var initialData = editorData || {};
    var body = {
      type: 'panel',
      items: [
        {type: 'input', name: 'headerText', label: '章头文字'},
        {type: 'colorinput', name: 'textColor', label: '文字颜色'},
        {type: 'colorinput', name: 'bgColor', label: '背景颜色',},
        {
          type: 'selectbox',
          name: 'borderStyle',
          label: '边框样式',
          items: [
            {value: 'none', text: '无'},
            {value: 'solid', text: '实线'},
            {value: 'dashed', text: '虚线'},
            {value: 'dotted', text: '点状'}
          ],
        },
        {type: 'colorinput', name: 'borderColor', label: '边框颜色'},
        {type: 'input', name: 'borderWidth', label: '边框宽度'}
      ]
    };
    var win = editor.windowManager.open({
      title: '添加章头',
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
        const serviceData = api.getData();
        const content = createChapterHeader({
          serviceData
        });
        editor.insertContent(content);
        api.close();
      },
      onChange: function () {
        console.debug(editor);
      }
    });
  }

  var registerMenuItem = function (editor) {
    editor.ui.registry.addMenuItem('chapterHeader', {
      text: '插入章头',
      onAction: function () {
        showDialog(editor);
      }
    });
  };

  var registerButton = function (editor) {
    editor.ui.registry.addButton('chapterHeader', {
      tooltip: '插入章头',
      icon: 'chapter',
      onAction: function () {
        showDialog(editor);
      },
    });
  };


  var getEditorData = function (editor){
    var element = editor.selection.getNode();
    if (element.classList.contains('chapter-header')) {
      var computedStyle = window.getComputedStyle(element);
      return {
        headerText: element.querySelector('h2') ? element.querySelector('h2').innerText : '',
        textColor: computedStyle.color || '#000000',
        bgColor: computedStyle.backgroundColor || '#ffffff',
        borderStyle: computedStyle.borderStyle || 'solid',
        borderColor: computedStyle.borderColor || '#000000',
        borderWidth: computedStyle.borderWidth.replace('px', '') || '1'
      };
    }
    return null;
  }



  function Plugin() {
    global.add('chapterHeader', function (editor) {
      registerMenuItem(editor);
      registerButton(editor);
      editor.on('dblclick', function (e) {
        showDialog(editor);
      });
    });
  }

  Plugin();

}());
