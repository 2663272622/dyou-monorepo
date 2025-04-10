<template>
  <div>
    <div class="question-header w-full fixed flex justify-between items-center py-3 px-4 bg-white border-gray-300">
      <div class="timer flex items-center text-gray-600 ">
        <img :src="COS_BASE+'/my/timer-icon.png'" class="timer-icon w-5 h-5" >
        {{ currentTime }}
      </div>
      <div class="question-progress font-medium">
        <span class="progress text-[#3984B5]">{{ currentQuestion }}</span>
        <span>/</span>
        <span>{{ totalQuestions }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {COS_BASE} from "@/utils/const";

defineProps({
  currentTime: {
    type: String,
    required: true
  },
  currentQuestion: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.progress{
  font-family: Source Han Sans CN, Source Han Sans CN;
  font-size: 1.25rem;
  font-style: normal;
  text-transform: none;
}

</style>