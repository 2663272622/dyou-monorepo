<template>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="这就是名称呗" v-model="modelValue" width="70%" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body>
       <el-form ref="formRef" :model="formData"  :rules="rules" label-width="80px">
            <el-row :gutter="10">
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="字典名称" prop="dictName">
                        <el-input v-model="formData.dictName" placeholder="请输入字典名称" />
                    </el-form-item>
                </el-col>  
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="字典名称" prop="dictName">
                        <el-input v-model="formData.dictName" placeholder="请输入字典名称" />
                    </el-form-item>
                </el-col>  
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <el-form-item label="状态" prop="status">
                        <el-select
                            v-model="formData.dictName"
                            placeholder="Select"
                            style="width: 100%"
                        >
                            <el-option
                                v-for="item in sys_normal_disable"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>  
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="formData.remark" type="textarea" placeholder="请输入内容"></el-input>
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
// 子组件代码如下 可同时修改父子组件的v-model值
const props = defineProps({
  modelValue: {// 双向绑定的值
    type: [String],
    default: "",
  },
});
const emit = defineEmits(["update:modelValue",'cancel','submit']); 
const modelValue = useVModel(props, "modelValue", emit);


const { proxy } = getCurrentInstance();
// 书籍发布状态
const { book_issue_status } = proxy.useDict("book_issue_status");
// 书籍审核状态
const { book_audit_status } = proxy.useDict("book_audit_status");


const rules = reactive({
    dictName: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    // age: [{ validator: checkAge, trigger: 'blur' }],
})
const formData = ref({})
const formRef = ref()

// 点击确认
const submitForm = () => {
    formRef.value.validate(async(bol,msg)=>{
        if(bol){


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