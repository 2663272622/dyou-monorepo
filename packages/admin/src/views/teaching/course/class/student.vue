<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="班级名称" prop="className">
        <el-input
            v-model="queryParams.className"
            placeholder="请输入班级名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery" style="margin-right: 10px">搜索</el-button>
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
            v-hasPermi="['manage:class:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['manage:class:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['manage:class:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['manage:class:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="classList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="班级编号" prop="classId" width="120" />
      <el-table-column label="班级名称" prop="className" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="班级码" :show-overflow-tooltip="true">
        <template  #default="scope">
          <div v-copyText="scope.row.classCode" arg="callback" class="copy-text" @click="copyCallback">
            {{ scope.row.classCode }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="查看学生" placement="top">
            <el-button link type="primary" v-hasPermi="['manage:class:edit']"icon="User" @click="handleStudent(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="修改" placement="top">
            <el-button link type="primary" v-hasPermi="['manage:class:edit']"icon="Edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" v-hasPermi="['manage:class:remove']" icon="Delete" @click="handleDelete(scope.row)"></el-button>
          </el-tooltip>
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

    <!-- 添加或修改二级班级对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="classRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="form.className" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="课程名称" placeholder="课程选择" prop="courseName" >
          <el-select v-model="form.courseName" filterable placeholder="课程选择" clearable>
            <!--            <el-option-->
            <!--                v-for="info in courseList"-->
            <!--                :key="info.curriculumid"-->
            <!--                :label="info.curriculumname"-->
            <!--                :value="info.curriculumid + '+' + info.curriculumname"-->
            <!--            />-->
          </el-select>
        </el-form-item>
        <el-form-item label="人数" prop="studentNum">
          <el-input-number v-model="form.studentNum"></el-input-number>
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

<script setup name="class">
import { addClass , delClass , listClass , listClassDetail , updateClass } from "@/api/teaching/class";
const { proxy } = getCurrentInstance();

const classList = ref([]);
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
    className: undefined,
    courseName:undefined,
  },
  rules: {
    className: [{ required: true, message: "班级名称不能为空", trigger: "blur" }],
    courseName: [{ required: true, message: "请选择课程", trigger: "blur" }],
    studentNum: [{ required: true, message: "人数不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询班级列表列表 */
function getList() {
  loading.value = true;
  classList.value = [
    {
      className:'ceshi1班',
      classCode:'ASFGDDESG15A5550',
      studentNum: 20,
      courseName: 'cc',
    }
  ]
  // listClass(queryParams.value).then(res => {
  //   classList.value = res.rows;
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
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 删除按钮操作 */
function handleDelete(row) {
  const classIds = row.classId || ids.value;
  proxy.$modal.confirm('是否确认删除"' + row.className + '"的数据项?').then(function () {
    return delClass(classIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/class/export", {
    ...queryParams.value,

  }, `班级_${new Date().getTime()}.xlsx`);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.classId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 重置新增的表单以及其他数据  */
function reset() {
  form.value = {
    classId: undefined,
    className: undefined,
    courseName: undefined,
    studentNum: undefined,
  };
  proxy.resetForm("classRef");
}

/** 添加角色 */
function handleAdd() {
  reset();
  //请求接口
  open.value = true;
  title.value = "添加班级";
}

/** 修改角色 */
function handleUpdate(row) {
  reset();
  const classId = row.classId || ids.value
  listClassDetail(classId).then(res => {
    form.value = res.data
    open.value = true;
    title.value = "修改班级信息";
  });
}

/*
* 查看学生
* */
function handleStudent(row) {
  //跳转
}

function copyCallback() {
  proxy.$modal.msgSuccess("复制成功");
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["classRef"].validate(valid => {
    if (valid) {
      if (form.value.classId != undefined) {

        updateClass(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {

        addClass(form.value).then(response => {
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
.copy-text {
  cursor: pointer; /* 鼠标悬停时变为手指 */
  padding: 5px; /* 添加内边距 */
}

.copy-text:hover {
  color: #409eff; /* 鼠标悬停时变色 */
}
</style>
