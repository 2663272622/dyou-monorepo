<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="书架名称" prop="bookName">
        <el-input
            v-model="queryParams.bookName"
            placeholder="请输入书籍名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请状态" prop="applyStatus">
        <el-select v-model="queryParams.applyStatus" clearable placeholder="请选择" style="width: 200px;">
          <el-option
              v-for="status in apply_status"
              :key="status.value"
              :label="status.label"
              :value="status.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试用时间" prop="applyStatus">
        <el-select v-model="queryParams.probationTime" clearable placeholder="试用时间" style="width: 200px;">
          <el-option v-for="item in probation_time" :key="item.value" :label="item.label" :value="item.value"/>
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
<!--            type="success"-->
<!--            plain-->
<!--            icon="Edit"-->
<!--            :disabled="single"-->
<!--            @click="handleUpdate"-->
<!--            v-hasPermi="['manage:bookshelf:edit']"-->
<!--        >审核-->
<!--        </el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['manage:bookshelf:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table  stripe  v-loading="loading" :data="bookshelfList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="书籍名称" align="center" prop="bookName"/>
      <el-table-column label="用户名称" align="center" prop="userName"/>
      <el-table-column label="出版社" align="center" prop="publisherName"/>
      <el-table-column label="试用时间" align="center">
        <template #default="scope">
          <dict-tag :options="probation_time" :value="scope.row.probationTime"/>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center">
        <template #default="scope">
          <dict-tag :options="apply_status" :value="scope.row.applyStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="试用结束时间" align="center" prop="probationEndTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.probationEndTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-if="scope.row.applyStatus == 0" link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['manage:bookshelf:edit']">审核
          </el-button>
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

    <!-- 添加或修改老师试用申请对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bookTrialAudit" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审核" prop="applyStatus">
          <el-radio-group v-model="form.applyStatus">
            <el-radio
                v-for="dict in audit_operation"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="试用时间" prop="probationTime" v-if="form.applyStatus == 1">
          <el-select v-model="form.probationTime" placeholder="试用时间" :style="{ width: '100%' }">
            <el-option v-for="item in probation_time" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注信息"/>
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

<script setup name="Bookshelf">
import {listBookshelf, getBookshelf, updateBookshelf} from "@/api/press/bookTrialAudit";
import {parseTime} from "@/utils/ruoyi.js";

const {proxy} = getCurrentInstance();
const {
  apply_status,
  audit_operation,
  probation_time
} = proxy.useDict('apply_status', 'audit_operation', 'probation_time');

const bookshelfList = ref([]);
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
    bookName: null,
    applyStatus: null,
    probationTime:null,
  },
  rules: {
    probationTime:[
      {required: true, message: "试用时长不能为空", trigger: "blur"}
    ],
    applyStatus:[
      {required: true, message: "审核不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询老师试用申请列表 */
function getList() {
  loading.value = true;
  listBookshelf(queryParams.value).then(response => {
    bookshelfList.value = response.rows;
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
    probationTime: null,
    applyStatus: null,
    remark: null,
  };
  proxy.resetForm("bookTrialAudit");
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

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getBookshelf(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改老师试用申请";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["bookTrialAudit"].validate(valid => {
    if (valid) {
      console.log(form.value)
      // return
      if (form.value.id != null) {
        updateBookshelf(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/teacherBookshelf/export', {
    ...queryParams.value
  }, `老师书籍试用申请列表_${new Date().getTime()}.xlsx`)
}

getList();
</script>
