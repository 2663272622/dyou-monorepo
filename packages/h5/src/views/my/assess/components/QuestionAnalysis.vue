<template>
  <div class="question-analysis">
    <!-- 答题结果统计 -->
    <div class="analysis-header">
      <div class="result-stats">
        <div class="stat-item">
          <div class="stat-label">正确答案</div>
          <div class="stat-value correct">{{ formatAnswer(correctAnswer) }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">你的答案</div>
          <div class="stat-value" :class="isCorrect ? 'correct' : 'wrong'">
            {{ formatAnswer(userAnswer) }}
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-label">正确率</div>
          <div class="stat-value">{{ accuracy }}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">易错项</div>
          <div class="stat-value error">{{ errorProne }}</div>
        </div>
      </div>
    </div>

    <!-- 解析内容 -->
    <div class="analysis-content">
      <div class="section-title">
        <div class="title-icon">
          <i class="icon-analysis"></i>
        </div>
        <span>解析与考点</span>
      </div>

      <!-- 答案解析 -->
      <div class="analysis-text">
        <h4>答案解析</h4>
        <div class="text-content">{{ analysis }}</div>
      </div>

      <!-- 知识点 -->
      <div class="knowledge-points" v-if="knowledgePoints?.length">
        <h4>考查知识点</h4>
        <div class="points-list">
          <span
              v-for="(point, index) in knowledgePoints"
              :key="index"
              class="point-tag"
          >
            {{ point }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  correctAnswer: {
    type: [String, Array, Boolean],
    required: true
  },
  userAnswer: {
    type: [String, Array, Boolean],
    default: ''
  },
  analysis: {
    type: String,
    required: true
  },
  accuracy: {
    type: [Number, String],
    default: 0
  },
  errorProne: {
    type: String,
    default: 'C'
  },
  knowledgePoints: {
    type: Array,
    default: () => []
  }
})

// 判断答案是否正确
const isCorrect = computed(() => {
  if (Array.isArray(props.correctAnswer)) {
    return JSON.stringify(props.correctAnswer.sort()) === JSON.stringify(props.userAnswer.sort())
  }
  return props.correctAnswer === props.userAnswer
})

// 格式化答案显示
const formatAnswer = (answer) => {
  if (Array.isArray(answer)) {
    return answer.join('、')
  }
  if (typeof answer === 'boolean') {
    return answer ? '正确' : '错误'
  }
  return answer || '未作答'
}
</script>

<style scoped>
.question-analysis {
  margin-top: 20px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.analysis-header {
  padding: 16px;
  background: #f8f9fa;
}

.result-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 14px;
  font-weight: 500;
}

.stat-value.correct {
  color: #4CAF50;
}

.stat-value.wrong {
  color: #FF5252;
}

.stat-value.error {
  color: #FF9800;
}

.analysis-content {
  padding: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.title-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-analysis {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: #2196F3;
  border-radius: 50%;
}

.analysis-text h4,
.knowledge-points h4 {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.text-content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  white-space: pre-wrap;
}

.points-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.point-tag {
  padding: 4px 12px;
  background: #e3f2fd;
  color: #2196F3;
  border-radius: 16px;
  font-size: 12px;
}

@media (max-width: 768px) {
  .result-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>