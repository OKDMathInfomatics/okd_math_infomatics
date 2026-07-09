import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDataStore } from '@/composables/useDataStore'

const HomeView          = () => import('@/views/HomeView.vue')
const InstructorView    = () => import('@/views/InstructorView.vue')
const AdminLoginView    = () => import('@/views/AdminLoginView.vue')
const AdminDashView     = () => import('@/views/AdminDashView.vue')
const SubjectView       = () => import('@/views/SubjectView.vue')
const GradeView         = () => import('@/views/GradeView.vue')
const CourseListView    = () => import('@/views/CourseListView.vue')
const CourseDetailView  = () => import('@/views/CourseDetailView.vue')
const StudentLoginView  = () => import('@/views/StudentLoginView.vue')
const StudentResultView = () => import('@/views/StudentResultView.vue')
const NotFoundView      = () => import('@/views/NotFoundView.vue')

const routes = [
  { path: '/',           name: 'home',           component: HomeView,         meta: { title: '創学ゼミ' } },
  { path: '/instructor', name: 'instructor',      component: InstructorView,   meta: { title: '講師紹介' } },

  // 管理者
  { path: '/admin',           name: 'admin-login',  component: AdminLoginView, meta: { title: '管理者ログイン' } },
  { path: '/admin/dashboard', name: 'admin-dash',   component: AdminDashView,  meta: { title: '先生用管理画面', requiresAuth: true } },

  // 生徒向け階層
  { path: '/subjects',                    name: 'subjects', component: SubjectView,    meta: { title: '科目を選ぶ' } },
  { path: '/subjects/:subject',           name: 'grade',    component: GradeView,      meta: { title: '学年を選ぶ' } },
  { path: '/subjects/:subject/:grade',    name: 'courses',  component: CourseListView, meta: { title: '講座一覧' } },
  { path: '/courses/:courseId',           name: 'course-detail', component: CourseDetailView, meta: { title: '講座詳細' } },

  // 生徒ログイン・成績
  { path: '/courses/:courseId/login',  name: 'student-login',  component: StudentLoginView,  meta: { title: '生徒ログイン' } },
  { path: '/courses/:courseId/result', name: 'student-result', component: StudentResultView, meta: { title: '成績確認', requiresStudentAuth: true } },

  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: 'ページが見つかりません' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title || '創学ゼミ') + ' | 創学ゼミ'

  if (to.meta.requiresAuth) {
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated()) {
      next({ name: 'admin-login', query: { redirect: to.fullPath } })
      return
    }
  }

  if (to.meta.requiresStudentAuth) {
    const { getStudentSession } = useDataStore()
    if (!getStudentSession(to.params.courseId)) {
      next({ name: 'student-login', params: { courseId: to.params.courseId } })
      return
    }
  }

  next()
})

export default router
