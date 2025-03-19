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
      <el-form-item label="作者" prop="author">
        <el-input
            v-model="queryParams.author"
            placeholder="请输入作者"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="书号" prop="ISBN">
        <el-input
            v-model="queryParams.ISBN"
            placeholder="请输入书号"
            clearable
            style="width: 240px"
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
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="textbookList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="封面" :show-overflow-tooltip="true" width="150" >
        <template #default="scope">
          <ImagePreview :src="scope.row.coverUrl"></ImagePreview>
        </template>
      </el-table-column>
      <el-table-column label="书籍名称" prop="bookName" :show-overflow-tooltip="true"  />
      <el-table-column label="ISBN书号" prop="ISBN" :show-overflow-tooltip="true"  />
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

<script setup name="Teacher">
import {listTextbook} from "@/api/teaching/textbook";
const textbookList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    author: undefined,
    ISBN:undefined,
  },
});

const { queryParams } = toRefs(data);

/** 查询学院列表列表 */
function getList() {
  loading.value = true;
  textbookList.value = [
    {
      bookId:1,
      bookName: '张三',
    },
    {
      bookId:2,
      bookName: '李四',
    }
  ]
  // listCollege(queryParams.value).then(res => {
  //   textbookList.value = res.rows;
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


/** 导出按钮操作 */
function handleExport() {
  proxy.download("mangae/textbook/export", {
    ...queryParams.value,

  }, `教材_${new Date().getTime()}.xlsx`);
}


getList();
</script>
