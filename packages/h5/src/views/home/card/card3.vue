<template>
  <div class="bcard card2">
    <div class="bcard-head">
        <p>最新上架</p>
        <span>
            查看更多
            <img :src="COS_RIGHT" alt=""> 
        </span>
    </div>
    <ul class="card1-ul">
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
  </div>
</template>

<script lang="ts" setup>
import { COS_BASE,COS_RIGHT } from "@/utils/const"


</script>

<style lang="less">
.card1-ul{
    display: flex;
    flex-wrap: wrap;
    & > li{
        width: calc(33.33%  - .56rem);
        display: flex;
        flex-direction: column;
        margin-right: .56rem;
        margin-bottom: .69rem;
        & > img{
            width: 100%;
            height: 6.25rem;
            border-radius: 0.25rem 0.25rem 0.25rem 0.25rem;
        }
        & > p{
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
            margin: .5rem 0;
            margin-bottom: .19rem;;
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
</style>