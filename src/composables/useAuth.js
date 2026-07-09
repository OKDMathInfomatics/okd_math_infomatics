/**
 * useAuth.js — 管理者認証 composable
 *
 * 静的サイトの制約上、完全な秘匿は不可能です。
 * このパスワード認証は「誤操作・一般生徒の誤アクセス防止」を目的としています。
 *
 * セキュリティを強化したい場合：
 *   - GAS側にもAPIキー認証を追加（useGasApi.js の GAS_API_KEY）
 *   - リポジトリをprivateにする（ソースコードが見られなくなる）
 */

// ★ここにパスワードのSHA-256ハッシュを設定してください
// 生成方法: https://emn178.github.io/online-tools/sha256.html
// デフォルト: "sougaku2024" のハッシュ
const ADMIN_PASSWORD_HASH = '1cad42439406288ad393125a00813818db0e72056a88069e80af28d26a3b8069'
// ↑ 必ず本番前にご自身のパスワードのハッシュに変更してください

const SESSION_KEY = 'sougaku_admin_auth'
const SESSION_EXPIRE_MS = 8 * 60 * 60 * 1000 // 8時間

/**
 * SHA-256 ハッシュを計算（ブラウザ内蔵Web Crypto API使用）
 */
async function sha256(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function useAuth() {
  /**
   * ログイン処理
   * @param {string} password - 入力されたパスワード
   * @returns {Promise<boolean>} - 認証成功なら true
   */
  async function login(password) {
    const hash = await sha256(password)
    if (hash === ADMIN_PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        authenticated: true,
        expireAt: Date.now() + SESSION_EXPIRE_MS
      }))
      return true
    }
    return false
  }

  /**
   * 認証済みかどうか確認
   * @returns {boolean}
   */
  function isAuthenticated() {
    try {
      const data = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}')
      if (!data.authenticated) return false
      if (Date.now() > data.expireAt) {
        sessionStorage.removeItem(SESSION_KEY)
        return false
      }
      return true
    } catch {
      return false
    }
  }

  /**
   * ログアウト
   */
  function logout() {
    sessionStorage.removeItem(SESSION_KEY)
  }

  return { login, isAuthenticated, logout }
}
