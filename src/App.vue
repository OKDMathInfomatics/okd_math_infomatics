<template>
  <div id="app-root">
    <NavBar />
    <main class="page-content">
      <div class="container">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>
    <footer class="site-footer">
      <div class="container">
        <p>© {{ new Date().getFullYear() }} 創学ゼミ &nbsp;|&nbsp; 数学・情報担当：奥田</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<style scoped>
#app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-footer {
  background: var(--color-text);
  color: #94a3b8;
  padding: var(--space-5) 0;
  font-size: var(--font-size-sm);
  text-align: center;
  margin-top: auto;
}

/* ページ遷移アニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
