
export const processHtmlContent = (editor) => {
    const content = editor.selection.getContent({ format: 'html' });
    // 替换文本内容中的字母和数字为特定字体
    let str = content.replace(/>([^<]+)<|<\/([^>]+)>/g, (match, text, tag) => {
        if (text) {
            // 处理文本中的字母和数字部分，排除 HTML 实体
            const updatedText = text.replace(/[a-zA-Z0-9]+/g, (substring) => {
                // 排除 &nbsp; 等 HTML 实体
                // if (/&[a-zA-Z#0-9]+;/.test(substring)) {
                if (substring == 'nbsp') {
                    console.log("匹配到原始字符不替换",substring)
                    return substring;  // 如果是实体字符，不做任何替换
                }
                // 否则替换为 Times New Roman 字体
                return `<span style="font-family: Times New Roman;">${substring}</span>`;
            });
            return `>${updatedText}<`;
        }
        return match;
    });
    if(str == content){
        str = str.replace(/[a-zA-Z0-9]+/g, (substring) => {
            // 排除 &nbsp; 等 HTML 实体
            // if (/&[a-zA-Z#0-9]+;/.test(substring)) {
            if (substring == 'nbsp') {
                console.log("匹配到原始字符不替换",substring)
                return substring;  // 如果是实体字符，不做任何替换
            }
            // 否则替换为 Times New Roman 字体
            return `<span style="font-family: Times New Roman;">${substring}</span>`;
        });
    }
    
    editor.selection.setContent(str);
}

// 定位到光标位置
export const HandleReUnDo = (editor)=>{
    const cursorNode = editor.selection.getNode();
    
    if (cursorNode) {
        const boundingRect = cursorNode.getBoundingClientRect();
        let boundingRectTop = boundingRect.top
        setTimeout(function() { 
            document.getElementsByClassName('contents')[0].scrollTop  = boundingRectTop 
        }, 0);
    }  
}


// 获取当前选区
export const HandleGetSelection = (id)=>{
    const obj = {
        rng:tinymce.activeEditor.selection.getRng() ,
        txt:window.tinymce.get(id).selection.getContent({ format: 'text' })
    }
    return obj
}

/**
 * 获取当前选区的数据
 * @param { String } id 当前的tinymce ID
*/
export const handleHeight = (id) => {
    let editor = window.tinymce.get(id)
    
    
    var range = tinymce.activeEditor.selection.getRng() 
    var selectedText = range.toString()
    
    const getAllTextNodes = (container,offset) =>  {
        var textNodes = [];
        
        function getP(n){
            if([
                'P',
                'H1',
                'H2',
                'H3',
                'H4',
                'H5',
                'H6',
                'H7',
                'H8',
            ].includes(n.parentNode.tagName)){
                return n.parentNode
            }else{
                return getP(n.parentNode)
            }
        }
        let pNode = getP(container)


        function traverse(node) {
            if(!node)return;
            if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node);  
            }  
            for (var i = 0; i < node.childNodes.length; i++) {
                traverse(node.childNodes[i]);
            }
        } 
        traverse(pNode); 

        // 输出所有文本节点
        let txt = ''
        let obj = {}
        textNodes.map((node)=> {
            if(obj.pid)return;

            if(node == container){
                obj = {
                    pid: pNode.getAttribute('data-id'),
                    offset:txt.length+offset,
                    text:'node.nodeValue',
                    pTagName:pNode.tagName
                }  
            } 
            
            txt += node.nodeValue;
        });

        return {
            obj,
            txt,
            textNodes,
        };
    }

    const { obj:startConfig } =  getAllTextNodes(range.startContainer,range.startOffset);
    const { obj:endConfig   }  =  getAllTextNodes(range.endContainer,range.endOffset);
    // this.heightTxt.push({startConfig,endConfig,selectedText})
    
    return {
        endConfig,
        startConfig,
    }
    
    // setTimeout(()=>{
    //     that.selectAndHighlightText(startConfig,endConfig)
    // })
}
/**
 * 解析实现高亮
 * @param { String } id 当前的tinymce ID
 * @param { handleHeight 的 returns } start
 * @param { handleHeight 的 returns } end
 * @param { String } color 标注的背景颜色
*/
export const selectAndHighlightText = (hid,id,startConfig,endConfig,color) => {
    return new Promise((resolve,reject)=>{
        let editor = window.tinymce.get(id)
        var range = tinymce.activeEditor.selection.getRng() 
        var $ = window.tinymce.get(id).dom.$;
    
        function getTextNode(cnf,num){
            if(!cnf.pid){
                // console.log("没有PID没有PID")
                return reject("没有PID")
            }
            let pDom = $(`${cnf.pTagName}[data-id="${cnf.pid}"]`)
            if(!pDom){
                resolve()
            }
             
            pDom = pDom[0].innerHTML == '<br>' ? pDom[1] : pDom[0]            //  pDom[0]
            console.log(pDom)
            // debugger
            let textNodes = []
            let txt = ''
            let textNode = null;
            function traverse(node) {
                if(!node)return;
                if (node.nodeType === Node.TEXT_NODE) {
                    textNodes.push(node);  
                }  
                for (var i = 0; i < node.childNodes.length; i++) {
                    traverse(node.childNodes[i]);
                }
            } 
            traverse(pDom);
    
            textNodes.map(i=>{
                if(textNode)return;
    
                let afterTxt = txt + i.nodeValue 
    
                if(afterTxt.length >= cnf.offset + num){
                    textNode = {
                        node:i,
                        ...cnf,
                        offset:cnf.offset - txt.length//txt.length - cnf.offset - i.nodeValue.length //cnf.offset - txt.length + i.nodeValue.length
                    };
                }
                txt = afterTxt;
            }) 
            return textNode
        }
        let strts = getTextNode(startConfig,1)
        let end = getTextNode(endConfig ,0 )
        
        setTimeout(()=>{
            range.setStart(strts.node, strts.offset);
            try{
                range.setEnd(end.node , end.offset);
            }catch(err){ 
            }
            tinymce.activeEditor.selection.setRng(range)
            tinymce.activeEditor.execCommand('BackColor', false, color);  // 设置背景色为红色
            // console.log("测试高亮BUG---- 设置背景色")
            // debugger 
            // // 获取选中的内容并将其转换为节点列表
            // var nodes = tinymce.activeEditor.selection.getSelectedBlocks();
            // console.log(nodes)
            // // 遍历所有选中的元素并添加自定义属性
            // nodes.forEach((node,index) => {
            //     let curN = index == 0 ? strts.node : index == nodes.length - 1 ? end.node : node
                
            //     tinymce.activeEditor.dom.setAttrib(curN, 'data-state', hid);
            // });
            // setTimeout(()=>{
            //     // debugger
            //     // tinymce.activeEditor.selection.getNode().setAttribute('data-state', hid);
                resolve() 
                // 取消选区，但保留选中的内容
                tinymce.activeEditor.selection.collapse();
                console.log("调整高度mceAutoResize")
                tinymce.activeEditor.execCommand('mceAutoResize');
            // },400)
        },0)
    })
}