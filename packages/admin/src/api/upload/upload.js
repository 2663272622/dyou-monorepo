import request from '@/utils/request'

// 上传文件接口
export function uploadApi(data) {
  return request({
    url: '/file/uploadCOS',
    method: 'post',
    data , 
    headers:{
        isRepeatSubmit:false,
        "Content-Type":"multipart/form-data"
    }
  })
} 