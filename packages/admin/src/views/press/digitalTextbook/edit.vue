<template>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="props.title" v-model="modelValue" width="65%" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body>
       <el-form ref="formRef" :model="formData"  :rules="rules" label-width="80px">
            <el-row :gutter="10">
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="书籍名称" prop="bookName">
                        <el-input v-model="formData.bookName" placeholder="请输入书籍名称" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="作者" prop="authorId">
                        <el-select
                            v-model="formData.authorId"
                            placeholder="请输入作者"
                        >
                            <el-option
                                v-for="item in authorList"
                                :key="item.authorId"
                                :label="item.authorName"
                                :value="item.authorId"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="封面" prop="coverUrl">
                        <dyUpload
                            v-model="formData.coverUrl"
                            fileType="5"
                        ></dyUpload>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="字数(万)" prop="wordCount">
                        <el-input v-model="formData.wordCount" placeholder="请输入字数" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="ISBN" prop="isbn">
                        <el-input v-model="formData.isbn" placeholder="请输入ISBN" />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="定价" prop="listPrice">
                        <el-input v-model="formData.listPrice"  type="number" placeholder="请输入定价" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="销售价" prop="price">
                        <el-input v-model="formData.price"  type="price" placeholder="请输入价格" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="编辑电话" prop="editorPhone">
                        <el-input v-model="formData.editorPhone"  type="number" placeholder="请输入电话" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="出版日期" prop="publishDate">
                        <el-date-picker
                            style="width: 100%;"
                            v-model="formData.publishDate"
                            placeholder="请输入出版日期"
                            type="date"
                            value-format="YYYY-MM-DD"
                        />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="合作院校" prop="schoolId">
                        <el-select
                            v-model="formData.schoolId"
                            placeholder="请选择合作院校"
                            clearable
                        >
                            <el-option
                                v-for="dict in schoolList"
                                :key="dict.schoolId"
                                :label="dict.schoolName"
                                :value="dict.schoolId"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="出版社" prop="publishId">
                        <el-select
                            v-model="formData.publishId"
                            placeholder="请选择出版社"
                            clearable
                        >
                            <el-option
                                v-for="dict in pressList"
                                :key="dict.publisherId"
                                :label="dict.name"
                                :value="dict.publisherId"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="书籍状态" prop="bookStatus">
                        <el-select
                            v-model="formData.bookStatus"
                            placeholder="请选择书籍状态"
                            clearable
                            disabled
                        >
                            <el-option
                                v-for="dict in book_issue_status"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="审核状态" prop="auditStatus">
                        <el-select
                            v-model="formData.auditStatus"
                            placeholder="请选择审核状态"
                            clearable
                            disabled
                        >
                        <el-option
                            v-for="dict in book_audit_status"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="教学层次" prop="educationLevel">
                        <el-select
                            v-model="formData.educationLevel"
                            placeholder="请选择教学层次"
                            clearable
                        >
                        <el-option
                            v-for="dict in sch_teaching_level"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="学科分类" prop="categoryTypeList">
                        <el-cascader
                            v-model="formData.categoryTypeList"
                            placeholder="请选择学科分类"
                            :options="typeTree"
                            style="width:100%"
                            :props="{
                                label:'categoryName',
                                value:'id',
                                children:'children',
                            }"
                        />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="标签" prop="tags">
                        <el-select
                            v-model="formData.tags"
                            placeholder="请选择标签"
                            clearable
                        >
                        <el-option
                            v-for="dict in book_tag"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="内容摘要" prop="name">
                        <el-input v-model="formData.name" placeholder="请输入内容摘要" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="特别说明" prop="name">
                        <el-input v-model="formData.name" placeholder="请输入特别说明" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="本书特色" prop="features">
                        <el-input v-model="formData.features" placeholder="请输入本书特色" />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="备注" prop="description">
                        <el-input v-model="formData.description" type="textarea" placeholder="请输入内容"></el-input>
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
import { bookAddApi,bookEditApi,bookbookApi,selectBookCategoryTreeApi } from "@/api/press/digitalTextbook"
import { authorAllListApi } from "@/api/press/author"
import { pressListAllApi, } from "@/api/press/press"
import { listAllSchoolApi } from "@/api/self-manage/school.js";

import { ElNotification , ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { isPhone } from '@/utils/validate'


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


const formData = ref({})
const formRef = ref()

watch(()=>modelValue.value,()=>{
    if(modelValue.value){
        if(props.type == 'edit'){
            handleGetInfo(props.id)
        }
    }
})

const { proxy } = getCurrentInstance();
// 书籍发布状态
const { book_issue_status } = proxy.useDict("book_issue_status");
// 书籍审核状态
const { book_audit_status } = proxy.useDict("book_audit_status");
const { book_tag } = proxy.useDict("book_tag");
const { sch_teaching_level } = proxy.useDict("sch_teaching_level");


const rules = reactive({
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    bookName: [
        { required: true, message: '请输入名称', trigger: 'blur' },
    ],
    coverUrl: [
        { required: true, message: '请上传封面', trigger: 'blur' },
    ],
    isbn: [
        { required: true, message: '请输入书号', trigger: 'blur' },
    ],
    educationLevel: [
        { required: true, message: '请选择教学层次', trigger: 'blur' },
    ],
    categoryTypeList: [
        { required: true, message: '请输入学科分类', trigger: 'blur' },
    ],
    listPrice: [
        { required: true, message: '请输入定价', trigger: 'blur' },
    ],
    publishId: [
        { required: true, message: '请选择出版社', trigger: 'blur' },
    ],
    schoolId: [
        { required: true, message: '请选择学校', trigger: 'blur' },
    ],
    price: [
        { required: true, message: '请输入售价', trigger: 'blur' },
    ],
    publishDate: [
        { required: true, message: '请输入出版日期', trigger: 'blur' },
    ],
    authorId: [
        { required: true, message: '请输入作者', trigger: 'blur' },
    ],

    editorPhone: [
        // { required: true, message: '请输入出版社电话', trigger: 'blur' },
        { validator: isPhone, trigger: 'blur' , message: '请检查手机号格式是否正确'}
        // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    // age: [{ validator: checkAge, trigger: 'blur' }],
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

const handleGetInfo = (id)=>{
    bookbookApi(id).then(res=>{
        formData.value = res.data
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
            switch(props.type){
                case "add":
                    res = await bookAddApi(formData.value)
                break;
                case "edit":
                    res = await bookEditApi(formData.value)
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
// 点击取消
const cancel = () => {
    formRef.value.resetFields()
    modelValue.value = false
    emit("cancel")
}

</script>

<style lang="scss">

</style>