<template>
  <div class="app-container">
<!--    echarts图表-->
    <div id="echartBox"></div>
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item :label="typeTitle + '名称'" prop="assessmentName">
        <el-input
            v-model="queryParams.assessmentName"
            :placeholder="'请输入'+typeTitle + '名称'"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="typeTitle + '开始时间'" prop="startTime">
        <el-date-picker clearable
                        v-model="queryParams.startTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        :placeholder="'请选择'+typeTitle+'开始时间'" />
      </el-form-item>
      <el-form-item :label="typeTitle + '结束时间'" prop="endTime">
        <el-date-picker clearable
                        v-model="queryParams.endTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        :placeholder="'请选择'+typeTitle+'结束时间'" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-radio-group v-model="queryParams.assessType" aria-label="assessType" @change='changeAssessType'>
          <el-radio-button value="1">考试</el-radio-button>
          <el-radio-button value="2">作业</el-radio-button>
        </el-radio-group>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table  stripe  v-loading="loading" :data="detailList" @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column :label="typeTitle + '编码'" align="center" prop="courseId" />
      <el-table-column :label="typeTitle + '名称'" align="center" prop="assessmentName" />
      <el-table-column :label="typeTitle + '提交时间'" align="center" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.submittedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="typeTitle + '开始时间'" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="typeTitle + '结束时间'" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark" />
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
import { listAssessmentRecord} from "@/api/teaching/evaluate-record";
import {parseTime} from "ruoyi/src/utils/ruoyi";
import {useRouter,useRoute} from "vue-router"
import useUserStore from "@/store/modules/user";

const userInfo = useUserStore();
const { proxy } = getCurrentInstance();
// const {  } = proxy.useDict('');

const router = useRouter();
const route = useRoute();
const detailList = ref([]);
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
    assessmentName: null,
    startTime: null,
    endTime: null,
    assessType:1,
    userId:route.query.studentId,
    courseId:route.query.courseId,
  },
  rules: {}
});

const { queryParams } = toRefs(data);
const typeTitle = ref('考试')

/** 查询课程列表 */
function getList() {
  loading.value = true;
  listAssessmentRecord(queryParams.value).then(response => {
    detailList.value = response.rows;
    total.value = response.total;
    loading.value = false;
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

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.courseId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

// 切换考试作业
function changeAssessType(type){
  typeTitle.value = type == 1 ? '考试' : type == 2 ? '作业' :'测评';
  queryParams.value.assessType = type;
  getList();
}


getList();
</script>