<template>
    <div id="dyEditor">
        <!-- <div class="dye-head">
        </div> -->
        <el-row :gutter="10"  class="dye-body">
            <el-col  class="dyeb-l-col" :xs="14" :sm="14" :md="8" :lg="6" :xl="5">
                <eLeft 
                    ref="leftRef"
                    @changeSection="changeSection"
                    :base="bookInfo"
                    :bookId="bookId"
                ></eLeft>
            </el-col>
            <el-col  class="dyeb-c-col" :xs="10" :sm="10" :md="16" :lg="18  " :xl="19">
                <eCenter
                    ref="centerRef"
                    :base="bookInfo"
                    :bookId="bookId"
                    :tinymceId="tinymceId"
                    v-model="sectionID"
                ></eCenter>
            </el-col>
            <!-- <eRight ref="rightRef"></eRight> -->
            <!-- <el-col  class="dyeb-r-col" :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
                <button v-if="!editDisabled" @click="setDisabled">只读</button>
                <button v-else @click="setDisabled">编辑</button>
                <button @click="hhhhh">获取数据</button>
                <button @click="sssss">设置数据</button>
                <button @click="wwwww">清空数据</button>
            </el-col> -->
        </el-row>
    </div>
</template>
<script setup>
    import eCenter from './model/e-center.vue'
    import eRight from './model/e-right.vue'
    import eLeft from './model/e-left.vue'
    import { randomId } from '@dy-monorepo/utils'
    import { bookAddApi,bookEditApi,bookbookApi,selectBookCategoryTreeApi } from "@/api/press/digitalTextbook"

    
    const route = useRoute();
    const router = useRouter();

    const leftRef = ref();
    const centerRef = ref();
    const rightRef = ref(); 

    // 章节ID
    const sectionID = ref()
    // 书ID
    const bookId = ref()
    const bookInfo = ref()

    const editDisabled = ref(false);

    // 切换书章节
    const changeSection = ()=>{

    }

    onMounted(()=>{
        bookId.value = route.query.bookId;
        getBookInfo()
    })

    // 获取书籍基本信息详情
    const getBookInfo = async()=>{
        // bookInfo
        const {data:binfo} = await bookbookApi(bookId.value)
        console.log('拉满',binfo)
        bookInfo.value = binfo
    }
 
    // 获取
    const hhhhh = ()=>{
        centerRef.value.getEditorContent()
    }
    // 清空
    const wwwww = ()=>{
        centerRef.value.clearEditor()
    }
    // 清空
    const sssss = ()=>{
        let val = `<p data-id="id-195b17e3d51dd25">+${Math.random()}</p>`
        console.log(val)
        centerRef.value.setEditor(  val)
    }
    // 清空
    const setDisabled = ()=>{
        editDisabled.value = !editDisabled.value
        console.log("装填",editDisabled.value)
        centerRef.value.setEditorDiasabled(editDisabled.value)
    }

    

    onMounted(() => {

        // 拦截关闭
        // window.addEventListener('beforeunload', function (event) {
        //     // 设置提示信息
        //     const message = "你确定要离开吗？未保存的更改将丢失。";
        //     // 现代浏览器（比如Chrome）不允许自定义提示内容，但依然会弹出确认框
        //     event.returnValue = message; // 在某些浏览器上，这行代码是必须的
        //     return message; // 在旧版浏览器中，这样可以显示自定义提示框
        // });

    })
</script>
<style lang='scss'>
#dyEditor{
    width: 100%;
    height:100%;
    position: relative;
    overflow: hidden;
    $headHeight:0px;
    .dye-head{
        width: 100%;
        height: $headHeight;
        background-color: #F5F8FA;
        overflow: hidden;
    }
    .dye-body{
        width: 100%;
        height: calc(100% - $headHeight);
        overflow: hidden; 
        margin-left: 0 !important;
        margin-right: 0 !important;
        .dyeb-l-col,.dyeb-c-col,.dyeb-r-col{
            height: 100%;
            position: relative;
            overflow: hidden;
        }
        .dyeb-l-col{
        }
        .dyeb-c-col{
        }
        .dyeb-r-col{
        }
    }
}
</style>