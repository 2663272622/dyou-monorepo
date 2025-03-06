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