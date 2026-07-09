<template>
  <div class="home">
    <!-- ヒーローセクション -->
    <section class="hero">
      <div class="hero-badge">創学ゼミ 数学・情報</div>
      <h1 class="hero-title">
        わかる喜びを、<br />
        <span class="highlight">一緒に作ろう。</span>
      </h1>
      <p class="hero-desc">
        数学・情報担当講師 奥田の授業ページへようこそ。<br />
        講座の成績確認や学習資料をここで確認できます。
      </p>
      <div class="hero-actions">
        <RouterLink to="/subjects" class="btn btn-primary btn-lg">
          講座を探す
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </RouterLink>
        <RouterLink to="/instructor" class="btn btn-outline btn-lg">講師紹介</RouterLink>
      </div>
    </section>

    <!-- 科目カード -->
    <section class="subject-section">
      <h2 class="section-title">担当科目</h2>
      <div class="subject-grid">
        <RouterLink to="/subjects/math" class="subject-card math">
          <div class="subject-icon">∑</div>
          <div class="subject-info">
            <h3>数学</h3>
            <p>数学Ⅰ・A / 数学Ⅱ・B / 数学Ⅲ<br />基礎から応用まで徹底指導</p>
          </div>
          <div class="subject-arrow">→</div>
        </RouterLink>
        <RouterLink to="/subjects/info" class="subject-card info">
          <div class="subject-icon">⌨</div>
          <div class="subject-info">
            <h3>情報</h3>
            <p>情報Ⅰ / 情報Ⅱ<br />プログラミング・アルゴリズム対策</p>
          </div>
          <div class="subject-arrow">→</div>
        </RouterLink>
      </div>
    </section>

    <!-- お知らせ（静的サンプル） -->
    <section class="notice-section">
      <h2 class="section-title">お知らせ</h2>
      <ul class="notice-list">
        <li class="notice-item">
          <span class="notice-date">2024.04.01</span>
          <span class="notice-tag new">NEW</span>
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
// ホームページ：現状は静的コンテンツ
// 後ほど GAS API からお知らせを取得する予定
</script>

<style scoped>
/* ヒーロー */
.hero {
  text-align: center;
  padding: var(--space-12) 0 var(--space-10);
}
.hero-badge {
  display: inline-block;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: 700;
  padding: var(--space-1) var(--space-4);
  border-radius: 20px;
  margin-bottom: var(--space-5);
  letter-spacing: 0.05em;
}
.hero-title {
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: var(--space-5);
  color: var(--color-text);
}
.hero-title .highlight {
  color: var(--color-primary);
}
.hero-desc {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-8);
}
.hero-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}
.btn-lg {
  padding: var(--space-3) var(--space-8);
  font-size: var(--font-size-base);
}

/* セクション共通 */
.section-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-6);
  color: var(--color-text);
  position: relative;
  padding-bottom: var(--space-3);
}
.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 3px;
  background: var(--color-primary);
  border-radius: 2px;
}

/* 科目カード */
.subject-section {
  margin-bottom: var(--space-10);
}
.subject-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-5);
}
.subject-card {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: white;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow-md);
}
.subject-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  text-decoration: none;
}
.subject-card.math {
  background: linear-gradient(135deg, #2563eb, #1e40af);
}
.subject-card.info {
  background: linear-gradient(135deg, #059669, #065f46);
}
.subject-icon {
  font-size: 36px;
  width: 56px;
  height: 56px;
  background: rgba(255,255,255,0.15);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.subject-info h3 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: 4px;
}
.subject-info p {
  font-size: var(--font-size-sm);
  opacity: 0.85;
  line-height: 1.6;
}
.subject-arrow {
  margin-left: auto;
  font-size: 22px;
  opacity: 0.7;
}

/* お知らせ */
.notice-section {
  margin-bottom: var(--space-10);
}
.notice-list {
  list-style: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-card);
}
.notice-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
}
.notice-item:last-child {
  border-bottom: none;
}
.notice-date {
  color: var(--color-text-muted);
  white-space: nowrap;
  font-size: var(--font-size-xs);
}
.notice-tag {
  background: #fee2e2;
  color: #dc2626;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
}
.notice-tag.new {
  background: #dcfce7;
  color: #16a34a;
}
</style>
