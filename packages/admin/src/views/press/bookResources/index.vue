<!-- 图书资源管理 -->
 <template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="关联书籍" prop="name">
            <el-input
               v-model="queryParams.name"
               placeholder="请输入书籍名称"
               clearable
               style="width: 240px"
               @keyup.enter="handleQuery"
            />
         </el-form-item> 
         <el-form-item label="资源类型" prop="status">
            <el-select
               v-model="queryParams.status"
               placeholder="请选择资源类型"
               clearable
               style="width: 240px"
            >
               <el-option
                  v-for="dict in book_resource_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>  
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button
               type="primary"
               plain
               icon="Plus"
               @click="handleUpdate(2)"
               v-hasPermi="['manage:publisher:add']"
            >上传文件</el-button>
         </el-form-item>
      </el-form>
      
      <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
         <!-- <el-table-column label="头像" align="center" fixed="left" width="70"  >
            <template #default="scope">
                <el-image
                    style="width: 50px; height: 50px"
                    :src="scope.row.logo"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    fit="cover"
                /> 
            </template>
         </el-table-column> -->

         <el-table-column label="文件名" align="center" prop="phone" :show-overflow-tooltip="true"/>
         <el-table-column label="文件大小" align="center" prop="phone"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="关联书籍" align="center" prop="phone"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="文件类型" align="center" prop="status">
            <template #default="scope">
               <dict-tag :options="book_resource_type" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="上传人" align="center" prop="name"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="上传时间" align="center" prop="phone"  width="200" :show-overflow-tooltip="true"/>

  
         <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(1,scope.row)" v-hasPermi="['manage:publisher:edit']">替换</el-button>
               <el-button link type="primary" icon="Delete" @click="handleUpdate(3,scope.row)" v-hasPermi="['manage:publisher:remove']">删除</el-button>
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
         :title="title"
         :id="currentId"
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
const { book_resource_type } = proxy.useDict("book_resource_type");
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

/** 多选框选中数据 */
function handleSelectionChange(selection) { }

/** 修改按钮操作 */
function handleUpdate(type,row) {
    // 保存row  id
    currentId.value = row?.publisherId || "";

    switch(type){
        case 1:// 编辑
            editType.value = 'edit'
            title.value = "替换文件";
            open.value = true;
        break;
        case 2:// 新增
            editType.value = 'add'
            title.value = "新增文件";
            open.value = true;
        break; 
        case 3:// 删除
            proxy.$modal.confirm('是否确认删除？').then(()=> {
                return pressDelApi(currentId.value);
            }).then(() => {
                getList();
                proxy.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        break;


    }

}
 


getList();
</script>