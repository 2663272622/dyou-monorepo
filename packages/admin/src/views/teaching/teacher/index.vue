<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="学校名称" prop="schoolName">
        <el-input
            v-model="queryParams.schoolName"
            placeholder="请输入学校名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学校类目" prop="schoolCategory">
        <el-select v-model="queryParams.schoolCategory" placeholder="请选择" style="width: 200px">
          <el-option
              v-for="dict in sch_teaching_level"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学院名称" prop="collegeName">
        <el-input
            v-model="queryParams.collegeName"
            placeholder="请输入学院名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="teacherName">
        <el-input
            v-model="queryParams.teacherName"
            placeholder="请输入姓名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
            v-model="queryParams.phone"
            placeholder="请输入手机号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职位" prop="position">
        <el-input
            v-model="queryParams.position"
            placeholder="请输入职位（如：系主任）"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职称" prop="title">
        <el-input
            v-model="queryParams.title"
            placeholder="请输入职称（如：教授）"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="专业领域" prop="major">
        <el-input
            v-model="queryParams.major"
            placeholder="请输入专业领域"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主授课程名称" prop="courseName">
        <el-input
            v-model="queryParams.courseName"
            placeholder="请输入主授课程名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="认证状态" prop="authenticationStatus" >
        <el-select v-model="queryParams.authenticationStatus" placeholder="请选择认证状态"  clearable style="width: 200px">
          <el-option
              v-for="dict in authentication_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="primary"-->
<!--            plain-->
<!--            icon="Plus"-->
<!--            @click="handleAdd"-->
<!--            v-hasPermi="['manage:teacher:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['manage:teacher:edit']"
        >审核</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['manage:teacher:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['manage:teacher:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teacherList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学校名称" align="center" prop="schoolName" />
      <el-table-column label="学校LOGO" align="center">
        <template #default="scope">
          <image-preview :src="scope.row.schoolLogo"></image-preview>
        </template>
      </el-table-column>
      <el-table-column label="学校类目" align="center" prop="schoolCategory" />
      <el-table-column label="学院名称" align="center" prop="collegeName" />
      <el-table-column label="姓名" align="center" prop="teacherName" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="职位" align="center" prop="position" />
      <el-table-column label="职称" align="center" prop="title" />
      <el-table-column label="专业领域" align="center" prop="major" />
      <el-table-column label="办公地址" align="center" prop="address" />
      <el-table-column label="主授课程名称" align="center" prop="courseName" />
      <el-table-column label="工作证件" align="center" >
        <template #default="scope">
          <image-preview :src="scope.row.credential"></image-preview>
        </template>
      </el-table-column>
      <el-table-column label="认证状态" align="center" prop="authenticationStatus">
        <template #default="scope">
          <dict-tag :options="authentication_status" :value="scope.row.authenticationStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:teacher:edit']">审核</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:teacher:remove']">删除</el-button>
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

    <!-- 添加或修改教师信息对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="teacherRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="学校名称" prop="schoolName">
          <el-input v-model="form.schoolName" placeholder="请输入学校名称" :disabled="true" />
        </el-form-item>
        <el-form-item label="学校LOGO" prop="schoolLogo">
          <image-preview :src="form.schoolLogo"></image-preview>
        </el-form-item>
        <el-form-item label="学校类目" prop="schoolCategory">
          <el-input v-model="form.schoolCategory" placeholder="请输入学校类目" :disabled="true" />
        </el-form-item>
        <el-form-item label="学院名称" prop="collegeName">
          <el-input v-model="form.collegeName" placeholder="请输入学院名称" :disabled="true" />
        </el-form-item>
        <el-form-item label="姓名" prop="teacherName">
          <el-input v-model="form.teacherName" placeholder="请输入姓名" :disabled="true" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" :disabled="true" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" :disabled="true" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="请输入职位" :disabled="true" />
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-input v-model="form.title" placeholder="请输入职称" :disabled="true" />
        </el-form-item>
        <el-form-item label="专业领域" prop="major">
          <el-input v-model="form.major" placeholder="请输入专业领域" :disabled="true" />
        </el-form-item>
        <el-form-item label="办公地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入办公地址" :disabled="true" />
        </el-form-item>
        <el-form-item label="主授课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入主授课程名称" :disabled="true" />
        </el-form-item>
        <el-form-item label="工作证件" prop="credential">
          <image-preview :src="form.credential"></image-preview>
        </el-form-item>
        <el-form-item label="认证状态">
          <dict-tag :options="authentication_status" :value="form.authenticationStatus"/>
        </el-form-item>
        <el-form-item label="审核" prop="authenticationStatus">
          <el-radio-group v-model="form.authenticationStatus">
            <el-radio
                v-for="dict in audit_operation"
                :key="dict.value"
                :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注信息" />
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
import { listTeacher, getTeacher, delTeacher, addTeacher, updateTeacher } from "@/api/teaching/teacher";
import ImagePreview from "@/components/ImagePreview/index.vue";

const { proxy } = getCurrentInstance();
const { authentication_status , audit_operation , sch_teaching_level } = proxy.useDict('authentication_status','audit_operation','sch_teaching_level');

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
    schoolName: null,
    schoolCategory: null,
    collegeName: null,
    teacherName: null,
    phone: null,
    email: null,
    position: null,
    title: null,
    major: null,
    courseName: null,
    authenticationStatus: null,
  },
  rules: {
    schoolName: [
      { required: true, message: "学校名称不能为空", trigger: "blur" }
    ],
    schoolCategory: [
      { required: true, message: "学校类目不能为空", trigger: "blur" }
    ],
    collegeName: [
      { required: true, message: "学院名称不能为空", trigger: "blur" }
    ],
    teacherName: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
    phone: [
      { required: true, message: "手机号不能为空", trigger: "blur" }
    ],
    credential: [
      { required: true, message: "工作证件存储路径/URL不能为空", trigger: "blur" }
    ],
    authenticationStatus: [
      { required: true, message: "请选择认证审核", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询教师信息列表 */
function getList() {
  loading.value = true;
  listTeacher(queryParams.value).then(response => {
    teacherList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    schoolName: null,
    schoolLogo: null,
    schoolCategory: null,
    collegeName: null,
    teacherName: null,
    phone: null,
    email: null,
    position: null,
    title: null,
    major: null,
    address: null,
    courseName: null,
    credential: null,
    authenticationStatus: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("teacherRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  // open.value = true;
  // title.value = "添加教师信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getTeacher(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改教师信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["teacherRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateTeacher(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTeacher(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除教师信息编号为"' + _ids + '"的数据项？').then(function() {
    return delTeacher(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/teacher/export', {
    ...queryParams.value
  }, `老师认证申请列表_${new Date().getTime()}.xlsx`)
}

getList();
</script>
