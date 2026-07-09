<template>
  <div class="instructor-page">
    <h1 class="page-title">講師紹介</h1>
    <p class="page-subtitle">数学・情報担当講師のご紹介です。</p>

    <div class="profile-card card">
      <!-- アバター部分 -->
      <div class="profile-header">
        <div class="avatar">奥田</div>
        <div class="profile-meta">
          <h2 class="profile-name">奥田 <span class="profile-name-kana">（おくだ）</span></h2>
          <div class="profile-badges">
            <span class="badge badge-math">数学</span>
            <span class="badge badge-info">情報</span>
          </div>
        </div>
      </div>

      <!-- 詳細情報 -->
      <div class="profile-body">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">担当科目</div>
            <div class="info-value">数学（数Ⅰ・A / 数Ⅱ・B / 数Ⅲ・C）、情報（情報Ⅰ）</div>
          </div>
          <div class="info-item">
            <div class="info-label">所属校舎</div>
            <div class="info-value">創学ゼミ ○○校舎</div>
          </div>
          <div class="info-item">
            <div class="info-label">受付時間</div>
            <div class="info-value">授業前後、または授業後の質問タイム（要予約）</div>
          </div>
        </div>

        <!-- 担当講座一覧 -->
        <div class="courses-section">
          <div class="courses-label">担当講座</div>
          <ul class="course-list">
            <li v-for="course in courses" :key="course.name" class="course-list-item">
              <div class="course-list-header">
                <span class="badge" :class="course.badge">{{ course.subject }}</span>
                <span class="course-list-name">{{ course.name }}</span>
              </div>
              <p class="course-list-desc">{{ course.desc }}</p>
            </li>
          </ul>
        </div>

        <!-- メッセージ -->
        <div class="message-box">
          <div class="message-label">生徒へのメッセージ</div>
          <p class="message-text">
            数学や情報は「わかった！」の積み重ねで一気に伸びる科目です。<br />
            わからないまま放置しないで、授業後でも気軽に質問しに来てください。<br />
            一緒に考えましょう。
          </p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="cta">
      <RouterLink to="/subjects" class="btn btn-primary">講座を探す →</RouterLink>
    </div>
  </div>
</template>

<script setup>
const courses = [
  {
    subject: '数学',
    badge: 'badge-math',
    name: '高３ハイレベル数学ⅠAⅡBⅢC',
    desc: '阪大・神大をはじめとする難関大学合格に必要な思考力・記述力を鍛えます。'
  },
  {
    subject: '数学',
    badge: 'badge-math',
    name: '高３スタンダード数学ⅠAⅡB＋C',
    desc: '国公立大学合格に必要な土台を構築するとともに定石力を身につけます。'
  },
  {
    subject: '数学',
    badge: 'badge-math',
    name: '高２東大京大阪大医学部数学',
    desc: '最難関大学合格を目指し、高速かつ高度な単元学習を目指します。'
  },
  {
    subject: '数学',
    badge: 'badge-math',
    name: '高２ハイレベル理系数学',
    desc: '難関大学合格を目指し、高速単元学習を目指します。'
  },
  {
    subject: '数学',
    badge: 'badge-math',
    name: '高１数学《発展1》',
    desc: '最難関大学合格を目指し、高速かつ高度な単元学習を目指します。'
  },
  {
    subject: '数学',
    badge: 'badge-math',
    name: '高１数学《発展2》',
    desc: '難関大学合格へ向け、本当の単元理解を目指します。'
  },
  {
    subject: '情報',
    badge: 'badge-info',
    name: '高３共通テスト対策情報Ⅰ',
    desc: '共通テストで高得点を取るために必要な傾向と対策をお伝えします。'
  }
]
</script>

<style scoped>
.profile-card {
  padding: var(--space-8);
  max-width: 720px;
  margin: 0 auto var(--space-8);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  font-size: var(--font-size-lg);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-name {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-3);
}
.profile-name-kana {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  font-weight: 400;
}
.profile-badges {
  display: flex;
  gap: var(--space-2);
}

.info-grid {
  display: grid;
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}
.info-item {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: var(--space-3);
  font-size: var(--font-size-sm);
}
.info-label {
  font-weight: 700;
  color: var(--color-text-muted);
  padding-top: 1px;
}
.info-value {
  color: var(--color-text);
  line-height: 1.7;
}
.info-note {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.message-box {
  background: var(--color-primary-light);
  border-left: 3px solid var(--color-primary);
  border-radius: 0 var(--radius) var(--radius) 0;
  padding: var(--space-4) var(--space-5);
}
.message-label {
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.message-text {
  font-size: var(--font-size-sm);
  line-height: 1.9;
  color: var(--color-text);
}

/* 担当講座リスト */
.courses-section {
  margin-bottom: var(--space-6);
}
.courses-label {
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-4);
}
.course-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.course-list-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
}
.course-list-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}
.course-list-name {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-text);
}
.course-list-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  line-height: 1.6;
  padding-left: calc(var(--space-2) + 52px);
}

.cta {
  text-align: center;
}
</style>
