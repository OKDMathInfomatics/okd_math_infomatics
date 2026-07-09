<template>
  <div class="admin-dash">
    <div class="dash-header">
      <div>
        <h1 class="page-title">管理ダッシュボード</h1>
        <p class="page-subtitle">奥田専用ページ ─ 成績データの管理・更新</p>
      </div>
      <button class="btn btn-outline" @click="handleLogout">ログアウト</button>
    </div>

    <!-- 統計カード -->
    <div class="stats-grid">
      <div class="stat-card card">
        <div class="stat-icon" style="background:#dbeafe;color:#1d4ed8">📚</div>
        <div class="stat-info">
          <div class="stat-num">{{ courses.length }}</div>
          <div class="stat-name">担当講座数</div>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon" style="background:#dcfce7;color:#16a34a">👥</div>
        <div class="stat-info">
          <div class="stat-num">{{ totalStudents }}</div>
          <div class="stat-name">総生徒数</div>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-icon" style="background:#fef9c3;color:#a16207">📝</div>
        <div class="stat-info">
          <div class="stat-num">{{ totalTests }}</div>
          <div class="stat-name">実施済みテスト数</div>
        </div>
      </div>
    </div>

    <!-- 講座一覧テーブル -->
    <div class="courses-section card">
      <div class="section-header">
        <h2>担当講座一覧</h2>
        <span class="hint">✏️ 「成績編集」から各テストのスコアを入力できます</span>
      </div>
      <div class="table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>講座名</th>
              <th>科目</th>
              <th>学年</th>
              <th>生徒数</th>
              <th>テスト数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.id">
              <td class="course-name-cell">{{ course.name }}</td>
              <td>
                <span class="badge" :class="`badge-${course.subject}`">
                  {{ course.subject === 'math' ? '数学' : '情報' }}
                </span>
              </td>
              <td>{{ gradeLabels[course.grade] }}</td>
              <td>{{ course.studentCount }}</td>
              <td>{{ course.testCount }}</td>
              <td>
                <RouterLink :to="`/admin/edit/${course.id}`" class="btn btn-primary btn-sm">
                  成績編集
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- GAS APIステータス -->
    <div class="api-status card">
      <h2>GAS API 接続状態</h2>
      <div class="status-row">
        <div class="status-dot" :class="gasStatus === 'ok' ? 'ok' : gasStatus === 'error' ? 'error' : 'checking'"></div>
        <span>{{ gasStatusLabel }}</span>
        <button class="btn btn-outline btn-sm" @click="checkGasStatus">再確認</button>
      </div>
      <p class="api-hint">
        GAS WebアプリのURLは <code>src/composables/useGasApi.js</code> の <code>GAS_ENDPOINT</code> に設定してください。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useGasApi } from '@/composables/useGasApi'

const router = useRouter()
const { logout } = useAuth()
const { checkConnection } = useGasApi()

const courses = ref([])
const gasStatus = ref('checking') // 'checking' | 'ok' | 'error'

const gradeLabels = { grade1: '高1', grade2: '高2', grade3: '高3' }
const totalStudents = computed(() => courses.value.reduce((s, c) => s + (c.studentCount || 0), 0))
const totalTests = computed(() => courses.value.reduce((s, c) => s + (c.testCount || 0), 0))
const gasStatusLabel = computed(() => ({
  checking: 'GAS APIに接続確認中...',
  ok: 'GAS API 接続OK',
  error: 'GAS APIに接続できません（URL設定を確認してください）'
}[gasStatus.value]))

onMounted(async () => {
  // 講座データ取得
  try {
    const res = await fetch(new URL('@/data/courses.json', import.meta.url).href)
    courses.value = await res.json()
  } catch { }

  await checkGasStatus()
})

async function checkGasStatus() {
  gasStatus.value = 'checking'
  try {
    const ok = await checkConnection()
    gasStatus.value = ok ? 'ok' : 'error'
  } catch {
    gasStatus.value = 'error'
  }
}

function handleLogout() {
  logout()
  router.push('/')
}
</script>

<style scoped>
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}
.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.stat-num { font-size: var(--font-size-2xl); font-weight: 700; }
.stat-name { font-size: var(--font-size-xs); color: var(--color-text-muted); }

.courses-section {
  padding: var(--space-5);
  margin-bottom: var(--space-6);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-3);
}
.section-header h2 { font-size: var(--font-size-lg); font-weight: 700; }
.hint { font-size: var(--font-size-xs); color: var(--color-text-muted); }

.table-wrap { overflow-x: auto; }
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}
.admin-table th {
  background: var(--color-bg);
  padding: var(--space-2) var(--space-3);
  text-align: left;
  font-weight: 700;
  color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border);
  font-size: var(--font-size-xs);
  white-space: nowrap;
}
.admin-table td {
  padding: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}
.course-name-cell { font-weight: 600; }
.btn-sm { padding: 4px 12px; font-size: var(--font-size-xs); }

.badge-math { background: var(--color-math-light); color: var(--color-math); }
.badge-info { background: var(--color-info-light); color: var(--color-info); }

/* GASステータス */
.api-status {
  padding: var(--space-5);
}
.api-status h2 { font-size: var(--font-size-lg); font-weight: 700; margin-bottom: var(--space-4); }
.status-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  font-size: var(--font-size-sm);
}
.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-dot.ok { background: var(--color-success); }
.status-dot.error { background: var(--color-danger); }
.status-dot.checking {
  background: var(--color-warning);
  animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

.api-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: var(--space-3);
}
code {
  background: #e2e8f0;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 11px;
}
</style>
