import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// ===== View コンポーネント（遅延ロードで初期表示を高速化）=====
const HomeView        = () => import('@/views/HomeView.vue')
const InstructorView  = () => import('@/views/InstructorView.vue')
const AdminLoginView  = () => import('@/views/AdminLoginView.vue')
const AdminDashView   = () => import('@/views/AdminDashView.vue')
const AdminEditView   = () => import('@/views/AdminEditView.vue')
const SubjectView     = () => import('@/views/SubjectView.vue')
const GradeView       = () => import('@/views/GradeView.vue')
const CourseListView  = () => import('@/views/CourseListView.vue')
const CourseDetailView = () => import('@/views/CourseDetailView.vue')
const NotFoundView    = () => import('@/views/NotFoundView.vue')

const routes = [
  // ===== 公開ページ =====
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '創学ゼミ' }
  },
  {
    path: '/instructor',
    name: 'instructor',
    component: InstructorView,
    meta: { title: '講師紹介 | 創学ゼミ' }
  },

  // ===== 管理者ページ =====
  {
    path: '/admin',
    name: 'admin-login',
    component: AdminLoginView,
    meta: { title: '管理者ログイン' }
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashView,
    meta: { title: '管理ダッシュボード', requiresAuth: true }
  },
  {
    path: '/admin/edit/:courseId',
    name: 'admin-edit',
    component: AdminEditView,
    meta: { title: '成績編集', requiresAuth: true }
  },

  // ===== 生徒向けページ（階層構造）=====
  {
    // 科目選択: /subjects
    path: '/subjects',
    name: 'subjects',
    component: SubjectView,
    meta: { title: '科目を選ぶ | 創学ゼミ' }
  },
  {
    // 学年選択: /subjects/math  または  /subjects/info
    path: '/subjects/:subject',
    name: 'grade',
    component: GradeView,
    meta: { title: '学年を選ぶ' }
  },
  {
    // 講座一覧: /subjects/math/grade2
    path: '/subjects/:subject/:grade',
    name: 'courses',
    component: CourseListView,
    meta: { title: '講座一覧' }
  },
  {
    // 講座詳細（成績ページ）: /courses/MATH_2A_2024
    path: '/courses/:courseId',
    name: 'course-detail',
    component: CourseDetailView,
    meta: { title: '講座詳細' }
  },

  // ===== 404 =====
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'ページが見つかりません' }
  }
]

const router = createRouter({
  // GitHub Pages では hash モードが設定不要で動く
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// ===== ナビゲーションガード =====
router.beforeEach((to, from, next) => {
  // ページタイトル更新
  document.title = to.meta.title || '創学ゼミ'

  // 管理者認証チェック
  if (to.meta.requiresAuth) {
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated()) {
      next({ name: 'admin-login', query: { redirect: to.fullPath } })
      return
    }
  }
  next()
})

export default router
