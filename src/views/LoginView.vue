<template>
  <div class="auth-page">
    <div class="auth-card">

      <div class="tab-controls">
        <button
          :class="['tab-btn', { active: activeTab === 'login' }]"
          @click="activeTab = 'login'"
        >
          Iniciar Sesión
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'register' }]"
          @click="activeTab = 'register'"
        >
          Registrarse
        </button>
      </div>

      <div v-if="activeTab === 'login'" class="auth-form-container">
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label>Correo*</label>
            <input v-model="loginForm.email" type="email" placeholder="Correo" required />
          </div>
          <div class="form-group">
            <label>Contraseña*</label>
            <input v-model="loginForm.password" type="password" placeholder="Contraseña" required />
          </div>

          <button type="submit" class="btn-primary">Acceder</button>

          <div class="divider-text"><span>o ingresa con</span></div>
          <button type="button" class="btn-google" @click="loginConGoogle">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="google-icon">
            Continuar con Google
          </button>
        </form>
      </div>

      <div v-else class="auth-form-container">
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label>Nombre*</label>
            <input v-model="registerForm.nombre" type="text" placeholder="Nombre" required />
          </div>
          <div class="form-group">
            <label>Contraseña*</label>
            <input v-model="registerForm.password" type="password" placeholder="Contraseña" required />
          </div>
          <div class="form-group">
            <label>Confirmar contraseña*</label>
            <input v-model="registerForm.confirmPassword" type="password" placeholder="Confirmar" required />
          </div>

          <button type="submit" class="btn-primary">Crear cuenta</button>

          <div class="divider-text"><span>o regístrate con</span></div>
          <button type="button" class="btn-google" @click="loginConGoogle">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="google-icon">
            Registrarse con Google
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


const activeTab = ref('login')


const loginForm = reactive({
  email: '',
  password: ''
})


const registerForm = reactive({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})


const handleLogin = () => {
  console.log('Intentando iniciar sesión con:', loginForm)
  router.push('/')
}

const handleRegister = () => {
  console.log('Intentando registrar:', registerForm)

  if (registerForm.password !== registerForm.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  alert('Cuenta creada exitosamente')
}

const loginConGoogle = () => {
  console.log('Iniciando flujo de Google...')
  alert('Aquí se abrirá la ventana emergente de Google');
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 20px;
}

.auth-card {
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  overflow: hidden;
}

.tab-controls {
  display: flex;
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.tab-btn {
  flex: 1;
  padding: 18px 0;
  border: none;
  background: none;
  color: #6b7280;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #003366;
}

.tab-btn.active {
  color: #003366;
  border-bottom: 3px solid #003366;
  background-color: white;
}

.auth-form-container {
  padding: 30px 40px;
}

.auth-container {
  display: flex;
  flex-direction: column;
  background: white;
  width: 100%;
  max-width: 900px;
}

@media (min-width: 768px) {
  .auth-container {
    flex-direction: row;
    align-items: flex-start;
  }
}

.auth-section {
  flex: 1;
  padding: 20px 40px;
}

.divider {
  display: none;
  width: 1px;
  background-color: #e5e7eb;
  margin: 40px 0;
  min-height: 500px;
}

@media (min-width: 768px) {
  .divider {
    display: block;
  }
}

h2 {
  text-align: center;
  color: #003366;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  margin-top: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  color: #333;
  font-weight: 600;
  font-size: 0.85rem;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.95rem;
  color: #333;
}

.form-group input::placeholder {
  color: #9ca3af;
}

.form-group input:focus {
  outline: none;
  border-color: #003366;
}

.help-text {
  font-size: 0.7rem;
  color: #6b7280;
  margin-top: 2px;
  line-height: 1.2;
}

.btn-primary {
  padding: 12px;
  background-color: #003366;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #002244;
}

.terms-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 0.8rem;
  color: #4b5563;
}

.terms-group input[type="checkbox"] {
  cursor: pointer;
}

.terms-group a {
  color: #3b82f6;
  text-decoration: none;
}

.terms-group a:hover {
  text-decoration: underline;
}

.divider-text {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: #6b7280;
  font-size: 0.85rem;
}

.divider-text::before,
.divider-text::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider-text span {
  padding: 0 10px;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn-google:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.google-icon {
  width: 20px;
  height: 20px;
}

</style>
