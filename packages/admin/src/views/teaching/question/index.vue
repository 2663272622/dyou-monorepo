<!-- 数字教材管理 -->
<template>
    <div class="app-container">
       <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        
        <el-form-item label="题库类型" prop="bankType">
             <el-select
                v-model="queryParams.bankType"
                placeholder="请选择题库类型"
                clearable
                style="width: 240px"
             >
                <el-option
                   v-for="dict in question_bank_type"
                   :key="dict.value"
                   :label="dict.label"
                   :value="dict.value"
                />
             </el-select>
          </el-form-item>  
        <el-form-item label="题目类型" prop="questionType">
             <el-select
                v-model="queryParams.questionType"
                placeholder="请选择题目类型"
                clearable
                style="width: 240px"
             >
                <el-option
                   v-for="dict in topic_type"
                   :key="dict.value"
                   :label="dict.label"
                   :value="dict.value"
                />
             </el-select>
          </el-form-item>  
          
        <!-- <el-form-item label="教材名称" prop="bookName">
             <el-input
                v-model="queryParams.bookName"
                placeholder="请输入教材名称"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
             />
          </el-form-item>   -->
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button
               type="primary"
               plain
               icon="Plus"
               @click="handleUpdate(1)"
               v-hasPermi="['manage:publisher:add']"
            >新增</el-button>
         </el-form-item> 
       </el-form>
       
       <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
        <el-table-column label="题库类型" align="center" prop="bankType"   width="150" >
             <template #default="scope">
                <dict-tag :options="question_bank_type" :value="scope.row.bankType" />
             </template>
          </el-table-column>
        <el-table-column label="题型" align="center" prop="questionType"   width="200" >
             <template #default="scope">
                <dict-tag :options="topic_type" :value="scope.row.questionType" />
             </template>
          </el-table-column>
        <el-table-column label="题目" align="center" prop="questionType"     >
             <template #default="scope">
                <p v-html="scope.row.questionText"></p>
             </template>
          </el-table-column>
          <!-- <el-table-column label="书籍名称" align="center" fixed="left" prop="bookName"  width="200" :show-overflow-tooltip="true"/> -->
          <!-- <el-table-column label="题目" align="left" prop="questionText" :show-overflow-tooltip="true"/> -->
 
   
            <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width" fixed="right">
                <template #default="scope"> 
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(2,scope.row)" v-hasPermi="['manage:publisher:edit']">编辑</el-button>
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(3,scope.row)" v-hasPermi="['manage:publisher:edit']">删除</el-button>
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
 import { questionGetApi,bankDelApi } from "@/api/teaching/question"

 const { proxy } = getCurrentInstance();
 const { book_issue_status } = proxy.useDict("book_issue_status");
 const { topic_type } = proxy.useDict("topic_type");
 const { question_bank_type } = proxy.useDict("question_bank_type");
 
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
 
 const queryParams = ref({
     pageNum: 1,
     pageSize: 10,
 })
 
 const bookId = ref("")
 bookId.value = route.query.bookId

 /** 查询列表 */
 function getList() {
   loading.value = true;
   queryParams.value.bookId = bookId.value;
   questionGetApi(queryParams.value).then(response => {
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
     // 保存row  id
     currentId.value = row?.questionId || ""; 
     switch(type){
         case 1:// 新增
             editType.value = 'add'
             title.value = "新增题目";
             open.value = true;
         break;
         case 2:// 编辑
             editType.value = 'edit'
             title.value = "编辑题目";
             open.value = true;
         break; 
         case 3:// 删除
             proxy.$modal.confirm('是否确认删除？').then(()=> {
                 return bankDelApi(currentId.value);
             }).then(() => {
                 getList();
                 proxy.$modal.msgSuccess("删除成功");
             }).catch(() => {});
         break; 
 
 
     }
 
 }
  
 
 
 getList();
 </script>