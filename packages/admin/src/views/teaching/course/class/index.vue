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
      <el-form-item label="关联课程" prop="courseId">
        <el-select v-model="queryParams.courseId" placeholder="关联课程" clearable style="width: 240px">
          <el-option v-for="item in courseList" :key="item.courseId" :label="item.label"
                     :value="item.courseId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="班级码" prop="classCode">
        <el-input
            v-model="queryParams.classCode"
            placeholder="请输入唯一班级码"
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
        <template  #default="scope">
          <el-link :underline="false" type="primary" v-copyText="scope.row.classCode" arg="callback" @click="copyCallback">
            {{ scope.row.classCode }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
        <template #default="scope">
<!--          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"-->
<!--                     v-hasPermi="['manage:class:list']">学生管理-->
<!--          </el-button>-->
<!--          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"-->
<!--                     v-hasPermi="['manage:class:edit']">修改-->
<!--          </el-button>-->
<!--          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"-->
<!--                     v-hasPermi="['manage:class:remove']">删除-->
<!--          </el-button> -->
          <el-button link type="primary" icon="Edit" @click="handleStudent(scope.row)">学生管理</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
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
            <!--            <el-option-->
            <!--                v-for="info in courseList"-->
            <!--                :key="info.curriculumid"-->
            <!--                :label="info.curriculumname"-->
            <!--                :value="info.curriculumid + '+' + info.curriculumname"-->
            <!--            />-->
          </el-select>
        </el-form-item>
        <el-form-item label="唯一班级码" prop="classCode">
          <el-link :underline="false" type="primary" v-copyText="form.classCode" arg="callback" @click="copyCallback">{{ form.classCode }}</el-link>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注信息"/>
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
import {listClass, getClass, delClass, addClass, updateClass} from "@/api/teaching/class";
import {useRouter,useRoute} from 'vue-router'

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();


// const classList = ref([]);
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
    courseId: route.params.courseId,
    classCode: null,
  },
  rules: {
    className: [
      {required: true, message: "班级名称不能为空", trigger: "blur"}
    ],
    courseId: [
      {required: true, message: "关联课程不能为空", trigger: "blur"}
    ],
    classCode: [
      {required: true, message: "唯一班级码不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);
const mockClassList = [
  {
    classId: 1,
    courseId: 1,
    className: "高一（1）班",
    courseName: "数学基础",
    classCode: "GY1B",
    remark: "优秀班级",
  },
  {
    classId: 2,
    courseId: 2,
    className: "高一（2）班",
    courseName: "英语语法",
    classCode: "GY2B",
    remark: "活跃班级",
  },
  {
    classId: 3,
    courseId: 3,
    className: "高二（1）班",
    courseName: "科学探究",
    classCode: "GZ1B",
    remark: "实验班级",
  },
  {
    classId: 4,
    courseId: 4,
    className: "高二（2）班",
    courseName: "历史概论",
    classCode: "GZ2B",
    remark: "文化班级",
  },
  {
    classId: 5,
    className: "高三（1）班",
    courseName: "文科综合",
    classCode: "G3B",
    remark: "冲刺班级",
  },
  {
    classId: 6,
    className: "高三（2）班",
    courseName: "理科综合",
    classCode: "G3B2",
    remark: "顶尖班级",
  },
];

// 课程选择假数据
const mockCourseList = [
  { courseId: 1, label: "数学基础" },
  { courseId: 2, label: "英语语法" },
  { courseId: 3, label: "科学探究" },
  { courseId: 4, label: "历史概论" },
];

// 在你的 setup 函数中替换从 API 获取数据的部分
const classList = ref(mockClassList);
const courseList = ref(mockCourseList);

/** 查询课程班级列表 */
function getList() {
  loading.value = true;
  // listClass(queryParams.value).then(response => {
  //   classList.value = response.rows;
  //   total.value = response.total;
    loading.value = false;
  // });
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
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
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
  reset();
  console.log(route)
  // router.push("/teaching/course-to/class/" + row.courseId+"/student/" + row.classId)
  router.push("/teaching/course-to/class/"+row.courseId+"/student/"+row.classId)
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
        });
      } else {
        addClass(form.value).then(response => {
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
</script>
