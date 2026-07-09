<template>
  <div class="course-detail">
    <!-- ローディング -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>成績データを読み込み中...</p>
    </div>

    <template v-else-if="course">
      <!-- ブレッドクラム -->
      <nav class="breadcrumb">
        <RouterLink to="/">ホーム</RouterLink>
        <span class="breadcrumb-sep">›</span>
        <RouterLink to="/subjects">科目一覧</RouterLink>
        <span class="breadcrumb-sep">›</span>
        <RouterLink :to="`/subjects/${course.subject}`">{{ subjectLabel }}</RouterLink>
        <span class="breadcrumb-sep">›</span>
        <RouterLink :to="`/subjects/${course.subject}/${course.grade}`">{{ gradeLabel }}</RouterLink>
        <span class="breadcrumb-sep">›</span>
        <span>{{ course.name }}</span>
      </nav>

      <!-- 講座ヘッダー -->
      <div class="course-header card">
        <div class="course-header-body">
          <div class="course-badges">
            <span class="badge" :class="`badge-${course.subject}`">{{ subjectLabel }}</span>
            <span class="grade-badge">{{ gradeLabel }}</span>
          </div>
          <h1 class="course-title">{{ course.name }}</h1>
          <p class="course-desc">{{ course.description }}</p>
        </div>
        <div class="course-stats">
          <div class="stat-item">
            <div class="stat-val">{{ scores.length }}</div>
            <div class="stat-label">登録生徒数</div>
          </div>
          <div class="stat-item">
            <div class="stat-val">{{ testNames.length }}</div>
            <div class="stat-label">実施テスト数</div>
          </div>
          <div class="stat-item">
            <div class="stat-val">{{ classAverage }}</div>
            <div class="stat-label">最新テスト平均点</div>
          </div>
        </div>
      </div>

      <!-- テスト選択タブ -->
      <div class="test-tabs">
        <button
          v-for="testName in testNames"
          :key="testName"
          class="test-tab"
          :class="{ active: selectedTest === testName }"
          @click="selectedTest = testName"
        >
          {{ testName }}
        </button>
        <button class="test-tab all-tab" :class="{ active: selectedTest === '__all__' }" @click="selectedTest = '__all__'">
          全テスト比較
        </button>
      </div>

      <!-- 成績テーブル -->
      <div class="score-section card">
        <div class="score-header">
          <h2>成績一覧</h2>
          <div class="score-actions">
            <input
              v-model="searchQuery"
              class="search-input"
              placeholder="生徒名で検索..."
            />
          </div>
        </div>

        <div class="table-wrap">
          <table class="score-table">
            <thead>
              <tr>
                <th class="col-num">No.</th>
                <th class="col-name">生徒名</th>
                <template v-if="selectedTest === '__all__'">
                  <th v-for="t in testNames" :key="t">{{ t }}</th>
                  <th>平均</th>
                </template>
                <template v-else>
                  <th>点数</th>
                  <th>偏差値</th>
                  <th>順位</th>
                  <th>評価</th>
                </template>
                <th>メモ</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(student, idx) in filteredScores"
                :key="student.id"
                :class="getRankClass(student, idx)"
              >
                <td class="col-num">{{ idx + 1 }}</td>
                <td class="col-name">{{ student.name }}</td>
                <template v-if="selectedTest === '__all__'">
                  <td
                    v-for="t in testNames"
                    :key="t"
                    class="score-cell"
                    :class="getScoreClass(student.scores[t])"
                  >
                    {{ student.scores[t] ?? '—' }}
                  </td>
                  <td class="score-cell">{{ getStudentAvg(student) }}</td>
                </template>
                <template v-else>
                  <td class="score-cell" :class="getScoreClass(student.scores[selectedTest])">
                    {{ student.scores[selectedTest] ?? '—' }}
                  </td>
                  <td>{{ calcDeviation(student, selectedTest) }}</td>
                  <td>{{ getRank(student, selectedTest) }}</td>
                  <td><span class="grade-chip" :class="getGradeClass(student.scores[selectedTest])">{{ getGrade(student.scores[selectedTest]) }}</span></td>
                </template>
                <td class="memo-cell">{{ student.memo ?? '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 得点分布（簡易バーチャート） -->
      <div v-if="selectedTest !== '__all__'" class="distribution-section card">
        <h2>得点分布（{{ selectedTest }}）</h2>
        <div class="bar-chart">
          <div
            v-for="band in distribution"
            :key="band.label"
            class="bar-group"
          >
            <div class="bar-label">{{ band.label }}</div>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: band.pct + '%' }"
                :class="band.color"
              ></div>
            </div>
            <div class="bar-count">{{ band.count }}人</div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="not-found">
      <p>講座が見つかりません。</p>
      <RouterLink to="/subjects" class="btn btn-primary">科目一覧に戻る</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const course = ref(null)
const scores = ref([])   // [{ id, name, scores: { "第1回": 85, ... }, memo }]
const selectedTest = ref('')
const searchQuery = ref('')

// ===== データ取得 =====
onMounted(async () => {
  await loadData()
})

watch(() => route.params.courseId, loadData)

async function loadData() {
  loading.value = true
  try {
    // 1) 講座マスタ取得
    const coursesRes = await fetch(new URL('@/data/courses.json', import.meta.url).href)
    const courses = await coursesRes.json()
    course.value = courses.find(c => c.id === route.params.courseId) ?? null

    // 2) 成績データ取得（GAS API または 静的JSON）
    // ★ GAS API を使う場合は useGasApi.js を経由する
    const scoresRes = await fetch(new URL('@/data/scores_sample.json', import.meta.url).href)
    const allScores = await scoresRes.json()
    scores.value = allScores.filter(s => s.courseId === route.params.courseId)

    // 最初のテストをデフォルト選択
    if (testNames.value.length > 0) selectedTest.value = testNames.value[0]
  } catch (e) {
    console.error('データ取得失敗:', e)
  } finally {
    loading.value = false
  }
}

// ===== 算出プロパティ =====
const subjectLabel = computed(() =>
  course.value?.subject === 'math' ? '数学' : '情報'
)
const gradeLabels = { grade1: '高1', grade2: '高2', grade3: '高3' }
const gradeLabel = computed(() => gradeLabels[course.value?.grade] ?? '')

// テスト名一覧（全生徒のscoresキーを統合）
const testNames = computed(() => {
  const keys = new Set()
  scores.value.forEach(s => Object.keys(s.scores || {}).forEach(k => keys.add(k)))
  return [...keys].sort()
})

// 検索フィルタ
const filteredScores = computed(() =>
  scores.value
    .filter(s => s.name.includes(searchQuery.value))
    .sort((a, b) => {
      if (selectedTest.value === '__all__') return 0
      return (b.scores[selectedTest.value] ?? -1) - (a.scores[selectedTest.value] ?? -1)
    })
)

// 最新テスト平均点
const classAverage = computed(() => {
  if (!selectedTest.value || selectedTest.value === '__all__') {
    const last = testNames.value.at(-1)
    if (!last) return '—'
    const vals = scores.value.map(s => s.scores[last]).filter(v => v != null)
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—'
  }
  const vals = scores.value.map(s => s.scores[selectedTest.value]).filter(v => v != null)
  return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—'
})

// 偏差値計算
function calcDeviation(student, testName) {
  const score = student.scores[testName]
  if (score == null) return '—'
  const vals = scores.value.map(s => s.scores[testName]).filter(v => v != null)
  if (vals.length < 2) return '—'
  const avg = vals.reduce((a, b) => a + b) / vals.length
  const sd = Math.sqrt(vals.reduce((a, b) => a + (b - avg) ** 2, 0) / vals.length)
  if (sd === 0) return '50.0'
  return (10 * (score - avg) / sd + 50).toFixed(1)
}

// 順位
function getRank(student, testName) {
  const score = student.scores[testName]
  if (score == null) return '—'
  const rank = scores.value.filter(s => (s.scores[testName] ?? -1) > score).length + 1
  return `${rank}位`
}

// 評価ランク
function getGrade(score) {
  if (score == null) return '—'
  if (score >= 90) return 'S'
  if (score >= 75) return 'A'
  if (score >= 60) return 'B'
  if (score >= 45) return 'C'
  return 'D'
}
function getGradeClass(score) {
  const g = getGrade(score)
  return { 'grade-s': g === 'S', 'grade-a': g === 'A', 'grade-b': g === 'B', 'grade-c': g === 'C', 'grade-d': g === 'D' }
}
function getScoreClass(score) {
  if (score == null) return ''
  if (score >= 90) return 'score-excellent'
  if (score >= 75) return 'score-good'
  if (score < 45) return 'score-poor'
  return ''
}
function getRankClass(student, idx) {
  if (idx === 0) return 'rank-1'
  if (idx === 1) return 'rank-2'
  if (idx === 2) return 'rank-3'
  return ''
}
function getStudentAvg(student) {
  const vals = Object.values(student.scores || {}).filter(v => v != null)
  return vals.length ? (vals.reduce((a, b) => a + b) / vals.length).toFixed(1) : '—'
}

// 得点分布
const distribution = computed(() => {
  if (selectedTest.value === '__all__') return []
  const bands = [
    { label: '90〜100', min: 90, max: 100, color: 'bar-s' },
    { label: '75〜89',  min: 75, max: 89,  color: 'bar-a' },
    { label: '60〜74',  min: 60, max: 74,  color: 'bar-b' },
    { label: '45〜59',  min: 45, max: 59,  color: 'bar-c' },
    { label: '0〜44',   min: 0,  max: 44,  color: 'bar-d' }
  ]
  const total = scores.value.filter(s => s.scores[selectedTest.value] != null).length || 1
  return bands.map(b => {
    const count = scores.value.filter(s => {
      const v = s.scores[selectedTest.value]
      return v != null && v >= b.min && v <= b.max
    }).length
    return { ...b, count, pct: Math.round(count / total * 100) }
  })
})
</script>

<style scoped>
/* ローディング */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-12);
  color: var(--color-text-muted);
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* 講座ヘッダー */
.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-6);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}
.course-badges { display: flex; gap: var(--space-2); margin-bottom: var(--space-3); }
.grade-badge {
  background: #f1f5f9;
  border-radius: 20px;
  font-size: var(--font-size-xs);
  padding: 1px 8px;
  color: var(--color-text-muted);
  font-weight: 600;
}
.course-title { font-size: var(--font-size-2xl); font-weight: 700; margin-bottom: var(--space-2); }
.course-desc { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.6; }

.course-stats {
  display: flex;
  gap: var(--space-6);
  flex-shrink: 0;
}
.stat-item { text-align: center; }
.stat-val { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-primary); }
.stat-label { font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: 2px; }

/* テストタブ */
.test-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}
.test-tab {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius);
  border: 1.5px solid var(--color-border);
  background: var(--color-bg-card);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s;
}
.test-tab:hover { border-color: var(--color-primary); color: var(--color-primary); }
.test-tab.active { background: var(--color-primary); border-color: var(--color-primary); color: white; }
.all-tab { border-style: dashed; }

/* 成績テーブル */
.score-section {
  padding: var(--space-5);
  margin-bottom: var(--space-6);
}
.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-3);
}
.score-header h2 { font-size: var(--font-size-lg); font-weight: 700; }
.search-input {
  padding: var(--space-2) var(--space-3);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  font-size: var(--font-size-sm);
  outline: none;
  transition: border-color 0.15s;
}
.search-input:focus { border-color: var(--color-primary); }

.table-wrap { overflow-x: auto; }
.score-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}
.score-table th {
  background: var(--color-bg);
  padding: var(--space-2) var(--space-3);
  text-align: left;
  font-weight: 700;
  color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border);
  white-space: nowrap;
  font-size: var(--font-size-xs);
}
.score-table td {
  padding: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}
.score-table tbody tr:hover { background: #f8fafc; }
.col-num { width: 48px; color: var(--color-text-light); text-align: center; }
.col-name { font-weight: 600; }
.score-cell { text-align: center; font-weight: 700; }
.memo-cell { color: var(--color-text-muted); font-size: var(--font-size-xs); }

/* 点数色 */
.score-excellent { color: #7c3aed; }
.score-good { color: var(--color-success); }
.score-poor { color: var(--color-danger); }

/* 順位ハイライト */
.rank-1 td:first-child::before { content: '🥇'; }
.rank-2 td:first-child::before { content: '🥈'; }
.rank-3 td:first-child::before { content: '🥉'; }

/* 評価チップ */
.grade-chip {
  display: inline-block;
  width: 28px;
  text-align: center;
  border-radius: 4px;
  font-weight: 800;
  font-size: var(--font-size-xs);
  padding: 2px 0;
}
.grade-s { background: #ede9fe; color: #7c3aed; }
.grade-a { background: #dcfce7; color: #16a34a; }
.grade-b { background: #dbeafe; color: #1d4ed8; }
.grade-c { background: #fef9c3; color: #a16207; }
.grade-d { background: #fee2e2; color: #dc2626; }

/* 得点分布 */
.distribution-section {
  padding: var(--space-5);
  margin-bottom: var(--space-6);
}
.distribution-section h2 {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--space-5);
}
.bar-chart { display: flex; flex-direction: column; gap: var(--space-3); }
.bar-group { display: flex; align-items: center; gap: var(--space-3); }
.bar-label { width: 72px; text-align: right; font-size: var(--font-size-xs); color: var(--color-text-muted); }
.bar-track { flex: 1; background: var(--color-bg); border-radius: 4px; height: 22px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; min-width: 2px; }
.bar-s { background: #7c3aed; }
.bar-a { background: #16a34a; }
.bar-b { background: #1d4ed8; }
.bar-c { background: #ca8a04; }
.bar-d { background: #dc2626; }
.bar-count { width: 36px; font-size: var(--font-size-xs); color: var(--color-text-muted); }

.badge-math { background: var(--color-math-light); color: var(--color-math); }
.badge-info { background: var(--color-info-light); color: var(--color-info); }

.not-found { text-align: center; padding: var(--space-10); }
</style>
