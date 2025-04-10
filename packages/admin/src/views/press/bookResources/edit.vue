<template>
    <!-- 添加或修改参数配置对话框 -->
     
  <el-drawer v-model="modelValue" direction="rtl" size="70%">
    <template #header>
      <h4>{{props.title}}</h4>
    </template>
    <template #default>
        <div class="book_file">
            <el-form ref="formRef" :model="formData"  :rules="rules" label-width="80px">
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="24" :md="12" :lg="7" :xl="7">
                        <el-form-item label="选择章节" prop="catalogId">
                            <el-cascader style="width:100%" v-model="catalogId" :options="options1" :props="props1" clearable />
                        </el-form-item>
                    </el-col>   
                    <el-col :xs="24" :sm="24" :md="12" :lg="7" :xl="7">
                        <el-form-item label="文件名称" prop="fileName">
                            <el-input v-model="formData.fileName" placeholder="请输入文件名" />
                        </el-form-item>
                    </el-col>    
                    <el-col :xs="24" :sm="24" :md="12" :lg="7" :xl="7">
                        <el-form-item label="文件类型" prop="fileType">
                            <el-select
                                v-model="formData.fileType"
                                placeholder="请选择文件类型"
                                clearable
                                 style="width:100%"
                            >
                                <el-option
                                v-for="dict in file_type"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>  
                    <el-col :xs="24" :sm="24" :md="12" :lg="3" :xl="3">
                           <el-button type="primary" icon="Search" @click="handleGetInfo">搜索</el-button> 
                    </el-col>     
                    
                </el-row>
            </el-form>
            <div class="book_filels">
                <el-row :gutter="32">
                    <el-col 
                    v-for="(item,index) of fileLs"
                    :key="index"
                    :xs="24" :sm="24" :md="12" :lg="8" :xl="8" >
                        <div class="book_fitem">
                            <div class="book_icover">
                                <img v-if="item.fileType.indexOf('ppt') != -1"   class="book_icoverBg" src="https://yj-dy-project.oss-cn-qingdao.aliyuncs.com/dy/ppt.png" alt="">
                                <img v-if="item.fileType.indexOf('video') != -1"  class="book_icoverBg" src="https://yj-dy-project.oss-cn-qingdao.aliyuncs.com/dy/video.png" alt="">
                                <img v-else                                       class="book_icoverBg" src="https://yj-dy-project.oss-cn-qingdao.aliyuncs.com/dy/other.png" alt="">
                                 
                                <img  v-if="item.fileType.indexOf('ppt') != -1"   class="book_icoverJb" src="https://yj-dy-project.oss-cn-qingdao.aliyuncs.com/dy/otherjb.png" alt="">
                                <img  v-if="item.fileType.indexOf('video') != -1" class="book_icoverJb" src="https://yj-dy-project.oss-cn-qingdao.aliyuncs.com/dy/pptjb.png" alt="">
                                <img  v-else                                      class="book_icoverJb" src="https://yj-dy-project.oss-cn-qingdao.aliyuncs.com/dy/videojb.png" alt="">
                            </div>
                            <div class="book_ifooter">
                                <p>
                                    {{ props.title }}
                                </p>
                            </div>
                            
                            <div class="book_xuanfu">
                                {{ item.catalogName }}
                            </div>
                            <div class="book_preview_file">
                                <!-- <p>
                                    <el-icon><Search /></el-icon>
                                    <span>预览</span>
                                </p> -->
                                <p @click="handleDown(item)">
                                    <el-icon><Download /></el-icon>
                                    <span>下载</span>
                                </p>
                            </div>
                        </div>
                    </el-col>  
                </el-row>
            </div>
        </div>
    </template>
    <template #footer>
      <div style="flex: auto">
             <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
             <el-button @click="cancel">关闭</el-button>
        <!-- <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button> -->
      </div>
    </template>
  </el-drawer> 
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import dyUpload from "@/components/dy-upload/index.vue"
import { pressAddApi,pressEditApi,pressInfoApi } from "@/api/press/press"

import { ElNotification , ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { isPhone } from '@/utils/validate'
import { bookcatalogTreefApi,bokResourceFileLsApi,catalogTApi } from "@/api/press/digitalTextbook"



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

const options1 = ref([])
const props1 = ref({
  children: 'children',
  label: 'catalogName',
  checkStrictly: true,
  value:"catalogId"
})

watch(()=>modelValue.value,()=>{
    if(modelValue.value){
        formRef?.value?.resetFields()
        if(props.type == 'edit'){
            handleGetInfo()
        }
        bookcatalogTreefApi({bookId:props.id}).then(cdata=>{
            options1.value = cdata.data  
        })
    }
})

const { proxy } = getCurrentInstance();
const { file_type } = proxy.useDict("file_type");
 

const handleDown = (item)=>{
    window.open(item.storagePath)
}

const rules = reactive({
    name: [
        { required: true, message: '请输入出版社名称', trigger: 'blur' },
        // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    logo: [
        { required: true, message: '请上传出版社logo', trigger: 'blur' },
        // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    phone: [
        // { required: true, message: '请输入出版社电话', trigger: 'blur' },
        { validator: isPhone, trigger: 'blur' , message: '请检查手机号格式是否正确'}
        // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    // age: [{ validator: checkAge, trigger: 'blur' }],
})

const fileLs = ref([])
const handleGetInfo = ()=>{
    let params = {}
    params = {
        bookId:props.id,
        ...formData.value,
        catalogId:Array.isArray(formData.value.catalogId) && formData.value.catalogId.length > 0 ? formData.value.catalogId.at(-1) :  formData.value.catalogId
    } 
    bokResourceFileLsApi(params).then(res=>{
        fileLs.value = res.data
    })
}

// 点击确认
const submitForm = () => {
            modelValue.value = false
            emit("submit")
    // formRef.value.validate(async(bol,msg)=>{
    //     if(bol){
    //         let res = null;
    //         formData.value.phone = formData.value.phone *1 
    //         switch(props.type){
    //             case "add":
    //                 res = await pressAddApi(formData.value)
    //             break;
    //             case "edit":
    //                 res = await pressEditApi(formData.value)
    //             break;
    //         }

    //         ElMessage({ message: `操作成功`, type: 'success' })

    //         formRef.value.resetFields()
    //         modelValue.value = false
    //         emit("submit")
    //     }else{
    //         let key = Object.keys(msg)[0]
            
    //         formRef.value.scrollToField(key)
    //         console.error("表单验证失败",msg)
    //     }
    // }) 
}
// 点击取消
const cancel = () => {
    modelValue.value = false
    emit("cancel")
}




</script>

<style lang="scss">
.book_file{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .book_filels{
        height: 100%;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        .book_fitem{
            width: 100%;
            height: 235px;
            border-radius: 8px;
            // border: 1px solid #437AFC;
            border: 1px solid #EDEDED;
            margin-bottom:32px;
            position: relative;
            .book_itemType{
                position: absolute;
                right: 0;
                top: 0;
                width: 45px;
                height: 45px;
                background-color: red;
            }
            .book_xuanfu{
                align-items: center;
                display: flex;
                position: absolute;
                width: 100%;
                height: 40px;
                left:0;
                bottom:calc(100% - 174px);
                background: linear-gradient( 90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.25) 100%);
                border-radius: 0px 0px 0px 0px;
                opacity: 0.8;
                font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20;
                font-weight: 400;
                font-size: 14px;
                color: #FFFFFF;
                line-height: 20px;
                text-align: left;
                font-style: normal;
                padding: 0 15px;
                box-sizing: border-box;
                text-transform: none;
                text-align: center;
                font-style: normal;
                text-transform: none;
                white-space: nowrap;       /* 禁止文本换行 */
                overflow: hidden;          /* 隐藏超出部分 */
                text-overflow: ellipsis; 
            }
            .book_icover{
                width: 100%;
                height: 174px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #DFE9FA;
                position: relative;
                .book_icoverBg{
                    width: 94px;
                    height: 84px;
                }
                .book_icoverJb{
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }
            .book_ifooter{
                width: 100%;
                height: calc(100% - 174px);
                display: flex;
                align-items: center;
                padding: 0 15px;
                box-sizing: border-box;
                p{
                    width: 282px;
                    height: 20px;
                    font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20;
                    font-weight: 400;
                    font-size: 14px;
                    color: #1D2129;
                    line-height: 20px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    white-space: nowrap;       /* 禁止文本换行 */
                    overflow: hidden;          /* 隐藏超出部分 */
                    text-overflow: ellipsis;   /* 使用省略号表示超出部分 */
                }
            }
            .book_preview_file{
                position: absolute;
                display: none;
                bottom:0;
                width: 100%;
                height: calc(100% - 174px);
                background-color: #fff;
                border-radius: 8px 8px 8px 8px;
                p{
                    cursor: pointer;
                    position: relative;
                    width:103px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20;
                    font-weight: 400;
                    font-size: 14px;
                    color: #437AFC;
                    line-height: 20px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    span{
                        margin-left:5px
                    }
                }
                p::before{
                    content:"";
                    position: absolute;
                    width: 2px;
                    height: 50%;
                    right:0;
                    top:0;
                    background: #EFF3FB;
                    transform: translateY(50%);

                }
            }
        }
                .book_fitem:hover{
                    .book_preview_file{
                        display: flex;
                    }
                }
    }
}
</style>