<template>
  <div class="single-choice">
    <div
        v-for="option in props.question.options"
        :key="option.label"
        class="option-item"
        :class="{
        'selected': modelValue === option.label,
        'correct': showResult && option.label === props.question.correctAnswer,
        'wrong': showResult && modelValue === option.label && option.label !== props.question.correctAnswer
      }"
        @click="selectOption(option.label)"
    >
      <div class="option-label">{{ option.label }}</div>
      <div class="option-text">{{ option.text }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  showResult: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'answer-submit'])

const selectOption = (label) => {
  emit('update:modelValue', label)
  emit('answer-submit', label)
}
</script>

<style scoped>
.single-choice {
  margin-top: 16px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  margin-bottom: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
}

.option-item.selected {
  border-color: #4CAF50;
  background: #f0f9f0;
}

.option-label {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.option-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}

.correct {
  border-color: #4CAF50;
  background: #f0f9f0;
}

.wrong {
  border-color: #FF5252;
  background: #fff0f0;
}
</style>