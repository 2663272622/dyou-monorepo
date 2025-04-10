<template>
  <div class="app-container">
    <!-- 搜索框和按钮 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
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
            @click="handleAdd()"
            v-hasPermi="['manage:college:add']"
        >新增一级学院</el-button>
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
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Sort"
            @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="collegeList"
        row-key="deptId"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'collegeSubList', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="学院名称" align="center" prop="collegeName"/>
      <el-table-column label="学院LOGO" align="center">
        <template #default="scope">
          <ImagePreview :src="scope.row.collegeLogo"></ImagePreview>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Plus" v-if="scope.row.type == 1" @click="() => handleAdd(scope.row)" v-hasPermi="['manage:college:add']">
            新增二级学院
          </el-button>
          <el-button link type="primary" icon="link" @click="() => handleInvite(scope.row)" v-hasPermi="['manage:college:invite']">
            老师邀请
          </el-button>
          <el-button link type="primary" icon="Edit" @click="() => handleUpdate(scope.row)" v-hasPermi="['manage:college:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="() => handleDelete(scope.row)" v-hasPermi="['manage:college:remove']">删除</el-button>
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

    <!-- 添加或修改学院信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="collegeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学院名称" prop="collegeName">
          <el-input v-model="form.collegeName" placeholder="请输入学院名称"/>
        </el-form-item>
        <el-form-item label="学院LOGO" prop="collegeLogo">
          <dy-upload v-model="form.collegeLogo" placeholder="请输入学院LOGO路径/URL"/>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注信息"/>
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
import { ref, reactive, toRefs } from 'vue';
import {
  listCollege,
  getCollege,
  delCollege,
  addCollege,
  updateCollege,
  addCollegeSub,
  getCollegeSub,
  updateCollegeSub,
  delCollegeSub,
} from "@/api/teaching/college";
import DyUpload from "@/components/dy-upload/index.vue";
import useUserStore from "@/store/modules/user";
import router from "@/router/index.js";

const { proxy } = getCurrentInstance();
const userInfo = useUserStore();

const collegeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const isExpandAll = ref(false);
const refreshTable = ref(true);
const total = ref(0);
const title = ref("");
const isEditMode = ref(false); // 用于判断是编辑模式
const parentCollegeId = ref(null); // 用于存储父级学院ID
const type = ref(null)

const data = reactive({
  form: {
    collegeId: null,
    collegeSubId:null,
    collegeName: null,
    collegeLogo: null,
    remark: null,
    schoolId: null, // 学校ID
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    collegeName: null,
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
    // collegeList.value =proxy.handleTree(response.rows, "collegeSubId");
    total.value = response.total;
    loading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = {
    collegeId: null,
    collegeSubId:null,
    collegeName: null,
    collegeLogo: null,
    remark: null,
    schoolId: null, // 清除学校ID
  };
  parentCollegeId.value = null; // 清除父级学院ID
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

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}

function handleInvite (row){
  router.push('/teaching/college-invite/index/'+row.deptId)
}

/** 新增按钮操作 */
function handleAdd(row = null) {
  reset(); // 重置表单
  isEditMode.value = false; // 设置为新增模式
  form.value.schoolId = userInfo.schoolId; // 设置学校ID
  if (row) {
    title.value = "添加二级学院"; // 标题为添加二级学院
    parentCollegeId.value = row.collegeId; // 设置父级学院ID
    form.value.collegeId = null; // 新增时不设置 collegeId
  } else {
    title.value = "添加一级学院"; // 标题为添加一级学院
    parentCollegeId.value = null; // 一级学院无父级ID
  }

  open.value = true; // 打开对话框
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  form.value.schoolId = userInfo.schoolId; // 设置学校ID
  form.value.collegeId = row.collegeId; // 设置当前学院ID
  isEditMode.value = true; // 设置为编辑模式
  type.value = row.type

  if (row.type == 1) {
    title.value = "修改一级学院"; // 标题为修改一级学院
    getCollege(row.collegeId).then(response => {
      form.value = response.data; // 获取一级学院数据
      open.value = true; // 打开对话框
    });
  } else if (row.type == 2) {
    title.value = "修改二级学院"; // 标题为修改二级学院
    getCollegeSub(row.collegeSubId).then(response => {
      form.value = response.data; // 获取二级学院数据
      open.value = true; // 打开对话框
    });
  }
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["collegeRef"].validate(valid => {
    if (valid) {
      console.log(form.value)
      console.log(parentCollegeId.value)
      console.log(type.value)
      // return
      if (isEditMode.value) {
        // 修改操作
        if (type.value == 2) {
          updateCollegeSub(form.value).then(() => {
            proxy.$modal.msgSuccess("二级学院修改成功");
            open.value = false;
            getList();
          });
        } else if (type.value == 1) {
          updateCollege(form.value).then(() => {
            proxy.$modal.msgSuccess("一级学院修改成功");
            open.value = false;
            getList();
          });
        }
      } else {
        // 新增操作
        if (parentCollegeId.value) {
          form.value.collegeId = parentCollegeId.value; // 设置父级学院ID
          addCollegeSub(form.value).then(() => {
            proxy.$modal.msgSuccess("二级学院新增成功");
            open.value = false;
            getList();
          });
        } else {
          addCollege(form.value).then(() => {
            proxy.$modal.msgSuccess("一级学院新增成功");
            open.value = false;
            getList();
          });
        }
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  if (row.type == 1) {
    proxy.$modal.confirm(`是否确认删除一级学院 "${row.collegeName}"？`).then(() => {
      return delCollege(row.collegeId);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("一级学院删除成功");
    });
  } else if (row.type == 2) {
    proxy.$modal.confirm(`是否确认删除二级学院 "${row.collegeName}"？`).then(() => {
      return delCollegeSub(row.collegeSubId);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("二级学院删除成功");
    });
  }
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/college/export', {
    ...queryParams.value
  }, `college_${new Date().getTime()}.xlsx`);
}

getList();
</script>