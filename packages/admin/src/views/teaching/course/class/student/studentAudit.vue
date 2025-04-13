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
      <!--      <el-form-item label="审核状态" prop="auditStatus">-->
      <!--        <el-select v-model="queryParams.auditStatus" style="width: 200px">-->
      <!--          <el-option v-for="item in audit_status" :key="item.dictValue" :label="item.label" :value="item.value"></el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" plain icon="Check" v-if="queryParams.auditStatus == 0" v-hasPermi="['manage:student:edit']" @click="oneCilckAudit(1)">
          通过
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Close" v-if="queryParams.auditStatus == 0" v-hasPermi="['manage:student:edit']" @click="oneCilckAudit(2)">
          拒绝
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-tabs
        v-model="queryParams.auditStatus"
        type="card"
        @tab-click="handleClick"
    >
      <el-tab-pane
          v-for="item in audit_status"
          :key="item.value"
          :label="item.label"
          :name="item.value"
          :stretch="true"
      >
        <el-table  stripe  v-loading="loading" :data="studentAuditList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="编号" align="center" prop="id"/>
          <el-table-column label="学生编号" align="center" prop="studentId"/>
          <el-table-column label="姓名" align="center" prop="studentName"/>
          <el-table-column label="班级" align="center" prop="className"/>
          <el-table-column label="审核状态" align="center">
            <template #default="scope">
              <dict-tag :options="audit_status" :value="scope.row.auditStatus"/>
            </template>
          </el-table-column>
          <el-table-column label="备注信息" align="center" prop="remark"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button link type="primary" icon="Check" v-if="scope.row.auditStatus == 0"
                         @click="handleUpdate(1,scope.row)" v-hasPermi="['manage:student:edit']">通过
              </el-button>
              <el-button link type="primary" icon="Close" v-if="scope.row.auditStatus == 0"
                         @click="handleUpdate(2,scope.row)" v-hasPermi="['manage:student:edit']">拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="studentAudit">
import {listStudentAudit, updateStudentAudit} from "@/api/teaching/student.js";
import {useRouter, useRoute} from 'vue-router'
import {useVModel} from '@vueuse/core'


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
const {audit_status} = proxy.useDict("audit_status");


const studentAuditList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const AuditIds = ref([]);
const data = reactive({
  form: {},
  queryParams: {
    studentName: null,
    classId: route.query.classId,
    courseId: route.query.courseId,
    auditStatus: "0"
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询学生信息列表 */
function getList() {
  loading.value = true;
  listStudentAudit(queryParams.value).then(response => {
    studentAuditList.value = response.data;
    loading.value = false;
  });
}

function handleClick(tab, event) {
  queryParams.value.auditStatus = tab.props.name
  getList()
}

// 取消按钮
function cancel() {
  modelValue.value = false
  emit("cancel")
}


/** 搜索按钮操作 */
function handleQuery() {
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  AuditIds.value = selection.map(item => item.studentId);
}

// 一键审核
function oneCilckAudit(type) {
  if (AuditIds.value.length === 0) {
    proxy.$modal.alert('请先选择学生');
    return;
  }
  const obj = {
    courseId: queryParams.value.courseId,
    classId: queryParams.value.classId,
    auditStatus: type,
    studentCourseId: AuditIds.value
  }
  proxy.$modal.confirm('是否确认通过学生信息数据项？？').then(function () {
    return updateStudentAudit(obj);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("成功");
  }).catch(() => {
  });
}

/** 审核按钮操作 */
function handleUpdate(type, row) {
  const obj = {
    courseId: row.courseId,
    classId: row.classId,
    auditStatus: type,
    studentCourseId: [row.studentId]
  }
  proxy.$modal.confirm('是否确认通过学生信息数据项？？').then(function () {
    return updateStudentAudit(obj);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("成功");
  }).catch(() => {
  });
}

getList();
</script>