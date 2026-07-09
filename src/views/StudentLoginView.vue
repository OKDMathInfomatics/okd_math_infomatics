<template>
  <div class="login-page">
    <div class="login-card card">
      <!-- ヘッダー -->
      <div class="login-header">
        <svg width="48" height="48" viewBox="0 0 80 80" fill="none">
          <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" fill="none" stroke="#c8922a" stroke-width="2.5"/>
          <text x="40" y="47" text-anchor="middle" font-size="24" font-weight="800" fill="#1a2a4a" font-family="serif">S</text>
        </svg>
        <div>
          <h1 class="login-title">成績確認ログイン</h1>
          <p class="login-course" v-if="course">{{ course.name }}</p>
          <p class="login-course" v-else>講座を読み込み中…</p>
        </div>
      </div>

      <!-- エラー -->
      <div v-if="errorMsg" class="error-box">{{ errorMsg }}</div>

      <!-- フォーム -->
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="field">
          <label>氏名を選ぶ <span class="required">*</span></label>
          <select v-model="selectedStudentId" required>
            <option value="">— 名前を選んでください —</option>
            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>

        <div class="field">
          <label>PIN（合言葉） <span class="required">*</span></label>
          <input v-model="pin" type="text" placeholder="PINを入力" required autocomplete="off" />
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? '確認中…' : '成績を確認する →' }}
        </button>
      </form>

      <p class="login-note">PINを忘れた場合は担当講師にお問い合わせください。</p>
    </div>

    <!-- 生徒未登録メッセージ -->
    <div v-if="students.length === 0 && !loadingStudents" class="no-students-card card">
      <p>⚠️ まだ生徒が登録されていません。<br/>先生に登録をお願いしてください。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@/composables/useDataStore'

const route = useRoute()
const router = useRouter()
const ds = useDataStore()

const courseId = computed(() => route.params.courseId)
const course = ref(null)
const students = ref([])
const loadingStudents = ref(true)
const selectedStudentId = ref('')
const pin = ref('')
const errorMsg = ref('')
const loading = ref(false)

onMounted(async () => {
  // 講座データ取得
  try {
    const res = await fetch(new URL('@/data/courses.json', import.meta.url).href)
    const all = await res.json()
    course.value = all.find(c => c.id === courseId.value) || null
  } catch {}

  // 生徒一覧（卒業生除く）
  students.value = ds.getStudents().filter(s => !s.isAlumni)
  loadingStudents.value = false
})

function handleLogin() {
  errorMsg.value = ''
  loading.value = true

  setTimeout(() => {
    const session = ds.studentLogin(courseId.value, selectedStudentId.value, pin.value.trim())
    loading.value = false
    if (!session) {
      errorMsg.value = '氏名またはPINが正しくありません。もう一度確認してください。'
      return
    }
    router.push({ name: 'student-result', params: { courseId: courseId.value } })
  }, 300)
}
</script>

<style scoped>
.login-page {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.login-card { padding: var(--space-8); }

.login-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border);
}
.login-title { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-primary); }
.login-course { font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: 2px; }

.error-box {
  background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius);
  padding: var(--space-3) var(--space-4); color: var(--color-danger);
  font-size: var(--font-size-sm); margin-bottom: var(--space-5);
}

.login-form { display: flex; flex-direction: column; gap: var(--space-5); }

.field { display: flex; flex-direction: column; gap: var(--space-1); }
.field label { font-size: var(--font-size-xs); font-weight: 700; color: var(--color-text-muted); letter-spacing: 0.04em; }
.field input, .field select {
  padding: var(--space-3) var(--space-3);
  border: 1.5px solid var(--color-border); border-radius: var(--radius);
  font-size: var(--font-size-base); font-family: var(--font-sans); background: white;
  transition: border-color 0.15s;
}
.field input:focus, .field select:focus { outline: none; border-color: var(--color-primary); }
.required { color: var(--color-danger); }

.btn-block { width: 100%; text-align: center; }
.btn-block:disabled { opacity: 0.6; cursor: not-allowed; }

.login-note { margin-top: var(--space-5); font-size: var(--font-size-xs); color: var(--color-text-light); text-align: center; }

.no-students-card { padding: var(--space-6); text-align: center; font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.7; }
</style>
