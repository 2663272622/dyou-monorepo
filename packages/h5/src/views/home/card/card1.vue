<template>
  <div class="bcard card1">
    <div class="bcard-head">
        <p>精选书籍</p>
        <span>
            <!-- 查看更多
            <img :src="COS_RIGHT" alt="">  -->
        </span>
    </div>
    <div class="card1-content">
        <ul class="card1-btns">
            <li class="card1b-active">推荐</li>
            <li>电子信息</li>
            <li>计算机</li>
            <li>电器类</li>
            <li>机械制造</li>
        </ul>
        <ul class="card1-books">
            <li>
                <img src="http://47.99.82.108:9300/statics/2025/02/17/微信图片_20250217094620_20250217094709A250.jpg" alt="">
                <p>钢铁是怎样炼成的</p>
                <span>张三</span>
            </li>
            <li>
                <img src="http://47.99.82.108:9300/statics/2025/02/17/微信图片_20250217094620_20250217094709A250.jpg" alt="">
                <p>钢铁是怎样炼成的</p>
                <span>张三</span>
            </li>
            <li>
                <img src="http://47.99.82.108:9300/statics/2025/02/17/微信图片_20250217094620_20250217094709A250.jpg" alt="">
                <p>钢铁是怎样炼成的</p>
                <span>张三</span>
            </li>
            <li>
                <img src="http://47.99.82.108:9300/statics/2025/02/17/微信图片_20250217094620_20250217094709A250.jpg" alt="">
                <p>钢铁是怎样炼成的</p>
                <span>张三</span>
            </li>
            <li>
                <img src="http://47.99.82.108:9300/statics/2025/02/17/微信图片_20250217094620_20250217094709A250.jpg" alt="">
                <p>钢铁是怎样炼成的</p>
                <span>张三</span>
            </li>
        </ul>

        <div class="card1-b">
            查看更多
        </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { COS_BASE,COS_RIGHT } from "@/utils/const"


</script>

<style lang="less">
.card1-content{
    .card1-btns{
        width: 100%;
        scrollbar-width: none;
        overflow-x: auto;
        display: flex;
        justify-content: left;
        margin-bottom: .69rem;
        & > li{
            height: 1.88rem;
            width: max-content;
            min-width: max-content;
            padding: 0 .63rem;
            margin-right: .5rem;
            text-align: center;
            background: #F7F7F7;font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            font-size: 1rem;
            color: #6F6F6F;
            line-height: 1.17rem;
            text-align: center;
            font-style: normal;
            text-transform: none;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.38rem 0.38rem 0.38rem 0.38rem;
        }
        & > .card1b-active{
            color: #FFFFFF;
            background: linear-gradient( 270deg, #78BAE5 0%, #3984B5 97%);
        }
    }
    .card1-books{
        scrollbar-width: none; 
        width: 100%;
        overflow-x: auto;
        display: flex;
        justify-content: left;
        & > li{
            width: 5rem;
            display: flex;
            flex-direction: column;
            margin-right: .5rem;
            img{
                width: 100%;
                height: 6.75rem;
            }
            p{
                margin: .5rem 0;
                font-weight: 800;
                font-size: 0.88rem;
                color: #0F1214;
                line-height: 1.03rem;
                text-align: left;
                font-style: normal;
                text-transform: none;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap; 
            }
            span{
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap; 

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
    .card1-b{
        margin-top: 1.25rem;
        background: #F5F5F5;
        border-radius: 5.63rem 5.63rem 5.63rem 5.63rem;
        height: 2.5rem;
        display: flex;
        width: calc(100% - 1rem);
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 0.88rem;
        color: #7E7E7E;
        line-height: 1.03rem;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }
}
</style>