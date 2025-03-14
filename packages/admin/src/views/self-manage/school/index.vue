<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="学校名称" prop="schoolName">
        <el-input
            v-model="queryParams.schoolName"
            placeholder="请输入学校名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否开通" prop="isActive">
        <el-select v-model="queryParams.isActive" placeholder="审核状态" clearable style="width: 240px">
          <el-option v-for="dict in sch_open_status" :key="dict.value" :label="dict.label" :value="dict.value"/>
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
    <el-table v-loading="loading" :data="schoolList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" width="120"/>
      <el-table-column label="Logo" :show-overflow-tooltip="true" width="150" >
        <template #default="scope">
          <ImagePreview :src="scope.row.schoolLogo"></ImagePreview>
        </template>
      </el-table-column>
      <el-table-column label="学校名称" prop="schoolName" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="联系电话" prop="contactPhone" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="学校层次" :show-overflow-tooltip="true" width="150" >
        <template #default="scope">
          <dict-tag :options="sch_teaching_level" :value="scope.row.schoolLevel"/>
        </template>
      </el-table-column>
      <el-table-column label="是否开通" align="center" key="isActive">
        <template  #default="scope">
          <dict-tag :options="sch_open_status" :value="scope.row.isActive"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="修改时间" prop="updateTime" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
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

    <!-- 添加或修改学校对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="schoolRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="学校名称" prop="schoolName">
              <el-input v-model="form.schoolName" placeholder="请输入学校名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系方式" :disabled="form.schoolId !== undefined"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学校logo" prop="schoolLogo">
              <dyUpload
                  v-model="form.schoolLogo"
                  fileType="5"
              ></dyUpload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校级别" prop="schoolLevel">
              <el-select v-model="form.schoolLevel" placeholder="教学层次" clearable>
                <el-option v-for="dict in sch_teaching_level" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="教务处账号" prop="academicAccount">
              <el-input v-model="form.academicAccount" placeholder="请输入教务处账号" :disabled="form.schoolId !== undefined"/>
            </el-form-item>
            <el-form-item label="是否开通" prop="isActive">
              <el-radio-group v-model="form.isActive">
                <el-radio value="1">开通</el-radio>
                <el-radio value="0">不开通</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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

<script setup name="School">
import { addSchool, listSchool , listSchoolDetail, updateSchool , delSchool } from "@/api/self-manage/school.js";
import {useRouter} from "vue-router";

const router = useRouter();
const {proxy} = getCurrentInstance();
const {sch_open_status, sch_teaching_level} = proxy.useDict("sch_open_status", "sch_teaching_level");
const schoolList = ref([]);
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
    schoolName: undefined,
    isActive: undefined,
    schoolLevel: undefined,
  },
  rules: {
    schoolName: [{required: true, message: "学校名称不能为空", trigger: "blur"}],
    contactPhone: [{
      required: true,
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的联系电话",
      trigger: "blur"
    }],
    academicAccount:[
      {
        required: true,
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: "请输入教务处账号",
        trigger: "blur"
      }
    ],
    isActive:[
      {
        required: true,
        message: "请选择是否开通账号",
        trigger: "blur"
      }
    ]
  },
});

const {queryParams, form, rules} = toRefs(data);

/** 查询学校列表列表 */
function getList() {
  loading.value = true;
  listSchool(queryParams.value).then(res => {
    schoolList.value = res.rows;
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
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 删除按钮操作 */
function handleDelete(row) {
  const roleIds = row.schoolId || ids.value;
  proxy.$modal.confirm('是否确认删除学校为"' + row.schoolName + '"的数据项?').then(function () {
    return delSchool(roleIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("manage/school/export", {
    ...queryParams.value,

  }, `school_${new Date().getTime()}.xlsx`);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.schoolId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 重置新增的表单以及其他数据  */
function reset() {
  form.value = {
    schoolId: undefined,
    schoolName: undefined,
    schoolLevel:undefined,
    academicAccount: undefined,
    schoolLogo: undefined,
    isActive: undefined,
    remark: undefined,
  };
  proxy.resetForm("schoolRef");
}

/** 添加角色 */
function handleAdd() {
  reset();
  //请求接口
  open.value = true;
  title.value = "添加学校";
}

/** 修改角色 */
function handleUpdate(row) {
  reset();
  const schoolId = row.schoolId || ids.value
  listSchoolDetail(schoolId).then(res => {
    console.log(res.data)
      form.value = res.data
      form.shcoolId = res.data.schoolId
      form.schoolLevel = res.data.schoolLevel
      open.value = true;
      title.value = "修改学校信息";
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["schoolRef"].validate(valid => {
    if (valid) {
      console.log(form.value.schoolId)
      if (form.value.schoolId != undefined) {

        updateSchool(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {

        addSchool(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
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
