<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>


<style>
    .el-dialog__body{
        max-height: 75vh;
        overflow-y: auto;
        overflow-x: hidden;
    } 
    
    *{
        margin:0;
        padding:0;
    }
</style>