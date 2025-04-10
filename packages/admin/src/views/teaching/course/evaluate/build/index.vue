<template>
  <div class="exam-page">
    <div class="steps-wrapper">
      <el-steps
        :active="evaluateStore.activeStep"
        class="steps"
        finish-status="success"
      >
        <el-step title="填写信息" description="填写基本信息" />
        <el-step title="选择试题" description="从题库中选取试题" />
        <el-step title="发布考试" description="发布后即可进行考察" />
      </el-steps>
    </div>

    <component :is="currentComponent" :typeTitle="typeTitle" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import ExamForm from "./ExamForm.vue";
import QuestionSelection from "./QuestionSelection.vue";
import PublishCompletion from "./PublishCompletion.vue";
import useEvaluateStore from "@/store/modules/build";
const evaluateStore = useEvaluateStore();

const route = useRoute();

const assessmentId = route.query.assessmentId;
evaluateStore.setAssessmentId(assessmentId);
evaluateStore.form.courseId = route.query.courseId;
evaluateStore.form.bookId = route.query.bookId;
evaluateStore.form.assessType = route.query.assessType;

if (assessmentId) {
  evaluateStore.getEvaluateInfo().catch((error) => {
    console.error(error);
  });
}

const typeTitle = computed(() => {
  return evaluateStore.form.assessType == 1
    ? "考试"
    : evaluateStore.form.assessType == 2
      ? "作业"
      : "测评";
});

// 组件
const currentComponent = computed(() => {
  switch (evaluateStore.activeStep) {
    case 0:
      return ExamForm;
    case 1:
      return QuestionSelection;
    case 2:
      return PublishCompletion;
    default:
      return ExamForm;
  }
});
</script>

<style lang="scss" scoped>
.exam-page {
  width: 100%;
  height: 100%;
  padding: 25px;
}
.steps-wrapper {
  width: 80%;
  margin: auto;
}
/*修改步骤条样式*/
$stepColor: #437afc;
$stepBgColor: #e8f3ff;
$stepHeight: 40px;

.steps {
  height: $stepHeight;
  color: $stepColor;
}

/*$stepColor:'#1890ff';*/

.steps {
  width: 100%;
  height: 50px;
  ::v-deep .el-step {
    height: 100%;
    // 设置图标和步骤条的行高
    .el-step__head {
      line-height: 35px;
    }
    // 已完成步骤条的边框色和字体颜色
    .el-step__head.is-success {
      color: $stepColor;
      border-color: #d9e4fe;
    }
    // 步骤条
    .el-step__line {
      background-color: #d9e4fe;
      top: 50%;
      height: 1px;
    }

    .el-step__title.is-process {
      //未完成步骤的title
      color: #000;
    }
    .el-step__title.is-success {
      // 已完成步骤的title
      color: #000;
    }

    // 已完成图标背景色
    .el-step__icon {
      width: 28px;
      height: 28px;
      font-size: 16px;
      border: 1px solid #6195f7;
      z-index: 99;
      // 已完成图标字体颜色
      .el-step__icon-inner {
        font-weight: unset !important;
        color: #6195f7;
      }
    }

    // 未完成图标背景色
    .is-process .el-step__icon.is-text {
      z-index: 99;
      background: #6195f7;
      // 未完成图标字体颜色
      .el-step__icon-inner {
        color: #fff;
      }
    }
    // title样式
    .el-step__title {
      z-index: 66;
      position: absolute;
      top: 0;
      left: calc(5%);
      width: 92px;
      font-size: 14px;
      background-color: #fff;
      z-index: 66;
      color: #000;
    }
    .el-step__title.is-process {
      // 防止最后一个title会加粗
      font-weight: normal !important;
    }
    // 描述样式
    .el-step__description {
      z-index: 66;
      position: absolute;
      top: 40px;
      width: 100%;
      height: 20px;
      font-weight: 400;
      font-size: 12px;
      color: #86909c;
      line-height: 20px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }

  // 第一个步骤
  ::v-deep .el-step:first-child {
    flex-basis: 47% !important;
    .el-step__head.is-process {
      width: 79%;
      padding-left: 10px !important;
    }
    .el-step__head.is-success {
      width: 79%;
      padding-left: 10px !important;
    }
    .el-step__line {
      width: 100%;
      margin-left: 25% !important;
    }
    .el-step__description {
      left: calc(4% + 34px);
    }
    .el-step__title {
      padding-left: 26px !important;
    }
    .el-step__description {
      margin-left: -16px !important;
    }
  }

  // 第二个步骤
  ::v-deep .el-step:nth-child(2) {
    flex-basis: 30% !important;
    .el-step__line {
      width: 104%;
      margin-left: 28% !important;
    }
    .el-step__title {
      width: 90px;
      padding-left: 20px !important;
    }
    .el-step__description {
      margin-left: 28px !important;
    }
  }

  // 第三个步骤
  ::v-deep .el-step:last-child {
    padding-left: 10% !important;
    max-width: 10% !important;
    flex-basis: 50% !important;
    .el-step__title {
      padding-left: 24px !important;
      margin-left: 100% !important;
      z-index: 66;
    }
    .el-step__description {
      width: 110px;
      margin-left: 24px !important;
    }
  }
}
</style>
