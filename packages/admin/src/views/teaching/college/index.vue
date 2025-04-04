<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学院名称" prop="collegeName">
        <el-input
            v-model="queryParams.collegeName"
            placeholder="请输入学院名称"
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

    <el-table v-loading="loading" :data="collegeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学院LOGO" align="center">
        <template #default="scope">
          <ImagePreview :src="scope.row.collegeLogo"></ImagePreview>
        </template>
      </el-table-column>
      <el-table-column label="学院名称" align="center" prop="collegeName" />
      <el-table-column label="备注信息" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['manage:college:add']">新增</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:college:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:college:remove']">删除</el-button>
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

    <!-- 添加或修改学院信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="collegeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学院名称" prop="collegeName">
          <el-input v-model="form.collegeName" placeholder="请输入学院名称" />
        </el-form-item>
        <el-form-item label="学院LOGO" prop="collegeLogo">
          <dy-upload v-model="form.collegeLogo" placeholder="请输入学院LOGO路径/URL" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="mitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="College">
import { listCollege, getCollege, delCollege, addCollege, updateCollege } from "@/api/teaching/college";
import DyUpload from "@/components/dy-upload/index.vue";

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
    collegeName: null,
    collegeLogo: null,
  },
  rules: {
    collegeName: [
      { required: true, message: "学院名称不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询学院信息列表 */
function getList() {
  loading.value = true;
  listCollege(queryParams.value).then(response => {
    collegeList.value = response.rows;
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
    collegeName: null,
    collegeLogo: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    isDel: null
  };
  proxy.resetForm("collegeRef");
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
  ids.value = selection.map(item => item.collegeId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  // const _collegeId = row.collegeId || ids.value
  // getCollege(_collegeId).then(response => {
  //   form.value = response.data;
    open.value = true;
    title.value = "添加学院信息";
  // });
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _collegeId = row.collegeId || ids.value
  getCollege(_collegeId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改学院信息";
  });
}

/** 提交按钮 */
function mitForm() {
  proxy.$refs["collegeRef"].validate(valid => {
    if (valid) {
      if (form.value.collegeId != null) {
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

/** 删除按钮操作 */
function handleDelete(row) {
  const _collegeIds = row.collegeId || ids.value;
  proxy.$modal.confirm('是否确认删除学院信息编号为"' + _collegeIds + '"的数据项？').then(function() {
    return delCollege(_collegeIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/college/export', {
    ...queryParams.value
  }, `college_${new Date().getTime()}.xlsx`)
}

getList();
</script>
