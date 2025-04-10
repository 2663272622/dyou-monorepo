<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item :label="typeTitle+'名称'" prop="assessmentName">
        <el-input
            v-model="queryParams.assessmentName"
            placeholder="请输入测评名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="typeTitle+'开始时间'" prop="startTime">
        <el-date-picker clearable
                        v-model="queryParams.startTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择测评开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="typeTitle+'结束时间'" prop="endTime">
        <el-date-picker clearable
                        v-model="queryParams.endTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择测评结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['manage:assessment:add']"
        >组建{{typeTitle}}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['manage:assessment:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['manage:assessment:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['manage:assessment:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="evaluateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column :label="typeTitle + '编码'" align="center" prop="assessmentId"/>
      <el-table-column :label="typeTitle+'名称'" align="center" prop="assessmentName"/>
      <el-table-column :label="typeTitle+'开始时间'" align="center">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="typeTitle+'结束时间'" align="center">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="typeTitle+'时长'" align="center" prop="examinationTime"/>
      <el-table-column label="完成情况">
        <template #default="scope">
          <div class="performance">{{ scope.row.performance }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="300">
        <template #default="scope">
          <el-button link type="primary" icon="Menu" @click="handleDetails(scope.row)" v-hasPermi="['manage:assessment:list']">{{typeTitle}}情况</el-button>
          <el-button link type="primary" icon="View" @click="handlePreview(scope.row)" v-hasPermi="['manage:assessment:list']">{{typeTitle}}预览</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:assessment:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:assessment:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改测评对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="evaluateRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item :label="typeTitle+'名称'" prop="assessmentName">
          <el-input v-model="form.assessmentName" placeholder="请输入测评名称"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="typeTitle+'发布时间'" prop="startTime">
              <el-date-picker
                  v-model="form.startTime"
                  type="datetime"
                  placeholder="开始时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="typeTitle+'截止时间'" prop="endTime">
              <el-date-picker
                  v-model="form.endTime"
                  type="datetime"
                  placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="考试时长" prop="endTime" v-if="route.params.type == 1">
          <el-select v-model="form.examtime" clearable placeholder="请选择" style="width: 100%"  >
            <el-option
                v-for="item in exam_time"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Evaluate">
import {
  listEvaluate,
  delEvaluate,
  listTextbook
} from "@/api/teaching/evaluate";
import {parseTime} from "ruoyi/src/utils/ruoyi";
import {useRouter,useRoute} from "vue-router";

const {proxy} = getCurrentInstance();
const {exam_time} = proxy.useDict('exam_time');

const router = useRouter();
const route = useRoute();
const evaluateList = ref([]);
const bookList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const typeTitle = route.query.type == 1 ? '考试' : route.query.type == 2 ? '作业' :'测评' ;


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    assessmentName: null,
    startTime: null,
    endTime: null,
    bookId: route.query.bookId,
    assessType:route.query.assessType,
    courseId:route.query.courseId,
  },
  rules: {
    assessmentName: [
      {required: true, message: typeTitle+"名称不能为空", trigger: "blur"}
    ],
    startTime: [
      {required: true, message: typeTitle+"发布时间不能为空", trigger: "blur"}
    ],
    endTime: [
      {required: true, message: typeTitle+"截止时间不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询测评列表 */
function getList() {
  loading.value = true;
  listEvaluate(queryParams.value).then(response => {
    evaluateList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getBookList() {
  listTextbook().then(response => {
    bookList.value = response.data;
  })
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    assessmentId: null,
    assessmentName: null,
    examtime:null,
    startTime: null,
    endTime: null,
    bookId: null,
    remark: null,
  };
  proxy.resetForm("evaluateRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.assessmentId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  router.push("/teaching/study/build?courseId=" + queryParams.value.courseId + '&bookId='+ queryParams.value.bookId + '&assessType='+ queryParams.value.assessType+ '&assessmentId='+ row.assessmentId)
}

/*组件测评*/
function handleAdd(){
  router.push("/teaching/study/build?courseId=" + queryParams.value.courseId + '&bookId='+ queryParams.value.bookId + '&assessType='+ queryParams.value.assessType)
}

/*测评情况*/
function handleDetails(row) {
  //跳转
  // router.push("/teaching/study/evaluateAllDetails?courseId=" + row.courseId + '&assessType='+ row.assessType+ '&assessmentId='+ row.assessmentId);
  router.push("/teaching/study/evaluateAllDetails?courseId=" +4 + '&assessType='+ 1 + '&assessmentId='+ 1);
}
function handlePreview(row) {
  //跳转
  // router.push("/teaching/course-class/index/" + row.courseId);
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["evaluateRef"].validate(valid => {
    if (valid) {
        updateEvaluate(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _assessmentIds = row.assessmentId || ids.value;
  proxy.$modal.confirm('是否确认删除'+typeTitle+'编号为"' + row.assessmentName + '"的数据项？').then(function () {
    return delEvaluate(_assessmentIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/assessment/export', {
    ...queryParams.value
  }, `测评列表_${new Date().getTime()}.xlsx`)
}

getList();
getBookList();
</script>
<style scoped>
.performance {
  width: 70px;
  height: 30px;
  background: #2c3e50;
  border-radius: 10px;
  color: white;
  font-size: 15px;
  text-align: center;
  line-height: 30px;
}
</style>
