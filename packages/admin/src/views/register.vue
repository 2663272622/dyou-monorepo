<template>
  <div class="register-container">
    <div class="register-box">
<!--      <div class="logo-title">点优智慧教育平台</div>-->
      <!-- 链接失效状态 -->
      <div v-if="linkInvalid" class="result-box">
        <el-result icon="error" title="链接已失效" sub-title="您访问的邀请链接无效或已过期"></el-result>
      </div>

      <!-- 申请成功状态 -->
      <div v-else-if="isRegistered" class="result-box">
        <el-result icon="success" title="申请成功" sub-title="您已成功注册并申请"></el-result>
      </div>

      <!-- 申请表单 -->
      <template v-else>
        <div class="logo-title">点优智慧教育平台</div>

        <el-form ref="registerRef" :model="form" :rules="rules" :size="isMobile ? 'large' : 'default'">
          <el-form-item prop="nickName">
            <el-input v-model="form.nickName" placeholder="请输入姓名" :prefix-icon="User"/>
          </el-form-item>

          <el-form-item prop="userName">
            <el-input v-model="form.userName" placeholder="请输入手机号码" :prefix-icon="Iphone"/>
          </el-form-item>


            <el-form-item prop="password">
              <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password :prefix-icon="Lock"/>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input v-model="form.confirmPassword" type="password" placeholder="请确认密码" show-password :prefix-icon="Lock"/>
            </el-form-item>


          <!-- 验证码申请 -->

            <el-form-item prop="code">
              <div class="verify-code-box">
                <el-input v-model="form.code" placeholder="请输入短信验证码" :prefix-icon="ChatRound"/>
                <el-button color="#477efc" class="code-btn" :disabled="isCountingDown" @click="sendcode">
                  {{ countDownText }}
                </el-button>
              </div>
            </el-form-item>

          <el-form-item>
            <el-button type="primary" class="submit-btn" :loading="loading" @click="handleSubmit">申请</el-button>
          </el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { inviteRegister, getCode} from '@/api/register/register.js'

import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Iphone,ChatRound } from '@element-plus/icons-vue'

const route = useRoute();
const router = useRouter();

const { proxy } = getCurrentInstance();

// 响应式状态
const isMobile = ref(window.innerWidth <= 768)
const isRegistered = ref(false)
const loading = ref(false)
const countDown = ref(0)
const registerRef = ref(null)
const linkInvalid = ref(false)

// 表单数据
const form = ref({
  // userName: '',
  // password: '',
  // confirmPassword: '',
  // code: '',
})

// 表单验证规则
const rules = {
  nickName: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
  ],
  userName: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度应为4位', trigger: 'blur' }
  ]
}

// 计算属性
const countDownText = computed(() => {
  return countDown.value > 0 ? `${countDown.value}秒后重新发送` : '发送验证码'
})

const isCountingDown = computed(() => countDown.value > 0)

// 方法
const checkInviteLink = async () => {

  try {
    const inviteCode = route.query.uuid
    // console.log(inviteCode)
    // if (!inviteCode) {
    //   linkInvalid.value = true
    //   return
    // }

    // TODO: 调用API检查邀请链接是否有效
    // const result = await checkTeacherStatus(inviteCode)
    // if (!result.valid) {
    //   linkInvalid.value = true
    //   return
    // }
    // isRegistered.value = result.isRegistered

  } catch (error) {
    linkInvalid.value = true
  }
}

const sendcode = async () => {
  if (!form.value.userName) {
    ElMessage.warning('请先输入手机号')
    return
  }

  try {
    // TODO: 调用发送验证码API
    await getCode({phone:form.value.userName})

    countDown.value = 60
    const timer = setInterval(() => {
      countDown.value--
      if (countDown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    ElMessage.success('验证码已发送')
  } catch (error) {
    ElMessage.error('验证码发送失败')
  }
}

const handleSubmit = async () => {
  if (!registerRef.value) return
  await  proxy.$refs.registerRef.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // TODO: 调用申请API
        const data = {
          ...form.value,
          uuid: route.query.uuid,
        }
        console.log(route)
        console.log(form.value)
        console.log(data)
       const res = await inviteRegister(data);
        if (res.code == 200){
          isRegistered.value = true
          ElMessage.success('申请成功')
        }
      } catch (error) {
        ElMessage.error('申请失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 监听窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  checkInviteLink()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
 /* background-color: #F1F6FF;*/
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.register-box {
  width: 100%;
  max-width: 400px;
  padding: 30px 0;
  background: #fff;
  border-radius: 10px;
  /*  box-shadow: grey;*/
}

.logo-title {
  text-align: center;
  margin: 20px 0;
  position: relative;
  padding: 0 20px;
  font-family: Source Han Sans CN, Source Han Sans CN;
  font-weight: bold;
  font-size: 20px;
  color: #333333;
}

.logo-title::before {
  content: '';
  position: absolute;
  top: 50%;
  width: 90px;
  height: 2px;
  background: linear-gradient( 90deg, rgba(255,255,255,0.1) 6%, rgba(78,111,244,0.7) 86%);
  border-radius: 1px 1px 1px 1px;
}

.logo-title::after{
  content: '';
  position: absolute;
  top: 50%;
  width: 90px;
  height: 2px;
  background: linear-gradient( 90deg, rgba(78,111,244,0.7) 7%, rgba(255,255,255,0.1) 100%);
  border-radius: 1px 1px 1px 1px;
}

.logo-title::before {
  left: 20px;
}

.logo-title::after {
  right: 20px;
}

/* 表单样式 */
:deep(.el-form) {
  padding: 0 35px;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #dcdfe6;
  border-radius: 0;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
  border-color: #477EFC;
}

:deep(.el-input__inner) {
  height: 40px;
}

.verify-code-box {
  display: flex;
  gap: 10px;
}

.verify-code-box .el-input {
  flex: 1;
}

.code-btn {
  border-radius: 10px;
  padding: 0 15px;
}

.submit-btn {
  width: 100%;
  height: 45px;
  background: #477EFC;
  border-radius: 6px 6px 6px 6px;
}

.result-box {
  text-align: center;
  padding: 20px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .register-container {
   /* padding: 0;*/
/*    background: #fff;*/
  }

  .register-box {
    padding: 20px 0;
  }

  :deep(.el-form) {
    padding: 0 20px;
  }
}

:deep(.el-checkbox__label) {
  font-size: 12px;
  color: #606266;
}

/* 验证码按钮样式 */
.code-btn {
  border-radius: 0;
  padding: 0 15px;
  height: 40px;
  font-size: 14px;
  white-space: nowrap;
}

/* 成功发送验证码提示 */
:deep(.el-message--success) {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}

/* 移动端适配补充 */
@media screen and (max-width: 768px) {
  .code-btn {
    min-width: 120px;
  }
}
</style>
