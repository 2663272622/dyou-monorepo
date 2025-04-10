<template>
  <div class="exam-list-page h-full bg-[#f5f6fa] flex flex-col">
      <c-nav-bar :title="'考试列表'"></c-nav-bar>

    <!-- 考试列表 -->
    <div class="exam-list flex-1 overflow-auto px-4 py-2 h-[calc(100%-3.5rem)]">
      <div v-for="(item, index) in examList" :key="index" @click="navigateToAnser"
           class="exam-item flex flex-col justify-between p-2 bg-[#fff] mb-2.5 rounded-lg h-20">
        <div class="w-full flex items-center">
          <div class="exam-icon w-6 h-6 mr-3 text-gray-600">
            <img :src="COS_BASE+'/my/test.png'">
          </div>
          <div class="exam-title font-bold text-gray-800 text-center normal-case">{{ item.title }}</div>
        </div>
        <div class="exam-info w-full">
          <div class="exam-stats flex justify-between text-[#999999] text-xs normal-case font-normal">
            <span class="answered">{{ item.answered }}人已答题</span>
            <span class="total">共{{ item.total }}题</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref , defineProps ,} from "vue";
import {COS_BASE} from "@/utils/const";
import { useRouter } from "vue-router";
import path from "path";
const router = useRouter()
const props = defineProps({

})
const examList = ref(Array(5).fill({
  title: '2021年重庆市中考英语预测试卷(三)',
  answered: '9783',
  total: '25'
}))
const navigateToAnser = () => {
  router.push('/answer')
}
const onClickLeft = () => history.back();
</script>

<style scoped>
.exam-title {
  font-family: PingFang SC, PingFang SC;
  font-size: 1rem;
  font-style: normal;
}
</style>