<!-- 出版社管理 -->
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
       
        <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">


                
            <el-table-column label="书籍名称" align="center" fixed="left" prop="bookName"  width="200" :show-overflow-tooltip="true"/>
            <el-table-column label="审核人备注" align="center" prop="auditRemark"  width="200" :show-overflow-tooltip="true"/>
            <el-table-column label="出版社" align="center" prop="publishName"  width="200" :show-overflow-tooltip="true"/>
            
            <el-table-column label="提交人" align="center" prop="submitId"  width="200" :show-overflow-tooltip="true"/>
            <el-table-column label="提交人备注" align="center" prop="submitRemark"  width="200" :show-overflow-tooltip="true"/>
            <el-table-column label="提交时间" align="center" prop="submitDate"  width="200" :show-overflow-tooltip="true"/>
            <el-table-column label="审核时间" align="center" prop="auditDate"  width="200" :show-overflow-tooltip="true"/>
            <el-table-column label="终审人" align="center" prop="endAuditId"  width="200" :show-overflow-tooltip="true"/>
            <el-table-column label="终审人备注" align="center" prop="endRemark"  width="200" :show-overflow-tooltip="true"/>
          
            <el-table-column label="审核状态" align="center" prop="auditStatus" fixed="right">
                <template #default="scope">
                    <dict-tag :options="book_audit_status" :value="scope.row.auditStatus" />
                </template>
            </el-table-column>
 
   
            <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width" fixed="right">
                <template #default="scope"> 
                    <!-- 0撤回审核/未提交审核 1-待审 2-通过 3-驳回 4复核通过 -->
                     <template v-if="[1].includes(scope.row.auditStatus * 1)">
                         <el-button link type="primary" icon="Edit" @click="handleUpdate(1,scope.row)" v-hasPermi="['manage:publisher:edit']">通过</el-button>
                         <el-button link type="primary" icon="Edit" @click="handleUpdate(2,scope.row)" v-hasPermi="['manage:publisher:edit']">驳回</el-button>
                    </template>
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
 import { bookRecordListApi } from "@/api/press/bookReview"
 
 const { proxy } = getCurrentInstance();
 const { book_issue_status } = proxy.useDict("book_issue_status");
 const { book_audit_status } = proxy.useDict("book_audit_status");
 const { sch_teaching_level } = proxy.useDict("sch_teaching_level");
 
 
 
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
   bookRecordListApi(queryParams.value).then(response => {
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
     currentId.value = row?.bookId || ""; 
     switch(type){
         case 1:// 
             editType.value = 'resolve'
             title.value = "同意处理";
             open.value = true;
         break;
         case 2:// 
             editType.value = 'reject'
             title.value = "驳回处理";
             open.value = true;
         break; 
        //  case 7:// 提交审核
        //      proxy.$modal.confirm('是否确认提交审核？').then(()=> {
        //          return submitReviewApi({
        //              "bookId": currentId.value,
        //              // "bookStatus": "",
        //              // "auditStatus": "",
        //              // "auditRemark": "",
        //              "subStatus": "1" //1提交审核 2取消审核
        //          });
                 
        //      }).then(() => {
        //          getList();
        //          proxy.$modal.msgSuccess("操作成功");
        //      }).catch(() => {});
        //  break;
        //  case 8:// 取消审核
        //      proxy.$modal.confirm('是否确认取消？').then(()=> {
        //          return submitReviewApi({
        //              "bookId": currentId.value,
        //              // "bookStatus": "",
        //              // "auditStatus": "",
        //              // "auditRemark": "",
        //              "subStatus": "2" //1提交审核 2取消审核
        //          });
        //      }).then(() => {
        //          getList();
        //          proxy.$modal.msgSuccess("操作成功");
        //      }).catch(() => {});
        //  break;
 
 
     }
 
 }
  
 
 
 getList();
 </script>