<template>
  <div
    class="login-container w-full h-full bg-[#F4F8FB] py-[2rem] px-[2rem]  flex pt-[5.69rem] flex-col items-center"
    :style="{
        ...BG_STYLE
    }"
  >
    <img
      :src="COS_LOGO"
      class="xyc w-[3.5rem] h-[3.5rem] mb-[.5rem]"
      alt=""
    />
    <h1 class="xyc mb-[3.81rem] text-[#10121F] font-[500] ">点优智慧教育平台</h1>

    <ul class="login-mode w-full flex justify-center h-[3rem] mb-[1rem] px-[.81rem]">
        <li class="relative w-[50%] h-[100%]" @click="loginMode == 'PASSWORD' && handleChangeLoginMode()">
            <img v-show="loginMode != 'PASSWORD'" :src="COS_BASE+'/login/left1.png'" class="absolute z-[0]" alt="">
            <img  v-show="loginMode == 'PASSWORD'" :src="COS_BASE+'/login/left2.png'" class="absolute z-[0]" alt="">
            <p :style="{
                color: loginMode == 'PASSWORD' ? '#3984B5' : '#FFFFFF'
            }">手机号登录</p>
        </li>
        <li class="relative  w-[50%] h-[100%]" @click="loginMode != 'PASSWORD' && handleChangeLoginMode()">
            <img v-show="loginMode == 'PASSWORD'" :src="COS_BASE+'/login/right1.png'" alt="">
            <img v-show="loginMode != 'PASSWORD'" :src="COS_BASE+'/login/right2.png'" alt="">
            <p :style="{
                color: loginMode != 'PASSWORD' ? '#3984B5' : '#FFFFFF'
            }">账号登录</p>
            
        </li>
    </ul>

    <div class="login-from w-full">
        <!-- 允许输入数字，调起带符号的纯数字键盘 -->
        <van-field
            v-model="userName"
            :label-width="0"
            type="number"
            placeholder="请输入手机号"
            label=""
            clearable
            :maxlength="30"
        >
            <template #left-icon>
                <img :src="COS_BASE+'/login/user.png'" class="w-[1.25rem] h-[1.25rem]" alt="">
            </template>
        </van-field>
      <!-- 	/ -->
      <!-- 输入密码 -->
      <van-field
        v-if="loginMode == 'PASSWORD'"
        v-model="password"
        :label-width="0"
        :type="seePas ? 'text' : 'password'"
        placeholder="请输入密码"
        label=""
        :maxlength="30"
        >
            <template #left-icon>
                <img :src="COS_BASE+'/login/pas.png'" class="w-[1.25rem] h-[1.25rem]" alt="">
            </template>
            <template #right-icon v-if="password.length > 0">
                <img @click="seePas = !seePas" v-show="!seePas" :src="COS_BASE+'/login/see.png'" class="w-[1.25rem] h-[1.25rem]" alt="">
                <img @click="seePas = !seePas" v-show="seePas" :src="COS_BASE+'/login/unsee.png'" class="w-[1.25rem] h-[1.25rem]" alt="">
            </template>
        </van-field>

      <van-field
        v-model="code"
        center
        v-else
        clearable
        :maxlength="30"
        label=""
        :label-width="0"
        placeholder="请输入短信验证码"
      > 
        <template #button>
            <span class="text-[#cccc]">丨</span>
            <span
                 @click="residueTime <= 0 && handSendMsm()"
                :class="[residueTime == 0 ? 'text-[#3984B5]' : 'opacity-[0.5]']"
            >{{
              residueTime == 0 ? "发送验证码" : residueTime + "s后重新发送"
            }}</span>
        </template>
      </van-field>
      <van-button
        @click="handleLogin"
        type="primary"
        round
        size="large"
        class="!mt-[1rem] !mb-[1rem]"
        color="#3984B5"
        :disabled="btnDisabled"
        >登录</van-button
      >

        <ul class="flex justify-between text-xs text-[#2D79EB]">
            <li >
                <!-- @click="handleChangeLoginMode"
                {{ loginMode == "PHONE" ? "密码登录" : "验证码登录" }} -->
            </li>
            <li>
            <!-- 忘记密码 -->
            </li>
        </ul>
    </div>

    <div class="fixed bottom-[3rem] login-fotter">
        <van-checkbox v-model="checked">
            <span>
                登录代表您同意 <a>《用户服务协议》</a><a>《隐私政策》</a>
            </span>
        </van-checkbox>

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
const code = ref("");

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
    .login-mode{
        display: flex;
        justify-content: space-between;
        & li{
            display: flex;
            width: calc(50% - 0px);
            align-items: center;
            justify-content: center;
            & > img{
                width: 100%;
                height: 100%;
            }
            & p{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
                font-weight: 500;
                font-size: 0.85rem;
                color: #FFFFFF;
                line-height: 0.99rem;
                text-align: center;
                font-style: normal;
                text-transform: none;
            }
        }
    }

    .login-from {
        .van-cell.van-field {
        border-radius: 1.5rem;
        border: 1px solid #cccccc70;
        margin-bottom: 1rem;
        //   padding: 0;
            input {
                background: #fff;
                background-color: #fff !important;
            }
        }
    }

    .login-fotter{
        span{
            font-weight: 400;
            font-size: 0.75rem;
            color: #6A6D75;
            line-height: 1.25rem;
            text-align: left;
            font-style: normal;
            text-transform: none;
            a{
                color:#3984B5
            }
        }
    }

    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px white inset;
        -webkit-text-fill-color: #333;
    }
}
</style>
