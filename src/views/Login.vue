<template>
  <div class="login-container">
    <!-- 顶部留白区域 -->
    <div class="header-space">
      <div class="header-icon">
        <img src="../assets/logo-1.png" alt="Logo Icon" class="logo-icon" />
      </div>
    </div>
    <div class="login-box">
      <h2>临床专病信息管理系统</h2>

      <!-- 身份选择区域 -->
      <div class="role-select">
        <span
          :class="{ selected: role === 'doctor' }"
          @click="role = 'doctor'"
        >{{ role === 'doctor' ? '✓ 医生登录' : '医生登录' }}</span>
        <span
          :class="{ selected: role === 'patient' }"
          @click="role = 'patient'"
        >{{ role === 'patient' ? '✓ 患者登录' : '患者登录' }}</span>
      </div>

      <div class="login-form">
        <div class="form-item">
          <label>用户名</label>
          <input type="text" v-model="username" placeholder="请输入用户名">
        </div>
        <div class="form-item">
          <label>密码</label>
          <input type="password" v-model="password" placeholder="请输入密码">
        </div>
        <div class="form-item remember">
          <label class="remember-label">
            <input type="checkbox" v-model="remember">
            <span>记住我</span>
          </label>
          <a href="#" class="forget-pwd">忘记密码?</a>
        </div>
        <button class="login-btn" @click="handleLogin">登录</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginCreate } from '@/api/login.ts'

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const remember = ref(false)
    const role = ref<'doctor' | 'patient'>('doctor') // 身份状态

    const handleLogin = async () => {
      const res = await loginCreate({
        username: username.value,
        password: password.value,
        role: role.value, // 将角色传给后端
      })
      if (res.data.code === 200 && res.data.data) {
        ElMessage.success('登录成功')
        localStorage.setItem('userLoginStatus', res.data.access)
        router.push({ path: '/dashboard' })
      } else {
        ElMessage.error('账号密码错误，请重试')
      }
    }

    return {
      username,
      password,
      remember,
      role,
      handleLogin
    }
  }
})
</script>

<style scoped lang="scss">
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: url('../assets/hello.png') no-repeat center center;
  background-size: cover;
  justify-content: center;
  align-items: center;
}

.header-space {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  padding-left: 40px;
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 0;
  left: 0;
}

.header-icon {
  .logo-icon {
    width: auto;
    height: 100px;
  }
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
    font-weight: bold;
  }

  .role-select {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;

    span {
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;
      color: #7F265B;
      border: 1px solid transparent;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(127, 38, 91, 0.1);
      }

      &.selected {
        border: 1px solid #7F265B;
        background-color: rgba(127, 38, 91, 0.1);
        font-weight: bold;
      }
    }
  }

  .login-form {
    .form-item {
      margin-bottom: 20px;

      label {
        display: block;
        margin-bottom: 8px;
        color: #7F265B;
        font-size: 14px;
      }

      input[type='text'],
      input[type='password'] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        outline: none;
        font-size: 14px;
        color: #7F265B;

        &:focus {
          border-color: #7F265B;
        }

        &::placeholder {
          color: #7F265B;
        }
      }
    }

    .remember {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;

      .remember-label {
        display: flex;
        align-items: center;
        margin: 0;

        input[type='checkbox'] {
          margin-right: 5px;
        }

        span {
          color: #7F265B;
          font-size: 14px;
        }
      }

      .forget-pwd {
        color: #7F265B;
        text-decoration: none;
        font-size: 14px;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .login-btn {
      width: 100%;
      padding: 12px;
      background: #7F265B;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;

      &:hover {
        background: #6b1f4d;
      }
    }
  }
}
</style>
