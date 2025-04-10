<template>
  <div class="app-container">
    <div class="question-container">
      <div class="question-bank">
        <div class="bank-header">
          <div class="bank-title">章节题库</div>
          <el-button icon="RefreshRight" type="primary" link class="operation" @click="handleRandom">随机生成
          </el-button>
        </div>
        <!--        <div class="placeholder"></div>-->
        <div class="bank-content">
          <div class="question-box" v-for="(item, index) in questions" :key="item.questionType">
            <div class="bank-type">
              <div class="type-title">
                <dict-tag :options="topic_type" :value="item.questionType"/>
                ,
                共计<span class="total">{{ item.questionList.length }}</span>道
              </div>
              <div>
                <el-button type="primary" link @click="viewDetails(item,index)">查看详情</el-button>
                <el-button type="primary" link @click="addSelectedQuestions(index)">添加试题</el-button>
              </div>
            </div>
            <div class="question-list">
              <el-table
                  :data="item.questionList"
                  :header-row-style="tableHeaderStyle"
                  @selection-change="(selection) => selectionBankChange(selection, index)"
                  max-height="250"
              >
                <el-table-column type="selection" width="30"/>
                <el-table-column
                    prop="questionText"
                    label="题目"
                    :show-overflow-tooltip="true"
                />
                <el-table-column prop="score" label="分值">
                  <template #default="{ row }">
                    <el-input-number
                        style="width: 110px"
                        :min="0"
                        v-model="row.score"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                  <template #default="scope">
                    <el-button
                        link
                        type="primary"
                        size="small"
                        @click.prevent="addQuestion(scope.row)"
                    >
                      添加试题
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <el-empty v-show="questions.length == 0" description="暂无数据"/>
        </div>
      </div>
      <div class="img">
        <img src="@/assets/teaching/bank/cut.png"/>
      </div>
      <div class="selected-questions">
        <div class="selected-header">
          <div class="bank-title">已选题目</div>
          <el-button icon="Delete" type="primary" link class="operation" @click="deleteSelectedQuestions">删除</el-button>
        </div>
        <!--        <div class="placeholder"></div>-->
        <div class="selected-content">
          <div class="selected-box" v-for="(item, index) in selectedQuestions" :key="item.questionType">
            <div class="bank-type">
              <div class="type-title">
                <dict-tag :options="topic_type" :value="item.questionType"/>
                ,共计<span class="total">{{ item.questionList.length }}</span
              >道
              </div>
              <el-button type="primary" link @click="viewDetails(item,index)"
              >查看详情
              </el-button
              >
            </div>
            <div class="selected-list">
              <el-table
                  :data="item.questionList"
                  :header-row-style="tableHeaderStyle"
                  @selection-change="(selection) => selectedTopicChange(selection, index)"
                  max-height="250"
              >
                <el-table-column type="selection" width="30"/>
                <el-table-column
                    fixed
                    prop="questionText"
                    label="题目"
                    width="300"
                    :show-overflow-tooltip="true"
                />
                <el-table-column prop="score" label="分值"/>
                <el-table-column fixed="right" label="操作">
                  <template #default="scope">
                    <el-button
                        link
                        type="primary"
                        size="small"
                        @click.prevent="removeQuestion(scope.row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <el-empty v-show="selectedQuestions.length == 0" description="暂无数据"/>
        </div>
        <div class="tips" ref="tips" v-show="selectedQuestions.length != 0">
          注:试题满分100分才可进行发布，如不够100分，可在左侧列表设置分值或继续添加题目
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <el-button plain class="plain" @click="handlePrev">上一步</el-button>
      <el-button plain class="plain" @click="preview">预览</el-button>
      <el-button class="publish" type="primary" @click="Next">发布</el-button>
    </div>
  </div>

  <!-- 查看详情 -->
  <viewDetailsPage v-if="open" v-model:modelValue="open" :data="detailList" :title="title"
                   @cancel="()=>{}"></viewDetailsPage>
  <randomGeneration v-if="randomOpen" v-model:modelValue="randomOpen" :data="randomTableData" @submit="" @cancel="()=>{}"></randomGeneration>
</template>

<script setup>
import {ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import {addEvaluate, selectCatalogId} from "@/api/teaching/build";
import useEvaluateStore from "@/store/modules/build";
import viewDetailsPage from './details.vue';
import randomGeneration from './random.vue';

const evaluateStore = useEvaluateStore();

const route = useRoute();
const router = useRouter();

const props = defineProps({
  data: Object,
});

const {proxy} = getCurrentInstance();
const {topic_type} = proxy.useDict("topic_type");

// 左侧题库列表
const questions = ref([]);
// 右侧选择的题
const selectedQuestions = ref([]);
// 查看详情
const open = ref(false);
// 随机生成
const randomOpen = ref(false);
// 查看详情标题
const title = ref('');
// 详情列表
const detailList = ref([]);
// 随机生成表格数据
const randomTableData = ref([])


const data = reactive({
  form: {},
});

const {form} = toRefs(data);


// 获取题库列表
const getQuestionBank = () => {
  selectCatalogId({catalogIdList: evaluateStore.form.catalogIdList}).then(res => {
    questions.value = res.data.map(item => ({
      ...item,
      selectedRows: [] // 为每个表格初始化选中行
    }));
    randomTableData.value = res.data.map(item => ({
      questionType: item.questionType,
      score: 0,
      num: 0,
      questionNum: item.questionList.length // 计算每种题型的题目数量
    }));
  });
};

// 单个添加试题
const addQuestion = (question) => {
  // 检查题目是否已存在
  const existingType = selectedQuestions.value.find(
      (q) => q.questionType === question.questionType
  );

  if (!existingType) {
    // 如果该类型不存在，创建新的对象
    selectedQuestions.value.push({
      questionType: question.questionType, // 题目类型
      questionList: [question], // 将题目放入 questionList
    });
    console.log("添加新题目:");
  } else {
    // 如果类型已存在，检查该类型下的题目是否已存在
    const existingQuestion = existingType.questionList.find(
        (it) => it.questionId === question.questionId
    );

    if (!existingQuestion) {
      // 如果该题目不存在，添加到现有的 questionList
      existingType.questionList.push(question);
      proxy.$modal.msgSuccess("更新已存在题目:");
    } else {
      proxy.$modal.msgWarning("题目已存在于该类型中，不再添加。");
    }
  }
  evaluateStore.form.bankQuestionList = selectedQuestions.value;
};


// 单个删除试题
const removeQuestion = (question) => {
  selectedQuestions.value.forEach((q) => {
    q.questionList = q.questionList.filter(
        (item) => item.questionId !== question.questionId
    );
  });
  // 过滤掉没有题目的类型
  selectedQuestions.value = selectedQuestions.value.filter(
      (q) => q.questionList.length > 0
  );
  evaluateStore.form.bankQuestionList = selectedQuestions.value;
};

// 添加选中试题
const addSelectedQuestions = (index) => {
  const currentQuestions = questions.value[index]; // 获取当前表格
  const rowsToAdd = currentQuestions.selectedRows; // 获取选中的行
  rowsToAdd.forEach(row => {
    const existingType = selectedQuestions.value.find(q => q.questionType === row.questionType);
    if (!existingType) {
      selectedQuestions.value.push({
        questionType: row.questionType,
        questionList: [row], // 将题目放入 questionList
      });
    } else {
      const existingQuestion = existingType.questionList.find(it => it.questionId === row.questionId);
      if (!existingQuestion) {
        existingType.questionList.push(row); // 添加题目
      } else {
        proxy.$modal.msgWarning("题目已存在于该类型中，不再添加。");
      }
    }
  });
};

// 左侧处理题库选择变化
const selectionBankChange = (selection, index) => {
  questions.value[index].selectedRows = selection; // 更新当前表格的选中行
};

// 删除已选题目
const deleteSelectedQuestions = () => {
  console.log(selectedQuestions.value)
  selectedQuestions.value.forEach(selected => {
    selected.questionList = selected.questionList.filter(item => !item.selected);
  });
  selectedQuestions.value = selectedQuestions.value.filter(q => q.questionList.length > 0);
  evaluateStore.form.bankQuestionList = selectedQuestions.value;
};

// 处理已选题目变化
const selectedTopicChange = (selection, index) => {
  selectedQuestions.value[index].selectedRows = selection; // 更新选中状态
};

// 随机生成题目
const handleRandom = () => {
  // 实现随机生成逻辑
  randomOpen.value = true
};

// 查看左侧题目详情
const viewDetails = (data, index) => {
  // 实现查看详情逻辑
  open.value = true
  title.value = '详情'
  detailList.value = [data];
};

// 上一步
const handlePrev = () => {
  evaluateStore.setActiveStep(0);
};

// 实现预览逻辑
const preview = () => {
  router.push("/teaching/study/preview");
};

// 发布
const Next = () => {
  const questionList = [];
  selectedQuestions.value.forEach((questions) => {
    questions.questionList.forEach((it) => {
      questionList.push(it);
    });
  });
  evaluateStore.saveEvaluation();
  evaluateStore.setActiveStep(2);
};

// 表头样式
const tableHeaderStyle = () => {
  return {background: "#F2F3F4", height: "60px"};
};

// 获取题库列表
getQuestionBank();

onMounted(() => {
  selectedQuestions.value = evaluateStore.form.bankQuestionList;
});
</script>

<style scoped lang="scss">
$color: #437afc;

.el-button {
  color: $color;
}

.question-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.question-bank,
.selected-questions {
  /*  flex: 1;*/
  width: 45%;
  height: 600px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  position: relative;
}

.bank-header,
.selected-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #dcdfe6;
  /*  padding: 0 10px;*/
  /*  position: absolute;
    top: 0;
    left: 0;
    right: 0;*/
}

.bank-title {
  font-weight: 500;
  font-size: 16px;
  color: #1d2129;
  line-height: 22px;
  font-style: normal;
  text-transform: none;
}

.operation {
  position: absolute;
  right: 20px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.placeholder {
  height: 50px;
}

.bank-content {
  overflow-y: auto;
  height: calc(100% - 50px);
}

.selected-content {
  overflow-y: auto;
  height: calc(100% - 90px);
}

.bank-type {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 15px;
  background: #f5f9ff;
  border-radius: 0px 0px 0px 0px;
}

.type-title {
  display: flex;
  font-weight: 500;
  font-size: 16px;
  color: #1d2129;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.total {
  color: $color;
}

.tips {
  width: 100%;
  font-weight: 400;
  font-size: 12px;
  color: #f95454;
  padding-left: 20px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  z-index: 99;
  height: 40px;
  line-height: 40px;
  border-top: 1px solid #dcdfe6;
}

.question-list,
.selected-list {
  /*  height: 500px;*/
  overflow-y: auto;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 10px;

  .el-button {
    width: 96px;
    height: 40px;
    border-radius: 4px 4px 4px 4px;
  }

  .plain {
    border: 1px solid #437afc;
  }

  .publish {
    background: $color;
    color: #fff;
  }
}
</style>
