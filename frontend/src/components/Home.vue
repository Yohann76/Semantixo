<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="title">Hello World !</h1>
      <p class="subtitle">Bienvenue dans votre application Semantixo</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 90px;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.title {
  font-size: 3rem;
  margin-bottom: 10px;
  font-weight: bold;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}
</style> 