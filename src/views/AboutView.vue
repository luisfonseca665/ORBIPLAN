<template>
  <div class="about">
    <div class="about-card">
      <h1>This is an about page</h1>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal que centra la tarjeta en la pantalla */
.about {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* Tarjeta minimalista con sombra suave */
.about-card {
  background: #FFFFFF;
  padding: 60px 80px;
  border-radius: 16px;
  border: 1px solid #E8E6E1;
  box-shadow: 0 12px 32px rgba(62, 44, 37, 0.04);
  text-align: center;
  max-width: 600px;
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(62, 44, 37, 0.08);
}

/* Tipografía destacada (Espresso) con un sutil subrayado (Chambray) */
h1 {
  margin: 0;
  font-size: 2.2rem;
  color: #3E2C25;
  font-weight: 700;
  letter-spacing: -0.03em;
}

h1::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background-color: #728DA6;
  margin: 24px auto 0;
  border-radius: 4px;
}

/* Responsividad para pantallas móviles */
@media (max-width: 768px) {
  .about-card {
    padding: 40px 20px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
}
</style>