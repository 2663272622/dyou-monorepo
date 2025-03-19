<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      v-show="showSearch"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="类目名称" prop="categoryName">
        <el-input
          v-model="queryParams.categoryName"
          placeholder="请输入类目名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in start_stop"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Sort"
            @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table
      v-if="refreshTable"
      :load="loading"
      :data="categoryList"
      row-key="id"
      lazy
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        label="类目名称"
        prop="categoryName"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="排序"
        prop="sortOrder"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column label="状态" align="center" key="status">
        <template #default="scope">
          <dict-tag :options="start_stop" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="备注"
        prop="remark"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip content="新增" placement="top">
            <el-button
                link
                type="primary"
                icon="Plus"
                @click="handleAdd(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="修改" placement="top">
            <el-button
              link
              type="primary"
              icon="Edit"
              @click="handleUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              link
              type="primary"
              icon="Delete"
              @click="handleDelete(scope.row)"
            ></el-button>
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
      <el-form
        ref="categoryRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级类目">
          <el-tree-select
              v-model="form.parentId"
              :data="categoryOptions"
              :props="{ value: 'id', label: 'categoryName', children: 'children' }"
              value-key="id"
              placeholder="选择上级类目"
              check-strictly
          />
        </el-form-item>
        <el-form-item label="类目名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入类目名称" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sortOrder">
              <el-input-number
                v-model="form.sortOrder"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in start_stop"
              :key="dict.value"
              :value="dict.value"
              >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
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

<script setup name="BookCategory">
import {
  addCategory,
  listCategory,
  listCategoryDetail,
  listChildCategory,
  updateCategory,
  delCategory,
} from "@/api/web-manage/book_category.js";
import { useRouter } from "vue-router";

const router = useRouter();
const { proxy } = getCurrentInstance();
const { start_stop, res_type } = proxy.useDict("start_stop", "res_type");
const categoryList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const categoryOptions = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const isExpandAll = ref(true);
const refreshTable = ref(true);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    categoryName: undefined,
    status: undefined,
    resType: undefined,
  },
  rules: {
    categoryName: [
      { required: true, message: "类目名称不能为空", trigger: "blur" },
    ],
    status: [{ required: true, message: "请选择状态", trigger: "blur" }],
    sortOrder: [{ required: true, message: "请填写排序", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询类目列表 */
function getList() {
  loading.value = true;
  listCategory(queryParams.value).then((res) => {
    categoryList.value = proxy.handleTree(res.data, "id");
    total.value = res.total;
    loading.value = false;
  });
}

/** 查询菜单下拉树结构 */
function getTreeselect() {
  categoryOptions.value = [];
  listCategory().then(response => {
    const category = { id: 0, categoryName: "主类目", children: [] };
    category.children = proxy.handleTree(response.data, "id");
    categoryOptions.value.push(category);
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

/** 删除按钮操作 */
function handleDelete(row) {
  const roleIds = row.id;
  proxy.$modal
    .confirm('是否确认删除类目为"' + row.categoryName + '"的数据项?')
    .then(function () {
      return delCategory(roleIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "manage/category/export",
    {
      ...queryParams.value,
    },
    `category_${new Date().getTime()}.xlsx`
  );
}

/** 重置新增的表单以及其他数据  */
function reset() {
  form.value = {
    id: undefined,
    parentId: 0,
    categoryName: undefined,
    sortOrder: undefined,

    remark: undefined,
  };
  proxy.resetForm("categoryRef");
}

/** 添加资源 */
function handleAdd(row) {
  reset();
  getTreeselect();
  if (row != null && row.id) {
    form.value.parentId = row.id;
  } else {
    form.value.parentId = 0;
  }
  open.value = true;
  title.value = "添加类目";
}

/** 修改资源 */
async function handleUpdate(row) {
  reset();
  await getTreeselect();
  const id = row.id;
  listCategoryDetail(id).then((res) => {
    form.value = res.data;
    form.status = res.data.status;
    form.id = res.data.id;
    open.value = true;
    title.value = "修改类目信息";
  });
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["categoryRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateCategory(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCategory(form.value).then((response) => {
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
