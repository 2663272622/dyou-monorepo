<!-- 书城 -->
<template>
  <div id='hBooks' class='w-full h-full'>
    <div
        class="hB-contain w-full   pb-[5rem]"
        id="hB-contain"
        :style="{
            ...(topOut ? {} : BGA_STYLE),
            
        }"
    >
    <!--  -->
        <h1 class="hbooks-totle">我的书架</h1>
        <img v-show="topOut" :src="COS_BG2"
            style="position: fixed;top:0;z-index: 1;"
         class="w-full bg-white h-[6.13rem] z-1 left-0 right-0" alt="">
        <van-cell-group inset class="!m-0 hhomes-search !mb-[1rem]" id="hbookS">
            <van-field
                v-model="searchText"
                clearable
                label=""
                left-icon="music-o"
                placeholder="输入书名/作者搜索"
            /> 
        </van-cell-group>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <van-cell  v-for="item in list" :key="item" class="hbook-cell">
                    <img src="https://ww3.sinaimg.cn/mw690/005Dg9pggy1hstip8bi5zj31pk3pcnpd.jpg" alt="">
                    <div>
                        <p>中小学生数字教材中小学生数字教材</p>
                        <span>张三</span>
                    </div>
                </van-cell>
            </van-list>
        </van-pull-refresh>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import GridPatternDashed from "@/components/grid-pattern/grid-pattern-dashed.vue";
import { COS_BASE,BGA_STYLE,COS_BG2 } from "@/utils/const"
defineOptions({
  name: "books"
});

const searchText = ref("")
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const onLoad = () => {
    setTimeout(() => {
        if (refreshing.value) {
            list.value = [];
            refreshing.value = false;
        }

        for (let i = 0; i < 10; i++) {
            list.value.push(list.value.length + 1);
        }
        loading.value = false;

        if (list.value.length >= 40) {
            finished.value = true;
        }
    }, 1000);
};
    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
      onLoad();
    };

    const topOut = ref(false)

    onMounted(() => {
        // 获取输入框元素
        const inputElement = document.getElementById('hbookS');
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        console.log("监听1滚动")

            // 获取元素
            const hBContain = document.getElementById('hB-contain');
            // 获取元素
            const hbookS = document.getElementById('hbookS');

            // 监听滚动事件
            hBContain.addEventListener('scroll', function() {
                // console.log('元素正在滚动');
                
                // 获取元素的位置信息
                const rect = hbookS.getBoundingClientRect();
                // 获取距离页面顶部的距离
                const distanceToTop = rect.top + window.scrollY;

                if(rootFontSize* 2.13 <= distanceToTop){
                    console.log("小雨")
                    topOut.value = false
                }else{
                    console.log("大于")
                    topOut.value = true
                }
                
            });
    })
</script>


<style lang="less">
#hBooks{
    background-color: #F6F8FB;
  .hB-contain{
    padding: 0 1.06rem;
    box-sizing: border-box;
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    .hbooks-totle{
        font-weight: 400;
        font-size: 1.88rem;
        color: #000000;
        line-height: 2.2rem;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-bottom: 1.56rem;
        padding-top: 2.56rem;
    }
    .hhomes-search{
        position: sticky;
        top: 2.13rem;
        z-index: 2;
    }
    .van-list{
        background-color: #fff;
        border-radius: .4rem;
    }
    .hbook-cell{
        padding:.5rem;
        border-radius: .25rem;
        box-sizing: border-box;
        // margin-bottom:.75rem;
        .van-cell__value{
            border-radius: .25rem; 
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            & > img{
                width: 5.48rem;
                min-width: 5.48rem;
                aspect-ratio: 1 / 1;
                border-radius: .25rem;
            }
            & > div{
                margin-left: 1.44rem;
                
                overflow: hidden;
                width: 100%;
                    display: flex
                ;
                    flex-direction: column;
                & > p{
                    margin-bottom: .13rem;
                    font-weight: 800;
                    font-size: 1rem;
                    color: #0F1214;
                    line-height: 1.17rem;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap; 
                }
                & > span{
                    font-weight: 400;
                    font-size: 0.75rem;
                    color: #A6A6A6;
                    line-height: 0.88rem;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                }
            }
        }
    }
    .van-list__finished-text{
        margin-bottom:5rem;
    }
  }
}
</style>