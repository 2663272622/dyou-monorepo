<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="学院名称" prop="collegeName">
        <el-input
            v-model="queryParams.collegeName"
            placeholder="请输入学院名称"
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
            v-hasPermi="['manage:college:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['manage:college:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['manage:college:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['manage:college:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="collegeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学院编号" prop="collegeId" width="120" />
      <el-table-column label="学院名称" prop="collegeName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="学院码" prop="collegeCode" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button link type="primary" v-hasPermi="['manage:college:edit']"icon="Edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" v-hasPermi="['manage:college:remove']" icon="Delete" @click="handleDelete(scope.row)"></el-button>
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

    <!-- 添加或修改二级学院对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="collegeRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="学院名称" prop="collegeName">
          <el-input v-model="form.collegeName" placeholder="请输入学院名称" />
        </el-form-item>
        <el-form-item label="院长" prop="dean">
          <el-input v-model="form.dean" placeholder="请输入院长" />
        </el-form-item>
        <el-form-item label="学院Logo" prop="collegeLogo">
          <dyUpload v-model="form.collegeLogo"/>
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

<script setup name="College">
import { addCollege , delCollege , listCollege , listCollegeDetail , updateCollege } from "@/api/teaching/college";
const { proxy } = getCurrentInstance();

const collegeList = ref([]);
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
    collegeName: undefined,
    dean:undefined,
  },
  rules: {
    collegeName: [{ required: true, message: "学院名称不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询学院列表列表 */
function getList() {
  loading.value = true;
  listCollege(queryParams.value).then(res => {
    collegeList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  })
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
  const collegeIds = row.collegeId || ids.value;
  proxy.$modal.confirm('是否确认删除"' + row.collegeName + '"的数据项?').then(function () {
    return delCollege(collegeIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/college/export", {
    ...queryParams.value,

  }, `college_${new Date().getTime()}.xlsx`);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.collegeId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 重置新增的表单以及其他数据  */
function reset() {
  form.value = {
    collegeId: undefined,
    collegeName: undefined,
    dean: undefined,
    remark: undefined,
    collegeLogo:undefined
  };
  proxy.resetForm("collegeRef");
}

/** 添加角色 */
function handleAdd() {
  reset();
  //请求接口
  open.value = true;
  title.value = "添加学院";
}

/** 修改角色 */
function handleUpdate(row) {
  reset();
  const collegeId = row.collegeId || ids.value
  listCollegeDetail(collegeId).then(res => {
    form.value = res.data
    open.value = true;
    title.value = "修改学校信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["collegeRef"].validate(valid => {
    if (valid) {
      if (form.value.collegeId != undefined) {

        updateCollege(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {

        addCollege(form.value).then(response => {
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
