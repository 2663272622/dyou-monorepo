<!-- dy-upload 上传组件 -->
<template>
    <el-upload
        :class="{
            uploadFull:props.limit == fileList.length
        }"
        v-model:file-list="fileList" 
        :before-upload="beforeUpload"
        action="" 
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :accept="props.accept"
        :limit="props.limit"
        :disabled="props.disabled"
        :multiple="props.limit > 1"
    >
      <!-- :disabled="" -->
      <el-icon><Plus /></el-icon>
    </el-upload>
  
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </template>


<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import { uploadApi } from "@/api/upload/upload"
import { ElLoading } from 'element-plus'
// 子组件代码如下 可同时修改父子组件的v-model值
const props = defineProps({
  modelValue: {// 双向绑定的值
    type: [String],
    default: "",
  },
  urls: {// 双向绑定的值
    type: [String,Array],
    default: "",
  }, 
  bookId: {// 双向绑定的值
    type: [String],
    default: "",
  }, 
  fileType: {// 用于区分 文件所属的业务模块【 1书籍图片 2书籍文件 3书籍视频 4系统文件 5其他 】  
    type: [String],
    default: "5",
  },
  accept: {// 限制上传类型
    type: [String],
    default: "image/*",
  },
  limit: {// 限制上传量
    type: [Number],
    default: 1,
  },
  disabled: {// 禁用
    type: [Boolean],
    default: false,
  },
  
});
const emit = defineEmits(["update:modelValue",'cancel','submit']); 
const modelValue = useVModel(props, "modelValue", emit);


const fileList = ref ([])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
// 处理删除
const handleRemove = (uploadFile, uploadFiles) => {
    if(props.limit == 1){
        modelValue.value = ""
    }else{
        modelValue.value = uploadFiles.map(i=>i.url)
    }
}
// 预览
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

// 存储正在上传的文件状态
const loads = ref({})
// 全局LOADING
const loadMethed = ref()
// 上传前劫持
const beforeUpload = (file)=>{

    // 处理拦截
    // if(files.size > 10000){
    //     超出限制 禁止上传
    // }

    if(Object.values(loads.value).length == 0){ 
        loadMethed.value = ElLoading.service({
            lock: true,
            text: '正在上传。。。',
            background: 'rgba(0, 0, 0, 0.7)',
        })
    }
    
    // 生成LOAD
    const loadId = (Date.now() + Math.floor(Math.random() * 16)).toString(16);
    loads.value[loadId] = true;

    // 上传参数
    let params = new FormData()
    params.append('type',props.fileType)
    params.append('bookId',props.bookId)
    params.append('file',file) 
    // 调用上传
    uploadApi(params).then(res=>{
        if(props.limit == 1){  // 处理单文件上传
            modelValue.value = res.data.url
        }else{ // 处理多文件上传
            modelValue.value.push(res.data.url)
        }
    }).catch(e=>{
        console.log("上柴失败",e)
    }).finally(i=>{
        // 处理全局 LOADIng
        delete loads.value[loadId]

        if(Object.values(loads.value).length === 0){ 
            loadMethed?.value?.close()
            loadMethed.value =  null;
        }
    })
    return false;
}



// 监听单项数据变化
watch(()=>modelValue.value,()=>{
    if(!modelValue.value){
        if(props.limit == 1){
            fileList.value = ""
        }else{
            modelValue.value = []
        }
    }else if(typeof modelValue.value == 'string'){
        fileList.value = [{
            url:modelValue.value,
            name:""
        }]
    }else if(Array.isArray(modelValue.value )){

        let arr = modelValue.value.map(i=>{
            return {
                url:i,
                name:""
            }
        })
        fileList.value = arr;
    }
},{
    immediate:true,
    deep: true
})

</script>

<style lang="scss">
    .uploadFull{
        .el-upload--picture-card{
            display: none;
        }
    }

</style>