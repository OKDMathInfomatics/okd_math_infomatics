/**
 * useGasApi.js — Google Apps Script API composable
 *
 * GAS Webアプリを経由してGoogleスプレッドシートの成績データを読み書きします。
 *
 * ===== セットアップ手順 =====
 * 1. Googleスプレッドシートを作成
 * 2. 拡張機能 → Apps Script でGASスクリプトを作成（gas_template.js を参照）
 * 3. デプロイ → 新しいデプロイ → Webアプリ として公開
 *    - 「次のユーザーとして実行」: 自分
 *    - 「アクセスできるユーザー」: 全員
 * 4. 表示されたWebアプリURLを GAS_ENDPOINT に貼り付ける
 * 5. GAS_API_KEY に任意の秘密キーを設定（GAS側でも同じキーを検証する）
 */

// ★ここにGAS WebアプリのURLを設定してください
const GAS_ENDPOINT = 'https://script.google.com/macros/s/YOUR_GAS_SCRIPT_ID/exec'

// ★任意のAPIキー（GAS側の doGet/doPost でこのキーを検証します）
const GAS_API_KEY = 'YOUR_SECRET_API_KEY'

export function useGasApi() {
  /**
   * 接続確認
   * @returns {Promise<boolean>}
   */
  async function checkConnection() {
    if (GAS_ENDPOINT.includes('YOUR_GAS')) return false
    try {
      const res = await fetch(`${GAS_ENDPOINT}?action=ping&key=${GAS_API_KEY}`)
      const data = await res.json()
      return data.status === 'ok'
    } catch {
      return false
    }
  }

  /**
   * 指定講座の成績データ取得
   * @param {string} courseId
   * @returns {Promise<Array>}  [{ id, name, scores: {テスト名: 点}, memo }]
   */
  async function getScores(courseId) {
    if (GAS_ENDPOINT.includes('YOUR_GAS')) {
      // GAS未設定時はサンプルJSONにフォールバック
      const res = await fetch(new URL('@/data/scores_sample.json', import.meta.url).href)
      const all = await res.json()
      return all.filter(s => s.courseId === courseId)
    }
    const res = await fetch(
      `${GAS_ENDPOINT}?action=getScores&courseId=${encodeURIComponent(courseId)}&key=${GAS_API_KEY}`
    )
    if (!res.ok) throw new Error(`GAS API error: ${res.status}`)
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.scores ?? []
  }

  /**
   * 成績データを保存
   * @param {string} courseId
   * @param {Array} scores
   * @returns {Promise<void>}
   */
  async function saveScores(courseId, scores) {
    if (GAS_ENDPOINT.includes('YOUR_GAS')) {
      // GAS未設定時はコンソールに出力（開発用）
      console.log('[saveScores] GAS未設定。保存先がありません。', { courseId, scores })
      return
    }
    const res = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveScores', courseId, scores, key: GAS_API_KEY })
    })
    if (!res.ok) throw new Error(`GAS API error: ${res.status}`)
    const data = await res.json()
    if (data.error) throw new Error(data.error)
  }

  return { checkConnection, getScores, saveScores }
}
