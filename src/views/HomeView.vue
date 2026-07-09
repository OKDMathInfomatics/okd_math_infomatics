<template>
  <div class="home">
    <!-- ヒーローセクション -->
    <section class="hero">
      <div class="hero-eyebrow">SOUGAKU ZEMI &nbsp;·&nbsp; MATH &amp; INFORMATICS DIVISION</div>

      <div class="hero-logo-area">
        <!-- SVGロゴ（六角形モチーフ） -->
        <svg class="hero-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" fill="none" stroke="#c8922a" stroke-width="2"/>
          <polygon points="40,14 66,28 66,52 40,66 14,52 14,28" fill="none" stroke="#1a2a4a" stroke-width="1.5" opacity="0.4"/>
          <text x="40" y="46" text-anchor="middle" font-size="22" font-weight="800" fill="#1a2a4a" font-family="serif">S</text>
        </svg>
        <div class="hero-brand">OKD MATH / Informatics</div>
      </div>

      <h1 class="hero-title">
        創学ゼミ<br />
        数学・情報<br />
        <span class="hero-title-accent">奥田クラス</span>
      </h1>
      <p class="hero-desc">
        各講座の成績確認・学習資料はこちらから。<br />
        担当：奥田（数学・情報）
      </p>

      <!-- カードナビ -->
      <div class="hero-cards">
        <RouterLink to="/subjects" class="hero-card">
          <div class="hero-card-num">01</div>
          <div class="hero-card-body">
            <h3>講座を探す</h3>
            <p>科目・学年から担当講座を選んで成績を確認できます。</p>
          </div>
          <div class="hero-card-link">講座一覧へ &rsaquo;</div>
        </RouterLink>
        <RouterLink to="/instructor" class="hero-card">
          <div class="hero-card-num">02</div>
          <div class="hero-card-body">
            <h3>講師紹介</h3>
            <p>担当講師・担当講座の詳細をご確認いただけます。</p>
          </div>
          <div class="hero-card-link">講師紹介へ &rsaquo;</div>
        </RouterLink>
        <RouterLink to="/admin" class="hero-card admin-card">
          <div class="hero-card-num">03</div>
          <div class="hero-card-body">
            <h3>管理画面</h3>
            <p>生徒・テストの登録、採点入力を行います。（パスワードが必要です）</p>
          </div>
          <div class="hero-card-link">管理画面をひらく &rsaquo;</div>
        </RouterLink>
      </div>
    </section>

    <!-- お知らせ -->
    <section class="notice-section">
      <div class="section-label">NOTICE</div>
      <ul class="notice-list">
        <li class="notice-item">
          <span class="notice-date">2024.04.01</span>
          <span class="notice-tag">NEW</span>
          <span class="notice-text">2024年度 春期講座のテスト結果を更新しました。</span>
        </li>
        <li class="notice-item">
          <span class="notice-date">2024.03.25</span>
          <span class="notice-text">春期講座の日程を掲載しました。</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
// ホームページ
</script>

<style scoped>
.home {
  max-width: 820px;
  margin: 0 auto;
}

/* ヒーロー */
.hero {
  text-align: center;
  padding: var(--space-10) 0 var(--space-10);
}

.hero-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-6);
  text-transform: uppercase;
}

.hero-logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}
.hero-icon {
  width: 80px;
  height: 80px;
}
.hero-brand {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.08em;
}

.hero-title {
  font-size: clamp(32px, 6vw, 52px);
  font-weight: 800;
  line-height: 1.25;
  color: var(--color-primary);
  margin-bottom: var(--space-5);
  letter-spacing: -0.01em;
}
.hero-title-accent {
  color: var(--color-accent);
}

.hero-desc {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  line-height: 1.9;
  margin-bottom: var(--space-10);
}

/* ヒーローカード */
.hero-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-4);
  text-align: left;
}

.hero-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-5);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--color-text);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: var(--shadow-sm);
}
.hero-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  text-decoration: none;
  color: var(--color-text);
}
.admin-card:hover {
  border-color: var(--color-primary);
}

.hero-card-num {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-light);
  letter-spacing: 0.1em;
  margin-bottom: var(--space-3);
}
.hero-card-body h3 {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}
.hero-card-body p {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: 1.7;
  flex: 1;
}
.hero-card-link {
  margin-top: var(--space-4);
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.04em;
}
.admin-card .hero-card-link {
  color: var(--color-primary);
}

/* お知らせ */
.notice-section {
  margin-bottom: var(--space-10);
}
.section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
  text-transform: uppercase;
  border-left: 3px solid var(--color-accent);
  padding-left: var(--space-3);
}
.notice-list {
  list-style: none;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.notice-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
}
.notice-item:last-child { border-bottom: none; }
.notice-date {
  color: var(--color-text-muted);
  white-space: nowrap;
  font-size: var(--font-size-xs);
  letter-spacing: 0.04em;
}
.notice-tag {
  background: var(--color-accent-light);
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
  letter-spacing: 0.06em;
}
</style>
