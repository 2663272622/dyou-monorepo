<template>
    <div id="dyeb-cc"  v-show='currentCatalogId'>
        <textarea :id="props.tinymceId"/>
        <div class="dyeb-btnss">
            <div class="dyebcc-edit">
                <p @click="handleEContent('preview')">预览</p>
                <p @click="handleEContent('save')">保存</p>
                <p @click="handleEContent('delete')">删除</p>
            </div>
            <div class="dyebcc-pages">
                <p class="dyebcc-total">共<span>{{pageTotal}}</span>页</p>
                <div class="dyebcc-l" :style="{background:pageNumber == 1? '':'#409EFF'}"  @click="handleEContent('f')"><el-icon><ArrowLeft /></el-icon></div>
                <!-- <el-input type="number" v-model="pageNumber" :max="pageTotal" :min="1"></el-input> -->
                <!--  -->
                <el-input-number v-model="pageNumber"  @change="handleEContent('changePage')"  :precision="0" :step="1" :max="pageTotal" />
                <div class="dyebcc-r" :style="{background:pageNumber < pageTotal ? '#409EFF':''}"   @click="()=>{pageNumber < pageTotal ? handleEContent('e') : ''}"><el-icon><ArrowRight /></el-icon></div>
                <el-button  type="primary" autofocus="" @click="handleEContent('e')">增加页码</el-button>
            </div>
        </div>
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
import { 
    editorGetApi,
    editorEdittApi,
    editorAddtApi,
    editorDelApi,
    bokResourceFileApi
 } from "@/api/press/digitalTextbook"
 import { ElLoading } from 'element-plus'
 const { proxy } = getCurrentInstance();


const route = useRoute();
const router = useRouter();

const props = defineProps({
    tinymceId:{
        type:String,
        default:'demo'
    },
    base:{
        type:Object,
        default:{}
    },
    bookId:{
        type:[String],
        default:""
    }
})

const currentCatalogId = ref()



// 编辑器初始化
const editorState = ref(false)
const initFun = async()=>{ 
    let loading = null;
    handleInit({
        selector: `#${props.tinymceId}`,
        height:'calc(100% - 60px)',
        token:getToken(),
        init_instance_callback:editor => {
            // if (_this.value) {
            //     editor.setContent(_this.value)
            // }
            // 加载完成
            editorState.value = true;
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
    },(num,obj)=>{
        if(!loading){
            loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
        }
        if(num == 1){
            loading.close()
            loading = null;

            if(obj){

                // 使用 URLSearchParams 解析查询参数
                let params = new URLSearchParams(window.location.search);
                let p = {
                    bookId: params.get('bookId'),
                    catalogId: params.get('catalogId'),
                    pnumber: params.get('pnumber'),
                    bookResourceList:[
                        {
                            storagePath:obj.storagePath,
                            fileSize:obj.fileSize,
                            fileType:obj.fileType,
                            fileName:obj.fileName,
                        }
                    ]
                }
                bokResourceFileApi(p).then(res=>{
                    console.log(res)
                })
            }
            

        }else{
            loading.setText('已上传'+Number(num*100).toFixed(2) + '%')
        }
    })
}

// 获取编辑器内容
const getEditorContent = ()=>{
    var content = EditorGet(props.tinymceId);
    console.log(content); // 打印当前编辑器的 HTML 内容
}

// 清空编辑器内容
const clearEditor = (val)=>{
    if(!editorState.value){
        setTimeout(()=>{
            clearEditor(val)
        },100)
        return;
    }
    EditorCleat(props.tinymceId)
}
// 设置编辑器内容
const setEditor = (val)=>{
    if(!editorState.value){
        setTimeout(()=>{
            console.log("未加载完~~~等待设置")
            setEditor(val)
        },100)
        return;
    }
    setTimeout(()=>{
        console.log("加载完成~~~====设置")
        EditorSet(props.tinymceId,val)
    },1000)

}
// 设置编辑器内容
const setEditorDiasabled = (bol)=>{
    EditorDisabled(props.tinymceId,bol)
}
 
// 页面总数
const pageTotal = ref(0)
// 书籍内容
const bookDatas = ref([])
const pageNumber = ref(1)

const handleEContent = async(type) => {
    
    let params = {
        catalogId:currentCatalogId.value  || route.query.catalogId,
        bookId:props.bookId || route.query.bookId
    }
    
    switch(type){
        case 'delete':// 删除
            proxy.$modal.confirm('是否确认删除？').then(()=> {
                return editorDelApi(bookDatas.value[pageNumber.value - 1].pageId);
            }).then(() => { 
                
                if(pageNumber.value > 1){
                    --pageNumber.value;
                }else{
                    pageNumber.value = null;
                }
                if(pageTotal.value - 1 === 0){
                    pageTotal.value = 0;
                    pageNumber.value = 1;
                    handleEContent('save')
                }else{
                    handleEContent('get')
                }
                proxy.$modal.msgSuccess("删除成功");
            }).catch(() => {});

        break;
        case 'preview':// 预览

        break;
        case 'save':// 保存
            let pageContent = EditorGet(props.tinymceId);
            params = {
                ...params,
                pageContent,
                sortOrder:pageNumber.value
            }
            let savedata = {}
            // 编辑页大于当前总数  或者 总数 为0  则走新增操作
            if(pageNumber.value > pageTotal.value || pageTotal.value === 0){
                savedata = await editorAddtApi(params);
            }else{
                params.pageId = bookDatas.value[pageNumber.value - 1].pageId
                savedata = await editorEdittApi(params);
            }
            handleEContent('get')
        break;
        case 'get':// 获取内容 
            if(!params.catalogId){return;}
            clearEditor()
            
            const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })

            editorGetApi(params).then(res=>{
                console.log(res)
                pageTotal.value = res.total
                bookDatas.value = res.rows
                if(res.total == 0){
                    return handleEContent('save')
                }

                if(!pageNumber.value)pageNumber.value = 1;

                setPageNum()
                loading.close()
                
            })
        break;
        case 'f':// 上一页
            if(pageNumber.value == 1){
                return;
            }
            --pageNumber.value;
            setPageNum()
        break;
        case 'e':// 下一页
            // 点击下一页按钮 已经是最后一页的情况下 执行新增
            if(pageNumber.value == pageTotal.value){ 
                clearEditor()
                // 新增下一页
                ++pageNumber.value 
                handleEContent('save')
            }else{// 设置下一页内容
                ++pageNumber.value;
                setPageNum()
            }
        break;
        case 'changePage':
            setPageNum()
        break;

    }
}

const setPageNum = ()=>{
    let pnumber = pageNumber.value
    clearEditor()
            
    router.replace({
        name:route.name,
        query:{
            ...route.query,
            pnumber
        }
    })

    let setContent = bookDatas.value[pageNumber.value - 1]
    console.log("设置大的",setContent)
    if(setContent){
        setEditor(setContent.pageContent || '')
    } 
}

onMounted(() => {
    initFun()
})

watch(()=>route.query,(new1,old1)=>{
    console.log("修改章节", new1,old1)
    if(old1 === undefined){

    }
    
    // if(currentCatalogId.value == '' && route.query.catalogId){
    //     initFun()
    // }
    currentCatalogId.value = route.query.catalogId
    handleEContent('get')
},{
    deep:true,
    immediate:true
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
    background-color: #F5F8FA;
    textarea{
        height: calc(100% - 60px);
    }
    .dyeb-btnss{
        height: 60px;
        width: 100%;
        background: #FFFFFF;
        display: flex;
        padding:0 90px;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        .dyebcc-edit{
            display: flex;
            align-items: center;
            &>p{
                font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20;
                font-weight: 400;
                font-size: 14px;
                color: #86909C;
                line-height: 20px;
                text-align: left;
                font-style: normal;
                text-transform: none;
                margin-right:40px;
                cursor: pointer;
            }
        }
        .dyebcc-pages{
            display: flex;
            justify-content: right;
            align-items: center;
            .dyebcc-total{ 
                font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20;
                font-weight: 400;
                font-size: 14px;
                color: #333333;
                line-height: 20px;
                text-align: left;
                font-style: normal;
                text-transform: none;
                margin-right: 32px;
                span{
                    font-size: 20px;
                    margin: 0 3px;
                }
            }
            .dyebcc-l{
                width: 40px;
                height: 30px;
                background: #EDEDED;
                border-radius: 0px 0px 0px 0px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                cursor: pointer;
                border-radius: 5px;
            }
            .el-input-number{
                width: 62px;
                margin:0 10px;
                .el-input__wrapper{
                    padding-left:0;
                    padding-right:0;
                }
            }
            .el-input-number__decrease,.el-input-number__increase{
                display: none;
            }
            .dyebcc-r{
                width: 40px;
                height: 30px;
                border-radius: 5px;
                background: #EDEDED;
                border-radius: 0px 0px 0px 0px;
                margin-right: 32px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                cursor: pointer;
            }
        }
    }
}

</style>


