<template>
  <van-nav-bar
      :title="title"
      left-arrow
      :placeholder="placeholder"
      @click-left="onClickLeft"
      class="nav-bar"
      fixed
  >
    <template #left>
      <div class="back-icon">
        <van-icon name="arrow-left" class="arrow-left"/>
      </div>
    </template>
  </van-nav-bar>
</template>

<script setup>
import { defineProps,} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()
const props = defineProps({
  title: {
    type: String,
  },
  placeholder:{
    type:Boolean,
    default:true
  }
})

const onClickLeft = () => history.back();
</script>

<style scoped>
::v-deep.nav-bar {
  height: 3.38rem;

  .van-nav-bar__content {
    text-transform: none;
    height: 3.38rem;
  }

  .van-nav-bar__title {
    font-weight: 400;
    font-style:normal;
    font-family: Inter, Inter;
  }
}

.back-icon {
  font-size: 18px;

  .arrow-left {
    color: #000000;
  }
}
</style>