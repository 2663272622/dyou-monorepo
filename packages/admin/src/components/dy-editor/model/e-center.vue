<template>
    <div id="dyeb-cc">
        <textarea :id="tinymceId" class="tinymce-textarea"  />
    </div>
</template>
<script setup>
import { randomId } from '@dy-monorepo/utils'
import { getToken } from "@/utils/auth";
import {
    HandleReUnDo ,
    newDid,
    processHtmlContent,
    handleInit,
    handleDestory
} from '@dy-monorepo/utils';


const tinymceId = ref(randomId())


// 编辑器初始化
const initFun = async()=>{

    handleInit({
        selector: `#${tinymceId.value}`,
        // height:this.height,
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
                        // if(e.value.indexOf("Times New Roman") == 0){// 处理新罗马体字体
                        //     processHtmlContent(editor)
                        //     return false;
                        // }else true;
                    break;
                    case 'Redo':
                        // HandleReUnDo(editor)
                    break;
                    case 'Undo':
                        // HandleReUnDo(editor)
                    break;
                    case 'mceInsertContent':
                        // let modifiedHTML = e.value.content
                        // if(modifiedHTML){
                        //     let resss = modifiedHTML.replace(/(<([a-z]+)[^>]*)(data-id="([^"]*)")([^>]*>)/gi, (match, p1, tagName, dataId, dataIdValue, p4) => {
                        //         return `${p1}${newDid()}${p4}`;
                        //     }).replace(/(<([a-z]+)([^>]*))(data-id="([^"]*)")?([^>]*>)/gi, (match, p1, tagName, attrs, dataIdMatch, dataIdValue, p4) => {
                        //         if (!dataIdMatch) { return `${p1} data-id="${newDid()}"${p4}`; }
                        //         return match;
                        //     });
                        //     editor.selection.setContent(resss);
                        //     return false;
                        // }
                    break;

                }
            });
        }
    })
}

onMounted(() => {
    initFun()
})

</script>
<style lang='scss'>

#dyeb-cc{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>