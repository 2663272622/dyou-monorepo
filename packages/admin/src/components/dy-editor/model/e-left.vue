<template>
    <div id="dyeb-lc">
        <div class="dyebc-top">
            <img :src="bookInfo.coverUrl" alt="">
            <div>
                <h2>{{ bookInfo.bookName }}</h2>
                <p>{{ bookInfo.authorName }}</p>
            </div>
        </div>
        <div  class="dyebc-content">
            <div class="dyebc-edit">
                <div class="dyebc-search">
                    <span>关键词</span>
                    <el-input v-model='filterText' style="width: 100%" placeholder="查询目录" :suffix-icon="Search" />
                </div>
                <div class="dyebc-btn">
                    <div class="dyebc-btn1">
                        <el-button type="primary" :icon="Plus" @click="handleNode('a')">新增</el-button>
                        <el-button type="primary" :icon="RefreshRight"  @click="getBookCatalogTree" plain>刷新</el-button>
                    </div>
                    <p @click="handleNode('f')">设置为试读</p>
                    <!-- <el-button type="primary" :icon="DeleteFilled"  @click="handleNode('d')" plain>删除</el-button> -->
                </div>
            </div>
            <div class="dyebc-tree">
                <el-tree
                    ref="treeRef"
                    style="width:100%"
                    :data="catalogTree"
                    show-checkbox
                    :filter-node-method="filterNode"
                    default-expand-all
                    node-key="catalogId"
                    highlight-current
                    :props="defaultProps"
                    @node-click="(r)=>handleNode('e',r)"
                >
                    <template #default="{ node, data }">
                        <div class="custom-tree-node">
                            <p class="node-label">
                                <span>{{ node.label }}</span>
                                <div class="freenode" v-show="data.isFree == '2'">
                                    免费
                                </div>
                            </p>
                            
                            <div>
                                
                                <el-dropdown @command="(command)=>handleNode(command,data)">
                                    <el-icon><More /></el-icon>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <!-- <el-dropdown-item command="a">新增根目录</el-dropdown-item>  -->
                                            <el-dropdown-item command="b">新增子目录</el-dropdown-item> 
                                            <el-dropdown-item command="c">编辑目录</el-dropdown-item> 
                                            <el-dropdown-item v-if="data.isFree == '2'" command="c">编辑目录</el-dropdown-item> 
                                            
                                            <el-dropdown-item command="d">删除目录</el-dropdown-item> 
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                        </div>
                    </template>
                </el-tree>
            </div>
        </div>
        
        
 
        <!-- 编辑目录 -->
       <editView
            v-model="open"
            :type="editType"
            :title="title"
            :id="currentId"
            :pid="parentId"
            :bookId="props.bookId"
            @cancel="()=>{}"
            @submit="()=>{getBookCatalogTree()}"
       ></editView>
    </div>
</template>
<script setup>

import { ref } from 'vue'
import { ElButton } from 'element-plus' 
import editView from './edit'
import {  Search,DeleteFilled,Plus,RefreshRight } from '@element-plus/icons-vue'

import { bookcatalogTreefApi,catalogDelApi,catalogTApi } from "@/api/press/digitalTextbook"
const { proxy } = getCurrentInstance();
    
const route = useRoute();
const router = useRouter();

const props = defineProps({
    bookId:{
        type:[String],
        default:''
    },
    base:{
        type:[Object],
        default:{}
    },
})

const bookInfo = computed(()=>props.base)


const defaultProps = {
  children: 'children',
  label: 'catalogName',
  value:"catalogId"
}

const currentCatalogId = ref()

watch(()=>props.bookId,()=>{

    props.bookId != '' && getBookCatalogTree()
},{immediate:true})


const filterText = ref('')
watch(filterText, (val) => {
  treeRef.value.filter(val)
})
const filterNode = (value, data) => {
  if (!value) {
    return true
  } 
  return data.catalogName.includes(value)
}


// 获取书籍目录
const catalogTree = ref([])
const getBookCatalogTree = async()=>{
    const {data} = await bookcatalogTreefApi({bookId:props.bookId})
    catalogTree.value = data
    console.log("书籍目录",data)


    if(route.query.catalogId){
        currentCatalogId.value = route.query.catalogId
    }else if(Array.isArray(data) && data.length>0){
        currentCatalogId.value = data[0].catalogId
    }
    if(currentCatalogId.value){
        setTimeout(()=>{
            nextTick(()=>{
                treeRef.value.setCurrentKey(currentCatalogId.value, true)
                  handleNode('e',{
                    catalogId:currentCatalogId.value
                })
            })
        },500)
    }
}



const open = ref(false);
const title = ref("");
const editType = ref("")
const currentId = ref("")
const parentId = ref("")
const treeRef = ref("")
const handleNode = (command,data)=>{
    currentId.value = data ? data.catalogId : '';
    parentId.value = null;

    switch(command){
        case 'a':// 新增根目录
            title.value = '新增目录'
            editType.value = 'add'
            open.value = true
        break;
        case 'b':// 新增子目录
            open.value = true
            currentId.value = null;
            parentId.value = data.catalogId
            editType.value = 'add'
        break;
        case 'c':// 编辑目录
            open.value = true
            editType.value = 'edit'
        break;
        case 'd':// 删除目录 
             proxy.$modal.confirm('是否确认删除？').then(()=> {
                 return catalogDelApi(currentId.value);
             }).then(() => {
                getBookCatalogTree();
                 proxy.$modal.msgSuccess("删除成功");
             }).catch(() => {});
        break;
        case 'e':// 单机目录
             router.replace({
                name:route.name,
                query:{
                    ...route.query,
                    catalogId:data.catalogId
                }
             })
        break;
        case 'f':// 试读
            const check = treeRef.value.getCheckedNodes(false,true)
            let prams = []
            check.map(i=>{
                prams.push({
                    ...i,
                    isFree:'2'
                })
            })
            if(prams.length == 0){
                proxy.$modal.msgSuccess("请先选择目录");
                return;
            }
             proxy.$modal.confirm('是否确认设置为试读？').then(()=> {
                return catalogTApi(prams)
             }).then(() => {
                getBookCatalogTree();
                 proxy.$modal.msgSuccess("操作成功");
             }).catch(() => {});

        break;
    }
}

// const data  = [
//   {
//     id: 1,
//     label: 'Level one 1',
//     children: [
//       {
//         id: 4,
//         label: 'Level two 1-1',
//         children: [
//           {
//             id: 9,
//             label: 'Level three 1-1-1',
//           },
//           {
//             id: 10,
//             label: 'Level three 1-1-2',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 2,
//     label: 'Level one 2',
//     children: [
//       {
//         id: 5,
//         label: 'Level two 2-1',
//       },
//       {
//         id: 6,
//         label: 'Level two 2-2',
//       },
//     ],
//   },
//   {
//     id: 3,
//     label: 'Level one 3',
//     children: [
//       {
//         id: 7,
//         label: 'Level two 3-1',
//       },
//       {
//         id: 8,
//         label: 'Level two 3-2',
//       },
//     ],
//   },
// ]


</script>
<style lang='scss'>
#dyeb-lc{

    width: 100%;
    height: 100%;
    overflow: hidden;
    padding:30px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .dyebc-top{
        $hheihgt:109px;
        $pbtoom:38px;
        box-sizing: content-box;
        display: flex;
        height: $hheihgt;
        min-height:calc( $hheihgt + $pbtoom);
        border-bottom:1px solid #EDF1F4;
        padding-bottom:$pbtoom;
        margin-bottom:30px;
        box-sizing: border-box;
        & > img{
            width: 82px;
            min-width: 82px;
            margin-right:16px;
            height: $hheihgt;
            min-height: $hheihgt;
            border-radius: 2px 2px 2px 2px;
        }
        & > div{
            height: 100%;
            width: 100%;
            p,h2{
                margin:0;
            }
            h2{
                font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20;
                font-weight: 500;
                font-size: 18px;
                color: #1D2129;
                line-height: 30px;
                text-align: left;
                font-style: normal;
                text-transform: none;
                display: -webkit-box;          /* 使用 flexbox 布局 */
                -webkit-box-orient: vertical;  /* 设置为垂直方向 */
                -webkit-line-clamp: 2;         /* 限制显示2行 */
                overflow: hidden;              /* 隐藏溢出的内容 */
                text-overflow: ellipsis;       /* 在溢出的文本末尾显示省略号 */
            }
            p{
                font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20;
                font-weight: 400;
                font-size: 14px;
                color: #86909C;
                line-height: 36px;
                text-align: left;
                font-style: normal;
                text-transform: none;
            }
        }
    }
    .dyebc-content{
        height: 100%;
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .dyebc-edit{
            .dyebc-search{
                display: flex;
                align-items: center;
                margin-bottom:30px;
                & > span{
                    margin-right:16px;
                    width: 42px;
                    height: 22px;
                    min-width: max-content;
                    font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20;
                    font-weight: 400;
                    font-size: 14px;
                    color: #4E5969;
                    line-height: 22px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                }
            }
            .dyebc-btn{
                margin-bottom:30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                & > p{
                    height: 20px;
                    font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20;
                    font-weight: 400;
                    font-size: 14px;
                    color: #437AFC;
                    line-height: 20px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    cursor: pointer;
                }
                .dyebc-btn1{
                    width: max-content;
                }
            }
        }
        .dyebc-tree{
            height: 100%;
            overflow-y: auto;
            .el-tree{

                --el-tree-node-content-height:38px !important; 
                --el-tree-node-hover-bg-color:#EFF3FB;
                .el-tree-node__content:hover{
                    color: #4A8FF7;
                }
                .custom-tree-node {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                    padding-right: 8px;
                    width: 100%;
                    overflow: hidden;
                    .node-label{
                        display: flex;
                        
                        width: 80%;
                        overflow: hidden;
                        & > span{
                            display: inline-block;
                            width:max-content;
                            max-width: calc(100% - 50px);
                            overflow: hidden;
                            display: -webkit-box;          /* 使用 flexbox 布局 */
                            -webkit-box-orient: vertical;  /* 设置为垂直方向 */
                            -webkit-line-clamp: 1;         /* 限制显示2行 */
                            overflow: hidden;              /* 隐藏溢出的内容 */
                            text-overflow: ellipsis;       /* 在溢出的文本末尾显示省略号 */
                        }
                        .freenode{
                            margin: 0 12px;
                            width: 40px;
                            height: 20px;
                            display: flex; 
                            justify-content: center;
                            align-items: center;
                            background: #C9D9F7;
                            border-radius: 2px 2px 2px 2px;
                            font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20;
                            font-weight: 400;
                            font-size: 12px;
                            color: #4A8FF7;
                            line-height: 17px;
                            text-align: left;
                            font-style: normal;
                            text-transform: none;
                        }
                    }
                }
            }
            
        }
    }
}
</style>