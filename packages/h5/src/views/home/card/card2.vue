<template>
  <div class="bcard card2">
    <div class="bcard-head">
        <p>数字教材</p>
        <span>
            查看更多
            <img :src="COS_RIGHT" alt=""> 
        </span>
    </div>
    <div class="card2-contain w-full">
        <div class="card2-item">
            <img src="http://47.99.82.108:9300/statics/2025/02/17/微信图片_20250217094620_20250217094709A250.jpg" alt="">
            <div>
                <p>全国计算机等级考试全国计算机等级考试</p>
                <span>张三</span>
                <div>
                    <span>2.8万人在学习</span>
                    <p>试看</p>
                </div>
            </div>
        </div>
        <div class="card2-item">
            <img src="http://47.99.82.108:9300/statics/2025/02/17/微信图片_20250217094620_20250217094709A250.jpg" alt="">
            <div>
                <p>全国计算机等级考试全国计算机等级考试</p>
                <span>张三</span>
                <div>
                    <span>2.8万人在学习</span>
                    <p>试看</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { COS_BASE,COS_RIGHT } from "@/utils/const"


</script>

<style lang="less">
.card2-contain{
    .card2-item{
        display: flex;
        width:100%;
        overflow:hidden;
        justify-content: space-between;
        margin-bottom: .75rem;
        & > img{
            width: 6.22rem;
            height: 6.22rem;
            border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
        }
        & > div{
            width: 100%;
            overflow:hidden;
            position: relative;
            margin:0 .81rem;
            & > p {
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap; 
                font-weight: 800;
                font-size: 1rem;
                color: #0F1214;
                line-height: 1.17rem;
                text-align: left;
                font-style: normal;
                text-transform: none;
            }
            & > span{
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
            & > div{
                display: flex;
                justify-content: space-between;
                position: absolute;
                bottom:0;
                width: 100%;
                & > span{
                    font-weight: bold;
                    font-size: 0.75rem;
                    color: #A6A6A6;
                    line-height: 0.88rem;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                }
                & > p{
                    font-weight: bold;
                    font-size: 1rem;
                    color: #3984B5;
                    line-height: 1.17rem;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                }
            }
        }
    }
}
</style>