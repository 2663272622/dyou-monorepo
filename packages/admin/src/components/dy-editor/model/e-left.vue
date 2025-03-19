<template>
    <div id="dyeb-lc">
        
        <el-tree
            style="max-width: 600px"
            :data="dataSource"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
        >
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    书籍目录
                    <!-- <span>{{ node.label }}</span>
                    <div>
                        <el-button type="primary" link @click="append(data)">
                        Append
                        </el-button>
                        <el-button
                        style="margin-left: 4px"
                        type="danger"
                        link
                        @click="remove(node, data)"
                        >
                        Delete
                        </el-button>
                    </div> -->
                </div>
            </template>
        </el-tree>
    </div>
</template>
<script setup>

import { ref } from 'vue'
import { ElButton } from 'element-plus' 
let id = 1000

const append = (data ) => {
  const newChild = { id: id++, label: 'testtest', children: [] }
  if (!data.children) {
    data.children = []
  }
  data.children.push(newChild)
  dataSource.value = [...dataSource.value]
}

const remove = (node , data ) => {
  const parent = node.parent
  const children = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  dataSource.value = [...dataSource.value]
}

const renderContent = (
  h,
  {
    node,
    data,
    store,
  }
) => {
  return h(
    'div',
    {
      class: 'custom-tree-node',
    },
    h('span', null, node.label),
    h(
      'div',
      null,
      h(
        ElButton,
        {
          type: 'primary',
          link: true,
          onClick: () => append(data),
        },
        'Append '
      ),
      h(
        ElButton,
        {
          type: 'danger',
          link: true,
          style: 'margin-left: 4px',
          onClick: () => remove(node, data),
        },
        'Delete'
      )
    )
  )
}

const dataSource = ref([
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
])
</script>
<style lang='scss'>
#dyeb-lc{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>