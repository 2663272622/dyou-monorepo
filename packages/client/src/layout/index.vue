<script setup lang="ts">
import tabbar from "@/components/tabbar/index.vue";
import NavBar from "@/components/nav-bar/index.vue";
import { useCachedViewStoreHook } from "@/store/modules/cached-view";
import { useDarkMode } from "@/composables/useToggleDarkMode";
import {computed, onMounted, ref} from "vue";

const tabbarDOM = ref()
const cachedViews = computed(() => {
  return useCachedViewStoreHook().cachedViewList;
});
onMounted(() => {
  console.log(tabbarDOM.value)
})
</script>

<template>
  <div class="app-wrapper">
    <van-config-provider :theme="useDarkMode() ? 'dark' : 'light'" class="w-full h-full">
      <!-- <nav-bar /> -->
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <tabbar ref="tabbarDOM" />
    </van-config-provider>
  </div>
</template>

<style lang="less" scoped>
@import "@/styles/mixin.less";

.app-wrapper {
  .clearfix();
  position: relative;
  height: 100%;
  width: 100%;
}
</style>

