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
import { ossKeyApi } from "@/api/upload/upload"
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


const ossKey = ref({})
const getOssKey = async ()=>{
    const {data} = await ossKeyApi()
    ossKey.value = data
};
const abortCheckpoint = ref()
const uploadBigFile = async(file,call)=>{
    await getOssKey()

    const cof= {
        authorizationV4: true,
        accessKeyId: ossKey.value.ossAccessKeyId,
        accessKeySecret: ossKey.value.accessKeySecret,
        stsToken: ossKey.value.securityToken,
        region: ossKey.value.regionId,
        bucket: ossKey.value.bucketName,
        policy: ossKey.value.policy,
        endpoint: `https://oss-cn-qingdao.aliyuncs.com/`, 
    }
    
    const client = new OSS(cof); 

    const headers = {
        // 指定该Object被下载时的网页缓存行为。
        "Cache-Control": "no-cache",
        // 指定该Object被下载时的名称。
        "Content-Disposition": "example.txt",
        // 指定过期时间，单位为毫秒。
        Expires: "1000",
        // 指定Object的存储类型。
        "x-oss-storage-class": "Standard",
        // 指定Object标签，可同时设置多个标签。
        "x-oss-tagging": "Tag1=1&Tag2=2",
        // 指定初始化分片上传时是否覆盖同名Object。此处设置为true，表示禁止覆盖同名Object。
        "x-oss-forbid-overwrite": "true",
    };
    // 指定上传到examplebucket的Object名称，例如exampleobject.txt。
    const name = ossKey.value.userPath + file.name;
    // 获取DOM。
    const options = {
        // 获取分片上传进度、断点和返回值。
        progress: (p, cpt, res) => {
            console.log(p);
            call(p,ossKey.value.host+name)
            if(p==1){
                console.log(ossKey.value.host+name)
            }
        },
        // 设置并发上传的分片数量。
        parallel: 4,
        // 设置分片大小。默认值为1 MB，最小值为100 KB，最大值为5 GB。最后一个分片的大小允许小于100 KB。
        partSize: 1024 * 1024,
        // headers,
        // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
        meta: { year: 2020, people: "test" },
        mime: "text/plain",
    };


          // 分片上传。
    await client.multipartUpload(name, file, {
        ...options,
        // 设置上传回调。
        // 如果不涉及回调服务器，请删除callback相关设置。
        // callback: {
        //     // 设置回调请求的服务器地址。
        //     // url: "http://examplebucket.aliyuncs.com:23450",
        //     // 设置回调请求消息头中Host的值，即您的服务器配置Host的值。
        //     // host: ossKey.value.host,
        //     /* eslint no-template-curly-in-string: [0] */
        //     // 设置发起回调时请求body的值。
        //     body: "bucket=${bucket}&object=${object}&var1=${x:var1}",
        //     // 设置发起回调请求的Content-Type。
        //     contentType: "application/x-www-form-urlencoded",
        //     customValue: {
        //         // 设置发起回调请求的自定义参数。
        //         var1: "value1",
        //         var2: "value2",
        //     },
        // },
    });
    
}


// 存储正在上传的文件状态
const loads = ref({})
// 全局LOADING
const loadMethed = ref()
// 上传前劫持
const beforeUpload = async(file)=>{
    // 文件大小
    const fsize = file.size/1024/1024

    let plan = 0;
    
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

    uploadBigFile(file,(p,url)=>{
        plan = p;

        loadMethed.value.setText('已完成：'+plan*100 + '%。。。') 

        if(plan == 1){
            console.log(url)
            if(props.limit == 1){  // 处理单文件上传
                modelValue.value = url
            }else{ // 处理多文件上传
                modelValue.value.push(url)
            }
            // 处理全局 LOADIng
            delete loads.value[loadId]

            if(Object.values(loads.value).length === 0){ 
                loadMethed?.value?.close()
                loadMethed.value =  null;
            }
        }
    });

    return false; 

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