<!-- 出版社管理 -->
 <template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="出版社" prop="name">
            <el-input
               v-model="queryParams.name"
               placeholder="请输入出版社名称"
               clearable
               style="width: 240px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>  
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button
               type="primary"
               plain
               icon="Plus"
               @click="handleAdd"
               v-hasPermi="['manage:publisher:add']"
            >新增</el-button>
         </el-form-item>
      </el-form>
      
      <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
         <!-- <el-table-column type="selection" width="55" align="center" /> -->
         <el-table-column label="LOGO" align="center" fixed="left" width="70"  >
            <template #default="scope">
                <el-image
                    style="width: 50px; height: 50px"
                    :src="scope.row.logo"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    fit="cover"
                    />
                    <!-- show-progress
                    :preview-src-list="[scope.row.logo]"
                    :initial-index="0" -->
            </template>
         </el-table-column>
         <el-table-column label="出版社名称" align="center" fixed="left" prop="name"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="联系电话" align="center" prop="phone"  width="200" :show-overflow-tooltip="true"/>
         <!-- <el-table-column label="管理员" align="center" prop="address"  width="200" :show-overflow-tooltip="true"/> -->
         <el-table-column label="地址" align="center" prop="address"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="是否开通" align="center" prop="status">
            <template #default="scope">
               <dict-tag :options="start_stop" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="出版社管理员" align="center" prop="dictName"  width="200" :show-overflow-tooltip="true"/>
  
         <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width" fixed="right">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:publisher:edit']">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:publisher:remove']">删除</el-button>
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

      <editView
         v-model="open"
         :type="editType"
         :id="currentId"
         :title="title"
        @cancel="()=>{}"
        @submit="()=>{getList()}"
      ></editView>
 
   </div>
</template>

<script setup name="Dict">
import useDictStore from '@/store/modules/dict'
import { listType, getType, delType, addType, updateType, refreshCache } from "@/api/system/dict/type";
import editView from './edit'
import { pressListApi,pressDelApi } from "@/api/press/press"

const { proxy } = getCurrentInstance();
const { start_stop } = proxy.useDict("start_stop");
// 出版社发布状态
const { book_issue_status } = proxy.useDict("book_issue_status");
// 出版社审核状态
const { book_audit_status } = proxy.useDict("book_audit_status");


const typeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const title = ref("");
const editType = ref("")
const currentId = ref("")

const queryParams = ref( {
    pageNum: 1,
    pageSize: 10,
})

/** 查询列表 */
function getList() {
  loading.value = true;
  pressListApi(queryParams.value).then(response => {
    typeList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
 

/** 搜索操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
 
/** 新增按钮操作 */
function handleAdd() {
    editType.value = 'add'
    title.value = "添加字典类型";
    open.value = true;
}

/** 多选框选中数据 */
function handleSelectionChange(selection) { }

/** 修改按钮操作 */
function handleUpdate(row) {
    editType.value = 'edit'
    title.value = "编辑字典类型";
    currentId.value = row.publisherId
    open.value = true;
}


/** 删除按钮操作 */
function handleDelete(row) {
    currentId.value = row.publisherId
    proxy.$modal.confirm('是否确认删除？').then(function() {
        return pressDelApi(currentId.value);
    }).then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
}



getList();
</script>