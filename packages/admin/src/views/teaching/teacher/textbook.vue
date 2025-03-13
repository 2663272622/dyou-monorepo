<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="书名" prop="bookName">
        <el-input
            v-model="queryParams.bookName"
            placeholder="请输入书名"
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
    <el-table v-loading="loading" :data="textbookList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="封面" :show-overflow-tooltip="true" width="150" >
        <template #default="scope">
          <ImagePreview :src="scope.row.bookimg"></ImagePreview>
        </template>
      </el-table-column>
      <el-table-column label="教师姓名" prop="bookName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="简介" prop="introduction" :show-overflow-tooltip="true" width="150" />
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

<script setup name="Textbook">
import {useRouter} from "vue-router";
const router = useRouter();
const { proxy } = getCurrentInstance();
const textbookList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    bookName: undefined,
  },
  rules: {
    bookName: [{ required: true, message: "书籍名称不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询学院列表列表 */
function getList() {
  loading.value = true;
  textbookList.value = [
    {
      bookId:1,
      bookName: '电机驱动与调速',
      bookimg:'/src/assets/images/profile.jpg',
      introduction:'测试hfghfghfghfgh'
    },
    {
      bookId:2,
      bookName: 'java程序设计',
      bookimg:'/src/assets/images/profile.jpg',
      introduction:'测试1fghfghfghfgh'
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
  // proxy.download("system/role/export", {
  //   ...queryParams.value,

  // }, `role_${new Date().getTime()}.xlsx`);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.bookId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

getList();
</script>
