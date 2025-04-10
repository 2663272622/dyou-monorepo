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
  // 上传大文件 
export function ossKeyApi(data) {
    return request({
        url: '/file/oss/getStsToken',
        method: 'get',
        data , 
        // headers:{
        //     isRepeatSubmit:false,
        //     "Content-Type":"multipart/form-data"
        // }
    })
} 
