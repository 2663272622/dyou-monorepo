<template>
  <el-dialog :title="props.title" v-model="modelValue" width="40%" :close-on-click-modal="false"
             :close-on-press-escape="false" align-center append-to-body>
    <el-table :data="data">
      <el-table-column label="题型">
        <template #default="{row}">
          <dict-tag :options="topic_type" :value="row.questionType"/>
        </template>
      </el-table-column>
      <el-table-column label="题目数量">
        <template #default="{ row }">
          <el-input-number
              style="width: 110px"
              :min="0"
              :max="row.questionNum"
              v-model="row.num"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="分值">
        <template #default="{ row }">
            <el-input-number
                style="width: 110px"
                :min="0"
                v-model="row.score"
            ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="{row}">
          <el-button link type="info" size="small" @click="resetNum(row)">重置数量</el-button>
          <el-button link type="info" size="small" @click="resetScore(row)">重置分数</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {useVModel} from '@vueuse/core'
import DictTag from "@/components/DictTag/index.vue";

// 子组件代码如下 可同时修改父子组件的v-model值
const props = defineProps({
  modelValue: {// 双向绑定的值
    type: Boolean,
    default: "",
  },
  title: {
    type: [String],
    default: "随机生成"
  },
  data:{
    type:Object
  }
});
const emit = defineEmits(["update:modelValue", 'cancel', 'submit']);
const modelValue = useVModel(props, "modelValue", emit);


const {proxy} = getCurrentInstance();
const {topic_type} = proxy.useDict("topic_type");

const data = ref(props.data)

// 重置数量
const resetNum = (row) => {
  row.num = 0; // 将数量重置为0
};

// 重置分数
const resetScore = (row) => {
  row.score = 0; // 将分数重置为0
};

// 点击确认
const submitForm = () => {

}
// 点击取消
const cancel = () => {
  modelValue.value = false
}

</script>

<style lang="scss">

</style>