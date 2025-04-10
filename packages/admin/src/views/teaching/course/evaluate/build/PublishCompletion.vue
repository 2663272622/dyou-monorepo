<template>
  <div class="step-three">
    <div class="success-info">
      <el-empty
        :image="img"
        :image-size="300"
        :description="'考试发布成功,您可以在考试管理中查看和管理该' + typeTitle"
      >
        <el-button color="#437AFC" type="primary" @click="goToExamList"
          >{{ typeTitle }}列表</el-button
        >
        <el-button @click="createNew">继续创建</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

import img from "@/assets/images/success.png";
import useEvaluateStore from "@/store/modules/build";
const evaluateStore = useEvaluateStore();

const route = useRoute();
const router = useRouter();

const props = defineProps({
  typeTitle: String,
});
const emit = defineEmits(["prev"]);

const data = reactive({
  queryParams: {
    courseId: route.query.courseId,
    bookId: route.query.bookId,
    assessType: route.query.assessType,
  },
});
const { queryParams } = toRefs(data);

const goToExamList = () => {
  router.push(
    "/teaching/study/evaluate?assessType=" +
      queryParams.value.assessType +
      "&courseId=" +
      queryParams.value.courseId +
      "&bookId=" +
      queryParams.value.bookId
  );
};
const createNew = () => {
  evaluateStore.setActiveStep(0);
};
</script>

<style scoped>
.step-three {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}
</style>
