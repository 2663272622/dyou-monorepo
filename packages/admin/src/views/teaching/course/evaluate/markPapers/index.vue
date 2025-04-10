<template>
  <div class="review-page">
    <!-- 顶部信息 -->
    <div class="page-header">
      <div class="student-info">
        <h2>{{ studentInfo.title }}</h2>
        <div class="info-items">
          <span>班级：{{ studentInfo.className }}</span>
          <span>学生：{{ studentInfo.name }}</span>
          <span>得分：{{ studentInfo.score }}/100</span>
          <span>提交时间：{{ studentInfo.submitTime }}</span>
        </div>
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="questions-list">
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="question-item"
      >
        <div class="question-no">{{ index + 1 }}</div>
        <div class="question-content">
          <!-- 题目标题 -->
          <div class="question-title">{{ question.title }}</div>

          <!-- 选择题选项 -->
          <template v-if="['single', 'multiple'].includes(question.type)">
            <div class="options-list">
              <div
                v-for="option in question.options"
                :key="option.key"
                class="option-item"
              >
                <el-radio
                  v-if="question.type === 'single'"
                  disabled
                  :model-value="question.studentAnswer"
                  :label="option.key"
                >
                  {{ option.key }}. {{ option.content }}
                </el-radio>
                <el-checkbox
                  v-else
                  disabled
                  :model-value="question.studentAnswer.includes(option.key)"
                >
                  {{ option.key }}. {{ option.content }}
                </el-checkbox>
              </div>
            </div>
          </template>

          <!-- 判断题答案 -->
          <template v-if="question.type === 'judge'">
            <div class="judge-options">
              <el-radio-group disabled :model-value="question.studentAnswer">
                <el-radio :label="true">正确</el-radio>
                <el-radio :label="false">错误</el-radio>
              </el-radio-group>
            </div>
          </template>

          <!-- 答案信息区域 -->
          <div class="answer-info">
            <!-- 客观题（选择、判断）答案展示 -->
            <template
              v-if="['single', 'multiple', 'judge'].includes(question.type)"
            >
              <div class="answer-row">
                <span class="label">学生答案：</span>
                <span
                  :class="{
                    correct: question.isCorrect,
                    wrong: !question.isCorrect,
                  }"
                >
                  {{ formatAnswer(question) }}
                </span>
              </div>
              <div class="answer-row">
                <span class="label">正确答案：</span>
                <span class="correct">{{ formatCorrectAnswer(question) }}</span>
              </div>
              <div class="answer-row">
                <span class="label">得分：</span>
                <span
                  class="score-text"
                  :class="{ 'score-full': question.isCorrect }"
                >
                  {{ question.score }}/{{ question.totalScore }}
                </span>
              </div>
            </template>

            <!-- 主观题（填空、简答）批改区域 -->
            <template v-else>
              <div class="answer-row">
                <span class="label">学生答案：</span>
                <div class="answer-text">{{ question.studentAnswer }}</div>
              </div>
              <div class="answer-row">
                <span class="label">参考答案：</span>
                <div class="answer-text">{{ question.referenceAnswer }}</div>
              </div>
              <div class="score-input">
                <span class="label">评分：</span>
                <el-input-number
                  v-model="question.score"
                  :min="0"
                  :max="question.totalScore"
                  size="small"
                  @change="calculateTotalScore"
                />
                <span class="total">/{{ question.totalScore }}</span>
              </div>
              <div class="comment">
                <span class="label">评语：</span>
                <el-input
                  v-model="question.comment"
                  type="textarea"
                  :rows="question.type === 'essay' ? 3 : 2"
                  placeholder="请输入评语"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-actions">
      <div class="total-score">
        总分：<span class="score">{{ totalScore }}</span
        >/{{ maxScore }}
      </div>
      <div class="buttons">
        <el-button @click="saveReview">保存</el-button>
        <el-button type="primary" @click="submitReview">提交批改</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

import { submitMarking, ViewUserAnswerPaper } from "@/api/teaching/readOver";

const router = useRouter();
const route = useRoute();
// 学生信息
const studentInfo = ref({
  name: "张三",
  className: "计算机科学与技术1班",
  submitTime: "2024-03-20 14:30:00",
  title: "2024年春季学期 - 数字电路期中考试",
  studentName: "张三",
  score: 0,
});
const questionList = ref([]);
// 题目数据
const questions = ref([
  {
    id: 1,
    type: "single", // 单选题
    title: "分解单氯甲烷片段后，在固体处理时需要考虑哪些问题？",
    options: [
      { key: "A", content: "原剂分解率" },
      { key: "B", content: "量分分解率" },
      { key: "C", content: "停滞分解率" },
      { key: "D", content: "上述三项" },
    ],
    studentAnswer: "A",
    correctAnswer: "D",
    isCorrect: false,
    score: 0,
    totalScore: 20,
  },
  {
    id: 2,
    type: "judge", // 判断题
    title: "分解单氯甲烷片段后的处理需要考虑温度因素。",
    studentAnswer: true,
    correctAnswer: true,
    isCorrect: true,
    score: 10,
    totalScore: 10,
  },
  {
    id: 3,
    type: "fill", // 填空题
    title: "分解单氯甲烷片段后，在固体处理时需要考虑_______问题。",
    studentAnswer: "分解率",
    referenceAnswer: "分解率和稳定性",
    score: 0,
    totalScore: 15,
    comment: "",
  },
  {
    id: 4,
    type: "essay", // 简答题
    title: "简述分解单氯甲烷片段后的处理注意事项。",
    studentAnswer: "需要考虑分解率问题，包括...",
    referenceAnswer: "主要需要考虑以下几个方面：1. 分解率...",
    score: 0,
    totalScore: 20,
    comment: "",
  },
]);

const data = reactive({
  queryParams: {
    assessmentId: route.query.assessmentId,
    userId: route.query.id,
  },
});

const { queryParams } = toRefs(data);

const getList = () => {
  ViewUserAnswerPaper(queryParams.value).then((res) => {
    // questionList.value
  });
};

// 格式化答案显示
const formatAnswer = (question) => {
  if (question.type === "judge") {
    return question.studentAnswer ? "正确" : "错误";
  } else if (question.type === "multiple") {
    return question.studentAnswer.join("、");
  }
  return question.studentAnswer;
};

const formatCorrectAnswer = (question) => {
  if (question.type === "judge") {
    return question.correctAnswer ? "正确" : "错误";
  } else if (question.type === "multiple") {
    return question.correctAnswer.join("、");
  }
  return question.correctAnswer;
};

// 计算总分
const totalScore = computed(() => {
  return questions.value.reduce((total, q) => total + (q.score || 0), 0);
});

// 计算满分
const maxScore = computed(() => {
  return questions.value.reduce((total, q) => total + q.totalScore, 0);
});

// 保存批改
const saveReview = () => {
  console.log("保存批改");
};

// 提交批改
const submitReview = () => {
  console.log("提交批改");
  submitMarking().then((res) => {});
};
</script>

<style scoped>
/* 样式保持不变 */
.review-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.student-info h2 {
  margin: 0 0 16px 0;
  color: #303133;
}

.info-items {
  display: flex;
  gap: 24px;
  color: #606266;
}

/*.questions-list{
  background: #fff;
}*/

.question-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  background: #fff;
}

.question-no {
  width: 24px;
  height: 24px;
  background: #409eff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.question-content {
  flex: 1;
}

.question-title {
  color: #303133;
  margin-bottom: 16px;
  line-height: 1.5;
}

.options-list {
  margin-bottom: 16px;
}

.option-item {
  margin-bottom: 12px;
}

.answer-info {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
}

.answer-row {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.label {
  /* width: 80px;*/
  color: #909399;
  flex-shrink: 0;
}

.score-text {
  font-weight: 600;
}

.correct {
  color: #67c23a;
}

.wrong {
  color: #f56c6c;
}

.score-full {
  color: #67c23a;
  font-weight: bold;
}

.answer-text {
  flex: 1;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #606266;
}

.score-input {
  display: flex;
  align-items: center;
  margin: 16px 0;
}

.score-input .total {
  margin-left: 10px;
  font-weight: 600;
}

.comment {
  display: flex;
  margin-top: 16px;
}

.comment .el-input {
  flex: 1;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  right: 0;
  background: #fff;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.total-score {
  font-size: 16px;
  color: #606266;
  margin-right: 10px;
}

.total-score .score {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  margin: 0 4px;
}

.buttons {
  display: flex;
  gap: 12px;
}
</style>
