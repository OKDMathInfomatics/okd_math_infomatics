<template>
  <div class="course-list-view">
    <nav class="breadcrumb">
      <RouterLink to="/">ホーム</RouterLink>
      <span class="breadcrumb-sep">›</span>
      <RouterLink to="/subjects">科目一覧</RouterLink>
      <span class="breadcrumb-sep">›</span>
      <RouterLink :to="`/subjects/${subjectId}`">{{ subjectLabel }}</RouterLink>
      <span class="breadcrumb-sep">›</span>
      <span>{{ gradeLabel }}</span>
    </nav>

    <h1 class="page-title">{{ subjectLabel }} ／ {{ gradeLabel }} の講座</h1>
    <p class="page-subtitle">受講している講座を選んでください。</p>

    <!-- ローディング -->
    <div v-if="loading" class="loading">読み込み中...</div>

    <!-- 講座リスト -->
    <div v-else class="course-grid">
      <RouterLink
        v-for="course in filteredCourses"
        :key="course.id"
        :to="`/courses/${course.id}`"
        class="course-card card"
      >
        <div class="course-header">
          <span class="badge" :class="`badge-${subjectId}`">{{ subjectLabel }}</span>
          <span class="course-grade-badge">{{ gradeLabel }}</span>
        </div>
        <h3 class="course-name">{{ course.name }}</h3>
        <p class="course-desc">{{ course.description }}</p>
        <div class="course-footer">
          <span class="course-meta">生徒数：{{ course.studentCount }}名</span>
          <span class="course-meta">テスト：{{ course.testCount }}回</span>
        </div>
        <div class="course-go">成績を確認する →</div>
      </RouterLink>
    </div>

    <div v-if="!loading && filteredCourses.length === 0" class="empty">
      <p>この学年の講座はまだ登録されていません。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const subjectId = computed(() => route.params.subject)
const gradeId = computed(() => route.params.grade)

const subjectLabel = computed(() =>
  subjectId.value === 'math' ? '数学' : '情報'
)
const gradeLabels = { grade1: '高1', grade2: '高2', grade3: '高3' }
const gradeLabel = computed(() => gradeLabels[gradeId.value] || gradeId.value)

const loading = ref(true)
const allCourses = ref([])

const filteredCourses = computed(() =>
  allCourses.value.filter(
    c => c.subject === subjectId.value && c.grade === gradeId.value
  )
)

onMounted(async () => {
  try {
    // courses.json から講座データを取得
    const res = await fetch(new URL('@/data/courses.json', import.meta.url).href)
    allCourses.value = await res.json()
  } catch (e) {
    console.error('講座データの読み込みに失敗:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.loading {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-10);
}
.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-10);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-5);
}

.course-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-5);
  text-decoration: none;
  color: var(--color-text);
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}
.course-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  text-decoration: none;
}

.course-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.course-grade-badge {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: var(--font-size-xs);
  padding: 1px 8px;
  color: var(--color-text-muted);
  font-weight: 600;
}
.course-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--space-2);
  line-height: 1.4;
}
.course-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  flex: 1;
  line-height: 1.6;
  margin-bottom: var(--space-4);
}
.course-footer {
  display: flex;
  gap: var(--space-4);
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}
.course-go {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 600;
  text-align: right;
}

.badge-math { background: var(--color-math-light); color: var(--color-math); }
.badge-info { background: var(--color-info-light); color: var(--color-info); }
</style>
