import { defineStore } from "pinia";
import { store } from "@/store";
import { nextTick } from "vue";
import { isDarkMode, updateDarkMode } from "@/utils/dark-mode";
import { codeLogin, getUserInfo, pasLogin } from "@/api/login";
import { showFailToast, showSuccessToast } from "vant";

export const useUserStore = defineStore({
  id: "user-store",
  state: () => ({
    token:"",
    userInfo:{},
  }), 
  getters: {
    phonenumber: (state) => state.userInfo.phonenumber,
    nickName: (state) => state.userInfo.nickName,
    userName: (state) => state.userInfo.userName,
    usertype: (state) => state.userInfo.usertype,
    usershenhetype: (state) => state.userInfo.usershenhetype,
  },
  actions: {
    setToken(t){
        this.token = t
        localStorage.setItem('token',t)
    },
    getToken(){
        if(this.token == '' && localStorage.getItem('token')){
            this.setToken(localStorage.getItem('token'))
        }
        return this.token
    },
    userLogin(mode,params){
        return new Promise(async(resolve,reject)=>{
            
            let data = {}
            try{
                if(mode == 'PHONE'){
                    data = await codeLogin(params)
                }else{
                    data = await pasLogin(params)
                }
            }catch(e){
                showFailToast(e.msg ?? '登录失败');
                reject(e)
                return;
            }
            console.log(data)
            this.setToken(data.access_token)
            showSuccessToast('登陆成功');
            this.getUserInfo()
            resolve(data);
        })
    },
    async getUserInfo(){
        let data={};
        try{
            data = await getUserInfo() 
        }catch(e){

        }
        this.userInfo = data; 
    }, 
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
