<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="老师姓名" prop="teacherName">
        <el-input
            v-model="queryParams.teacherName"
            placeholder="请输入老师姓名"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
            v-model="queryParams.phoneNumber"
            placeholder="请输入老师手机号"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="审核状态" clearable style="width: 240px">
          <el-option v-for="dict in sch_audit_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否通过" prop="isStatus">
        <el-select v-model="queryParams.isStatus" placeholder="审核状态" clearable style="width: 240px">
          <el-option v-for="dict in sch_audit_operation" :key="dict.value" :label="dict.label" :value="dict.value"/>
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
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="teacherList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="头像" :show-overflow-tooltip="true" width="150" >
        <template #default="scope">
          <ImagePreview :src="scope.row.avatar"></ImagePreview>
        </template>
      </el-table-column>
      <el-table-column label="教师姓名" prop="teacherName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="手机号" prop="phoneNumber" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="审核状态" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sch_audit_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="是否通过" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="sch_audit_operation" :value="scope.row.isStatus" />
        </template>
      </el-table-column>
      <el-table-column label="简介" prop="introduction" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="使用教材" placement="top">
            <el-button link type="primary" icon="reading" @click="handleUseBook(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="审核" placement="top">
            <el-button link type="primary" icon="edit" @click="handleAudit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
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

    <!-- 添加或修改老师对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="teacherRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="审核" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in sch_audit_operation" :key="dict.value" :value="dict.value">{{
                dict.label
              }}
            </el-radio>
          </el-radio-group>
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

<script setup name="Teacher">
import { delRole, updateRole } from "@/api/system/role";
import {listCollege} from "@/api/teaching/college.js";
import {useRouter} from "vue-router";
import path from "path";
const router = useRouter();
const { proxy } = getCurrentInstance();
const { sch_audit_status , sch_audit_operation} = proxy.useDict("sch_audit_status","sch_audit_operation");
const teacherList = ref([]);
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
    teacherName: undefined,
    status:undefined,
    isStatus:undefined,
  },
  rules: {
    teacherName: [{ required: true, message: "老师名称不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询学院列表列表 */
function getList() {
  loading.value = true;
  teacherList.value = [
    {
      teacherId:1,
      teacherName: '张三',
      phoneNumber:'1555555555',
      status:0,
      isStatus:1,
      avatar:'/src/assets/images/profile.jpg',
      introduction:'测试hfghfghfghfgh'
    },
    {
      teacherId:2,
      teacherName: '李四',
      phoneNumber:'156448334',
      status:0,
      isStatus:0,
      avatar:'/src/assets/images/profile.jpg',
      introduction:'测试1fghfghfghfgh'
    }
  ]
  // listCollege(queryParams.value).then(res => {
  //   teacherList.value = res.rows;
  //   total.value = res.total;
  loading.value = false;
  // }).catch(err=>{
  //   console.error(err)
  //   loading.value = false;
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

/** 查看使用教材操作 */
function handleUseBook(row) {
  console.log(row.teacherId)
  router.push("/teaching/teacher-textbook/index/" + row.teacherId);

}

/** 审核按钮操作 */
function handleAudit(row) {
  open.value = true
  title.value = '审核信息'
  // const roleIds = row.teacherId || ids.value;
  // proxy.$modal.confirm('是否确认删除学院为"' + roleIds + '"的数据项?').then(function () {
  //   return delRole(roleIds);
  // }).then(() => {
  //   getList();
  //   proxy.$modal.msgSuccess("删除成功");
  // }).catch(() => {});
}

/** 删除按钮操作 */
function handleDelete(row) {
  const roleIds = row.teacherId || ids.value;
  proxy.$modal.confirm('是否确认删除学院为"' + roleIds + '"的数据项?').then(function () {
    return delRole(roleIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  // proxy.download("system/role/export", {
  //   ...queryParams.value,

  // }, `role_${new Date().getTime()}.xlsx`);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.teacherId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 重置新增的表单以及其他数据  */
function reset() {
  form.value = {
    schoolId: undefined,
    teacherName: undefined,
    remark: undefined
  };
  proxy.resetForm("teacherRef");
}


/** 提交按钮 */
function submitForm() {
  proxy.$refs["teacherRef"].validate(valid => {
    if (valid) {
      updateRole(form.value).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        getList();
      });
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
