<!-- 作者管理 -->
 <template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="作者名称" prop="authorName">
            <el-input
               v-model="queryParams.authorName"
               placeholder="请输入作者名称"
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
               @click="handleUpdate(2)"
               v-hasPermi="['manage:publisher:add']"
            >新增</el-button>
         </el-form-item>
      </el-form>
      
      <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
         <el-table-column label="头像" align="center" fixed="left" width="70"  >
            <template #default="scope">
                <el-image
                    style="width: 50px; height: 50px"
                    :src="scope.row.profilePictureUrl"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    fit="cover"
                /> 
            </template>
         </el-table-column>
         <el-table-column label="作者名称" align="center" fixed="left" prop="authorName"  width="200" :show-overflow-tooltip="true"/>
         <!-- <el-table-column label="联系电话" align="center" prop="phone"  width="200" :show-overflow-tooltip="true"/> -->
         <!-- <el-table-column label="所属学校" align="center" prop="phone"  width="200" :show-overflow-tooltip="true"/> -->
         <el-table-column label="简介" align="center" prop="authorBlurb" :show-overflow-tooltip="true"/>
         

         <!-- <el-table-column label="是否开通" align="center" prop="status">
            <template #default="scope">
               <dict-tag :options="start_stop" :value="scope.row.status" />
            </template>
         </el-table-column> -->

  
         <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width" fixed="right">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(1,scope.row)" v-hasPermi="['manage:publisher:edit']">修改</el-button>
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
import { authorListApi,authorDelApi } from "@/api/press/author"

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
  authorListApi(queryParams.value).then(response => {
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
    currentId.value = row?.authorId || "";

    switch(type){
        case 1:// 编辑
            editType.value = 'edit'
            title.value = "修改作者信息";
            open.value = true;
        break;
        case 2:// 新增
            editType.value = 'add'
            title.value = "新增作者";
            open.value = true;
        break; 
        case 3:// 删除
            proxy.$modal.confirm('是否确认删除？').then(()=> {
                return authorDelApi(currentId.value);
            }).then(() => {
                getList();
                proxy.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        break;


    }

}
 


getList();
</script>