<template>
    <div id="dyEditor">
        <div class="dye-head">
        </div>
        <el-row :gutter="10"  class="dye-body">
            <el-col  class="dyeb-l-col" :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
                <eLeft></eLeft>
            </el-col>
            <el-col  class="dyeb-c-col" :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
                <eCenter></eCenter>
            </el-col>
            <el-col  class="dyeb-r-col" :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
                <eRight></eRight>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import eCenter from './model/e-center.vue'
import eRight from './model/e-right.vue'
import eLeft from './model/e-left.vue'
</script>
<style lang='scss'>
#dyEditor{
    width: 100%;
    height:100%;
    position: relative;
    overflow: hidden;
    $headHeight:100px;
    .dye-head{
        width: 100%;
        height: $headHeight;
        background-color: #ccc;
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