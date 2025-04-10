<!-- 图书订单 -->
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
         <!-- <el-form-item label="购买时间" prop="name">
            <el-date-picker
               v-model="queryParams.name"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="截止时间"
                :size="size"
            />
         </el-form-item> -->
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
         </el-form-item>
      </el-form>
      
      <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange"> 
         <el-table-column label="书籍名称" align="center" fixed="left" prop="bookName"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="购买人" align="center" prop="userName"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="购买数量" align="center" prop="count"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="创建时间" align="center" prop="createTime"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="支付金额" align="center" prop="paymentAmount"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="购买方式" align="center" prop="buyWay"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="购数码/订单编号" align="center" prop="orderNo" :show-overflow-tooltip="true"/>
        
        
         <!-- <el-table-column label="处理人" align="center" prop="phone"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="处理时间" align="center" prop="phone"  width="200" :show-overflow-tooltip="true"/>
         <el-table-column label="处理意见" align="center" prop="phone"  width="200" :show-overflow-tooltip="true"/> -->

         <!-- <el-table-column label="是否开通" align="center" prop="status">
            <template #default="scope">
               <dict-tag :options="start_stop" :value="scope.row.status" />
            </template>
         </el-table-column> -->

  
         <!-- <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
            <template #default="scope">
               <el-button link type="primary" icon="CircleCloseFilled" @click="handleUpdate(2,scope.row)" v-hasPermi="['manage:publisher:TurnOff']">退款</el-button>
            </template>
         </el-table-column> -->
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
import { orderListApi,orderDelApi } from "@/api/press/order"

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
  orderListApi(queryParams.value).then(response => {
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
        case 1:// 编辑基础数据
            editType.value = 'resolve'
            title.value = "同意意见";
            open.value = true;
        break;
        case 2:// 新增图书
            editType.value = 'reject'
            title.value = "驳回意见";
            open.value = true;
        break; 

    }

}
 

getList();
</script>