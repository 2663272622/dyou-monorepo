<template>
  <!-- 添加或修改参数配置对话框 -->
  <el-dialog :title="props.title" v-model="modelValue" width="1000"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             append-to-body>
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="姓名" prop="studentName">
        <el-input
            v-model="queryParams.studentName"
            placeholder="请输入姓名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" plain icon="Check" v-hasPermi="['manage:student:edit']" @click="oneCilckAudit(1)">一键通过</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Close" v-hasPermi="['manage:student:edit']" @click="oneCilckAudit(2)">一键拒绝</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" v-hasPermi="['manage:student:export']" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="studentAuditList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="学生编号" align="center" prop="studentId"/>
      <el-table-column label="班级" align="center" prop="className"/>
      <el-table-column label="姓名" align="center" prop="studentName"/>
      <el-table-column label="审核状态" align="center">
        <template #default="scope">
          <dict-tag :options="student_audit_status" :value="scope.row.auditStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Check" @click="handleUpdate(1,scope.row)" v-hasPermi="['manage:student:edit']">通过</el-button>
          <el-button link type="primary" icon="Close" @click="handleUpdate(2,scope.row)" v-hasPermi="['manage:student:edit']">拒绝</el-button>
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
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="studentAudit">
import {listStudentAudit,updateStudentAudit} from "@/api/teaching/student.js";
import {useRouter, useRoute} from 'vue-router'
import {useVModel} from '@vueuse/core'
import {delCourse} from "@/api/teaching/course.js";


// 子组件代码如下 可同时修改父子组件的v-model值
const props = defineProps({
  modelValue: {// 双向绑定的值
    type: [Boolean],
    default: "",
  },
  title: {
    type: [String],
    default: "审核列表"
  },
  type: {
    type: [String],
    default: "add"
  },
  id: {
    type: [String],
    default: ""
  },
});
const emit = defineEmits(["update:modelValue", 'cancel']);
const modelValue = useVModel(props, "modelValue", emit);

const router = useRouter();
const route = useRoute();

const {proxy} = getCurrentInstance();
const {student_audit_status} = proxy.useDict("student_audit_status");


// const studentAuditList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const AuditList = ref([]);
const total = ref(0);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    studentName: null,
    studentId: route.params.studentId
  },
  rules: {
    studentName: [
      {required: true, message: "姓名不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

const mockStudentList = [
  {
    studentId: 1,
    id: 1,
    className: "高一（1）班",
    studentName: "张三",
    auditStatus: 0, // 假设 1 表示审核通过
    courseStatus: 1, // 假设 1 表示课程状态正常
    remark: "积极参与",
  },
  {
    studentId: 2,
    id: 2,
    className: "高一（1）班",
    studentName: "李四",
    auditStatus: 0, // 假设 0 表示审核未通过
    courseStatus: 1,
    remark: "待审核",
  },
  {
    studentId: 3,
    id: 3,
    className: "高一（2）班",
    studentName: "王五",
    auditStatus: 0,
    courseStatus: 1,
    remark: "表现优秀",
  },
  {
    studentId: 4,
    id: 4,
    className: "高一（2）班",
    studentName: "赵六",
    auditStatus: 0,
    courseStatus: 2, // 假设 0 表示课程状态异常
    remark: "需改进",
  },
];

// 在你的 setup 函数中替换从 API 获取数据的部分
const studentAuditList = ref(mockStudentList);

/** 查询学生信息列表 */
function getList() {
  loading.value = true;
  // listStudentAudit(queryParams.value).then(response => {
  //   studentAuditList.value = response.rows;
  //   total.value = response.total;
  loading.value = false;
  // });
}

// 取消按钮
function cancel() {
  modelValue.value = false
  emit("cancel")
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
  AuditList.value = selection;
}

// 一键审核
function oneCilckAudit(type){
  if (AuditList.value.length === 0) {
    proxy.$modal.alert('请先选择学生');
    return;
  }


  const data = AuditList.value.map(row => ({
    studentId: row.studentId,
    userId: row.studentId,
    classId:row.classId,
    courseId:row.courseId,
    id: row.id,
    auditStatus: type,
  }));
  proxy.$modal.confirm('是否确认通过学生信息数据项？？').then(function() {
    return updateStudentAudit(data);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("成功");
  }).catch(() => {});
}

/** 审核按钮操作 */
function handleUpdate(type,row) {
  row.auditStatus = type
  var data =[{
    userId: row.studentId,
    courseId:row.courseId,
    classId:row.classId,
    studentId: row.studentId,
    id: row.id,
    auditStatus:type,
  }]
  proxy.$modal.confirm('是否确认通过学生信息数据项？？').then(function() {
    return updateStudentAudit(data);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/student/export', {
    ...queryParams.value
  }, `待审核学生列表_${new Date().getTime()}.xlsx`)
}

getList();
</script>