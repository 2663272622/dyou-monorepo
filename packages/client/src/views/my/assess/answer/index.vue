<template>
  <div class="question-page w-full h-full bg-[#f6f8fb]">
    <!-- 顶部导航 -->
    <c-nav-bar :title="'答题页面'"></c-nav-bar>

    <!-- 题目信息头部 -->
    <QuestionHeader
        :currentTime="timer"
        :currentQuestion="currentQuestionIndex"
        :totalQuestions="30"
    />

    <!-- 题目内容区域 -->
    <div class="question-content overflow-auto">
      <!-- 题型标签 -->
      <div class="question-type-tag bg-[#d0e1ed] text-[#3984B5] ">
        {{ currentQuestion.type }}
      </div>

      <!-- 题目 -->
      <div class="question-title">
        {{ currentQuestion.title }}
      </div>

      <!-- 动态组件 - 根据题型显示不同的答题组件 -->
      <component
          :is="questionComponent"
          v-model="userAnswer"
          :question="currentQuestion"
          @answer-submit="handleAnswerSubmit"
      />
    </div>

    <!-- 答案解析 -->
    <QuestionAnalysis
        v-if="showAnalysis"
        :correctAnswer="currentQuestion.correctAnswer"
        :analysis="currentQuestion.analysis"
        :userAnswer="userAnswer"
        :accuracy="currentQuestion.accuracy"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import QuestionHeader from '../components/QuestionHeader.vue'
import QuestionAnalysis from '../components/QuestionAnalysis.vue'
import SingleChoice from '../components/QuestionTypes/SingleChoice.vue'
import MultipleChoice from '../components/QuestionTypes/MultipleChoice.vue'
import JudgmentQuestion from '../components/QuestionTypes/JudgmentQuestion.vue'
import FillBlank from '../components/QuestionTypes/FillBlank.vue'
import ShortAnswer from '../components/QuestionTypes/ShortAnswer.vue'

const timer = ref('02:34')
const currentQuestionIndex = ref(5)
const userAnswer = ref(null)
const showAnalysis = ref(false)

// 当前题目数据
const currentQuestion = ref({
  type: '单选题',
  title: '天人相应，四时脉象的变化，如《素问·脉要精微论》所说："春日浮"，则可见',
  options: [
    { label: 'A', text: '如鱼之游在波' },
    { label: 'B', text: '如鱼之游在波' },
    { label: 'C', text: '如鱼之游在波如鱼之游在波如鱼之游在波...' },
    { label: 'D', text: '泛泛平万物有余' }
  ],
  correctAnswer: 'A',
  analysis: '一年间气候变化的规律一般是春温、夏热、秋凉、冬寒，顺应这种规律，人体的脉象也相应出现"春日浮如鱼之游在波"'
})

const onClickLeft = () => history.back();

// 根据题型动态选择组件
const questionComponent = computed(() => {
  const componentMap = {
    '单选题': SingleChoice,
    '多选题': MultipleChoice,
    '判断题': JudgmentQuestion,
    '填空题': FillBlank,
    '简答题': ShortAnswer
  }
  return componentMap[currentQuestion.value.type]
})

// 处理答题提交
const handleAnswerSubmit = (answer) => {
  userAnswer.value = answer
  showAnalysis.value = true
}
</script>

<style scoped>
.question-content {
  padding:0 1rem;
  margin-top: 0.81rem;
}
.question-type-tag{
  margin-bottom: 0.75rem;
  background: rgba(57,132,181,0.2);
}
.question-type-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #e8f2ff;
  color: #666;
  border-radius: 4px;
  font-size: 14px;
}

.question-title {
/*  margin: 16px 0;
  font-size: 16px;
  line-height: 1.5;
  color: #333;*/
  font-family: Source Han Sans CN, Source Han Sans CN;
  font-weight: 500;
  font-size: 1rem;
  color: #000000;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
</style>