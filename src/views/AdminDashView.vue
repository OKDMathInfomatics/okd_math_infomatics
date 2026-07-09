<template>
  <div class="admin-dash">
    <!-- ヘッダー -->
    <div class="dash-header">
      <div class="dash-brand">
        <svg width="32" height="32" viewBox="0 0 80 80" fill="none">
          <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" fill="none" stroke="#c8922a" stroke-width="2.5"/>
          <text x="40" y="47" text-anchor="middle" font-size="24" font-weight="800" fill="#1a2a4a" font-family="serif">S</text>
        </svg>
        <span class="brand-name">創学ゼミ</span>
        <span class="dash-title">先生用管理画面</span>
      </div>
      <div class="dash-header-right">
        <RouterLink to="/" class="btn btn-outline btn-sm">← トップへ</RouterLink>
        <button class="btn btn-outline btn-sm" @click="handleLogout">ログアウト</button>
      </div>
    </div>

    <!-- タブ -->
    <div class="tabs-bar">
      <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: currentTab === tab.id }" @click="currentTab = tab.id">
        <span class="tab-icon">{{ tab.icon }}</span>{{ tab.label }}
      </button>
    </div>

    <!-- ===== 生徒管理 ===== -->
    <div v-if="currentTab === 'students'" class="tab-content">
      <div class="section card">
        <h2>生徒を登録</h2>
        <p class="section-desc">氏名とPINは生徒がログインする際に使用します</p>
        <form class="student-form" @submit.prevent="submitStudent">
          <div class="form-row">
            <div class="field">
              <label>氏名 <span class="required">*</span></label>
              <input v-model="sf.name" placeholder="例）山田 太郎" required />
            </div>
            <div class="field">
              <label>PIN（合言葉・4桁など） <span class="required">*</span></label>
              <input v-model="sf.pin" placeholder="例）0417" required />
            </div>
            <div class="field">
              <label>高校名</label>
              <input v-model="sf.school" placeholder="例）○○高等学校" />
            </div>
          </div>
          <div class="form-row">
            <div class="field field-wide">
              <label>志望大学</label>
              <input v-model="sf.targetUniversity" placeholder="例）○○大学 理学部" />
            </div>
            <div class="field field-wide">
              <label>学年 / 卒業年度</label>
              <input v-model="sf.grade" placeholder="例）2027年卒 / 高3" />
            </div>
          </div>
          <label class="checkbox-label">
            <input type="checkbox" v-model="sf.isAlumni" />
            卒業生（先輩・比較データ用）として登録する
          </label>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              {{ editingStudentId ? '✏️ 更新する' : '+ 登録する' }}
            </button>
            <button v-if="editingStudentId" type="button" class="btn btn-outline" @click="cancelEdit">キャンセル</button>
          </div>
        </form>
      </div>

      <div class="section card">
        <div class="section-top">
          <h2>登録済み生徒一覧 <span class="count-badge">{{ students.length }}名</span></h2>
          <button class="btn btn-outline btn-sm" @click="exportStudentsCsv">CSVで書き出し</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>氏名</th><th>PIN</th><th>高校名</th><th>志望大学</th><th>学年</th><th>卒業生</th><th>操作</th></tr>
            </thead>
            <tbody>
              <tr v-if="students.length === 0">
                <td colspan="7" class="empty-cell">まだ生徒が登録されていません</td>
              </tr>
              <tr v-for="s in students" :key="s.id">
                <td class="name-cell">{{ s.name }}</td>
                <td><code class="pin-code">{{ s.pin }}</code></td>
                <td>{{ s.school || '—' }}</td>
                <td>{{ s.targetUniversity || '—' }}</td>
                <td>{{ s.grade || '—' }}</td>
                <td><span v-if="s.isAlumni" class="alumni-badge">先輩</span></td>
                <td class="actions">
                  <button class="btn-text" @click="editStudent(s)">編集</button>
                  <button class="btn-text danger" @click="removeStudent(s.id)">削除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== テスト管理 ===== -->
    <div v-if="currentTab === 'tests'" class="tab-content">
      <div class="section card">
        <h2>講座を選ぶ</h2>
        <select v-model="selectedCourseId" class="course-select">
          <option value="">— 講座を選択 —</option>
          <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>

      <template v-if="selectedCourseId">
        <div class="section card">
          <h2>テストを追加</h2>
          <form class="test-form" @submit.prevent="submitTest">
            <div class="form-row">
              <div class="field field-wide">
                <label>テスト名 <span class="required">*</span></label>
                <input v-model="tf.name" placeholder="例）第1回確認テスト" required />
              </div>
              <div class="field">
                <label>実施日</label>
                <input v-model="tf.date" type="date" />
              </div>
              <div class="field">
                <label>満点</label>
                <input v-model.number="tf.maxScore" type="number" min="1" placeholder="200" />
              </div>
            </div>
            <div class="form-row">
              <div class="field field-wide">
                <label>問題PDF URL（任意）</label>
                <input v-model="tf.pdfUrl" placeholder="https://..." />
              </div>
              <div class="field field-wide">
                <label>授業映像 URL（任意）</label>
                <input v-model="tf.videoUrl" placeholder="https://..." />
              </div>
            </div>
            <div class="field">
              <label>攻略マニュアル タグ（カンマ区切り）</label>
              <input v-model="tf.manualTagsStr" placeholder="例）ベクトル(1), 内積の計算" />
            </div>
            <button type="submit" class="btn btn-primary mt">+ テストを追加</button>
          </form>
        </div>

        <div class="section card">
          <h2>テスト一覧</h2>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr><th>テスト名</th><th>実施日</th><th>満点</th><th>PDF</th><th>マニュアルタグ</th><th>操作</th></tr>
              </thead>
              <tbody>
                <tr v-if="courseTests.length === 0">
                  <td colspan="6" class="empty-cell">テストが登録されていません</td>
                </tr>
                <tr v-for="t in courseTests" :key="t.id">
                  <td class="name-cell">{{ t.name }}</td>
                  <td>{{ t.date || '—' }}</td>
                  <td>{{ t.maxScore || '—' }}</td>
                  <td><a v-if="t.pdfUrl" :href="t.pdfUrl" target="_blank" class="link">開く</a><span v-else>—</span></td>
                  <td>
                    <span v-for="tag in (t.manualTags || [])" :key="tag" class="manual-tag">{{ tag }}</span>
                    <span v-if="!t.manualTags?.length">—</span>
                  </td>
                  <td class="actions">
                    <button class="btn-text danger" @click="removeTest(t.id)">削除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>

    <!-- ===== 採点入力 ===== -->
    <div v-if="currentTab === 'scores'" class="tab-content">
      <div class="section card">
        <div class="form-row">
          <div class="field field-wide">
            <label>講座</label>
            <select v-model="selectedCourseId" class="course-select">
              <option value="">— 講座を選択 —</option>
              <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="field field-wide" v-if="selectedCourseId">
            <label>テスト</label>
            <select v-model="selectedTestId" class="course-select">
              <option value="">— テストを選択 —</option>
              <option v-for="t in courseTests" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <template v-if="selectedCourseId && selectedTestId">
        <div class="mode-tabs">
          <button class="mode-tab" :class="{ active: scoreMode === 'manual' }" @click="scoreMode = 'manual'">✏️ 手動入力</button>
          <button class="mode-tab" :class="{ active: scoreMode === 'csv' }" @click="scoreMode = 'csv'">📋 CSV取り込み</button>
        </div>

        <div v-if="scoreMode === 'manual'" class="section card">
          <div class="section-top">
            <h2>手動入力</h2>
            <button class="btn btn-primary btn-sm" @click="saveManualScores">💾 保存する</button>
          </div>
          <p class="section-desc">空欄は未受験扱いになります。</p>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr><th>氏名</th><th>点数 / {{ selectedTest?.maxScore ?? '?' }}点</th></tr>
              </thead>
              <tbody>
                <tr v-if="activeStudents.length === 0">
                  <td colspan="2" class="empty-cell">生徒が登録されていません（生徒管理タブで登録してください）</td>
                </tr>
                <tr v-for="s in activeStudents" :key="s.id">
                  <td class="name-cell">{{ s.name }}</td>
                  <td>
                    <input class="score-input" type="number" min="0" :max="selectedTest?.maxScore" v-model.number="manualScores[s.id]" placeholder="—" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="saveMsg" class="save-msg">{{ saveMsg }}</p>
        </div>

        <div v-if="scoreMode === 'csv'" class="section card">
          <h2>CSV取り込み</h2>
          <div class="csv-format">
            <p class="section-desc">以下の形式でCSVを貼り付けてください（1行目はヘッダー行として読み飛ばします）：</p>
            <pre class="format-box">生徒名,点数
山田 太郎,85
佐藤 花子,120</pre>
          </div>
          <textarea v-model="csvText" class="csv-area" placeholder="ここにCSVを貼り付け..." rows="10"></textarea>
          <div class="csv-actions">
            <label class="btn btn-outline btn-sm file-label">
              📁 ファイルから読み込む
              <input type="file" accept=".csv" @change="loadCsvFile" hidden />
            </label>
            <button class="btn btn-primary" @click="importCsv">取り込む</button>
          </div>
          <div v-if="csvResult" class="csv-result">
            <p class="csv-ok">✅ {{ csvResult.matched }}件 取り込み成功</p>
            <p v-if="csvResult.unmatched.length" class="csv-warn">⚠️ 一致しなかった氏名：{{ csvResult.unmatched.join('、') }}</p>
          </div>
        </div>
      </template>
    </div>

    <!-- プレースホルダータブ -->
    <div v-if="['analysis','reports','manual','settings'].includes(currentTab)" class="tab-content">
      <div class="section card placeholder-section">
        <div class="placeholder-icon">🚧</div>
        <h2>{{ tabs.find(t => t.id === currentTab)?.label }}</h2>
        <p>この機能は今後実装予定です。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDataStore } from '@/composables/useDataStore'

const router = useRouter()
const { logout } = useAuth()
const ds = useDataStore()

const tabs = [
  { id: 'students', label: '生徒管理',       icon: '👤' },
  { id: 'tests',    label: 'テスト管理',     icon: '📝' },
  { id: 'scores',   label: '採点入力',       icon: '✏️' },
  { id: 'analysis', label: '成績分析',       icon: '📊' },
  { id: 'reports',  label: '個人帳票',       icon: '📋' },
  { id: 'manual',   label: '攻略マニュアル', icon: '📖' },
  { id: 'settings', label: '設定',           icon: '⚙️' },
]
const currentTab = ref('students')

// 講座
const courses = ref([])
onMounted(async () => {
  try {
    const res = await fetch(new URL('@/data/courses.json', import.meta.url).href)
    courses.value = await res.json()
  } catch {}
})

// ===== 生徒管理 =====
const students = ref([])
const editingStudentId = ref(null)
const sf = ref({ name: '', pin: '', school: '', targetUniversity: '', grade: '', isAlumni: false })

function loadStudents() { students.value = ds.getStudents() }
onMounted(loadStudents)

const activeStudents = computed(() => students.value.filter(s => !s.isAlumni))

function submitStudent() {
  if (editingStudentId.value) {
    ds.updateStudent({ ...sf.value, id: editingStudentId.value })
  } else {
    ds.addStudent({ ...sf.value })
  }
  loadStudents()
  cancelEdit()
}
function editStudent(s) {
  editingStudentId.value = s.id
  sf.value = { name: s.name, pin: s.pin, school: s.school || '', targetUniversity: s.targetUniversity || '', grade: s.grade || '', isAlumni: s.isAlumni || false }
}
function cancelEdit() {
  editingStudentId.value = null
  sf.value = { name: '', pin: '', school: '', targetUniversity: '', grade: '', isAlumni: false }
}
function removeStudent(id) {
  if (!confirm('この生徒を削除しますか？（関連する成績データも削除されます）')) return
  ds.deleteStudent(id)
  loadStudents()
}
function exportStudentsCsv() {
  const csv = '氏名,PIN,高校名,志望大学,学年\n' +
    students.value.map(s => `${s.name},${s.pin},${s.school||''},${s.targetUniversity||''},${s.grade||''}`).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = 'students.csv'
  a.click()
}

// ===== テスト管理 =====
const selectedCourseId = ref('')
const selectedTestId = ref('')
const tf = ref({ name: '', date: '', maxScore: 200, pdfUrl: '', videoUrl: '', manualTagsStr: '' })
const courseTests = computed(() => ds.getTests(selectedCourseId.value))
const selectedTest = computed(() => courseTests.value.find(t => t.id === selectedTestId.value))

watch(selectedCourseId, () => { selectedTestId.value = '' })

function submitTest() {
  const tags = tf.value.manualTagsStr.split(',').map(s => s.trim()).filter(Boolean)
  ds.addTest({
    courseId: selectedCourseId.value,
    name: tf.value.name,
    date: tf.value.date,
    maxScore: tf.value.maxScore || 200,
    pdfUrl: tf.value.pdfUrl,
    videoUrl: tf.value.videoUrl,
    manualTags: tags
  })
  tf.value = { name: '', date: '', maxScore: 200, pdfUrl: '', videoUrl: '', manualTagsStr: '' }
}
function removeTest(id) {
  if (!confirm('このテストを削除しますか？（成績データも削除されます）')) return
  ds.deleteTest(id)
}

// ===== 採点入力 =====
const scoreMode = ref('manual')
const manualScores = ref({})
const saveMsg = ref('')
const csvText = ref('')
const csvResult = ref(null)

watch([selectedCourseId, selectedTestId], () => {
  if (!selectedTestId.value) return
  const existing = ds.getScores({ courseId: selectedCourseId.value, testId: selectedTestId.value })
  const m = {}
  existing.forEach(s => { if (s.score != null) m[s.studentId] = s.score })
  manualScores.value = m
})

function saveManualScores() {
  const scores = Object.entries(manualScores.value)
    .filter(([, v]) => v !== '' && v != null && !isNaN(Number(v)))
    .map(([studentId, score]) => ({
      studentId,
      testId: selectedTestId.value,
      courseId: selectedCourseId.value,
      score: Number(score)
    }))
  ds.saveScoresBulk(scores)
  saveMsg.value = `✅ ${scores.length}件 保存しました`
  setTimeout(() => saveMsg.value = '', 3000)
}

function loadCsvFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => { csvText.value = ev.target.result }
  reader.readAsText(file, 'UTF-8')
}

function importCsv() {
  const lines = csvText.value.trim().split('\n').filter(Boolean)
  const studentList = ds.getStudents()
  const matched = []
  const unmatched = []

  lines.forEach(line => {
    const parts = line.split(',').map(s => s.trim())
    const name = parts[0]
    const scoreStr = parts[1]
    if (!name || !scoreStr || isNaN(Number(scoreStr))) return
    // ヘッダー行スキップ
    if (name === '生徒名' || name === '氏名' || name === '名前') return
    const student = studentList.find(s => s.name === name)
    if (!student) { unmatched.push(name); return }
    matched.push({
      studentId: student.id,
      testId: selectedTestId.value,
      courseId: selectedCourseId.value,
      score: Number(scoreStr)
    })
  })

  ds.saveScoresBulk(matched)
  csvResult.value = { matched: matched.length, unmatched }
}

function handleLogout() { logout(); router.push('/') }
</script>

<style scoped>
.admin-dash { max-width: 1100px; margin: 0 auto; }

.dash-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-4) 0 var(--space-5);
  border-bottom: 1px solid var(--color-border); margin-bottom: 0;
}
.dash-brand { display: flex; align-items: center; gap: var(--space-3); }
.brand-name { font-size: 16px; font-weight: 800; color: var(--color-primary); letter-spacing: 0.08em; }
.dash-title { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text); border-left: 1px solid var(--color-border); padding-left: var(--space-3); margin-left: var(--space-1); }
.dash-header-right { display: flex; gap: var(--space-2); }
.btn-sm { padding: 4px 12px; font-size: var(--font-size-xs); }

.tabs-bar {
  display: flex; border-bottom: 2px solid var(--color-border);
  margin-bottom: var(--space-6); overflow-x: auto;
}
.tab-btn {
  display: flex; align-items: center; gap: 6px;
  padding: var(--space-3) var(--space-4);
  background: none; border: none; border-bottom: 2px solid transparent;
  margin-bottom: -2px; font-size: var(--font-size-sm); font-weight: 600;
  color: var(--color-text-muted); cursor: pointer; white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
}
.tab-btn.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }
.tab-btn:hover { color: var(--color-primary); }
.tab-icon { font-size: 14px; }

.tab-content { display: flex; flex-direction: column; gap: var(--space-5); }
.section { padding: var(--space-6); }
.section h2 { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-primary); margin-bottom: var(--space-3); }
.section-desc { font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-4); }
.section-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); }
.count-badge { font-size: var(--font-size-xs); background: var(--color-primary-light); color: var(--color-primary); padding: 2px 8px; border-radius: 20px; margin-left: var(--space-2); font-weight: 600; }

.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-4); }
.field { display: flex; flex-direction: column; gap: var(--space-1); }
.field-wide { min-width: 240px; }
.field label { font-size: var(--font-size-xs); font-weight: 700; color: var(--color-text-muted); letter-spacing: 0.04em; }
.field input, .field select, .course-select {
  padding: var(--space-2) var(--space-3);
  border: 1.5px solid var(--color-border); border-radius: var(--radius);
  font-size: var(--font-size-sm); font-family: var(--font-sans); background: white;
  transition: border-color 0.15s;
}
.field input:focus, .field select:focus, .course-select:focus { outline: none; border-color: var(--color-primary); }
.required { color: var(--color-danger); }
.checkbox-label { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-sm); cursor: pointer; margin-bottom: var(--space-3); }
.form-actions { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
.mt { margin-top: var(--space-2); }
.course-select { width: 100%; }

.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
.data-table th {
  background: var(--color-bg); padding: var(--space-2) var(--space-3);
  text-align: left; font-weight: 700; color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border); font-size: var(--font-size-xs); white-space: nowrap;
}
.data-table td { padding: var(--space-3); border-bottom: 1px solid var(--color-border); }
.data-table tbody tr:hover { background: #faf8f4; }
.empty-cell { text-align: center; color: var(--color-text-light); padding: var(--space-8) !important; }
.name-cell { font-weight: 600; }
.pin-code { background: var(--color-bg); padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 13px; letter-spacing: 0.1em; }
.alumni-badge { background: var(--color-accent-light); color: var(--color-accent); font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 700; }
.actions { white-space: nowrap; }
.btn-text { background: none; border: none; font-size: var(--font-size-xs); font-weight: 700; color: var(--color-primary); cursor: pointer; padding: 2px 6px; }
.btn-text.danger { color: var(--color-danger); }
.manual-tag { display: inline-block; background: #eef2f8; color: var(--color-primary); font-size: 11px; padding: 1px 7px; border-radius: 4px; margin: 1px; }
.link { color: var(--color-primary); font-size: var(--font-size-xs); text-decoration: underline; }

.mode-tabs { display: flex; gap: var(--space-2); margin-bottom: var(--space-4); }
.mode-tab { padding: var(--space-2) var(--space-5); border: 1.5px solid var(--color-border); border-radius: var(--radius); background: white; font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-muted); cursor: pointer; transition: all 0.15s; }
.mode-tab.active { background: var(--color-primary); border-color: var(--color-primary); color: white; }

.score-input { width: 90px; padding: 4px 8px; border: 1.5px solid var(--color-border); border-radius: var(--radius); font-size: var(--font-size-sm); text-align: center; font-weight: 700; }
.score-input:focus { outline: none; border-color: var(--color-primary); }
.save-msg { margin-top: var(--space-3); font-size: var(--font-size-sm); color: var(--color-success); font-weight: 700; }

.format-box { background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-3) var(--space-4); font-size: 13px; font-family: monospace; margin-top: var(--space-2); }
.csv-area { width: 100%; padding: var(--space-3); border: 1.5px solid var(--color-border); border-radius: var(--radius); font-family: monospace; font-size: 13px; resize: vertical; margin-bottom: var(--space-3); box-sizing: border-box; }
.csv-actions { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); }
.file-label { cursor: pointer; }
.csv-result { background: var(--color-bg); border-radius: var(--radius); padding: var(--space-3) var(--space-4); }
.csv-ok { color: var(--color-success); font-weight: 700; font-size: var(--font-size-sm); }
.csv-warn { color: var(--color-warning); font-size: var(--font-size-sm); margin-top: var(--space-1); }

.placeholder-section { text-align: center; padding: var(--space-12); }
.placeholder-icon { font-size: 48px; margin-bottom: var(--space-4); }
.placeholder-section p { color: var(--color-text-muted); margin-top: var(--space-2); }
</style>
