<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="课程名称" prop="courseName">
        <el-input
            v-model="queryParams.courseName"
            placeholder="请输入课程名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程时间段" prop="dateRange" label-width="100px">
        <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
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
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
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
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号"/>
      <el-table-column label="封面" prop="coverUrl" :show-overflow-tooltip="true"/>
      <el-table-column label="书籍名称" prop="bookName" :show-overflow-tooltip="true"/>
      <el-table-column label="课程名称" prop="courseName" :show-overflow-tooltip="true"/>
      <el-table-column label="课程简介" prop="courseIntroduction" :show-overflow-tooltip="true"/>
      <el-table-column label="课程时间段" prop="courseTime" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true"/>
      <el-table-column label="修改时间" prop="updateTime" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-dropdown @command="(command)=>{handleCommand(command, scope.row, scope.$index)}" trigger="click">
            <span class="el-dropdown-link">
              更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="homework"><i style="font-size: 14px;" class="el-icon iconfont icon-fabuzuoye"></i>发布作业</el-dropdown-item>
                <el-dropdown-item command="exam" divided><i style="font-size: 14px;" class="el-icon iconfont icon-fabukaoshi"></i>发布考试</el-dropdown-item>
                <el-dropdown-item command="update" divided><el-icon><Edit /></el-icon>修改</el-dropdown-item>
                <el-dropdown-item command="class" divided><el-icon><Menu /></el-icon>班级</el-dropdown-item>
                <el-dropdown-item command="remove" divided><el-icon><Delete /></el-icon>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改资源对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="courseRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称"/>
        </el-form-item>
        <el-form-item label="课程时间段" prop="dateRange">
          <el-date-picker
              v-model="dateRange"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="关联教材" prop="bookName">
          <el-select v-model="queryParams.bookName" placeholder="关联教材" clearable>
            <!--            <el-option-->
            <!--                v-for="dict in sys_normal_disable"-->
            <!--                :key="dict.value"-->
            <!--                :label="dict.label"-->
            <!--                :value="dict.value"-->
            <!--            />-->
          </el-select>
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input v-model="form.courseIntroduction" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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

<script setup name="ImageManager">
import {addCourse, listCourse, listCourseDetail, updateCourse, delCourse} from "@/api/teaching/course";
import {useRouter} from "vue-router";

const router = useRouter();
const {proxy} = getCurrentInstance();
// const {start_stop} = proxy.useDict("start_stop");
const courseList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const dateRange = ref([]);
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
    courseName: undefined,
    dateRange: undefined,
  },
  rules: {
    courseName: [{required: true, message: "课程名称不能为空", trigger: "blur"}],
    dateRange: [{required: true, message: "请选择课程时间段", trigger: "blur"}],
    bookName: [{required: true, message: "请选择教材", trigger: "blur"}],
  },
});

const {queryParams, form, rules} = toRefs(data);

/** 查询学校列表列表 */
function getList() {
  loading.value = true;
  courseList.value = [
    {
      courseName: 'ceshi',
      coverUrl: '',
      bookName: '电机驱动与调速',
      courseId:1,
    }
  ]
  // listCourse(queryParams.value).then(res => {
  //   courseList.value = res.rows;
  //   total.value = res.total;
  loading.value = false;
  // })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 重置新增的表单以及其他数据  */
function reset() {
  form.value = {
    id: undefined,
    courseName: undefined,
    remark: undefined,
    courseIntroduction: undefined,
  };
  proxy.resetForm("courseRef");
}

/** 添加资源 */
function handleAdd() {
  reset();
  //请求接口
  open.value = true;
  title.value = "添加课程";
}

/** 修改资源 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  listCourseDetail(id).then(res => {
    form.value = res.data
    form.id = res.data.id
    open.value = true;
    title.value = "修改课程信息";
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const roleIds = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除课程为"' + row.courseName + '"的数据项?').then(function () {
    return delCourse(roleIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("manage/course/export", {
    ...queryParams.value,

  }, `resource_${new Date().getTime()}.xlsx`);
}


function handleClass(row){
  //跳转
  router.push("/teaching/course-class/index/" + row.courseId);
}

function handleCommand(command,row,index) {
  console.log(command)
  switch (command) {
    case "homework":
      goEvaluate(1)
      break;
    case "exam":
      goEvaluate(2)
      break;
      case "update":
        handleUpdate(row)
      break;
    case "class":
      handleClass(row)
      break;
      case "remove":
        handleDelete(row)
      break;
    default:
      break;
  }
}

// 跳转至创建测评页面
function goEvaluate(type){
  router.push('/teaching/course/evaluate?type='+type)
  // router.push('/teaching/course/evaluate/='+type)
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["courseRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {

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

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

getList();
</script>
<style>
.evaluate{
  line-height: normal;
  vertical-align: middle;
  border: 0.8px;
  padding: 2px;
  margin-left: 12px;
    .el-icon{
      color: #409eff;
  }
}
</style>