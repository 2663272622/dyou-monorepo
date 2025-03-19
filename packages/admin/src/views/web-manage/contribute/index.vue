<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="投稿人" prop="submitterName">
        <el-input
            v-model="queryParams.submitterName"
            placeholder="请输入投稿人"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="submitterPhone">
        <el-input
            v-model="queryParams.submitterPhone"
            placeholder="请输入联系电话"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出版类别" prop="submitterPhone">
        <el-select
            v-model="queryParams.status"
            placeholder="角色状态"
            clearable
            style="width: 240px"
        >
          <el-option
              v-for="dict in publication_category"
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
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
        >删除
        </el-button>
      </el-col>
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
    <el-table v-loading="loading" :data="contributeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" width="120"/>
      <el-table-column label="投稿人" prop="submitterName" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="联系电话" prop="submitterPhone" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="地址" prop="contactAddress" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="选题名称" prop="topicName" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="出版类型" width="150">
        <template #default="scope">
           <el-dict-tag :options="publication_category" :value="scope.row.publicationType"/>
        </template>
      </el-table-column>
      <el-table-column label="人员类别" width="150">
        <template #default="scope">
           <el-dict-tag :options="personnel_category" :value="scope.row.personnelCategory"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="下载稿件" placement="top">
            <el-button link type="primary" icon="Download" @click="handleDownload(scope.row)"></el-button>
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
  </div>
</template>

<script setup name="Contribute">
import { listContribute, delContribute} from "@/api/web-manage/contribute";
import {useRouter} from "vue-router";

const router = useRouter();
const {proxy} = getCurrentInstance();
const {publication_category,personnel_category} = proxy.useDict( "publication_category","personnel_category");
const contributeList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref([]);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    submitterName: undefined,
    submitterPhone: undefined,
    createTime: undefined,
    resType:undefined,
  },
});

const {queryParams} = toRefs(data);

/** 查询学校列表列表 */
function getList() {
  loading.value = true;
  listContribute(queryParams.value).then(res => {
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

function handleDownload(row){
  const fileUrl = 'https://example.com/path/to/your/file.pdf'; // 替换为实际文件URL
  const link = document.createElement('a');
  link.href = fileUrl;
  link.setAttribute('download', '稿件.pdf'); // 设置下载文件名
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 删除按钮操作 */
function handleDelete(row) {
  const roleIds = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除投稿为"' + row.submitterName + '"的数据项?').then(function () {
    return delContribute(roleIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("manage/submission/export", {
    ...queryParams.value,

  }, `contribute_${new Date().getTime()}.xlsx`);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


getList();
</script>
