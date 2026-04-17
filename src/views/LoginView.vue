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
            <label>Correo electrónico</label>
            <input v-model="loginForm.email" type="email" placeholder="ejemplo@correo.com" required :disabled="isLoading" />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input v-model="loginForm.password" type="password" placeholder="••••••••" required :disabled="isLoading" />
          </div>

          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Accediendo...' : 'Acceder a Orbiplan' }}
          </button>

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
            <label>Nombre Completo</label>
            <input v-model="registerForm.nombre" type="text" placeholder="Tu nombre" required :disabled="isLoading" />
          </div>
          <div class="form-group">
            <label>Correo electrónico</label>
            <input v-model="registerForm.email" type="email" placeholder="ejemplo@correo.com" required :disabled="isLoading" />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Contraseña</label>
              <input v-model="registerForm.password" type="password" placeholder="••••••••" required :disabled="isLoading" />
            </div>
            <div class="form-group">
              <label>Confirmar</label>
              <input v-model="registerForm.confirmPassword" type="password" placeholder="••••••••" required :disabled="isLoading" />
            </div>
          </div>

          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Creando cuenta...' : 'Crear cuenta' }}
          </button>

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
const isLoading = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  nombre: '',
  email: '',
  password: '',
  confirmPassword: '',
  rol: 'ALUMNO' // Rol por defecto
})

// --- LÓGICA DE INICIO DE SESIÓN ---
const handleLogin = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Correo o contraseña incorrectos')
    }

    const data = await response.json()
    
    // GUARDAR SESIÓN
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuarioNombre', data.nombre)
    localStorage.setItem('usuarioRol', data.rol)

    router.push('/') // Ir al Dashboard
  } catch (error) {
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}

// --- LÓGICA DE REGISTRO ---
const handleRegister = async () => {
  if (registerForm.password !== registerForm.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  isLoading.value = true
  try {
    const response = await fetch('http://localhost:8080/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: registerForm.nombre,
        email: registerForm.email,
        password: registerForm.password,
        rol: registerForm.rol
      })
    })

    const data = await response.text()

    if (!response.ok) throw new Error(data || 'Error al registrar')

    alert('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.')
    activeTab.value = 'login'
    loginForm.email = registerForm.email
  } catch (error) {
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}

const loginConGoogle = () => {
  alert('El login con Google requiere configuración de credenciales OAuth2 en Google Cloud Console.');
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #FAFAF9; /* Fondo cálido global */
  padding: 20px;
  font-family: inherit;
}

.auth-card {
  background: white;
  width: 100%;
  max-width: 460px;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(62, 44, 37, 0.06);
  overflow: hidden;
  border: 1px solid #E8E6E1;
}

.tab-controls {
  display: flex;
  background-color: #FDFDFD;
  border-bottom: 1px solid #E8E6E1;
}

.tab-btn {
  flex: 1;
  padding: 20px 0;
  border: none;
  background: none;
  color: #9A938E;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #728DA6;
}

.tab-btn.active {
  color: #3E2C25;
  border-bottom: 3px solid #728DA6;
  font-weight: 600;
  background-color: white;
}

.auth-form-container {
  padding: 40px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #4A403B;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #E8E6E1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #3E2C25;
  background: #FAFAF9;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #728DA6;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(114, 141, 166, 0.15);
}

.form-group input::placeholder {
  color: #C0BBB6;
}

.btn-primary {
  padding: 14px;
  background-color: #728DA6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  letter-spacing: 0.02em;
}

.btn-primary:hover:not(:disabled) {
  background-color: #5A748A;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(114, 141, 166, 0.2);
}

.btn-primary:disabled {
  background-color: #C0BBB6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.divider-text {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 15px 0;
  color: #9A938E;
  font-size: 0.85rem;
  font-weight: 500;
}

.divider-text::before,
.divider-text::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #E8E6E1;
}

.divider-text span {
  padding: 0 15px;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background-color: white;
  border: 1px solid #E8E6E1;
  border-radius: 8px;
  font-weight: 500;
  color: #4A403B;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.btn-google:hover {
  background-color: #FAFAF9;
  border-color: #D1CEC7;
}

.google-icon {
  width: 22px;
  height: 22px;
}
</style>