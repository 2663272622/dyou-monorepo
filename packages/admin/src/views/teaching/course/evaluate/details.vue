<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="学生名称" prop="nickName">
        <el-input
            v-model="queryParams.nickName"
            placeholder="请输入学生姓名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级" prop="classId">
        <el-select v-model="queryParams.classId" placeholder="请选择班级" clearable style="width: 200px">
          <!--          <el-option-->
          <!--              v-for="dict in sys_normal_disable"-->
          <!--              :key="dict.value"-->
          <!--              :label="dict.label"-->
          <!--              :value="dict.value"-->
          <!--          />-->
          <el-option v-for="item in classList" :key="item.classId" :label="item.className"
                     :value="item.classId"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="detailList">
      <el-table-column :label="typeTitle + '编码'" align="center" prop="courseId"/>
      <el-table-column label="姓名" align="center" prop="nickName"/>
      <el-table-column :label="typeTitle + '提交时间'" align="center" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.submittedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleReadOver(scope.row)"
                     v-hasPermi="['manage:course:edit']">批阅
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
  </div>
</template>

<script setup name="Course">
import {useRouter, useRoute} from "vue-router"
import {parseTime} from "ruoyi/src/utils/ruoyi";

import {listRecord} from "@/api/teaching/evaluate-record";
import {listClass} from "@/api/teaching/class";
import useUserStore from "@/store/modules/user";

const userInfo = useUserStore();
const {proxy} = getCurrentInstance();
// const {  } = proxy.useDict('');

const router = useRouter();
const route = useRoute();
const detailList = ref([]);
const classList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    nickName: null,
    startTime: null,
    endTime: null,
    assessmentId: route.query.assessmentId,
    courseId: route.query.courseId,
    assessType: route.query.assessType,
  },
  rules: {}
});

const {queryParams} = toRefs(data);

const typeTitle = queryParams.value.assessType == 1 ? '考试' : queryParams.value.assessType == 2 ? '作业' : '测评';

/** 查询课程列表 */
function getList() {
  loading.value = true;
  listRecord(queryParams.value).then(response => {
    detailList.value = response.rows;
    total.value = response.total;
  loading.value = false;
  });
}

function getClassList() {
  const params = {courseId: queryParams.value.courseId};
  listClass(params).then(response => {
    classList.value = response.rows;
  });
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

function handleReadOver(row) {
  router.push('/teaching/study/readOver')
  // window.open('http://localhost/teaching/study/readOver')
}

getList();
getClassList();
</script>