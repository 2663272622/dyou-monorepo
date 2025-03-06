<template>
  <van-tabbar v-model="active"  :placeholder="false" :route="true" fixed active-color="#3984B5">
    <van-tabbar-item
      v-for="(item, index) in tabbarData"
      :key="index"
      :to="item.to"
    >
      {{ item.title }}
        <template #icon="props">
            <!-- :icon="item.icon" -->
        <img :src="props.active ? item.active : item.inactive" />
        </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { COS_BASE,COS_LOGO,BG_STYLE } from "@/utils/const"

const active = ref(0);
const tabbarData = reactive([
  {
    icon: "gem-o",
    title: "我的书架",
    active:COS_BASE+'/tabbar/books1.png',
    inactive:COS_BASE+'/tabbar/books.png',
    to: {
      name: "books"
    }
  },
  {
    icon: "wap-home-o",
    title: "书城",
    active:COS_BASE+'/tabbar/mybook1.png',
    inactive:COS_BASE+'/tabbar/mybook.png',
    to: {
      name: "home"
    }
  },
  {
    icon: "user-o",
    title: "我的",
    active:COS_BASE+'/tabbar/my1.png',
    inactive:COS_BASE+'/tabbar/my.png',
    to: {
      name: "my"
    }
  }
]);
</script>
