<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
<!--      <el-form-item label="链接名称" prop="linkName">-->
<!--        <el-input-->
<!--            v-model="queryParams.linkName"-->
<!--            placeholder="请输入链接名称"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="有效开始时间" prop="effectiveBegin">
        <el-date-picker clearable v-model="queryParams.effectiveBegin" type="date" value-format="YYYY-MM-DD" placeholder="请选择链接开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="有效结束时间" prop="effectiveEnd">
        <el-date-picker clearable v-model="queryParams.effectiveEnd" type="date" value-format="YYYY-MM-DD" placeholder="请选择链接结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="是否需要审核" prop="isVerify">
        <el-select v-model="queryParams.isVerify" filterable placeholder="请选择是否需要审核状态" clearable style="width: 200px">
          <el-option
              v-for="item in is_verify"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="有效期类型" prop="effectiveType">
        <el-select v-model="queryParams.effectiveType" filterable placeholder="请选择有效期类型" clearable style="width: 200px">
          <el-option
              v-for="item in effective_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
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
            @click="handleAdd"
            v-hasPermi="['system:link:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:link:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:link:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:link:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="linkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="链接编码" align="center" prop="id"/>
<!--      <el-table-column label="链接名称" align="center" prop="linkName"/>-->
      <el-table-column label="链接名称" align="center" :show-overflow-tooltip="true" width="200">
        <template #default="scope">
          <el-link :underline="false" type="primary" v-copyText="scope.row.url" arg="callback" @click="copyCallback">
            {{ scope.row.url }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="链接有效开始时间" align="center">
        <template #default="scope">
          <span>{{ parseTime(scope.row.effectiveBegin, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接有效结束时间" align="center">
        <template #default="scope">
          <span>{{ parseTime(scope.row.effectiveEnd, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接状态" align="center" width="180">
        <template #default="scope">
          <dict-tag :options="start_stop" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="否需要审核" align="center">
        <template #default="scope">
          <dict-tag :options="is_verify" :value="scope.row.isVerify"/>
        </template>
      </el-table-column>
      <el-table-column label="有效类型" align="center">
        <template #default="scope">
          <dict-tag :options="effective_type" :value="scope.row.effectiveType"/>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="300">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleAudit(scope.row)" v-hasPermi="['system:link:edit']" >审核
          </el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:link:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:link:remove']">删除
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

    <!-- 添加或修改链接对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="linkRef" :model="form" :rules="rules" label-width="110px">
<!--        <el-form-item label="链接名称" prop="linkName">-->
<!--          <el-input v-model="form.linkName" placeholder="请输入链接名称"/>-->
<!--        </el-form-item>-->
        <el-form-item label="是否需要审核" prop="isVerify">
          <el-radio-group v-model="form.isVerify">
            <el-radio
                v-for="dict in is_verify"
                :key="dict.value"
                :value="dict.value"
            >{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="有效类型" prop="effectiveType">
          <el-radio-group v-model="form.effectiveType">
            <el-radio
                v-for="dict in effective_type"
                :key="dict.value"
                :value="dict.value"
            >{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row v-if="form.effectiveType == 2">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="effectiveBegin">
              <el-date-picker clearable
                              v-model="form.effectiveBegin"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择链接开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="effectiveEnd">
              <el-date-picker clearable
                              v-model="form.effectiveEnd"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择链接结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="status">
          <el-switch
              v-model="form.status"
              active-value="1"
              inactive-value="0"
              @change="handleStatusChange"
          ></el-switch>
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
import {listInvite, getInvite, delInvite, addInvite, updateInvite} from "@/api/teaching/invite";

import AuditList from './audit.vue'

import {parseTime} from "ruoyi/src/utils/ruoyi";
import { useRouter , useRoute } from "vue-router"
import {changeUserStatus} from "@/api/system/user.js";

const router = useRouter();
const route = useRoute();

const {proxy} = getCurrentInstance();
const { is_verify , effective_type, start_stop} = proxy.useDict('is_verify','effective_type','start_stop');

const linkList = ref([]);
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
    // linkName: null,
    effectiveBegin: null,
    effectiveEnd: null,
    effectiveType:null,
    isVerify: null,
    deptId:route.params.deptId
  },
  rules: {
    // linkName: [
    //   {required: true, message: "链接名称不能为空", trigger: "blur"}
    // ],
    isVerify: [
      {required: true, message: "链接名称不能为空", trigger: "blur"}
    ],
    effectiveType: [
      {required: true, message: "链接名称不能为空", trigger: "blur"}
    ],
    effectiveBegin: [
      {required: true, message: "链接开始时间不能为空", trigger: "blur"}
    ],
    effectiveEnd: [
      {required: true, message: "链接结束时间不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询链接列表 */
function getList() {
  loading.value = true;
  listInvite(queryParams.value).then(response => {
    linkList.value = response.rows;
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
    // linkName: null,
    status:null,
    effectiveBegin: null,
    effectiveEnd: null,
    isVerify: null,
    remark: null,
    createBy: null,
    updateBy: null,
    updateTime: null,
  };
  proxy.resetForm("linkRef");
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

function copyCallback() {
  proxy.$modal.msgSuccess("复制成功");
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 申请按钮操作 */
function handleAudit(row) {
  router.push('/teaching/college-invite/audit/'+row.id+'?uuid='+row.uuid)
}

function handleStatusChange(status) {
  console.log(status)
  form.value.status = status
  // let text = status === "0" ? "启用" : "停用";
  // proxy.$modal.confirm('确认要"' + text + '""' + row.nickName + '"链接吗?').then(function () {
  //   return changeUserStatus(row.userId, row.status);
  // }).then(() => {
  //   proxy.$modal.msgSuccess(text + "成功");
  // }).catch(function () {
  //   row.status = row.status === "0" ? "1" : "0";
  // });
};

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加链接";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const linkIds = row.id || ids.value
  getInvite(linkIds).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改链接";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["linkRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateInvite(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        form.value.id = route.params.id
        addInvite(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const deptIds = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除链接编号为"' + deptIds + '"的数据项？').then(function () {
    return delInvite(deptIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/link/export', {
    ...queryParams.value
  }, `链接列表_${new Date().getTime()}.xlsx`)
}

getList();
</script>
