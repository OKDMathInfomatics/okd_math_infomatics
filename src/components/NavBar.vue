<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="container navbar-inner">
      <!-- ロゴ -->
      <RouterLink to="/" class="navbar-logo">
        <span class="logo-text">創学ゼミ</span>
        <span class="logo-sub">数学・情報</span>
      </RouterLink>

      <!-- デスクトップナビ -->
      <ul class="navbar-links" :class="{ open: menuOpen }">
        <li>
          <RouterLink to="/" @click="menuOpen = false">ホーム</RouterLink>
        </li>
        <li>
          <RouterLink to="/instructor" @click="menuOpen = false">講師紹介</RouterLink>
        </li>
        <li>
          <RouterLink to="/subjects" @click="menuOpen = false">講座を探す</RouterLink>
        </li>
        <li class="nav-admin">
          <RouterLink to="/admin" @click="menuOpen = false">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            管理者
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

    <!-- モバイルメニュー背景オーバーレイ -->
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
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid transparent;
  z-index: 100;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.navbar.scrolled {
  border-color: var(--color-border);
  box-shadow: var(--shadow-sm);
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
  align-items: baseline;
  gap: var(--space-2);
  text-decoration: none;
}
.logo-text {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
}
.logo-sub {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: 500;
}

/* ナビリンク */
.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  list-style: none;
}
.navbar-links li a,
.navbar-links li a:visited {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.navbar-links li a:hover,
.navbar-links li a.router-link-active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  text-decoration: none;
}

/* 管理者リンク */
.nav-admin a {
  border: 1.5px solid var(--color-border);
  margin-left: var(--space-2);
}
.nav-admin a:hover {
  border-color: var(--color-primary);
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
  background: var(--color-text);
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}
.hamburger.active span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger.active span:nth-child(2) {
  opacity: 0;
}
.hamburger.active span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* オーバーレイ */
.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: -1;
}
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* モバイル */
@media (max-width: 680px) {
  .hamburger { display: flex; }

  .navbar-links {
    position: fixed;
    top: var(--navbar-height);
    right: 0;
    bottom: 0;
    width: 240px;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: white;
    padding: var(--space-4);
    transform: translateX(100%);
    transition: transform 0.25s ease;
    box-shadow: var(--shadow-lg);
  }
  .navbar-links.open {
    transform: translateX(0);
  }
  .navbar-links li a {
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-size-base);
    border-radius: var(--radius);
  }
  .nav-admin {
    margin-top: var(--space-4);
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-4);
  }
  .nav-admin a {
    border: none;
    margin-left: 0;
  }
}
</style>
