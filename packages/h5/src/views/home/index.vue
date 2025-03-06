<!-- 书城 -->
<template>
  <div id='home' class='w-full h-full'>
    <div
        class="h-contain w-full h-full  px-[1rem]"
        id='h-contain'
        :style="{
            ...(topOut ? {} : BGA_STYLE),
        }"
    >
        <img v-show="topOut" :src="COS_BG2"
            style="position: fixed;top:0;z-index: 1;"
         class="w-full bg-white h-[6.13rem] z-1 left-0 right-0" alt="">

        <div class="w-full pl-[1.37rem] flex items-center justify-between translate-y-[2rem]	">
            <img class="w-[10.38rem] h-[4.5rem] " :src="COSBASE + '/hbook/heelowdy.png'" alt="">
            <img class="w-[7.3rem] h-[9.45rem]" :src="COSBASE + '/hbook/people.png'" alt="">
        </div>

        <van-cell-group inset class="!m-0 hhome-search" id="homeS">
            <van-field
                v-model="searchText"
                clearable
                label=""
                left-icon="music-o"
                placeholder="输入书名/作者搜索"
            />
        </van-cell-group>

        <card1></card1>
        <card2></card2>
        <card3></card3>

        <div class="h-[5rem]"></div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, reactive,ref } from "vue";
import GridPatternDashed from "@/components/grid-pattern/grid-pattern-dashed.vue";
import { COS_BASE,BGA_STYLE,COS_BG2 } from "@/utils/const"
import card1 from './card/card1.vue'
import card2 from './card/card2.vue'
import card3 from './card/card3.vue'
defineOptions({
  name: "books"
});
const COSBASE = ref(COS_BASE)

const searchText = ref("")

const topOut = ref(false)

onMounted(() => {
    // 获取输入框元素
    const inputElement = document.getElementById('homeS');
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    console.log("监听1滚动")

        // 获取元素
        const hBContain = document.getElementById('h-contain');
        // 获取元素
        const homeS = document.getElementById('homeS');

        // 监听滚动事件
        hBContain.addEventListener('scroll', function() {
            // console.log('元素正在滚动');
            
            // 获取元素的位置信息
            const rect = homeS.getBoundingClientRect();
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
#home{
  .h-contain{
    height: 100%;
    overflow-y: auto;
    .bcard{
      background: #FFFFFF;
      border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
      padding: 0.75rem 0 0.75rem 1rem;
      box-sizing: border-box;
      margin-top: .69rem;
      .bcard-head{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .75rem;
        & > p{
          font-weight: 800;
          font-size: 1.25rem;
          color: #0F1214;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
        & > span{
          font-weight: 400;
          font-size: 0.81rem;
          color: #6A6D75;
          text-align: center;
          font-style: normal;
          text-transform: none;
          margin-right: 0.56rem;
          align-items: center;
          display: flex;
          & > img{
            // width: 0.51rem;
            height: 1rem;
          }
        }
      }
    }
    .hhome-search{
        position: sticky;
        top: 2.13rem;
        z-index: 2;
    }

  }
}
</style>