<template>
  <div class="subject-view">
    <h1 class="page-title">科目を選ぶ</h1>
    <p class="page-subtitle">担当科目から講座を探しましょう。</p>

    <div class="subject-grid">
      <RouterLink
        v-for="subject in subjects"
        :key="subject.id"
        :to="`/subjects/${subject.id}`"
        class="subject-card"
        :class="subject.id"
      >
        <div class="subject-icon">{{ subject.icon }}</div>
        <div class="subject-body">
          <h2>{{ subject.name }}</h2>
          <p>{{ subject.desc }}</p>
          <ul class="course-tags">
            <li v-for="tag in subject.tags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
        <div class="subject-go">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
const subjects = [
  {
    id: 'math',
    name: '数学',
    icon: '∑',
    desc: '数学Ⅰ・A / 数学Ⅱ・B / 数学Ⅲ の各学年別講座',
    tags: ['数学Ⅰ・A', '数学Ⅱ・B', '数学Ⅲ', '演習', '入試対策']
  },
  {
    id: 'info',
    name: '情報',
    icon: '⌨',
    desc: '情報Ⅰ / 情報Ⅱ のプログラミング・アルゴリズム対策',
    tags: ['情報Ⅰ', '情報Ⅱ', 'プログラミング', 'アルゴリズム', '共通テスト対策']
  }
]
</script>

<style scoped>
.subject-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-5);
}

.subject-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-5);
  padding: var(--space-7, 28px);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: white;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}
.subject-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0);
  transition: background 0.2s;
}
.subject-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  text-decoration: none;
}
.subject-card:hover::before {
  background: rgba(255,255,255,0.05);
}

.subject-card.math {
  background: linear-gradient(135deg, #1d4ed8, #1e3a8a);
}
.subject-card.info {
  background: linear-gradient(135deg, #047857, #064e3b);
}

.subject-icon {
  font-size: 40px;
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.15);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.subject-body {
  flex: 1;
}
.subject-body h2 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-2);
}
.subject-body p {
  font-size: var(--font-size-sm);
  opacity: 0.85;
  line-height: 1.6;
  margin-bottom: var(--space-4);
}

.course-tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.course-tags li {
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 2px 10px;
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.subject-go {
  opacity: 0.6;
  flex-shrink: 0;
}
</style>
