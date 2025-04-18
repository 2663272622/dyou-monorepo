<template>
  <div
    class="login-container" 
  >
    <div class="login_form">
        <h1>登录</h1>
        <ul>
            <li>账号密码</li>
            <li>验证码</li>
        </ul>
        <div class="login_formi">
            
        </div> 
        <div class="login_btn">
            <div>立即登录</div>
            <u>忘记密码？</u>
        </div>
    </div>
    <div class="login_img">
        <img src="@/assets/login/logingb.png" alt=""> 
    </div>
  </div>
</template>
<script setup lang="ts">
import { getPhoneCode,codeLogin } from "@/api/login";
import { showSuccessToast, showToast } from "vant";
import { computed, onMounted, reactive, ref } from "vue";
import { useUserStoreHook } from '@/store/modules/user'
import { useRouter } from "vue-router";
import { COS_BASE,COS_LOGO,BG_STYLE } from "@/utils/const"
defineOptions({
  name: "login"
}); 

const userStore = useUserStoreHook()
const router = useRouter()

const loginMode = ref("PHONE"); // PASSWORD

const userName = ref("");
const password = ref("");
const code = ref("")

const seePas = ref(false)
const checked = ref(false)

const btnDisabled = computed(()=>{
    if(userName.value == ''){
        return true;
    }
    if(loginMode.value == "PHONE" ){
        return code.value == ''
    }else{
        return password.value == ''
    }
})

onMounted(() => {
    // 获取倒计时时间
    nextSendTime.value = Number(localStorage.getItem("sendTime") || 0);
    handleCountDown();
});

const handleChangeLoginMode = () => {
  loginMode.value = loginMode.value == "PHONE" ? "PASSWORD" : "PHONE";

};

// 短信发送时间
const nextSendTime = ref();
// 短信剩余时间
const residueTime = ref(0);
// 获取剩余倒计时时间
const handleCountDown = () => {
    if (residueTime.value === 0 && nextSendTime.value === 0) {
        return;
    }

    let now = new Date().getTime();
    let count = parseInt((nextSendTime.value - now) / 1000 + "");

    if (count > 0) {
        if (nextSendTime.value > now) {
            if (count <= 0) {
                return resetTime()
            }
        }
        residueTime.value = count;
        setTimeout(() => handleCountDown() , 1000);
    }else{
        return resetTime()
    }
};
const resetTime = ()=>{
    nextSendTime.value = 0;
    residueTime.value = 0;
    localStorage.setItem("sendTime", 0 + "");
}

// 发送倒计时
const handSendMsm = () => {
    if (residueTime.value > 0) {
        return console.log("还在倒计时 暂时不可发送");
    }
    if(userName.value == ''){
        return showToast('请先填写手机号');
    }
    if(!validatePhoneNumber(userName.value)){
        return showToast('请检查手机号规则');
    }

    // 处理倒计时
    let now = new Date().getTime();
    nextSendTime.value = now + 60 * 1000;
    localStorage.setItem("sendTime", nextSendTime.value + "");
    residueTime.value = 60;

    getPhoneCode({ userName:userName.value }).finally(r => {
        handleCountDown();
        showSuccessToast('已发送成功');
    });
};

const handleLogin = async ()=>{
    
    let params = {
        userName:userName.value,
    }
    if(loginMode.value == 'PHONE'){
        params = {
            ...params,
            usertype: "学生",
            code:code.value
        }
    }else{
        params = {
            ...params,
            password:password.value
        }
    }
    
    await userStore.userLogin( loginMode.value,params)

    router.replace('/')
}

function validatePhoneNumber(phone) {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phone);
}
</script>

<style lang="less">
.login-container {
    background-color: #FAFAFA;
    display: flex;
    width: 100%;
    height: 100%;
    .login_form{
        padding: 150px 80px;
        box-sizing: border-box;
        width: 829px;
        height: 100%;
        background-color: #FFFFFF;
        & > h1{
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 42px;
            color: #1D2129;
            line-height: 59px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            margin-bottom:62px;
        }
        & > ul{
            display: flex;
            width: 100%;
            justify-content: center;
            margin-bottom: 65px;
            & > li{
                width: max-content;
                padding:0 45px;
            }   
        }
        .login_formi{

        }
        .login_btn{
            margin-top:80px;
            div{
                cursor: pointer;
                width: 100%;
                height: 60px;
                background: #25CBC8;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                font-size: 24px;
                color: #FFFFFF;
                line-height: 34px;
                text-align: left;
                font-style: normal;
                text-transform: none;
                border-radius: 4px;
            }

            u{
                margin:0 auto;
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                font-size: 20px;
                color: #1D2129;
                line-height: 28px;
                text-align: left;
                font-style: normal;
                text-decoration-line: underline;
                text-transform: none;
            }
        }

    }
    .login_img{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        & > img{
            width: 80%;
        }
    }
}
</style>