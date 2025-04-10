export const fontSettings = {
    /**
     * @description: 字体设置
     * @return {*}
     */
    fontFormats: `新罗马体=Times New Roman,微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;`,
  
    /**
     * @description: 字体设置
     * @return {*}
     */
    fontsizeFormats:'12px 13px 14px 15px 16px 17px 18px 19px 20px 21px 22px 23px 24px 25px 26px 27px 28px 29px 30px 31px 32px 33px 34px 35px 36px 37px 38px 39px 40px 41px 42px 43px 44px 45px 46px 47px 48px',
    /**
     * @description: 行高设置
     * @return {*}
     */
    lineheightFormats:'0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5'
};

/* 拼写检查 "spellchecker"
*  自动保存 "autosave"
*
* */
export const plugins = [
    "advlist",
     "anchor",
     "autolink",
    //  "autoresize",
    "codesample", "colorpicker", "charmap", "contextmenu", "chapterHeader",
    "directionality", "directionality",
    "emoticons", "exercises", "extendVideo", "extend",
    "fullscreen", "formatpainter",
    "hr",
    "image", "imagetools", "insertdatetime", "indent2em", "importword",
    "kityformula-editor",
    "lineheight", "letterspacing", "link", "lists",
    "media",
    "nonbreaking", "noneditable",
    "pagebreak", "paste", "preview", "print", "powerpaste",
    "save", "searchreplace", "sectionHeader",
    "tabfocus", "table", "template", "textcolor",
    "visualblocks", "visualchars",
    "wordcount",
    'pagebreak'
]

// Here is a list of the toolbar
// Detail list see https://www.tinymce.com/docs/advanced/editor-control-identifiers/#toolbarcontrols
export const toolbar = [
    'preview searchreplace bold italic underline strikethrough alignleft aligncenter alignright alignjustify outdent indent indent2em lineheight letterspacing ltr rtl formatpainter forecolor backcolor blockquote undo redo removeformat subscript superscript  codesample hr bullist numlist link bubble charmap anchor pagebreak  image media table wordcount wordpaster pptpaster pdfimport netpaster chapterHeader sectionHeader extend extendVideo exercises kityformula-editor importword wordpaster pptimport pdfimport netpaster fullscreen',
    'formatselect fontselect fontsizeselect'
] 

// 用于生成tinymce ID
export const randomId = ()=>{
    return `vue-tinymce-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

// 销毁编辑器
export const handleDestory = (id)=>{
    const tinymce = window.tinymce.get(id);
    try{
        tinymce.execCommand('mceFullScreen');
    }catch(e){}
    if (tinymce) {
      tinymce.destroy();
    }
}


// 初始化编辑器
export const handleInit = (cnf,call)=>{
    let token = cnf.token;
    const uploadPath =  import.meta.env.VITE_APP_UPLOAD_URL + '/file/uploadCOS'
    const STSPATH =  import.meta.env.VITE_APP_FILE_URL + '/file/oss/getStsToken'
    
    window.tinymce.init({
        pagebreak_split_block:true,
        content_style:`img{max-width:100%;height:auto}p{margin-block-start: 0em; margin-block-end: 0em;}table{max-width:100%;height:auto}; `,
        toolbar_sticky: true,
        toolbar_sticky_offset: 100,
        // height: 200,
        // autoresize_bottom_margin:200,
        body_class: 'my_class',
        // extended_valid_elements : "img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|loading=lazy]|data-mce-style" ,
        extended_valid_elements : "img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|data-mce-style" ,
        language: 'zh_CN',
        min_height: 200,
        // toolbar_mode: 'sliding', //工具栏模式 主要有四种模式："floating"（浮动）、"sliding"（滑动）、"scrolling"（滚动）和"wrap"（换行）
        font_size_input_default_unit:"em",
        // body_class: 'panel-body',
        branding: false, //隐藏商业logo 
        menubar:'file edit insert view format table', // 菜单栏的配置，也是数组
        toolbar, //工具栏配置
        plugins, //插件
        lineheight_formats:fontSettings.lineheightFormats, //行高配置，也可配置成"12px 14px 16px 20px"这种形式
        font_formats:  fontSettings.fontFormats, //字体类型
        fontsize_formats:  fontSettings.fontsizeFormats, //字体大小
        end_container_on_empty_block: true, // 如果在空的内部块元素中按enter键，则此选项允许您拆分当前容器块元素。
        paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_merge_formats: true, //此选项启用粘贴插件的合并格式功能
        nonbreaking_force_tab: true, // 此选项允许您在用户按下键盘tab键时强制TinyMCE插入三个实体
        file_picker_types: 'image media',// 此选项允许您通过空格或逗号分隔的类型名称列表指定所需的文件选取器类型。目前有三种有效类型：文件、图像和媒体
        file_brower_callback_type: 'image media', // 此选项允许您通过空格或逗号分隔的类型名称列表指定所需的文件选取器类型。目前有三种有效类型：文件、图像和媒体
        media_live_embeds: true, // 启用此选项后，用户将看到可编辑区域中嵌入视频内容的实时预览，而不是占位符图像
        object_resizing: true, // 图片和表格是否开启在编辑器内部缩放
        // automatic_uploads: false, // 自动上传
        powerpaste_word_import: 'propmt',// 参数可以是propmt, merge, clear，效果自行切换对比
        powerpaste_html_import: 'propmt',// propmt, merge, clear
        powerpaste_allow_local_images: true,
        custom_undo_redo_levels:10,//设置撤回步数
        // autoresize_overflow_padding: 50, //设置 padding
        //公式插件
        // external_plugins: {
        //   wordpaster: '../../../static/WordPaster/plugin/wordpaster.js',
        //   pptimport: '../../../static/WordPaster/plugin/pptimport.js',
        //   pdfimport: '../../../static/WordPaster/plugin/pdfimport.js',
        //   netpaster: '../../../static/WordPaster/plugin/netpaster.js'
        // },
        paste_preprocess:(plugin,args)=>{
          // 只保留一个空格，并去除文本首尾的空格
          args.content = args.content.trim();
        },
        // init_instance_callback ,
        setup(editor) {
            // // 从服务器获取到的内容存储在变量 htmlContent 中
            // var htmlContent =_this.value;

            //
            editor.on('init', function (r) {
            });
          editor.on('click', function () {
            // 将获取到的内容回显到编辑器中
            console.log("dianjisdasdasd~~~~~~~~```")
          }); 
          // // 当编辑器初始化完成后，设置编辑器内容
          // editor.on('init', function () {
          //   // 将获取到的内容回显到编辑器中
          //   editor.setContent(htmlContent);
          // }); 
          editor.on('NodeChange', (res) => {
            // const images = editor.dom.select('img');
            console.log("changge",res)
            // let a = 0
            // images.forEach(function (img) {
            //   // 监听每张图片的加载事件
            //   if (img.complete) {
            //     // 图片已经加载完成
            //     console.log('图片已经加载完成:',++a);
            //   } else {
            //     // 图片未加载，监听加载完成
            //     img.onload = function () {
            //       console.log('图片已经加载完成',++a);
            //     };
            //     img.onerror = function () {
            //       console.log('Image load failed:',++a);
            //     };
            //   }
            // })
            // debugger
            console.log("nodechangel ~~~~~~~~~", res.element)
                // 获取当前选中的节点
                var node = res.element;
                if (!node.hasAttribute('data-id')) {
                    // 如果没有 'data-id' 属性，新增一个
                    // 你可以自定义生成一个 ID，例如使用 Date.now() 生成唯一ID，或者使用其他方法
                    var uniqueId = newDid()
                    node.setAttribute('data-id', uniqueId);
                    // console.log('新增 data-id 属性:', uniqueId);
                } else {
                    // console.log('节点已有 data-id 属性:', node.getAttribute('data-id'));
                } 
          })

            // 监听回车事件（输入时自动生成 p 标签）
            editor.on('keydown', function(e) {
            if (e.keyCode === 13) { // 回车键的键码是 13
                var node = editor.selection.getNode();
                // 确保新生成的 <p> 标签没有 data-id 属性 
                if (node.nodeName === 'P'  ) {
                    // 生成唯一的 data-id，使用 Date.now() 结合随机数确保唯一性
                    let uniqueId  = 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

                    node.setAttribute('data-id', uniqueId);
                    // console.log('回车新生成 p 标签的 data-id:', uniqueId);
                }
            }
            });
          editor.on('paste', function (e) {
            console.log('粘贴了',e)
            // if(!WordPaster)return;
            // WordPaster.getInstance().SetEditor(editor)
            // WordPaster.getInstance().PasteManual()
            // e.preventDefault()
          })
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        },
        images_upload_handler: function(blobInfo, succFun, failFun) {
            
            var formData;
            formData = new FormData();
            var file = blobInfo.blob(); //转化为易于理解的file对象
            formData.append('file', file, file.name);
            formData.append('type', '2');

            // 使用 URLSearchParams 解析查询参数
            let params = new URLSearchParams(window.location.search);

            formData.append('bookId', params.get('name'));
            formData.append('catalogId', params.get('catalogId'));
            formData.append('pnumber', params.get('pnumber'));
            
            fetch(uploadPath, { 
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: "Bearer " + token
                },
            }).then(response => response.json()).then(res => {
                var data = res.data
                succFun(data.url)
            }).catch(error => {
                console.log("上传2~~~~~~~~~")
                // failFun('出现未知问题，刷新页面，或者联系程序员: ' + error);
                console.log("上传图片吧欧聪",error)
            })
        },

        file_picker_callback: function(cb, value, meta) {
            
            //当点击media图标上传时,判断meta.filetype == 'media'有必要，因为file_picker_callback是media(媒体)、image(图片)、file(文件)的共同入口
            if (meta.filetype == 'media' || meta.filetype == 'image') {
                //创建一个隐藏的type=file的文件选择input
                let input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.onchange = function() {
                    let file = this.files[0];
                    fetch(
                        STSPATH,
                        {
                            method: 'GET',
                            headers: {
                                Authorization: "Bearer " + token
                            },
                        }
                    ).then((res)=>res.json()).then(res=>{
                        console.log('获取参数',file)
                        const ossKey = res.data
                        const cof= {
                            authorizationV4: true,
                            accessKeyId: ossKey.ossAccessKeyId,
                            accessKeySecret: ossKey.accessKeySecret,
                            stsToken: ossKey.securityToken,
                            region: ossKey.regionId,
                            bucket: ossKey.bucketName,
                            policy: ossKey.policy,
                            endpoint: `https://oss-cn-qingdao.aliyuncs.com/`, 
                        }
                        const client = new OSS(cof);
                        let upath = '';
                        try{
                            let params = new URLSearchParams(window.location.search);
                            let bookId = params.get('bookId');
                            let catalogId = params.get('catalogId');
                            upath = `book_${bookId}/catalog_${catalogId}/`
                        }catch(e){}
                        const name = ossKey.userPath + upath + file.name;
                        const options = {
                            // 获取分片上传进度、断点和返回值。
                            progress: (p, cpt, res) => {
                                console.log(p);
                                // call(p,ossKey.host+name)
                                if(call){
                                    call(p)
                                }
                                if(p==1){
                                    console.log(ossKey.host+name)
                                    let mediaLocation = ossKey.host+name;
                                     
                                    call(p,{
                                        storagePath: ossKey.host+name,
                                        fileSize:(file.size/1024/1024).toFixed(2),
                                        fileType:file.type,
                                        fileName:file.name,
                                    })
                                        //cb()回调函数，将mediaLocation显示在弹框输入框中
                                    cb(mediaLocation, {
                                        title: name
                                    });
                                }
                            },
                            // 设置并发上传的分片数量。
                            parallel: 4,
                            // 设置分片大小。默认值为1 MB，最小值为100 KB，最大值为5 GB。最后一个分片的大小允许小于100 KB。
                            partSize: 1024 * 1024,
                            // headers,
                            // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
                            meta: { year: 2020, people: "test" },
                            mime: "text/plain",
                        };

                        // 分片上传。
                        client.multipartUpload(name, file, {
                            ...options, 
                        });
                    })
                    // let file = this.files[0]; //只选取第一个文件。如果要选取全部，后面注意做修改
                    // let formData;
                    // formData = new FormData();
                    // formData.append('file', file); 
                    // formData.append('type', '2'); 
                    // fetch(uploadPath, {
                    //     method: 'POST',
                    //     body: formData,
                    //     headers: {
                    //         Authorization: "Bearer " + token
                    //     },
                    // }).then(response => response.json()).then(res => {
                    //     let mediaLocation = res.data.url;
                    //         //cb()回调函数，将mediaLocation显示在弹框输入框中
                    //     cb(mediaLocation, {
                    //         title: file.name
                    //     });
                    // }).catch(error => {
                    //     console.log("上传1~~~~~~~~~")
                    //     console.error(error.message)
                    //     // failFun('出现未知问题，刷新页面，或者联系程序员: ' + err);
                    //     alert("上传失败 建议将图片压缩后上传")
                    //     window.open(`https://www.iloveimg.com/zh-cn/compress-image/compress-jpg`)
                    // })
                }
                //触发点击
                input.click();
            }
        },
        convert_urls: false,
        ...cnf
    })
}

// 生成随机ID
export const newDid = ()=>{
    return 'id-' + Date.now().toString(16)+Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
}
// 设置编辑器内容
export const handleSet = (id,value)=>{
    window.tinymce.get(id).setContent(value);
}

// 获取编辑器内容
export const EditorGet = (id,value)=>{
    return window.tinymce.get(id).getContent()
}
// 获取编辑器内容
export const EditorSet = (id,value)=>{
    console.log(value)
    window.tinymce.get(id).setContent(value);
}
// 设置编辑器内容
export const EditorCleat = (id)=>{
    window.tinymce.get(id).setContent('');
}

// 设置只读
export const EditorDisabled = (id,bol)=>{
    // 获取编辑器实例
    var editor = window.tinymce.get(id);
    console.log("设置",bol)
    if(bol){
        // 设置为只读模式
        // editor.setMode('readonly');
        
        editor.settings.toolbar = false;  // 隐藏工具栏
        editor.settings.menubar = false;  // 隐藏菜单栏
        editor.settings.readonly = true;  // 隐藏菜单栏
    }else{ 
         
        // 取消只读模式
        // editor.setMode('design');

        // // editor.ui.show()
        // // editor.ui.showToolbar();  // 显示工具栏
        
        editor.settings.toolbar = toolbar;  // 隐藏工具栏
        editor.settings.menubar = 'file edit insert view format table';  // 隐藏菜单栏
        editor.settings.readonly = false;  // 隐藏菜单栏 
    }
    editor.remove();  // 移除当前编辑器实例
    tinymce.init(editor.settings);  // 重新初始化编辑器


}

// 获取编辑器内容
export const handleGet = (id)=>{
    
}

