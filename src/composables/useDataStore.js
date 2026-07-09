/**
 * useDataStore.js — ローカルストレージを使ったデータ管理
 *
 * ⚠️ localStorage はデバイスをまたがないため、
 *    先生のPCで入力したデータは生徒のデバイスから見えません。
 *    生徒が自分の成績を確認するには GAS 連携が必要です。
 *    （useGasApi.js を設定することで切り替えられます）
 */

const KEYS = {
  students: 'sougaku_students',
  tests:    'sougaku_tests',
  scores:   'sougaku_scores',
}

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function useDataStore() {

  // ===== 生徒 =====
  function getStudents() { return load(KEYS.students) }

  function addStudent(s) {
    const list = getStudents()
    const student = { ...s, id: `s_${Date.now()}_${Math.random().toString(36).slice(2,6)}` }
    list.push(student)
    save(KEYS.students, list)
    return student
  }

  function updateStudent(updated) {
    const list = getStudents().map(s => s.id === updated.id ? updated : s)
    save(KEYS.students, list)
  }

  function deleteStudent(id) {
    save(KEYS.students, getStudents().filter(s => s.id !== id))
    // 関連スコアも削除
    save(KEYS.scores, load(KEYS.scores).filter(s => s.studentId !== id))
  }

  // ===== テスト =====
  function getTests(courseId) {
    const all = load(KEYS.tests)
    return courseId ? all.filter(t => t.courseId === courseId) : all
  }

  function addTest(t) {
    const list = load(KEYS.tests)
    const test = { ...t, id: `t_${Date.now()}` }
    list.push(test)
    save(KEYS.tests, list)
    return test
  }

  function updateTest(updated) {
    save(KEYS.tests, load(KEYS.tests).map(t => t.id === updated.id ? updated : t))
  }

  function deleteTest(id) {
    save(KEYS.tests, load(KEYS.tests).filter(t => t.id !== id))
    save(KEYS.scores, load(KEYS.scores).filter(s => s.testId !== id))
  }

  // ===== スコア =====
  function getScores({ courseId, testId, studentId } = {}) {
    let list = load(KEYS.scores)
    if (courseId)  list = list.filter(s => s.courseId  === courseId)
    if (testId)    list = list.filter(s => s.testId    === testId)
    if (studentId) list = list.filter(s => s.studentId === studentId)
    return list
  }

  function saveScore(score) {
    const list = load(KEYS.scores)
    const idx = list.findIndex(s => s.studentId === score.studentId && s.testId === score.testId)
    if (idx >= 0) list[idx] = score
    else list.push(score)
    save(KEYS.scores, list)
  }

  function saveScoresBulk(scores) {
    const list = load(KEYS.scores)
    scores.forEach(score => {
      const idx = list.findIndex(s => s.studentId === score.studentId && s.testId === score.testId)
      if (idx >= 0) list[idx] = score
      else list.push(score)
    })
    save(KEYS.scores, list)
  }

  // ===== 講座の生徒一覧（スコアが入っている生徒）=====
  function getCourseStudents(courseId) {
    const scores = getScores({ courseId })
    const ids = [...new Set(scores.map(s => s.studentId))]
    return getStudents().filter(s => ids.includes(s.id))
  }

  // ===== 生徒ログイン（セッション）=====
  function studentLogin(courseId, studentId, pin) {
    const student = getStudents().find(s => s.id === studentId && s.pin === pin)
    if (!student) return null
    const session = { studentId: student.id, name: student.name, school: student.school, targetUniversity: student.targetUniversity }
    sessionStorage.setItem(`sougaku_s_${courseId}`, JSON.stringify(session))
    return session
  }

  function getStudentSession(courseId) {
    try { return JSON.parse(sessionStorage.getItem(`sougaku_s_${courseId}`) || 'null') } catch { return null }
  }

  function studentLogout(courseId) {
    sessionStorage.removeItem(`sougaku_s_${courseId}`)
  }

  // ===== 統計計算 =====
  function calcStats(courseId, studentId) {
    const tests   = getTests(courseId).sort((a, b) => a.date.localeCompare(b.date))
    const scores  = getScores({ courseId })
    const students = getCourseStudents(courseId)

    const result = tests.map(test => {
      const testScores = scores.filter(s => s.testId === test.id && s.score != null)
      const myScore    = testScores.find(s => s.studentId === studentId)?.score ?? null
      const avg        = testScores.length
        ? testScores.reduce((s, x) => s + x.score, 0) / testScores.length
        : null
      const rank       = myScore != null
        ? testScores.filter(s => s.score > myScore).length + 1
        : null
      const total      = testScores.length
      return { test, myScore, avg, rank, total }
    })

    return result
  }

  return {
    getStudents, addStudent, updateStudent, deleteStudent,
    getTests, addTest, updateTest, deleteTest,
    getScores, saveScore, saveScoresBulk,
    getCourseStudents,
    studentLogin, getStudentSession, studentLogout,
    calcStats,
  }
}
