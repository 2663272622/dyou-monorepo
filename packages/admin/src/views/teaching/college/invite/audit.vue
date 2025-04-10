<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="用户名" prop="userName">
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="nickName">
        <el-input
            v-model="queryParams.nickName"
            placeholder="请输入用户名称"
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
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:examine:edit']"
        >审核
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:examine:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="examineList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="用户编码" align="center" prop="id"/>
      <el-table-column label="用户名" align="center" prop="userName"/>
      <el-table-column label="姓名" align="center" prop="nickName"/>
      <el-table-column label="审核状态" align="center" width="180">
        <template #default="scope">
          <dict-tag :options="link_audit_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="examineUser"/>
      <el-table-column label="申请时间" align="center" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="300">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-if="scope.row.status == 0" v-hasPermi="['system:examine:edit']">
            审核
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

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="auditRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="姓名">
          {{form.nickName}}
        </el-form-item>
        <el-form-item label="用户">
          {{form.userName}}
        </el-form-item>
        <el-form-item label="审核" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in link_audit_operation" :key="dict.value" :value="dict.value">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息"/>
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

<script setup name="Course">
import {listExamine, getExamine, updateExamine} from "@/api/teaching/invite";
import {parseTime} from "ruoyi/src/utils/ruoyi";
import {useRouter, useRoute} from "vue-router"

const router = useRouter();
const route = useRoute();

const {proxy} = getCurrentInstance();
const { link_audit_status, link_audit_operation } = proxy.useDict('link_audit_status','link_audit_operation');

const examineList = ref([]);
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
    userName: null,
    nickName: null,
    id:route.params.id,
    uuid:route.query.uuid
  },
  rules: {
    userName: [
      {required: true, message: "用户名称不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);

const mockExamineList = [
  {

    id: 1,
    userName: "高一（1）班",
    nickName: "张三",
    status: 0, // 假设 1 表示审核通过
    examineUser: 1,
    createTime: 1,
    updateTime: 1,
    remark: "积极参与",
  },
  {

    id: 2,
    userName: "高一（1）班",
    nickName: "李四",
    status: 0, // 假设 0 表示审核未通过
    createTime: 1,
    updateTime: 1,
    examineUser: 1,
    remark: "待审核",
  },
  {

    id: 3,
    userName: "高一（2）班",
    nickName: "王五",
    status: 0,
    examineUser: 1,
    createTime: 1,
    updateTime: 1,
    remark: "表现优秀",
  },
  {
    id: 4,
    userName: "高一（2）班",
    nickName: "赵六",
    status: 0,
    createTime: 1,
    updateTime: 1,
    examineUser: 2, // 假设 0 表示课程状态异常
    remark: "需改进",
  },
];

// 在你的 setup 函数中替换从 API 获取数据的部分
// const examineList = ref(mockExamineList);

/** 查询用户列表 */
function getList() {
  loading.value = true;
  listExamine(queryParams.value).then(response => {
    examineList.value = response.rows;
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
    userName: null,
    status:null,
    remark: null,
    updateTime: null,
  };
  proxy.resetForm("auditRef");
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

/** 审核按钮操作 */
function handleUpdate(row) {
  reset();
  const linkIds = row.id || ids.value
  getExamine(linkIds).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "审核用户";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["auditRef"].validate(valid => {
    if (valid) {
      updateExamine(form.value).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        getList();
      });

    }
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/examine/export', {
    ...queryParams.value
  }, `注册审核列表_${new Date().getTime()}.xlsx`)
}

getList();
</script>
