<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="图片名称" prop="resName">
        <el-input
            v-model="queryParams.resName"
            placeholder="请输入图片名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable style="width: 240px">
          <el-option v-for="dict in start_stop" :key="dict.value" :label="dict.label" :value="dict.value"/>
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
    <el-table v-loading="loading" :data="imgList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" width="120"/>
      <el-table-column label="图片名称" prop="resName" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="资源类型" align="center" key="resType">
        <template #default="scope">
          <dict-tag :options="res_type" :value="scope.row.resType"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" key="status">
        <template #default="scope">
          <dict-tag :options="start_stop" :value="scope.row.status"/>
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

    <!-- 添加或修改资源对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="imgRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="图片名称" prop="resName">
          <el-input v-model="form.resName" placeholder="请输入图片名称"/>
        </el-form-item>
        <el-form-item label="资源类型" prop="resType">
          <el-radio-group v-model="form.resType">
            <el-radio
                v-for="dict in res_type"
                :key="dict.value"
                :value="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sortOrder">
              <el-input-number v-model="form.sortOrder" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in start_stop"
                :key="dict.value"
                :value="dict.value"
            >{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图片上传" prop="resUrl">
          <dyUpload
              v-model="form.resUrl"
              fileType="5"
          ></dyUpload>
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

<script setup name="ImageManager">
import {addImg, listImg, listImgDetail, updateImg, delImg} from "@/api/web-manage/slidesshow";
import {useRouter} from "vue-router";

const router = useRouter();
const {proxy} = getCurrentInstance();
const {start_stop, res_type} = proxy.useDict("start_stop", "res_type");
const imgList = ref([]);
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
    resName: undefined,
    status: undefined,
    resType:undefined,
  },
  rules: {
    resName: [{required: true, message: "图片名称不能为空", trigger: "blur"}],
    status: [{required: true, message: "请选择状态", trigger: "blur"}],
    resType: [{required: true, message: "请选择资源类型", trigger: "blur"}],
    sortOrder: [{required: true, message: "请填写排序", trigger: "blur"}],
    resUrl: [{required: true, message: "请上传图片", trigger: "blur"}],
  },
});

const {queryParams, form, rules} = toRefs(data);

/** 查询学校列表列表 */
function getList() {
  loading.value = true;
  listImg(queryParams.value).then(res => {
    imgList.value = res.rows;
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
  const roleIds = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除图片为"' + row.resName + '"的数据项?').then(function () {
    return delImg(roleIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("manage/resource/export", {
    ...queryParams.value,

  }, `resource_${new Date().getTime()}.xlsx`);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 重置新增的表单以及其他数据  */
function reset() {
  form.value = {
    id: undefined,
    resName: undefined,
    resUrl: undefined,
    sortOrder: undefined,
    status: undefined,
    resType: undefined,
    remark: undefined,
  };
  proxy.resetForm("imgRef");
}

/** 添加资源 */
function handleAdd() {
  reset();
  //请求接口
  open.value = true;
  title.value = "添加图片";
}

/** 修改资源 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  listImgDetail(id).then(res => {
    form.value = res.data
    form.status = res.data.status
    form.resType = res.data.resType
    form.id = res.data.id
    open.value = true;
    title.value = "修改图片信息";
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["imgRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {

        updateImg(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {

        addImg(form.value).then(response => {
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
