<template>
  <div class="admin-edit">
    <nav class="breadcrumb">
      <RouterLink to="/admin/dashboard">管理ダッシュボード</RouterLink>
      <span class="breadcrumb-sep">›</span>
      <span>成績編集</span>
    </nav>

    <div v-if="loading" class="loading">データを読み込み中...</div>

    <template v-else-if="course">
      <div class="edit-header">
        <h1 class="page-title">成績編集：{{ course.name }}</h1>
        <div class="header-actions">
          <button class="btn btn-outline" @click="addTestColumn">+ テスト追加</button>
          <button class="btn btn-primary" :disabled="saving" @click="saveAll">
            {{ saving ? '保存中...' : '💾 すべて保存' }}
          </button>
        </div>
      </div>

      <p v-if="saveMsg" class="save-msg" :class="saveMsgType">{{ saveMsg }}</p>

      <!-- 編集テーブル -->
      <div class="edit-section card">
        <div class="table-wrap">
          <table class="edit-table">
            <thead>
              <tr>
                <th class="col-name-h">生徒名</th>
                <th v-for="(test, ti) in testColumns" :key="ti" class="col-score-h">
                  <input
                    class="test-name-input"
                    v-model="testColumns[ti]"
                    placeholder="テスト名"
                  />
                  <button class="del-col-btn" @click="removeTestColumn(ti)" title="このテストを削除">✕</button>
                </th>
                <th>メモ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, si) in editData" :key="si">
                <td class="col-name-cell">
                  <input class="name-input" v-model="student.name" placeholder="生徒名" />
                </td>
                <td v-for="(test, ti) in testColumns" :key="ti" class="score-td">
                  <input
                    class="score-input"
                    type="number"
                    min="0"
                    max="100"
                    v-model.number="student.scores[test]"
                    placeholder="—"
                  />
                </td>
                <td>
                  <input class="memo-input" v-model="student.memo" placeholder="メモ" />
                </td>
                <td>
                  <button class="del-row-btn" @click="removeStudent(si)" title="この生徒を削除">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button class="btn btn-outline add-student-btn" @click="addStudent">+ 生徒を追加</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGasApi } from '@/composables/useGasApi'

const route = useRoute()
const { getScores, saveScores } = useGasApi()

const loading = ref(true)
const saving = ref(false)
const saveMsg = ref('')
const saveMsgType = ref('success')
const course = ref(null)
const testColumns = ref([])
const editData = ref([])  // [{ id, name, scores: { テスト名: 点 }, memo }]

onMounted(async () => {
  try {
    const res = await fetch(new URL('@/data/courses.json', import.meta.url).href)
    const courses = await res.json()
    course.value = courses.find(c => c.id === route.params.courseId)

    // GAS APIから成績取得
    const data = await getScores(route.params.courseId)
    editData.value = data

    // テスト列を復元
    const keys = new Set()
    data.forEach(s => Object.keys(s.scores || {}).forEach(k => keys.add(k)))
    testColumns.value = [...keys].sort()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

function addTestColumn() {
  const name = `第${testColumns.value.length + 1}回`
  testColumns.value.push(name)
}
function removeTestColumn(ti) {
  const testName = testColumns.value[ti]
  testColumns.value.splice(ti, 1)
  editData.value.forEach(s => delete s.scores[testName])
}
function addStudent() {
  editData.value.push({ id: `new_${Date.now()}`, name: '', scores: {}, memo: '' })
}
function removeStudent(si) {
  editData.value.splice(si, 1)
}

async function saveAll() {
  saving.value = true
  saveMsg.value = ''
  try {
    await saveScores(route.params.courseId, editData.value)
    saveMsg.value = '✅ 保存しました！'
    saveMsgType.value = 'success'
  } catch {
    saveMsg.value = '❌ 保存に失敗しました。GAS APIの設定を確認してください。'
    saveMsgType.value = 'error'
  } finally {
    saving.value = false
    setTimeout(() => (saveMsg.value = ''), 4000)
  }
}
</script>

<style scoped>
.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
  gap: var(--space-4);
}
.header-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; }

.save-msg {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-4);
  font-weight: 600;
}
.save-msg.success { background: #dcfce7; color: #16a34a; }
.save-msg.error { background: #fee2e2; color: #dc2626; }

.loading { text-align: center; padding: var(--space-10); color: var(--color-text-muted); }

.edit-section { padding: var(--space-5); }
.table-wrap { overflow-x: auto; margin-bottom: var(--space-4); }
.edit-table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
.edit-table th {
  background: var(--color-bg);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border);
  white-space: nowrap;
}
.edit-table td {
  padding: var(--space-2) var(--space-2);
  border-bottom: 1px solid var(--color-border);
}

.col-name-h { width: 140px; }
.col-score-h { min-width: 110px; position: relative; }
.test-name-input {
  width: 90px;
  padding: 3px 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 700;
}
.del-col-btn {
  background: none;
  border: none;
  color: var(--color-danger);
  font-size: 11px;
  cursor: pointer;
  padding: 0 2px;
  opacity: 0.5;
}
.del-col-btn:hover { opacity: 1; }

.name-input, .memo-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-family: var(--font-sans);
}
.score-input {
  width: 70px;
  padding: 4px 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  text-align: center;
  font-weight: 600;
}
.score-input:focus, .name-input:focus, .memo-input:focus, .test-name-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.del-row-btn {
  background: none;
  border: none;
  color: var(--color-danger);
  font-size: 14px;
  cursor: pointer;
  opacity: 0.4;
}
.del-row-btn:hover { opacity: 1; }

.add-student-btn { width: 100%; justify-content: center; }
</style>
