<template>
  <div class="not-found">
    <div class="nf-code">404</div>
    <h1>ページが見つかりません</h1>
    <p>URLが間違っているか、ページが移動・削除された可能性があります。</p>
    <RouterLink to="/" class="btn btn-primary">ホームに戻る</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: var(--space-12) 0;
}
.nf-code {
  font-size: 80px;
  font-weight: 700;
  color: var(--color-border-dark);
  line-height: 1;
  margin-bottom: var(--space-4);
}
h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-3);
}
p {
  color: var(--color-text-muted);
  margin-bottom: var(--space-8);
}
</style>
