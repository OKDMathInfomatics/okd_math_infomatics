<template>
  <div class="admin-login">
    <div class="login-card card">
      <div class="login-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h1 class="login-title">管理者ログイン</h1>
      <p class="login-desc">奥田専用ページです。パスワードを入力してください。</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="field">
          <label for="password">パスワード</label>
          <input
            id="password"
            v-model="password"
            :type="showPass ? 'text' : 'password'"
            placeholder="パスワードを入力"
            autocomplete="current-password"
            autofocus
          />
          <button type="button" class="toggle-pass" @click="showPass = !showPass">
            {{ showPass ? '隠す' : '表示' }}
          </button>
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="btn btn-primary login-btn" :disabled="loading">
          <span v-if="loading">認証中...</span>
          <span v-else>ログイン</span>
        </button>
      </form>

      <p class="login-note">
        ※このページのパスワードはソースコードに含まれるため、<br />
        完全な秘密保護ではなく「誤操作防止」を目的としています。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  if (!password.value) {
    errorMsg.value = 'パスワードを入力してください'
    return
  }
  loading.value = true
  errorMsg.value = ''

  try {
    const success = await login(password.value)
    if (success) {
      const redirect = route.query.redirect || '/admin/dashboard'
      router.push(redirect)
    } else {
      errorMsg.value = 'パスワードが正しくありません'
    }
  } catch {
    errorMsg.value = 'エラーが発生しました。もう一度お試しください'
  } finally {
    loading.value = false
    password.value = ''
  }
}
</script>

<style scoped>
.admin-login {
  display: flex;
  justify-content: center;
  padding: var(--space-10) 0;
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: var(--space-8);
  text-align: center;
}

.login-icon {
  width: 64px;
  height: 64px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
}

.login-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-2);
}
.login-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-6);
}

.login-form { text-align: left; }
.field {
  margin-bottom: var(--space-4);
  position: relative;
}
.field label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--color-text);
}
.field input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  padding-right: 60px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  font-size: var(--font-size-base);
  outline: none;
  font-family: var(--font-sans);
  transition: border-color 0.15s;
}
.field input:focus {
  border-color: var(--color-primary);
}
.toggle-pass {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  background: none;
  border: none;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  cursor: pointer;
}

.error-msg {
  background: #fee2e2;
  color: #dc2626;
  border-radius: var(--radius);
  padding: var(--space-3);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-4);
}

.login-btn {
  width: 100%;
  justify-content: center;
  padding: var(--space-3);
  font-size: var(--font-size-base);
  margin-bottom: var(--space-4);
}

.login-note {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  line-height: 1.7;
  text-align: center;
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
}
</style>
