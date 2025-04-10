<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班级名称" prop="className">
        <el-input
            v-model="queryParams.className"
            placeholder="请输入班级名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级码" prop="classCode">
        <el-input
            v-model="queryParams.classCode"
            placeholder="请输入唯一班级码"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级" prop="classId">
        <el-select v-model="queryParams.classId" placeholder="班级" clearable style="width: 240px">
          <el-option v-for="item in classList1" :key="item.classId" :label="item.className"
                     :value="item.classId"/>
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
            v-hasPermi="['manage:class:add']"
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
            v-hasPermi="['manage:class:edit']"
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
            v-hasPermi="['manage:class:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['manage:class:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="classList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="班级编码" align="center" prop="classId"/>
      <el-table-column label="班级名称" align="center" prop="className"/>
      <el-table-column label="关联课程" align="center" prop="courseName"/>
      <el-table-column label="班级码" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-link :underline="false" type="primary" v-copyText="scope.row.classCode" arg="callback"
                   @click="copyCallback">
            {{ scope.row.classCode }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" v-hasPermi="['manage:class:edit']"
                     @click="handleStudent(scope.row)">学生管理
          </el-button>
          <el-button link type="primary" icon="Edit" v-hasPermi="['manage:class:edit']"
                     @click="handleUpdate(scope.row)">修改
          </el-button>
          <el-button link type="primary" icon="Delete" v-hasPermi="['manage:class:remove']"
                     @click="handleDelete(scope.row)">删除
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

    <!-- 添加或修改课程班级对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="classRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="form.className" placeholder="请输入班级名称"/>
        </el-form-item>
        <el-form-item label="关联课程" prop="courseId">
          <el-select v-model="form.courseId" filterable placeholder="课程选择" clearable>
            <el-option
                v-for="info in courseList"
                :key="info.courseId"
                :label="info.courseName"
                :value="info.courseId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级码" v-if="form.classId != undefined">
          <el-link :underline="false" type="primary" v-copyText="form.classCode" arg="callback" @click="copyCallback">
            {{ form.classCode }}
          </el-link>
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

<script setup name="Class">
import {listClass, getClass, delClass, addClass, updateClass, listCourse} from "@/api/teaching/class";
import {useRouter, useRoute} from 'vue-router'

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const classList = ref([]);
const classList1 = ref([]);
const courseList = ref([]);
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
    className: null,
    courseId: route.query.courseId,
    classCode: null,
    classId: null,
  },
  rules: {
    className: [
      {required: true, message: "班级名称不能为空", trigger: "blur"}
    ],
    courseId: [
      {required: true, message: "关联课程不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询课程班级列表 */
function getList(paginated = true) {
  const params = paginated ? queryParams.value : { courseId: queryParams.value.courseId };
  loading.value = true;
  listClass(params).then(response => {
    if (paginated) {
      classList.value = response.rows;
      total.value = response.total;
    } else {
      classList1.value = response.rows;
    }
    loading.value = false;
  });
}

/** 查询课程列表 */
function getCourseList() {
  listCourse().then(response => {
    courseList.value = response.data;
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
    classId: null,
    className: null,
    courseId: null,
    classCode: null,
    remark: null,
  };
  proxy.resetForm("classRef");
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
  ids.value = selection.map(item => item.classId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加课程班级";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _classId = row.classId || ids.value
  getClass(_classId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改课程班级";
  });
}

/** 修改按钮操作 */
function handleStudent(row) {
  // router.push("/teaching/study/students/?courseId=" +row.courseId+ '&classId='+ row.classId)
  router.push({path:'/teaching/study/students',query:{courseId:row.courseId,classId:row.classId}})
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["classRef"].validate(valid => {
    if (valid) {
      if (form.value.classId != null) {
        updateClass(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
          getList(false);
        });
      } else {
        addClass(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
          getList(false);
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _classIds = row.classId || ids.value;
  proxy.$modal.confirm('是否确认删除课程班级编号为"' + _classIds + '"的数据项？').then(function () {
    return delClass(_classIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/class/export', {
    ...queryParams.value
  }, `class_${new Date().getTime()}.xlsx`)
}

getList();
getList(false);
getCourseList();
</script>
