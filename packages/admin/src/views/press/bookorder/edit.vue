<template>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="props.title" v-model="modelValue" width="450" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body>
       <el-form ref="formRef" :model="formData"  :rules="rules" label-width="80px">
            <el-row :gutter="10">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="处理意见" prop="description">
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
import { pressAddApi,pressEditApi,pressInfoApi } from "@/api/press/press"
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
    default:"reject"
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
 

const { proxy } = getCurrentInstance();
// 书籍发布状态
const { book_issue_status } = proxy.useDict("book_issue_status");
// 书籍审核状态
const { book_audit_status } = proxy.useDict("book_audit_status");


const rules = reactive({
    name: [
        { required: props.type == 'reject', message: '请输入出版社名称', trigger: 'blur' },
        // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ], 
})
 

// 点击确认
const submitForm = () => {
    formRef.value.validate(async(bol,msg)=>{
        if(bol){
            let res = null;
            formData.value.phone = formData.value.phone *1 
            switch(props.type){
                case "resolve":// 同意
                    res = await pressAddApi(formData.value)
                break;
                case "reject":// 驳回
                    res = await pressEditApi(formData.value)
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