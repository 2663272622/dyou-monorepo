<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="书籍名称" prop="bookName">
        <el-input
            v-model="queryParams.bookName"
            placeholder="请输入书籍名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="错误类型" prop="errorType">
        <el-select
            v-model="queryParams.errorType"
            placeholder="错误类型"
            clearable
            style="width: 240px"
        >
          <el-option
              v-for="dict in error_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="correctStatus">
        <el-select
            v-model="queryParams.correctStatus"
            placeholder="处理状态"
            clearable
            style="width: 240px"
        >
          <el-option
              v-for="dict in correct_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime" style="width: 308px">
        <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="contributeList">
      <el-table-column type="index" label="序号" width="120"/>
      <el-table-column label="书籍名称" prop="bookName" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="错误原文内容" prop="errorContent" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="错误类型" width="150" key="errorType">
        <template #default="scope">
          <dict-tag :options="error_type" :value="scope.row.errorType"/>
        </template>
      </el-table-column>
      <el-table-column label="错误详情" prop="errorDetail" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="处理状态" width="150" key="correctStatus">
        <template #default="scope">
          <dict-tag :options="correct_status" :value="scope.row.correctStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="处理完成时间" prop="processedAt" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="去处理" placement="top">
            <el-button link type="primary" icon="DArrowRight" @click="(scope.row)"></el-button>
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

    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="correctionRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="书籍名称" prop="bookName">
          <el-input v-model="form.bookName" placeholder="请输入书籍名称" :disabled="true"/>
        </el-form-item>
        <el-form-item label="处理状态" prop="correctStatus">
          <el-radio-group v-model="form.correctStatus">
            <el-radio
                v-for="dict in correct_status"
                :key="dict.value"
                :value="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="错误类型" prop="errorType">
          <dict-tag :options="error_type" :value="form.errorType"/>
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

<script setup name="Error">
import { listCorrection,listCorrectionDetail,updateCorrection, delCorrection} from "@/api/web-manage/error_correction";
import {useRouter} from "vue-router";

const router = useRouter();
const {proxy} = getCurrentInstance();
const {error_type, correct_status} = proxy.useDict("error_type", "correct_status");
const contributeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref([]);
const title = ref("");

const data = reactive({
  form:{},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    bookName: undefined,
    errorType: undefined,
    correctStatus:undefined,
  },
  rules: {
    correctStatus: [{required: true, message: "处理状态不能为空", trigger: "blur"}],
  },
});

const {queryParams, form, rules} = toRefs(data);

/** 查询学校列表列表 */
function getList() {
  loading.value = true;
  // contributeList.value = [
  //   {
  //     bookId:59,
  //     bookName:'电机驱动与调速',
  //     errorContent:'cehsi',
  //     errorDetail:'cc',
  //     errorType:2,
  //     correctStatus:1,
  //   }
  // ]
  listCorrection(queryParams.value).then(res => {
    contributeList.value = res.rows;
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
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 重置新增的表单以及其他数据  */
function reset() {
  form.value = {
    booklId: undefined,
    bookName: undefined,
    correctStatus:undefined,
    remark: undefined,
  };
  proxy.resetForm("correctionRef");
}

/** 修改资源 */
function handleUpdate(row) {
  reset();
  const id = row.id
  listCorrectionDetail(id).then(res => {
    form.value = res.data
    form.correctStatus = res.data.correctStatus
    form.id = res.data.id
    open.value = true;
    title.value = "修改纠错信息";
  })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("manage/correction/export", {
    ...queryParams.value,

  }, `纠错_${new Date().getTime()}.xlsx`);
}

/*处理错误*/
function handle() {
  // 跳转至编辑器定位
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["correctionRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {

        updateCorrection(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
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
