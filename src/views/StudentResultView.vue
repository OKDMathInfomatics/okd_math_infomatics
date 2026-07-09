<template>
  <div class="result-page">
    <!-- ヘッダー -->
    <div class="result-header">
      <div class="result-header-left">
        <div class="student-name">{{ session?.name }} さんの成績</div>
        <div class="course-name" v-if="course">{{ course.name }}</div>
      </div>
      <button class="btn btn-outline btn-sm" @click="handleLogout">ログアウト</button>
    </div>

    <!-- ローディング -->
    <div v-if="loading" class="loading-card card">データを読み込み中…</div>

    <template v-else>
      <!-- データなし -->
      <div v-if="stats.length === 0" class="empty-card card">
        <div class="empty-icon">📭</div>
        <p>まだテストデータがありません。<br/>テスト後に先生が入力します。</p>
      </div>

      <template v-else>
        <!-- サマリーカード -->
        <div class="stats-row">
          <div class="stat-card card">
            <div class="stat-label">受験回数</div>
            <div class="stat-value">{{ receivedCount }}<span class="stat-unit">回</span></div>
          </div>
          <div class="stat-card card">
            <div class="stat-label">平均点（自分）</div>
            <div class="stat-value">{{ myAvgScore != null ? myAvgScore.toFixed(1) : '—' }}<span class="stat-unit">点</span></div>
          </div>
          <div class="stat-card card">
            <div class="stat-label">クラス平均との差</div>
            <div class="stat-value" :class="avgDiff >= 0 ? 'positive' : 'negative'">
              {{ avgDiff != null ? (avgDiff >= 0 ? '+' : '') + avgDiff.toFixed(1) : '—' }}<span class="stat-unit">点</span>
            </div>
          </div>
          <div class="stat-card card">
            <div class="stat-label">最高得点率</div>
            <div class="stat-value">{{ bestRate != null ? (bestRate * 100).toFixed(0) : '—' }}<span class="stat-unit">%</span></div>
          </div>
        </div>

        <!-- グラフ -->
        <div class="chart-card card">
          <h2>得点推移</h2>
          <div class="chart-legend">
            <span class="legend-item legend-mine">■ 自分</span>
            <span class="legend-item legend-avg">■ クラス平均</span>
          </div>
          <div class="chart-wrap">
            <svg :width="chartW" :height="chartH" class="score-chart">
              <!-- グリッド線 -->
              <line v-for="y in gridYs" :key="'gy'+y" :x1="padL" :y1="scaleY(y)" :x2="chartW - padR" :y2="scaleY(y)" stroke="#e5e0d8" stroke-width="1" />
              <!-- Y軸ラベル -->
              <text v-for="y in gridYs" :key="'yl'+y" :x="padL - 8" :y="scaleY(y) + 4" text-anchor="end" font-size="11" fill="#888">{{ y }}</text>

              <!-- クラス平均ライン -->
              <polyline v-if="avgPoints.length > 1" :points="polylinePoints(avgPoints)" fill="none" stroke="#c8922a" stroke-width="2" stroke-dasharray="5,3" />
              <!-- 自分ライン -->
              <polyline v-if="myPoints.length > 1" :points="polylinePoints(myPoints)" fill="none" stroke="#1a2a4a" stroke-width="2.5" />

              <!-- 点 -->
              <circle v-for="(pt, i) in avgPoints" :key="'ac'+i" :cx="pt.x" :cy="pt.y" r="4" fill="#c8922a" />
              <circle v-for="(pt, i) in myPoints" :key="'mc'+i" :cx="pt.x" :cy="pt.y" r="5" fill="#1a2a4a" />

              <!-- X軸ラベル（テスト名） -->
              <text
                v-for="(pt, i) in xLabels"
                :key="'xl'+i"
                :x="pt.x"
                :y="chartH - padB + 18"
                text-anchor="middle"
                font-size="10"
                fill="#666"
              >{{ pt.label }}</text>
            </svg>
          </div>
        </div>

        <!-- テスト一覧テーブル -->
        <div class="table-card card">
          <h2>テスト別成績</h2>
          <div class="table-wrap">
            <table class="result-table">
              <thead>
                <tr>
                  <th>テスト名</th>
                  <th>実施日</th>
                  <th>自分</th>
                  <th>平均</th>
                  <th>差</th>
                  <th>順位</th>
                  <th>得点率</th>
                  <th>問題</th>
                  <th>映像</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in stats" :key="row.test.id">
                  <td class="test-name">{{ row.test.name }}</td>
                  <td class="date-cell">{{ row.test.date || '—' }}</td>
                  <td class="score-cell" :class="row.myScore != null ? '' : 'absent'">
                    {{ row.myScore != null ? row.myScore : '欠席' }}
                  </td>
                  <td>{{ row.avg != null ? row.avg.toFixed(1) : '—' }}</td>
                  <td :class="diffClass(row)">{{ diffLabel(row) }}</td>
                  <td>
                    <span v-if="row.rank != null" class="rank-badge">{{ row.rank }}位<span class="rank-total"> / {{ row.total }}</span></span>
                    <span v-else>—</span>
                  </td>
                  <td>
                    <span v-if="row.myScore != null && row.test.maxScore" class="rate-bar-wrap">
                      <span class="rate-bar" :style="{ width: rateWidth(row) }"></span>
                      <span class="rate-label">{{ rateLabel(row) }}%</span>
                    </span>
                    <span v-else>—</span>
                  </td>
                  <td>
                    <a v-if="row.test.pdfUrl" :href="row.test.pdfUrl" target="_blank" class="icon-link">📄</a>
                    <span v-else>—</span>
                  </td>
                  <td>
                    <a v-if="row.test.videoUrl" :href="row.test.videoUrl" target="_blank" class="icon-link">🎬</a>
                    <span v-else>—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </template>
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
const session = ds.getStudentSession(courseId.value)
const course = ref(null)
const stats = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(new URL('@/data/courses.json', import.meta.url).href)
    const all = await res.json()
    course.value = all.find(c => c.id === courseId.value) || null
  } catch {}

  if (session) {
    stats.value = ds.calcStats(courseId.value, session.studentId)
  }
  loading.value = false
})

function handleLogout() {
  ds.studentLogout(courseId.value)
  router.push({ name: 'student-login', params: { courseId: courseId.value } })
}

// ===== サマリー計算 =====
const receivedCount = computed(() => stats.value.filter(r => r.myScore != null).length)

const myAvgScore = computed(() => {
  const received = stats.value.filter(r => r.myScore != null)
  if (!received.length) return null
  return received.reduce((s, r) => s + r.myScore, 0) / received.length
})

const avgDiff = computed(() => {
  const received = stats.value.filter(r => r.myScore != null && r.avg != null)
  if (!received.length) return null
  const myA = received.reduce((s, r) => s + r.myScore, 0) / received.length
  const clsA = received.reduce((s, r) => s + r.avg, 0) / received.length
  return myA - clsA
})

const bestRate = computed(() => {
  const rows = stats.value.filter(r => r.myScore != null && r.test.maxScore)
  if (!rows.length) return null
  return Math.max(...rows.map(r => r.myScore / r.test.maxScore))
})

// ===== チャート =====
const chartW = 680
const chartH = 240
const padL = 44, padR = 20, padT = 20, padB = 40

const maxScore = computed(() => {
  const mx = Math.max(...stats.value.map(r => r.test.maxScore || 0))
  return mx > 0 ? mx : 100
})

const gridYs = computed(() => {
  const step = maxScore.value <= 50 ? 10 : maxScore.value <= 100 ? 20 : 50
  const arr = []
  for (let y = 0; y <= maxScore.value; y += step) arr.push(y)
  return arr
})

function scaleY(val) {
  return padT + (1 - val / maxScore.value) * (chartH - padT - padB)
}
function scaleX(i) {
  const n = stats.value.length
  if (n <= 1) return padL + (chartW - padL - padR) / 2
  return padL + (i / (n - 1)) * (chartW - padL - padR)
}

const myPoints = computed(() =>
  stats.value
    .map((r, i) => r.myScore != null ? { x: scaleX(i), y: scaleY(r.myScore) } : null)
    .filter(Boolean)
)
const avgPoints = computed(() =>
  stats.value
    .map((r, i) => r.avg != null ? { x: scaleX(i), y: scaleY(r.avg) } : null)
    .filter(Boolean)
)
const xLabels = computed(() =>
  stats.value.map((r, i) => ({
    x: scaleX(i),
    label: r.test.name.length > 8 ? r.test.name.slice(0, 7) + '…' : r.test.name
  }))
)
function polylinePoints(pts) {
  return pts.map(p => `${p.x},${p.y}`).join(' ')
}

// ===== テーブル補助 =====
function diffLabel(row) {
  if (row.myScore == null || row.avg == null) return '—'
  const d = row.myScore - row.avg
  return (d >= 0 ? '+' : '') + d.toFixed(1)
}
function diffClass(row) {
  if (row.myScore == null || row.avg == null) return ''
  return row.myScore - row.avg >= 0 ? 'positive' : 'negative'
}
function rateLabel(row) {
  return ((row.myScore / row.test.maxScore) * 100).toFixed(0)
}
function rateWidth(row) {
  return `${Math.min(100, (row.myScore / row.test.maxScore) * 100)}%`
}
</script>

<style scoped>
.result-page { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-5); }

.result-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--space-4) 0; border-bottom: 1px solid var(--color-border);
}
.student-name { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-primary); }
.course-name { font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: 2px; }
.btn-sm { padding: 4px 12px; font-size: var(--font-size-xs); }

.loading-card, .empty-card { padding: var(--space-10); text-align: center; color: var(--color-text-muted); }
.empty-icon { font-size: 48px; margin-bottom: var(--space-3); }
.empty-card p { font-size: var(--font-size-sm); line-height: 1.8; }

/* サマリーカード */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }
@media (max-width: 640px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
.stat-card { padding: var(--space-5); text-align: center; }
.stat-label { font-size: var(--font-size-xs); color: var(--color-text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: var(--space-2); }
.stat-value { font-size: 28px; font-weight: 800; color: var(--color-primary); line-height: 1; }
.stat-unit { font-size: var(--font-size-sm); font-weight: 400; color: var(--color-text-muted); margin-left: 2px; }
.positive { color: #16a34a; }
.negative { color: var(--color-danger); }

/* グラフ */
.chart-card { padding: var(--space-6); }
.chart-card h2 { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-primary); margin-bottom: var(--space-3); }
.chart-legend { display: flex; gap: var(--space-4); margin-bottom: var(--space-4); }
.legend-item { font-size: var(--font-size-xs); font-weight: 700; }
.legend-mine { color: var(--color-primary); }
.legend-avg { color: var(--color-accent); }
.chart-wrap { overflow-x: auto; }
.score-chart { display: block; min-width: 400px; }

/* テーブル */
.table-card { padding: var(--space-6); }
.table-card h2 { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-primary); margin-bottom: var(--space-4); }
.table-wrap { overflow-x: auto; }
.result-table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
.result-table th {
  background: var(--color-bg); padding: var(--space-2) var(--space-3);
  text-align: left; font-weight: 700; color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border); font-size: var(--font-size-xs); white-space: nowrap;
}
.result-table td { padding: var(--space-3); border-bottom: 1px solid var(--color-border); vertical-align: middle; }
.test-name { font-weight: 600; white-space: nowrap; }
.date-cell { white-space: nowrap; color: var(--color-text-muted); }
.score-cell { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-primary); }
.absent { color: var(--color-text-light); font-style: italic; font-size: var(--font-size-sm); font-weight: 400; }
.rank-badge { display: inline-block; background: var(--color-primary-light); color: var(--color-primary); padding: 2px 10px; border-radius: 20px; font-weight: 700; font-size: var(--font-size-xs); white-space: nowrap; }
.rank-total { font-weight: 400; opacity: 0.7; }
.rate-bar-wrap { display: flex; align-items: center; gap: var(--space-2); }
.rate-bar { display: block; height: 6px; background: var(--color-primary); border-radius: 3px; min-width: 4px; flex-shrink: 0; }
.rate-label { font-size: var(--font-size-xs); font-weight: 700; color: var(--color-text-muted); white-space: nowrap; }
.icon-link { font-size: 18px; text-decoration: none; }
</style>
