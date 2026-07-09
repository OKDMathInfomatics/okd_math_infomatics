<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="container navbar-inner">
      <!-- ロゴ -->
      <RouterLink to="/" class="navbar-logo">
        <span class="logo-sougaku">SOUGAKU</span>
        <span class="logo-sep">|</span>
        <span class="logo-sub">OKD MATH / Informatics</span>
      </RouterLink>

      <!-- デスクトップナビ -->
      <ul class="navbar-links" :class="{ open: menuOpen }">
        <li>
          <RouterLink to="/" @click="menuOpen = false">HOME</RouterLink>
        </li>
        <li>
          <RouterLink to="/instructor" @click="menuOpen = false">INSTRUCTOR</RouterLink>
        </li>
        <li>
          <RouterLink to="/subjects" @click="menuOpen = false">COURSES</RouterLink>
        </li>
        <li class="nav-admin">
          <RouterLink to="/admin" @click="menuOpen = false">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            ADMIN
          </RouterLink>
        </li>
      </ul>

      <!-- ハンバーガーメニュー（モバイル） -->
      <button
        class="hamburger"
        :class="{ active: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="メニューを開く"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <Transition name="overlay">
      <div v-if="menuOpen" class="menu-overlay" @click="menuOpen = false" />
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const menuOpen = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  background: rgba(240, 235, 224, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  z-index: 100;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.navbar.scrolled {
  border-color: var(--color-border);
  box-shadow: 0 1px 8px rgba(26, 42, 74, 0.08);
}

.navbar-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ロゴ */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
}
.logo-sougaku {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: 0.12em;
}
.logo-sep {
  color: var(--color-border-dark);
  font-weight: 300;
}
.logo-sub {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 500;
  letter-spacing: 0.06em;
}

/* ナビリンク */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 0;
  list-style: none;
}
.navbar-links li a,
.navbar-links li a:visited {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: var(--space-2) var(--space-3);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.15s;
  border-bottom: 2px solid transparent;
}
.navbar-links li a:hover,
.navbar-links li a.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-accent);
  text-decoration: none;
}

/* 管理者リンク */
.nav-admin {
  margin-left: var(--space-4);
}
.nav-admin a {
  background: var(--color-primary);
  color: white !important;
  border-radius: var(--radius);
  padding: var(--space-1) var(--space-3) !important;
  border-bottom: none !important;
}
.nav-admin a:hover {
  background: var(--color-primary-dark);
  color: white !important;
}

/* ハンバーガー */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: var(--space-2);
  cursor: pointer;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-primary);
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}
.hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: -1;
}
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.2s; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

@media (max-width: 680px) {
  .hamburger { display: flex; }
  .navbar-links {
    position: fixed;
    top: var(--navbar-height);
    right: 0;
    bottom: 0;
    width: 220px;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: #f8f4ec;
    padding: var(--space-4);
    transform: translateX(100%);
    transition: transform 0.25s ease;
    box-shadow: var(--shadow-lg);
  }
  .navbar-links.open { transform: translateX(0); }
  .navbar-links li a {
    padding: var(--space-3) var(--space-4) !important;
    font-size: var(--font-size-sm) !important;
    border-radius: var(--radius);
    border-bottom: none !important;
  }
  .nav-admin { margin-left: 0; margin-top: var(--space-4); }
}
</style>
