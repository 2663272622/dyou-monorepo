<script setup lang="ts">
import {reactive} from "vue";
import {useRouter} from 'vue-router'
import {COS_BASE} from "@/utils/const";
const router = useRouter()
defineOptions({
  name: "my"
});
const assessList = reactive([
  {
    icon: COS_BASE + '/my/test.png',
    title: "我的测验",
    status:'1',
  },
  {
    icon: COS_BASE + '/my/exam.png',
    title: "我的考试",
    status:'2',
  },
  {
    icon: COS_BASE + '/my/task.png',
    title: "我的作业",
    status:'3',
  },
])

const navigateToAssess  = () =>{
  router.push({name:'assess'})
}
</script>
<template>
  <div class="mypage w-full h-full bg-[#F6F8FB] flex flex-col items-center justify-between">
    <div class="user-mode w-full">
      <!-- 用户信息区域 -->
      <div class="user-info px-5">
        <div class="flex justify-between items-center">
          <div>
            <div class=" font-pingfang font-semibold text-[1.25rem] text-black leading-[3.2rem]">你好，王阳明</div>
            <div class="text-sm text-[#666666]">手机号：178****9888</div>
          </div>
          <div class="flex items-center">
            <div
                class="w-[3rem] h-[3rem] mr-3 bg-[#3984B5] shadow-[0_0.25rem_0.21rem_0_rgba(148,160,180,0.14)] rounded-full border-[0.13rem] border-white">
              <img src="">
            </div>
            <img :src="COS_BASE+'/my/right.png'">
          </div>
        </div>
      </div>

      <!-- 功能菜单区域 -->
      <div class="px-5 mt-6">
        <div v-for="(item,index) in assessList" :key="index" class="menu-item bg-white rounded-xl mb-4" @click="navigateToAssess">
          <div class="flex items-center">
            <div class="icon-box">
              <img :src="item.icon" :alt="item.title"/>
            </div>
            <span>{{ item.title }}</span>
          </div>
          <div class="w-[0.55rem] h-[0.55rem] border-t-[0.1rem] border-r-[0.1rem] border-t-[#666666] border-r-[#666666] rotate-45"></div>
        </div>
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <van-button class="logout" round size="large">退出登录</van-button>
  </div>
</template>

<style lang="less" scoped>
.user-mode {
  height: 15.94rem;
  background: url("https://dyh5-1342821377.cos.ap-beijing.myqcloud.com/my/mbg.png") no-repeat;
  background-size: 100% 100%;
}

.user-info {
  padding-top: 3.56rem;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #F5F5F5;

  .icon-box {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  span {
    font-size: 1rem;
    color: #333333;
  }
}

.logout {
  width: 20rem;
  height: 3rem;
  background: #E3E3E3;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 0.94rem;
  font-style: normal;
  text-transform: none;
  margin-bottom: 3rem;
}
</style>
