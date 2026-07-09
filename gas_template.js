/**
 * gas_template.js — Google Apps Script テンプレート
 *
 * このファイルの内容を Google Apps Script エディタに貼り付けてください。
 *
 * ===== スプレッドシート構造 =====
 * 各講座ごとにシートを作成してください。シート名 = courseId
 * 例: シート名「MATH_G2_REG_2024」
 *
 * 各シートの1行目（ヘッダー）:
 *   id | name | 第1回 | 第2回 | 第3回 | ... | memo
 *
 * ===== デプロイ設定 =====
 * - 「次のユーザーとして実行」: 自分
 * - 「アクセスできるユーザー」: 全員
 */

// ★ useGasApi.js の GAS_API_KEY と同じ値を設定してください
const API_KEY = 'YOUR_SECRET_API_KEY'

/**
 * GETリクエスト処理
 */
function doGet(e) {
  const params = e.parameter
  if (params.key !== API_KEY) {
    return jsonError('Unauthorized')
  }

  const action = params.action
  if (action === 'ping') {
    return jsonResponse({ status: 'ok' })
  }
  if (action === 'getScores') {
    return handleGetScores(params.courseId)
  }
  return jsonError('Unknown action')
}

/**
 * POSTリクエスト処理
 */
function doPost(e) {
  let body
  try {
    body = JSON.parse(e.postData.contents)
  } catch {
    return jsonError('Invalid JSON')
  }
  if (body.key !== API_KEY) {
    return jsonError('Unauthorized')
  }

  const action = body.action
  if (action === 'saveScores') {
    return handleSaveScores(body.courseId, body.scores)
  }
  return jsonError('Unknown action')
}

/**
 * 成績データ取得
 */
function handleGetScores(courseId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(courseId)
  if (!sheet) {
    return jsonResponse({ scores: [] })
  }

  const data = sheet.getDataRange().getValues()
  if (data.length < 2) return jsonResponse({ scores: [] })

  const headers = data[0]  // ['id', 'name', '第1回', '第2回', ..., 'memo']
  const testHeaders = headers.slice(2, -1)  // テスト列のみ

  const scores = data.slice(1).map(row => {
    const scoreObj = {}
    testHeaders.forEach((h, i) => {
      const val = row[2 + i]
      if (val !== '' && val !== null) scoreObj[h] = Number(val)
    })
    return {
      id: String(row[0]),
      name: String(row[1]),
      scores: scoreObj,
      memo: String(row[row.length - 1] || '')
    }
  })

  return jsonResponse({ scores })
}

/**
 * 成績データ保存（全上書き）
 */
function handleSaveScores(courseId, scores) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(courseId)

  // シートがなければ作成
  if (!sheet) {
    sheet = ss.insertSheet(courseId)
  }

  if (!scores || scores.length === 0) {
    return jsonResponse({ status: 'ok', message: 'No data' })
  }

  // テスト列名を全部収集
  const testNames = new Set()
  scores.forEach(s => Object.keys(s.scores || {}).forEach(k => testNames.add(k)))
  const testCols = [...testNames].sort()

  // ヘッダー行
  const headers = ['id', 'name', ...testCols, 'memo']

  // データ行
  const rows = scores.map(s => [
    s.id || '',
    s.name || '',
    ...testCols.map(t => s.scores[t] ?? ''),
    s.memo || ''
  ])

  // シートをクリアして書き込み
  sheet.clearContents()
  sheet.getRange(1, 1, rows.length + 1, headers.length).setValues([headers, ...rows])

  // ヘッダー行をボールドに
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold')

  return jsonResponse({ status: 'ok' })
}

/** ヘルパー */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}
function jsonError(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ error: msg }))
    .setMimeType(ContentService.MimeType.JSON)
}
