<template>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="props.title" v-model="modelValue" width="65%" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body>
       <el-form ref="formRef" :model="formData"  :rules="rules" label-width="80px">
            <el-row :gutter="10">
                
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="题库类型" prop="bankType"> 
                        <el-select
                            v-model="formData.bankType"
                            placeholder="请选择题库类型"
                        >
                            <el-option
                                v-for="dict in question_bank_type"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>  
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="书籍名称" prop="bookId">
                        <el-select
                            v-model="formData.bookId"
                            placeholder="请选择书籍"
                            clearable
                            disabled
                        >
                            <el-option
                                v-for="dict in bookList"
                                :key="dict.bookId"
                                :label="dict.bookName"
                                :value="dict.bookId"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>  
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="关联目录" prop="catalogIds">
                        <el-cascader style="width:100%" v-model="formData.catalogIds" :options="catalogData" :props="defaultProps" clearable />
                    </el-form-item>
                </el-col>  
                
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="题型" prop="questionType">
                        <el-radio-group v-model="formData.questionType" @change="handleChangeQType">
                            <el-radio v-for="(item,index) of topic_type" :key="index" :value="item.value">{{ item.label }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col> 
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="题目" required>
                        <!-- prop="questionText" -->
                        <!-- 选项题目编辑 -->
                        <template v-if="['3'].includes(formData.questionType)">
                            <!-- <div id="questionText3"></div> -->
                            <textarea id="questionText3" />
                            <el-button
                                type="primary"
                                plain
                                icon="Plus"
                                style="margin-top:10px"
                                v-hasPermi="['manage:publisher:add']"
                                @click="handleAddBlank()"
                            >新增</el-button>
                        </template>
                        <!-- 题目 -->
                        <template v-else>
                            <el-input v-model="formData.questionText" type="textarea" placeholder="请输入内容"></el-input>
                        </template>
                    </el-form-item>
                </el-col>    
                  <!-- 单选/复选 选项配置 -->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"   v-if="['1','2'].includes(formData.questionType)">
                    <el-form-item label="选项内容" required>
                        <ul class="form-select" v-if="Array.isArray(formData.bankQuestionOptionList)">
                            
                            <li v-for="(item,index) of formData.bankQuestionOptionList" :key="index">
                                <p>{{ item.optionKey }}</p>
                                <el-input v-model="item.optionText"  placeholder="请输入内容"></el-input>
                                <p @click="handleQuestion(index)">删除</p>
                            </li> 
                        </ul>
                        <el-button
                            v-if="!formData.bankQuestionOptionList || formData.bankQuestionOptionList.length < 8"
                            type="primary"
                            plain
                            icon="Plus"
                            v-hasPermi="['manage:publisher:add']"
                            @click="handleQuestion()"
                        >新增</el-button>
                    </el-form-item>
                </el-col>    
                <!-- 单选/复选/判断 答案选项 -->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"  v-if="['1','2','5'].includes(formData.questionType)">
                    <el-form-item label="答案" required>
                        <!-- 单选 -->
                        <template v-if="formData.questionType == 1">
                            <el-radio-group v-model="formData.answer">
                                <el-radio v-for="(item,index) of formData.bankQuestionOptionList" :key="index" :value="item.optionId">{{ item.optionKey }}</el-radio>
                            </el-radio-group>
                        </template>
                        <!-- 复选 -->
                        <template v-else-if="formData.questionType == 2"> 
                            <el-checkbox-group  v-model="formData.answer">
                                <el-checkbox  v-for="(item,index) of formData.bankQuestionOptionList" :key="index" :value="item.optionId" :label="item.optionKey"  />
                            </el-checkbox-group>
                        </template>
                        <!-- 判断 -->
                        <template v-if="formData.questionType == 5">
                            <el-radio-group v-model="formData.answerData">
                                <el-radio value="Y">正确</el-radio>
                                <el-radio value="N">错误</el-radio>
                            </el-radio-group>
                        </template>
                    </el-form-item>
                </el-col>    
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-else>
                    <el-form-item label="参考答案" prop="answerData">
                        <el-input v-model="formData.answerData" type="textarea" placeholder="请输入参考答案"></el-input>
                    </el-form-item>
                </el-col>    
                
 
            </el-row>
 
       </el-form>
       <template #footer>
          <div class="dialog-footer">
             <el-button type="primary" @click="submitForm">确 定</el-button>
             <el-button @click="cancel">取 消</el-button>
          </div>
       </template>
    </el-dialog>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import dyUpload from "@/components/dy-upload/index.vue"
import { bookAddApi,bookEditApi,selectBookCategoryTreeApi } from "@/api/press/digitalTextbook"
import { authorAllListApi } from "@/api/press/author"
import { pressListAllApi, } from "@/api/press/press"
import { listAllSchoolApi } from "@/api/self-manage/school.js";
import { bookcatalogTreefApi,catalogDelApi,catalogTApi } from "@/api/press/digitalTextbook"

import { ElNotification , ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { isPhone } from '@/utils/validate'
import { bookListApi } from "@/api/press/digitalTextbook"
import { bankGetApi,bankAddApi,bankEditApi,bankINFPApi } from "@/api/teaching/question"

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

const route = useRoute();
const router = useRouter();

const { proxy } = getCurrentInstance();
// 书籍发布状态
const { book_issue_status } = proxy.useDict("book_issue_status");
// 书籍审核状态
const { book_audit_status } = proxy.useDict("book_audit_status");
const { book_tag } = proxy.useDict("book_tag");
const { sch_teaching_level } = proxy.useDict("sch_teaching_level");
 const { topic_type } = proxy.useDict("topic_type");
 const { question_bank_type } = proxy.useDict("question_bank_type");


// 子组件代码如下 可同时修改父子组件的v-model值
const props = defineProps({
  modelValue: {// 双向绑定的值
    type: [String],
    default: "",
  },
  title:{
    type:[ String ],
    default:"add"
  },
  type:{
    type:[ String ],
    default:"add"
  },
  id:{
    type:[ String ],
    default:""
  },
});
const emit = defineEmits(["update:modelValue",'cancel','submit']); 
const modelValue = useVModel(props, "modelValue", emit);

const iImgUrl = `https://yj-dy-project.oss-cn-qingdao.aliyuncs.com/dy/ddcr.png`
const inSetImg = ref(`<img src="${iImgUrl}" >`)
const EditorId = `#questionText3`

const defaultProps = {
  children: 'children',
  label: 'catalogName',
  checkStrictly: true,
  value:"catalogId"
}

const formData = ref({
    questionType:'1'
})
const formRef = ref()
const catalogData = ref([])

const bookList = ref([])
bookListApi({}).then(res=>{
    formData.value.bookId = Number(route.query.bookId)
    bookList.value = res.rows
    bookcatalogTreefApi({bookId:formData.value.bookId}).then(cdata=>{
        catalogData.value = cdata.data  
    })
})

watch(()=>modelValue.value,()=>{
    editorState.value = false
    if(modelValue.value){
        formData.value.bookId = Number(route.query.bookId)
        if(props.type == 'edit'){
            handleGetInfo(props.id)
        }
    }else{

        formData.value = {}
    }
})

const rules = reactive({
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    bankType: [
        { required: true, message: '请选择题库类型', trigger: 'blur' },
    ],
    bookId: [
        { required: true, message: '请选择书籍', trigger: 'blur' },
    ],
    catalogIds: [
        { required: true, message: '请选择目录', trigger: 'blur' },
    ],
    questionType: [
        { required:true, message: '请选择题型', trigger: 'blur' },
    ],
    // questionText: [
    //     { required: formData.value.questionType != '3', message: '请输入题目', trigger: 'blur' },
    // ],
    answerData: [
        { required: true, message: '请录入答案', trigger: 'blur' },
    ],

})

const authorList = ref([])
const schoolList = ref([])
const pressList = ref([])
const typeTree = ref([])
const getBaseValue = ()=>{
    authorAllListApi().then(r=>{
        authorList.value = r.data
    })
    listAllSchoolApi().then(r=>{
        schoolList.value = r.data;
    })
    pressListAllApi().then(r=>{
        pressList.value = r.data;
    })
    selectBookCategoryTreeApi().then(r=>{
        typeTree.value = r.data;
        console.log(r.data)
    })
}
getBaseValue()
// 
// 设置编辑器内容
const setEditor = (val)=>{
    console.log("设置val",val)
    if(!editorState.value){
        setTimeout(()=>{
            setEditor(val)
        },100)
        return;
    }
    nextTick(()=>{
        EditorSet(`questionText3`,val)
    })

}

const handleGetInfo = (id)=>{
    bankINFPApi(id).then(res=>{
        formData.value = res.data; 


        switch(formData.value.questionType){ 
            case '3':// 填空题
                // handleChangeQType()
                nextTick(()=>{
                    initEditor()
                    setEditor(formData.value.questionText)
                })
            break;
            case '4':// 简答题
    
            break;
            case '5':// 判断题
    
            break; 
        }

        formData.value.bankQuestionOptionList.forEach(item=>{
            if(item.isCorrect === '1'){
                switch(formData.value.questionType){
                    case '1':// 单选题
                        formData.value.answer = item.optionId;  
                    break;
                    case '2':// 多选题
                        if(!Array.isArray(formData.value.answer)){
                            formData.value.answer = [];
                        }
                        formData.value.answer.push(item.optionId); 
                    break;
                    // case '3':// 填空题
                    //     handleChangeQType()
                    //     nextTick(()=>{
                    //         setEditor(formData.value.questionText)
                    //     })
                    // break;
                    // case '4':// 简答题
            
                    // break;
                    case '5':// 判断题
            
                    break; 
                }
            }
        })
    })
}


// 添加题目
const selectABCD = [ 'A','B','C','D','E','F','G','H','I','J','K' ]
const handleQuestion = (num)=>{
    if(!Array.isArray(formData.value.bankQuestionOptionList)){
        formData.value.bankQuestionOptionList = []
    } 
    if(num === undefined){
        // const randomId = (Date.now().toString(16) + Math.random().toString(16).slice(2, 18)).slice(0, 32);

        let params = {
            "optionId": Date.now(), //选项ID
            // "questionId": 1, //题库题目ID（关联question_bank.question_id）
            "optionKey": "", //选项标识（如A/B/C/D）
            "optionText": "", //选项内容
            "isCorrect": "0", //是否为正确答案（0=否，1=是）
            // "createBy": "", //创建者
            // "createTime": "2025-03-31 09:51:04", //创建时间
            // "updateBy": "", //更新者
            // "updateTime": "2025-03-31 09:51:04", //更新时间
            "remark": "", //备注
            "params": {
                "KEY": {}
            } //请求参数
        }
    
        switch(formData.value.questionType){
            case '1':// 单选题
    
            break;
            case '2':// 多选题
    
            break;
            case '3':// 填空题
    
            break;
            case '4':// 简答题
    
            break;
            case '5':// 判断题
    
            break; 
        }
    
        formData.value.bankQuestionOptionList.push(params)
    }else{
        formData.value.bankQuestionOptionList.splice(num,1)
    }

    formData.value.bankQuestionOptionList.forEach((item,index)=>{
        item.optionKey = selectABCD[index]
    })

} 

// 点击确认
const submitForm = () => {
    formRef.value.validate(async(bol,msg)=>{
        if(bol){
            let res = null;
            try{
                // formData.value.categoryType = formData.value.categoryType.at(-1)
            }catch(e){}
            
     
            if(formData.value.questionText === '' || formData.value.questionText === undefined){
                if(['3'].includes(formData.value.questionType)){
                    let txt = EditorGet(`questionText3`);
                    if(txt.indexOf(iImgUrl) === -1){ 
                        return  ElMessage({ message: `请填写题目内容`, type: 'warning' })
                    }
                }else{
                    return  ElMessage({ message: `请填写题目内容`, type: 'warning' })
                }
            }  

            switch(formData.value.questionType.toString()){
                case '1':// 单选题
                    if(!formData.value.bankQuestionOptionList || formData.value.bankQuestionOptionList.length == 0){
                        return ElMessage({ message: `请先设置选项`, type: 'warning' })
                    }
                    if(formData.value.bankQuestionOptionList.find(item=>item.optionText == '' || item.optionText === undefined)){
                        return ElMessage({ message: `选项内容不可为空`, type: 'warning' })
                    } 
                    if(formData.value.answer === undefined || formData.value.answer == ''){
                        return ElMessage({ message: `请选择答案`, type: 'warning' })
                    }
                    formData.value.bankQuestionOptionList.forEach((item,index)=>{
                        if(item.optionId == formData.value.answer){
                            item.isCorrect = 1
                        }else item.isCorrect = 0;
                    }) 
                break;
                case '2':// 多选题
                    if(!formData.value.bankQuestionOptionList || formData.value.bankQuestionOptionList.length == 0){
                        return ElMessage({ message: `请先设置选项`, type: 'warning' })
                    }
                    if(formData.value.bankQuestionOptionList.find(item=>item.optionText == '' || item.optionText === undefined)){
                        return ElMessage({ message: `选项内容不可为空`, type: 'warning' })
                    } 
                    if(formData.value.bankQuestionOptionList.length < 3){
                        return ElMessage({ message: `多选题至少要有三条选项`, type: 'warning' })
                    } 
                    if(formData.value.answer === undefined || formData.value.answer.length == 0){
                        return ElMessage({ message: `请选择答案`, type: 'warning' })
                    } 
                    if(formData.value.answer.length == 1){
                        return ElMessage({ message: `多选题答案应有多个选项`, type: 'warning' })
                    } 

                    formData.value.bankQuestionOptionList.forEach((item,index)=>{
                        if(formData.value.answer && formData.value.answer.includes(item.optionId)){ 
                            item.isCorrect = 1
                        }else item.isCorrect = 0;
                    })
                break;
                case '3':// 填空题
                    var content = EditorGet(`questionText3`)
                    formData.value.questionText = content
                    console.log(content); // 打印当前编辑器的 HTML 内容
                break;
                case '4':// 简答题
        
                break;
                case '5':// 判断题
                    if(formData.value.answerData === undefined || formData.value.answerData == ''){
                        return ElMessage({ message: `请选择答案`, type: 'warning' })
                    }
                break; 
            } 
            let  params = {
                ...formData.value,
                answer:null
            }
            switch(props.type){
                case "add":
                    res = await bankAddApi(params) 
                break;
                case "edit":
                    res = await bankEditApi(params)
                break;
            }

            ElMessage({ message: `操作成功`, type: 'success' })

            formRef.value.resetFields()
            modelValue.value = false
            emit("submit")
        }else{
            let key = Object.keys(msg)[0]
            
            formRef.value.scrollToField(key)
            console.error("表单验证失败",msg)
        }
    }) 
}

// 切换题型
const handleChangeQType = ()=>{
    formData.value.bankQuestionOptionList = []
    switch(formData.value.questionType){
        case '1':// 单选题
            formData.value.answer = ""; 
        break;
        case '2':// 多选题
            formData.value.answer = [];
        break;
        case '3':// 填空题
            formData.value.answer = ""; 
            initEditor()
        break;
        case '4':// 简答题

        break;
        case '5':// 判断题

        break; 
    } 
}
watch(()=>formData.value.questionType,(n,old)=>{
    if(old === '3'){
        formData.value.questionText = ""; 
    }
})
// 插入空格
const handleAddBlank = ()=>{
    console.log("插入空额")
    let did = `questionText3`
    // 获取编辑器实例
    var editor = tinymce.get(did);  // 替换为你的编辑器实例ID
    // 插入内容
    editor.insertContent(inSetImg.value);
}


const editorState = ref(false)
const initEditor = ()=>{
    
    window.tinymce.remove();
    handleInit({
        selector: EditorId,
        height:'100',
        width:'100%',
        menubar: false,                  // 隐藏菜单栏
        toolbar: false,                  // 隐藏工具栏
        statusbar: false,                // 隐藏状态栏（如果需要）
        branding: false,                 // 隐藏版权信息（如果需要）
        // toolbar:null, //工具栏配置
        // plugins:null, //插件
        // menubar:null, //插件
        
        // token:getToken(),
        init_instance_callback:editor => {
            // 加载完成
            editorState.value = true;
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

// 点击取消
const cancel = () => {
    formRef.value.resetFields()
    modelValue.value = false
    emit("cancel")
}

</script>

<style lang="scss">
.form-select{ 
    width: 100%;
    ul,li{
        width: 100%;
    }
    li{
        display: flex;
        margin-bottom:30px;
        p{
            width: 45px;
            height:40px;
            min-width: 45px;
            min-height:40px;
            background: #E5E9ED;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20;
            font-weight: 400;
            font-size: 14px;
            color: #1D2129;
            line-height: 20px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            cursor: pointer;
        }
        .el-input__wrapper{
            border-radius: 0;
        }
    }
}
#questionText3{
    width: 100%;

}
</style>