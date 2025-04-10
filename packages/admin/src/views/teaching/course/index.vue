<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="课程名称" prop="courseName">
        <el-input
            v-model="queryParams.courseName"
            placeholder="请输入课程名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程开始时间" prop="startTime">
        <el-date-picker clearable
                        v-model="queryParams.startTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择课程开始时间" />
      </el-form-item>
      <el-form-item label="课程结束时间" prop="endTime">
        <el-date-picker clearable
                        v-model="queryParams.endTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择课程结束时间" />
      </el-form-item>
      <el-form-item label="关联书籍" prop="bookId">
        <el-select v-model="queryParams.bookId" filterable placeholder="请选择关联书籍" clearable style="width: 200px">
                      <el-option
                          v-for="item in bookList"
                          :key="item.bookId"
                          :label="item.bookName"
                          :value="item.bookId"
                      />
        </el-select>
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
            v-hasPermi="['manage:course:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['manage:course:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['manage:course:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['manage:course:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="课程编码" align="center" prop="courseId" />
      <el-table-column label="课程名称" align="center" prop="courseName" />
      <el-table-column label="书籍封面" align="center">
          <template #default="scope">
            <image-preview :src="scope.row.coverUrl"></image-preview>
          </template>
      </el-table-column>
      <el-table-column label="关联书籍" align="center" prop="bookName" />
      <el-table-column label="课程简介" align="center" prop="courseIntro" />
      <el-table-column label="课程开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程状态" align="center" width="180">
        <template #default="scope">
          <dict-tag :options="course_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="关联书籍" align="center" prop="bookId" />
      <el-table-column label="作业占比" align="center" prop="homeworkWeight" />
      <el-table-column label="考试占比" align="center" prop="examWeight" />
      <el-table-column label="阅读占比" align="center" prop="readingWeight" />
      <el-table-column label="备注信息" align="center" prop="remark" />
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="300">
        <template #default="scope">
          <el-button link type="primary" icon="Menu" @click="handleClass(scope.row)" v-hasPermi="['manage:course:list']">班级</el-button>
          <el-button link type="primary" @click="goEvaluate(scope.row,2)" v-hasPermi="['manage:course:list']"><i style="font-size: 14px;" class="el-icon iconfont icon-fabuzuoye"></i>发布作业</el-button>
          <el-button link type="primary" @click="goEvaluate(scope.row,1)" v-hasPermi="['manage:course:list']"><i style="font-size: 14px;" class="el-icon iconfont icon-fabukaoshi"></i>发布考试</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:course:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:course:remove']">删除</el-button>
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

    <!-- 添加或修改课程对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="courseRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程简介" prop="courseIntro">
          <el-input v-model="form.courseIntro" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker clearable
                              v-model="form.startTime"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择课程开始时间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker clearable
                              v-model="form.endTime"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择课程结束时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="关联书籍" prop="bookId">
          <el-select v-model="form.bookId" filterable placeholder="请选择关联书籍" clearable style="width: 200px">
            <el-option
                v-for="item in bookList"
                :key="item.bookId"
                :label="item.bookName"
                :value="item.bookId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作业占比" prop="homeworkWeight">
          <el-input-number v-model="form.homeworkWeight" placeholder="（0.00~100.00）" />
        </el-form-item>
        <el-form-item label="考试占比" prop="examWeight">
          <el-input-number v-model="form.examWeight" placeholder="（0.00~100.00）" />
        </el-form-item>
        <el-form-item label="阅读占比" prop="readingWeight">
          <el-input-number v-model="form.readingWeight" placeholder="（0.00~100.00）" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input  v-model="form.remark"  type="textarea" placeholder="请输入备注信息" />
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

<script setup name="Course">
import { listCourse, getCourse, delCourse, addCourse, updateCourse , listTextbook} from "@/api/teaching/course";
import {parseTime} from "ruoyi/src/utils/ruoyi";
import {useRouter} from "vue-router"
import DictTag from "@/components/DictTag/index.vue";
import ImagePreview from "@/components/ImagePreview/index.vue";

const { proxy } = getCurrentInstance();
const { course_status } = proxy.useDict('course_status');

const router = useRouter();
const courseList = ref([]);
const bookList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    courseName: null,
    courseIntro: null,
    startTime: null,
    endTime: null,
    bookId: null,
  },
  rules: {
    courseName: [
      { required: true, message: "课程名称不能为空", trigger: "blur" }
    ],
    startTime: [
      { required: true, message: "课程开始时间不能为空", trigger: "blur" }
    ],
    endTime: [
      { required: true, message: "课程结束时间不能为空", trigger: "blur" }
    ],
    bookId: [
      { required: true, message: "关联书籍不能为空", trigger: "blur" }
    ],
    homeworkWeight: [
      { required: true, message: "作业占比不能为空", trigger: "blur" }
    ],
    examWeight: [
      { required: true, message: "考试占比不能为空", trigger: "blur" }
    ],
    readingWeight: [
      { required: true, message: "阅读占比不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);


/** 查询课程列表 */
function getList() {
  loading.value = true;
  listCourse(queryParams.value).then(response => {
    courseList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getBookList(){
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
    courseId: null,
    courseName: null,
    courseIntro: null,
    startTime: null,
    endTime: null,
    bookId: null,
    homeworkWeight: null,
    examWeight: null,
    readingWeight: null,
    remark: null,
  };
  proxy.resetForm("courseRef");
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
  ids.value = selection.map(item => item.courseId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加课程";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _courseId = row.courseId || ids.value
  getCourse(_courseId).then(response => {
    form.value = response.data;
    form.value.startTime = response.data.startTime;
    form.value.endTime = response.data.endTime;
    open.value = true;
    title.value = "修改课程";
  });
}

function handleClass(row){
  // router.push("/teaching/study/class?courseId=" + row.courseId);
  router.push({path:'/teaching/study/class',query:{courseId:row.courseId}})
}

// 跳转至创建测评页面
function goEvaluate(row,assessType){
  router.push('/teaching/study/evaluate?assessType='+assessType + '&courseId='+ row.courseId +'&bookId='+ row.bookId)
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["courseRef"].validate(valid => {
    if (valid) {
      if(form.value.homeworkWeight+form.value.examWeight+form.value.readingWeight != 100){
        proxy.$modal.msgWarning("考试作业阅读占比相加为100%");
        return
      }
      if (form.value.courseId != null) {
        updateCourse(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCourse(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _courseIds = row.courseId || ids.value;
  proxy.$modal.confirm('是否确认删除课程编号为"' + _courseIds + '"的数据项？').then(function() {
    return delCourse(_courseIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/course/export', {
    ...queryParams.value
  }, `课程列表_${new Date().getTime()}.xlsx`)
}

getList();
getBookList();
</script>
