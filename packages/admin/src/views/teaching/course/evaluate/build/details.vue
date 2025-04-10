<template>
  <el-dialog :title="props.title" v-model="modelValue" width="80%"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :show-close="true"
             append-to-body>
    <div class="exam-preview">
      <div
          class="exam-content"
          v-for="(item, index) in questions"
          :key="item.questionType"
      >
        <div class="question-section">
          <div class="section-header">
          <span class="section-title"
          ><dict-tag :options="topic_type" :value="item.questionType"
          /></span>
            <span class="section-score"
            >共{{ item.questionList.length }}题，共20分</span
            >
          </div>

          <div class="question-list">
            <div
                v-for="(question, i) in item.questionList"
                :key="question.questionId"
                class="question-item"
            >
              <div class="question-header">
                <div class="question-number">{{ getGlobalQuestionNumber(index, i) }}</div>
                <div class="question-text">
                  {{
                    question.questionText
                  }}<span class="score">({{ question.score }}分)</span>
                </div>
              </div>

              <!-- Answer Options -->
              <div class="answer-options" v-if="question.questionType === '1'">
                <el-radio-group v-model="radio">
                  <div
                      class="option"
                      v-for="option in question.bankQuestionOptionList"
                      :key="option.choiceId"
                  >
                    <el-radio
                        :label="option.optionText"
                        :value="option.choiceId"
                    />
                  </div>
                </el-radio-group>
              </div>

              <div class="answer-options" v-if="question.questionType === '2'">
                <el-checkbox-group v-model="checkbox">
                  <div
                      class="option"
                      v-for="option in question.bankQuestionOptionList"
                      :key="option.choiceId"
                  >
                    <el-checkbox
                        :key="option.choiceId"
                        :label="option.optionText"
                        :value="option.choiceId"
                    />
                  </div>
                </el-checkbox-group>
              </div>

              <div class="answer-options" v-if="question.questionType === '3'">
                <div class="option">
                  <el-input
                      type="text"
                      class="blank-input"
                      v-model="blankAnswers[i]"
                      placeholder="填空答案"
                  />
                </div>
              </div>

              <div class="answer-options" v-if="question.questionType === '4'">
                <el-input
                    type="textarea"
                    rows="5"
                    class="short-answer"
                    v-model="shortAnswers[i]"
                    placeholder="简答题答案"
                ></el-input>
              </div>

              <div class="answer-options" v-if="question.questionType === '5'">
                <el-radio-group v-model="radio">
                  <div class="option">
                    <el-radio label="正确" :value="true"/>
                  </div>
                  <div class="option">
                    <el-radio label="错误" :value="false"/>
                  </div>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="cancel">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {useVModel} from '@vueuse/core'
import useEvaluateStore from "@/store/modules/build";

const evaluateStore = useEvaluateStore();
const {proxy} = getCurrentInstance();
const {topic_type} = proxy.useDict("topic_type");


// 子组件代码如下 可同时修改父子组件的v-model值
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: [String],
    default: "详情"
  },
  data:{
    type:Array,
  }
});
const emit = defineEmits(["update:modelValue", 'cancel']);
const modelValue = useVModel(props, "modelValue", emit);

const radio = ref("");
const checkbox = ref([]);
const blankAnswers = ref([]);
const shortAnswers = ref([]);
const questions = ref(props.data);


const getGlobalQuestionNumber = (sectionIndex, questionIndex) => {
  let count = 0;
  for (let i = 0; i < sectionIndex; i++) {
    count += questions.value[i].questionList.length; // 累加前面所有题目的数量
  }
  return count + questionIndex + 1; // 当前部分的题目序号
};

// 点击取消
const cancel = () => {
  modelValue.value = false
}
</script>

<style scoped>
.exam-preview {
  padding: 20px;
}

.exam-content {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}

.question-section {
  margin-bottom: 30px;
}

.question-header {
  display: flex;
  align-items: center;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin-right: 10px;
  font-weight: 500;
  font-size: 18px;
  color: #1d2129;
}

.section-score {
  font-weight: 400;
  font-size: 14px;
  color: #4e5969;
}

.question-item {
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 4px;
}

.question-number {
  width: 16px;
  height: 16px;
  background: #bfd9f9;
  border-radius: 1px;
  text-align: center;
  font-weight: 400;
  color: #437afc;
  margin-right: 10px;
}

.question-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.score {
  margin-left: 10px;
  color: grey;
}

.answer-options {
  width: 100%;
  margin-top: 16px;
  background-color: #f7f9fa;
}

.option {
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 30px;
  min-height: 50px;
}

.option:hover {
  background: #eef0f2;
}

.blank-input {
  display: inline-block;
  width: 200px;
  margin: 0 8px;
}

.short-answer {
  width: 100%;
  height: 80px;
  margin-top: 8px;
}

.el-radio-group {
  width: 100%;
}
</style>