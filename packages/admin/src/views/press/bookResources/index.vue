<!-- 图书资源管理 --><!-- 出版社管理 -->
 <template>
    <div class="app-container">
       <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="教材名称" prop="bookName">
             <el-input
                v-model="queryParams.bookName"
                placeholder="请输入教材名称"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
             />
          </el-form-item>  
          <el-form-item label="书籍作者" prop="author">
             <el-input
                v-model="queryParams.author"
                placeholder="请输入作者名称"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
             />
          </el-form-item>  
          <el-form-item label="书籍状态" prop="bookStatus">
             <el-select
                v-model="queryParams.bookStatus"
                placeholder="请选择书籍状态"
                clearable
                style="width: 240px"
             >
                <el-option
                   v-for="dict in book_issue_status"
                   :key="dict.value"
                   :label="dict.label"
                   :value="dict.value"
                />
             </el-select>
          </el-form-item>
          <el-form-item label="审核状态" prop="auditStatus">
             <el-select
                v-model="queryParams.auditStatus"
                placeholder="请选择审核状态"
                clearable
                style="width: 240px"
             >
                <el-option
                   v-for="dict in book_audit_status"
                   :key="dict.value"
                   :label="dict.label"
                   :value="dict.value"
                />
             </el-select>
          </el-form-item>
          <el-form-item>
             <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button> 
          </el-form-item>
       </el-form>
       
       <el-table  stripe  v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
          <el-table-column label="封面" align="center" fixed="left" width="70"  >
             <template #default="scope">
                 <el-image
                     style="width: 50px; height: 50px"
                     :src="scope.row.coverUrl"
                     :zoom-rate="1.2"
                     :max-scale="7"
                     :min-scale="0.2"
                     fit="cover"
                 /> 
             </template>
          </el-table-column>
          <el-table-column label="书籍名称" align="center" fixed="left" prop="bookName"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="书籍作者" align="center" prop="authorName"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="出版社" align="center" prop="publishName"  width="200" :show-overflow-tooltip="true"/>
          
          <el-table-column label="字数(万)" align="center" prop="wordCount"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="书籍定价" align="center" prop="listPrice"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="价格" align="center" prop="price"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="ISBN" align="center" prop="isbn"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="教学层次" align="center" prop="educationLevel"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="教材状态" align="center" prop="educationLevel"  >
             <template #default="scope">
                <dict-tag :options="sch_teaching_level" :value="scope.row.educationLevel" />
             </template>
          </el-table-column>
          <el-table-column label="标签" align="center" prop="tags"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="责任编辑电话" align="center" prop="editorPhone"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="出版日期" align="center" prop="publisxhDate"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="合作院校" align="center" prop="schoolName"  width="200" :show-overflow-tooltip="true"/>
          
          
          <el-table-column label="创建人" align="center" prop="createBy"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="创建时间" align="center" prop="createTime"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="修改人" align="center" prop="updateBy"  width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="修改时间" align="center" prop="updateTime"  width="200" :show-overflow-tooltip="true"/>
          
          <el-table-column label="教材状态" align="center" prop="bookStatus" fixed="right">
             <template #default="scope">
                <dict-tag :options="book_issue_status" :value="scope.row.bookStatus" />
             </template>
          </el-table-column>
          <el-table-column label="审核状态" align="center" prop="auditStatus" fixed="right">
             <template #default="scope">
                <dict-tag :options="book_audit_status" :value="scope.row.auditStatus" />
             </template>
          </el-table-column>
 
   
          <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
             <template #default="scope">
                 <el-button link type="primary" icon="Edit" @click="handleUpdate(1,scope.row)" v-hasPermi="['manage:publisher:edit']">文件</el-button>
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
 import { bookListApi,bookDelApi,upOrDownAddApi,submitReviewApi } from "@/api/press/digitalTextbook"
 
 const { proxy } = getCurrentInstance();
 const { book_issue_status } = proxy.useDict("book_issue_status");
 const { book_audit_status } = proxy.useDict("book_audit_status");
 const { sch_teaching_level } = proxy.useDict("sch_teaching_level");
 
 
 const route = useRoute();
 const router = useRouter();
 
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
   bookListApi(queryParams.value).then(response => {
     console.log("列表数据",response)
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
     currentId.value = row?.bookId || ""; 
     switch(type){
         case 1:// 编辑基础数据
             editType.value = 'edit'
             title.value = row.bookName;
             open.value = true;
         break; 
 
     }
 
 }
  
 
 
 getList();
 </script>