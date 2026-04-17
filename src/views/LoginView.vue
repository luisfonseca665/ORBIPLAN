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
            <input v-model="loginForm.email" type="email" placeholder="Correo" required :disabled="isLoading" />
          </div>
          <div class="form-group">
            <label>Contraseña*</label>
            <input v-model="loginForm.password" type="password" placeholder="Contraseña" required :disabled="isLoading" />
          </div>

          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Accediendo...' : 'Acceder' }}
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
            <label>Nombre Completo*</label>
            <input v-model="registerForm.nombre" type="text" placeholder="Tu nombre" required :disabled="isLoading" />
          </div>
          <div class="form-group">
            <label>Correo*</label>
            <input v-model="registerForm.email" type="email" placeholder="Correo" required :disabled="isLoading" />
          </div>
          <div class="form-group">
            <label>Contraseña*</label>
            <input v-model="registerForm.password" type="password" placeholder="Contraseña" required :disabled="isLoading" />
          </div>
          <div class="form-group">
            <label>Confirmar contraseña*</label>
            <input v-model="registerForm.confirmPassword" type="password" placeholder="Confirmar" required :disabled="isLoading" />
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
/* Tus estilos se mantienen exactamente igual */
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

.form-group input:focus {
  outline: none;
  border-color: #003366;
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

.btn-primary:hover:not(:disabled) {
  background-color: #002244;
}

.btn-primary:disabled {
  background-color: #6b7280;
  cursor: not-allowed;
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
}

.google-icon {
  width: 20px;
  height: 20px;
}
</style>