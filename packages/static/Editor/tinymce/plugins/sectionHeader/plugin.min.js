(function () {
  'use strict';

  var plugin = tinymce.util.Tools.resolve('tinymce.PluginManager');

  plugin.add('sectionHeader', function (editor) {
    // 注册按钮
    editor.ui.registry.addButton('sectionHeader', {
      icon: 'section',
      tooltip: '插入章节节头',
      onAction: openHeaderDialog
    });

    // 打开对话框的函数
    function openHeaderDialog(data = {}) {
      editor.windowManager.open({
        title: '插入/编辑章节节头',
        body: createDialogBody(),
        initialData: data, // 使用 initialData 设置初始值
        buttons: [
          { text: '确定', type: 'submit' },
          { text: '取消', type: 'cancel' }
        ],
        onSubmit: function (api) {
          const formData = api.getData();
          editor.insertContent(createHeaderContent(formData));
          api.close();
        }
      });
    }

    // 创建对话框内容
    function createDialogBody() {
      return {
        type: 'panel',
        items: [
          { type: 'input', name: 'headerText', label: '节头文字' },
          { type: 'colorinput', name: 'bgColor', label: '背景颜色' },
          { type: 'colorinput', name: 'textColor', label: '文字颜色' },
          {
            type: 'selectbox',
            name: 'elementAlign',
            label: '对齐方式',
            items: [
              { value: 'left', text: '左对齐' },
              { value: 'center', text: '居中' },
              { value: 'right', text: '右对齐' }
            ]
          },
          {
            type: 'selectbox',
            name: 'displayType',
            label: '显示方式',
            items: [
              { value: 'block', text: '一行' },
              { value: 'inline', text: '行内' }
            ]
          }
        ]
      };
    }

    // 创建章节头内容
    function createHeaderContent(data) {
      const displayStyle = data.displayType === 'inline' ? 'display: inline;' : 'display: block;';
      return `<div class="sectionHeader" contenteditable="false" style="text-align: ${data.elementAlign};">
                <h2 style="background-color: ${data.bgColor}; padding: 5px; color: ${data.textColor}; margin: 0; ${displayStyle}">
                  ${data.headerText}
                </h2>
              </div>`;
    }

    // 双击事件处理
    editor.on('dblclick', function (e) {
      const target = e.target.closest('.sectionHeader');
      if (target) {
        const headerText = target.querySelector('h2').innerText;
        const bgColor = target.querySelector('h2').style.backgroundColor || window.getComputedStyle(target.querySelector('h2')).backgroundColor || '#ffffff';
        const textColor = target.querySelector('h2').style.color || window.getComputedStyle(target.querySelector('h2')).color || '#000000';
        const elementAlign = target.style.textAlign || 'left';
        const displayType = target.querySelector('h2').style.display || 'block';

        const initialData = {
          headerText,
          bgColor,
          textColor,
          elementAlign,
          displayType
        };

        openHeaderDialog(initialData);
      }
    });
  });
})();
