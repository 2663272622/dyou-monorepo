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
            v-hasPermi="['manage:correction:export']"
            @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table  stripe  v-loading="loading" :data="contributeList">
      <el-table-column label="编号" prop="id"/>
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
          <template v-if="scope.row.correctStatus == 1">
            <el-button link type="primary" icon="Edit" v-hasPermi="['manage:correction:edit']" @click="handleUpdate(scope.row)">已修正</el-button>
          </template>
          <template>
            <el-button link type="primary" icon="DArrowRight"  v-hasPermi="['manage:correction:dispose']" @click="(scope.row)">去处理</el-button>
          </template>
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
  </div>
</template>

<script setup name="Error">
import { listCorrection,updateCorrection} from "@/api/press/error_correction.js";
import {useRouter} from "vue-router";

const router = useRouter();
const {proxy} = getCurrentInstance();
const {error_type, correct_status} = proxy.useDict("error_type", "correct_status");
const contributeList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const dateRange = ref([]);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    bookName: undefined,
    errorType: undefined,
    correctStatus:undefined,
  },
});

const {queryParams} = toRefs(data);

/** 查询学校列表列表 */
function getList() {
  loading.value = true;
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

/** 修改资源 */
function handleUpdate(row) {
  const id = row.id;
  proxy.$modal.confirm('确认已修正编号为"' + id + '"的数据项？').then(function () {
    return updateCorrection({id:id});
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("修正成功");
  }).catch(() => {
  });
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


getList();
</script>
