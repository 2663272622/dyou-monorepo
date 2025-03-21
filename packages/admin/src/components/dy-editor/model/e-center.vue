<template>
    <div id="dyeb-cc">
        <textarea :id="props.tinymceId" />
    </div>
</template>
<script setup>
import { getToken } from "@/utils/auth";
import {
    HandleReUnDo ,
    randomId,
    newDid,
    processHtmlContent,
    handleInit,
    handleDestory,
    EditorSet,
    EditorGet,
    EditorDisabled,
    EditorCleat,
} from '@dy-monorepo/utils';

const props = defineProps({
    tinymceId:{
        type:String,
        default:'demo'
    }
})



// 编辑器初始化
const initFun = async()=>{ 
    
    handleInit({
        selector: `#${props.tinymceId}`,
        // height:"500px",
        height:'100%',
        token:getToken(),
        init_instance_callback:editor => {
            // if (_this.value) {
            //     editor.setContent(_this.value)
            // }
            // _this.hasInit = true
            editor.on('NodeChange Change KeyUp SetContent', () => {
                // _this.hasChange = true
                // _this.$emit('input', editor.getContent())
            })

            editor.on('beforeexeccommand', (e) => {
                // let scrollPosition = document.getElementsByClassName('contents')[0].scrollTop

                console.log("beforeexeccommand",e)
                // console.log("beforeexeccommand",e.command)
                switch(e.command){
                    case 'FontName': // 字体修改
                        if(e.value.indexOf("Times New Roman") == 0){// 处理新罗马体字体
                            processHtmlContent(editor)
                            return false;
                        }else true;
                    break;
                    case 'Redo':
                        HandleReUnDo(editor)
                    break;
                    case 'Undo':
                        HandleReUnDo(editor)
                    break;
                    case 'mceInsertContent':
                        let modifiedHTML = e.value.content
                        if(modifiedHTML){
                            let resss = modifiedHTML.replace(/(<([a-z]+)[^>]*)(data-id="([^"]*)")([^>]*>)/gi, (match, p1, tagName, dataId, dataIdValue, p4) => {
                                return `${p1}${newDid()}${p4}`;
                            }).replace(/(<([a-z]+)([^>]*))(data-id="([^"]*)")?([^>]*>)/gi, (match, p1, tagName, attrs, dataIdMatch, dataIdValue, p4) => {
                                if (!dataIdMatch) { return `${p1} data-id="${newDid()}"${p4}`; }
                                return match;
                            });
                            editor.selection.setContent(resss);
                            return false;
                        }
                    break;

                }
            });
        }
    })
}

// 获取编辑器内容
const getEditorContent = ()=>{
    var content = EditorGet(props.tinymceId);
    console.log(content); // 打印当前编辑器的 HTML 内容
    
}

// 清空编辑器内容
const clearEditor = ()=>{
    EditorCleat(props.tinymceId)
}
// 设置编辑器内容
const setEditor = (val)=>{
    EditorSet(props.tinymceId,val)
}
// 设置编辑器内容
const setEditorDiasabled = (bol)=>{
    EditorDisabled(props.tinymceId,bol)
}

// 清空编辑器内容
// const clearEditor = ()=>{

// }

onMounted(() => {
    initFun()
})

defineExpose({
    getEditorContent,
    clearEditor,
    setEditor,
    setEditorDiasabled
})

</script>
<style lang='scss'>

#dyeb-cc{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding:0 12px;
    box-sizing: border-box;
    background: #ccc;
}

</style>