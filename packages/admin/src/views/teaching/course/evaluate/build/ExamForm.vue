<template>
  <div class="exam-create">
    <!-- 表单区域 -->
    <div class="form-content">
      <el-form
        ref="examFormRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="发布班级：" prop="courseClassIdList">
          <el-select
            v-model="form.courseClassIdList"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            placeholder="请选择班级"
            style="width: 300px"
          >
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="title + '名称：'" prop="assessmentName">
          <el-row>
            <el-col :span="24">
              <el-input
                v-model="form.assessmentName"
                placeholder="请输入名称"
                style="width: 300px"
              >
                <template #append>
                  <el-button
                    icon="RefreshRight"
                    type="primary"
                    plain
                    @click="generateName"
                    >生成</el-button
                  >
                </template>
              </el-input>
            </el-col>
            <el-col :span="24">
              <div class="tip-text">
                注：满分100分，作业名称将自动生成，生成规则：日期+课程/章节+{{
                  title
                }}
              </div>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="发布时间：" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择时间"
            :prefix-icon="Calendar"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item label="截止时间：" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="date"
            placeholder="请选择时间"
            value-format="YYYY-MM-DD"
            :prefix-icon="Calendar"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item label="测试时长：" prop="examinationTime">
          <el-input-number v-model="form.examinationTime"></el-input-number>
        </el-form-item>

        <el-form-item label="选章：" prop="catalogIdList">
          <div class="selection-box">
            <div class="selection-header">
              <div class="header-left">
                <el-checkbox v-model="selectAll" @change="handleCheckedAll"
                  >全选</el-checkbox
                >
              </div>
              <div class="header-right">
                <el-button link @click="clearSelection">
                  <el-icon class="del">
                    <Delete />
                  </el-icon>
                  <span class="empty">清空</span>
                </el-button>
              </div>
            </div>

            <div class="selection-content">
              <el-cascader-panel
                ref="chapterTreeRef"
                :props="defaultProps"
                :options="chapterList"
                v-model="form.catalogIdList"
                @change="chooseDir"
              >
                <template #default="{ node, data }">
                  <div class="content">
                    <span>{{ data.catalogName }}</span>
                    <span v-if="!node.isLeaf">
                      ({{ data.children.length }})
                    </span>
                  </div>
                </template>
              </el-cascader-panel>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-actions">
      <el-button type="primary" @click="Next">下一步</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { Calendar } from "@element-plus/icons-vue";
import { listClass } from "@/api/teaching/class";
import { listCatalog, selectCatalogId } from "@/api/teaching/build";
import { getBeijingTime } from "@/utils/ruoyi";

import useEvaluateStore from "@/store/modules/build";
const evaluateStore = useEvaluateStore();
const route = useRoute();

const { proxy } = getCurrentInstance();


// 班级列表
const classList = ref([]);
// 目录列表
const chapterList = ref([]);
// 全选的变量
const selectAll = ref(false);
// 级联面板的ref
const chapterTreeRef = ref(null);
// 所有目录章节的id
const allIds = ref([]);
// 类型标题
const title = evaluateStore.TypeTitle;

// 级联选择器的字段
const defaultProps = {
  value: "catalogId",
  label: "catalogName",
  multiple: true,
};

const data = reactive({
  form: {},
  queryParams: {
    courseId: evaluateStore.form.courseId,
    bookId: evaluateStore.form.bookId,
    assessType: evaluateStore.form.assessType,
  },
  rules: {
    courseClassIdList: [
      { required: true, message: "班级不能为空", trigger: "blur" },
    ],
    assessmentName: [
      { required: true, message: "名称不能为空", trigger: "blur" },
    ],
    startTime: [
      { required: true, message: "发布时间不能为空", trigger: "blur" },
    ],
    endTime: [{ required: true, message: "截止时间不能为空", trigger: "blur" }],
    examinationTime: [
      { required: true, message: "测试时长不能为空", trigger: "blur" },
    ],
    catalogIdList: [
      { required: true, message: "章节不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);


/* 获取班级列表 */
const getClassList = async () => {
  try {
    const response = await listClass(queryParams.value);
    classList.value = response.rows;
  } catch (error) {
    console.error("Failed to fetch class list:", error);
    throw error;
  }
}

/* 获取书籍章节列表 */
const getCatalogList = async () => {
  try {
    const response = await listCatalog(queryParams.value);
    chapterList.value = response.data;
  } catch (error) {
    console.error("Failed to fetch catalog list:", error);
    throw error;
  }
}

/*自动生成名称*/
const generateName = () => {
  const date = getBeijingTime("YYYY/MM/DD");
  form.value.assessmentName =
    date + " " + evaluateStore.form.assessmentName + title;
}

// 全选处理
const handleCheckedAll = () => {
  // 确保 catalogIdList 已初始化为一个数组
  form.value.catalogIdList = []; // 清空当前选中项

  if (selectAll.value) {
    // 当全选被选中时，递归收集所有章节和子章节的 ID
    form.value.catalogIdList = collectAllIds(chapterList.value);
  } else {
    // 当全选被取消时，清空选中
    form.value.catalogIdList = [];
  }
};

// 递归收集所有章节和子章节的 ID
const collectAllIds = (list, idList = []) => {
  list.forEach((item) => {
    idList.push(item.catalogId); // 添加当前章节 ID
    if (item.children) {
      collectAllIds(item.children, idList); // 递归调用处理子章节
    }
  });
  return idList; // 返回收集到的所有 ID
};

// 清空选择
const clearSelection = () => {
  form.value.catalogIdList = []; // 清空选择
  selectAll.value = false;
}

// 处理下一步
const Next = () => {
  proxy.$refs["examFormRef"].validate((valid) => {
    if (valid) {
      const ids = [...new Set(form.value.catalogIdList.flat(Infinity))];
      evaluateStore.form.catalogIdList = ids;
      evaluateStore.setActiveStep(1);
    }
  });
}

function chooseDir(value) {
  const ids = [...new Set(value.flat(Infinity))];
  evaluateStore.form.catalogIdList = ids;
}

// 监听选中项变化，以更新全选复选框状态
watch( () => evaluateStore.form.catalogIdList, (newVal,oldVal) => {
  // 更新全选状态
  selectAll.value = allIds.value.length === newVal.length;
},{ deep: true ,immediate:true});


onMounted(async () => {
  await getClassList();
  await getCatalogList();

  form.value = evaluateStore.form;
  allIds.value = collectAllIds(chapterList.value);
  // 更新全选状态
  selectAll.value = allIds.value.length === evaluateStore.form.catalogIdList.length;
});
</script>

<style lang="scss" scoped>
$color: #437afc;

.exam-create {
  width: 1000px;
  padding: 25px 0;
  margin: auto;
}

.steps-wrapper {
  margin-bottom: 30px;
}

.form-content {
  max-width: 1000px;
  margin: 0 auto;
}

.full-width {
  width: 100%;
}

.tip-text {
  color: #f95454;
  font-size: 12px;
  margin-top: 4px;
}

.selection-box {
  border-radius: 4px;
  width: 100%;
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 16px;
  border: 1px solid #dcdfe6;
  border-bottom: none;
  background: #f6f7f9;
}

.header-right {
  display: flex;
  align-items: center;
}

.del {
  font-size: 16px;
}

.empty {
  font-weight: 400;
  /*  //font-size: 13px;*/
  color: #86909c;
  line-height: 14px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.selection-content {
  /*  min-height: 300px;*/
  overflow-y: auto;
}

.content {
  display: flex;
  justify-content: space-between;
}

.bottom-actions {
  margin-top: 24px;
  text-align: left;

  .el-button {
    width: 96px;
    height: 40px;
    border-radius: 4px 4px 4px 4px;
    background: $color;
  }
}

:deep(.el-checkbox__label) {
  color: #606266;
}

:deep(.el-form-item__label) {
  color: #606266;
}

.count {
  width: 44px;
  height: 12px;
  font-weight: 400;
  font-size: 12px;
  color: #999999;
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
</style>
