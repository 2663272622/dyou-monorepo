<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="studentName">
        <el-input
            v-model="queryParams.studentName"
            placeholder="请输入姓名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级" prop="classId">
        <el-select v-model="queryParams.classId" style="width: 200px">
<!--          <el-option v-for="item in classList" :key="item.classId"  :label="item.className" :value="item.classId"></el-option>-->
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
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleDetails"
            v-hasPermi="['manage:student:edit']"
        >查看详情</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['manage:student:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['manage:student:export']"
        >导出</el-button>
      </el-col>
      <el-badge :value="100" style="margin-left: 10px">
          <el-button icon="Bell" color="#626aef" plain @click="audit()">待审核</el-button>
      </el-badge>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学生编号" align="center" prop="studentId" />
      <el-table-column label="班级" align="center" prop="className" />
      <el-table-column label="姓名" align="center" prop="studentName" />
      <el-table-column label="审核状态" align="center">
        <template #default="scope">
          <dict-tag :options="student_audit_status" :value="scope.row.auditStatus" />
        </template>
      </el-table-column>
      <el-table-column label="课程状态" align="center">
        <template #default="scope">
          <dict-tag :options="course_status" :value="scope.row.courseStatus" />
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleDetails(scope.row)" v-hasPermi="['manage:student:edit']">测评情况</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:student:edit']">调整班级</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:student:remove']">踢出</el-button>
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

    <!--调整班级 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="studentRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="studentName">
          <el-input v-model="form.studentName" placeholder="请输入姓名" :disabled="true" />
        </el-form-item>
        <el-form-item label="当前班级" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注信息" :disabled="true" />
        </el-form-item>
        <el-form-item label="转入班级" prop="remark">
          <el-select v-model="queryParams.classId" style="width: 200px">
<!--            <el-option v-for="item in classList" :key="item.classId" :label="item" :value="item"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <auth-student v-model="auditStatus" :title="'待审核列表'" @cancel="()=>{}"></auth-student>
  </div>
</template>

<script setup name="Student">
import { listStudent, getStudent, delStudent, addStudent, updateStudent } from "@/api/teaching/student.js";
import {useRouter,useRoute} from 'vue-router'
import AuthStudent from "./studentAudit.vue";

const router = useRouter();
const route = useRoute();

const { proxy } = getCurrentInstance();
const { student_audit_status ,course_status} = proxy.useDict("student_audit_status","course_status");

// const studentList = ref([]);
const open = ref(false);
const auditStatus = ref(false);
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
    studentName: null,
    studentId:route.params.studentId
  },
  rules: {
    studentName: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
  }
});

console.log(route)

const { queryParams, form, rules } = toRefs(data);

const mockStudentList = [
  {
    studentId: 1,
    className: "高一（1）班",
    studentName: "张三",
    auditStatus: 1, // 假设 1 表示审核通过
    courseStatus: 1, // 假设 1 表示课程状态正常
    remark: "积极参与",
  },
  {
    studentId: 2,
    className: "高一（1）班",
    studentName: "李四",
    auditStatus: 0, // 假设 0 表示审核未通过
    courseStatus: 1,
    remark: "待审核",
  },
  {
    studentId: 3,
    className: "高一（2）班",
    studentName: "王五",
    auditStatus: 1,
    courseStatus: 1,
    remark: "表现优秀",
  },
  {
    studentId: 4,
    className: "高一（2）班",
    studentName: "赵六",
    auditStatus: 2,
    courseStatus: 2, // 假设 0 表示课程状态异常
    remark: "需改进",
  },
];

// 在你的 setup 函数中替换从 API 获取数据的部分
const studentList = ref(mockStudentList);

/** 查询学生信息列表 */
function getList() {
  loading.value = true;
  // listStudent(queryParams.value).then(response => {
  //   studentList.value = response.rows;
  //   total.value = response.total;
    loading.value = false;
  // });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    studentId: null,
    studentName: null,
    studentNum: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
  };
  proxy.resetForm("studentRef");
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

function audit(){
  auditStatus.value = true
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.studentId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


function handleDetails(){
    router.push()
}


/** 详情按钮操作 */
function handleUpdate(row) {
  reset();
  // const _studentId = row.studentId || ids.value
  // getStudent(_studentId).then(response => {
  //   form.value = response.data;
    open.value = true;
    title.value = "学生信息";
  // });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["studentRef"].validate(valid => {
    if (valid) {
      if (form.value.studentId != null) {
        updateStudent(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStudent(form.value).then(response => {
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
  const _studentIds = row.studentId || ids.value;
  proxy.$modal.confirm('是否确认删除学生信息编号为"' + _studentIds + '"的数据项？').then(function() {
    return delStudent(_studentIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/studentCourse/export', {
    ...queryParams.value
  }, `学生列表_${new Date().getTime()}.xlsx`)
}

getList();
</script>
