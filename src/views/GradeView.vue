<template>
  <div class="grade-view">
    <!-- ブレッドクラム -->
    <nav class="breadcrumb">
      <RouterLink to="/">ホーム</RouterLink>
      <span class="breadcrumb-sep">›</span>
      <RouterLink to="/subjects">科目一覧</RouterLink>
      <span class="breadcrumb-sep">›</span>
      <span>{{ subjectLabel }}</span>
    </nav>

    <h1 class="page-title">
      <span class="badge" :class="`badge-${subjectId}`">{{ subjectLabel }}</span>
      &nbsp;学年を選ぶ
    </h1>
    <p class="page-subtitle">受講している学年を選んでください。</p>

    <div class="grade-grid">
      <RouterLink
        v-for="grade in grades"
        :key="grade.id"
        :to="`/subjects/${subjectId}/${grade.id}`"
        class="grade-card card"
      >
        <div class="grade-label">{{ grade.label }}</div>
        <div class="grade-name">{{ grade.name }}</div>
        <div class="grade-count">{{ grade.courseCount }}講座</div>
        <div class="grade-arrow">→</div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const subjectId = computed(() => route.params.subject)
const subjectLabel = computed(() =>
  subjectId.value === 'math' ? '数学' : '情報'
)

// 学年一覧（後ほど courses.json から動的に生成）
const grades = [
  { id: 'grade1', label: '高1', name: '高校1年生', courseCount: 2 },
  { id: 'grade2', label: '高2', name: '高校2年生', courseCount: 3 },
  { id: 'grade3', label: '高3', name: '高校3年生', courseCount: 4 }
]
</script>

<style scoped>
.grade-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  max-width: 700px;
}

.grade-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-8) var(--space-5);
  text-decoration: none;
  color: var(--color-text);
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
  position: relative;
}
.grade-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  text-decoration: none;
}

.grade-label {
  font-size: 40px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}
.grade-name {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
}
.grade-count {
  font-size: var(--font-size-xs);
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 600;
}
.grade-arrow {
  position: absolute;
  top: 50%;
  right: var(--space-4);
  transform: translateY(-50%);
  color: var(--color-text-light);
  font-size: 18px;
}

.badge-math { background: var(--color-math-light); color: var(--color-math); }
.badge-info { background: var(--color-info-light); color: var(--color-info); }
</style>
