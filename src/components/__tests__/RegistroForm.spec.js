import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginView from '@/views/LoginView.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

global.fetch = vi.fn()

describe('Orbiplan - Pruebas de Sistema: Registro de Usuarios (RegistroForm)', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('Caso 1: ES JEFE DE PROYECTO (SÍ) | EMAIL VÁLIDO (SÍ) | CONTRASEÑA >= 8 (SÍ) -> Usuario Registrado', async () => {
    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Cuenta creada exitosamente'
    })

    const wrapper = mount(LoginView)

    // Cambiamos a la pestaña de registro
    await wrapper.findAll('.tab-btn')[1].trigger('click')

    const registerForm = wrapper.findAll('form')[1]
    await registerForm.find('input[placeholder="Tu nombre"]').setValue('Luis Jefe')
    await registerForm.find('input[type="email"]').setValue('jefe@orbiplan.com')
    await registerForm.find('select').setValue('JEFE_PROYECTO')
    await registerForm.findAll('input[type="password"]')[0].setValue('Password123!')
    await registerForm.findAll('input[type="password"]')[1].setValue('Password123!')

    await registerForm.trigger('submit.prevent')
    await flushPromises()

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('exitosamente'))
    vi.unstubAllGlobals()
  })

  it('Caso 2: ES JEFE DE PROYECTO (SÍ) | EMAIL VÁLIDO (SÍ) | CONTRASEÑA >= 8 (NO) -> Error (Falla política de seguridad)', async () => {
    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(LoginView)
    await wrapper.findAll('.tab-btn')[1].trigger('click')

    const registerForm = wrapper.findAll('form')[1]
    await registerForm.find('input[placeholder="Tu nombre"]').setValue('Luis Jefe')
    await registerForm.find('input[type="email"]').setValue('jefe@orbiplan.com')
    await registerForm.find('select').setValue('JEFE_PROYECTO')
    await registerForm.findAll('input[type="password"]')[0].setValue('Pass12')
    await registerForm.findAll('input[type="password"]')[1].setValue('Pass12')

    await registerForm.trigger('submit.prevent')
    await flushPromises()

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Falla política de seguridad'))
    vi.unstubAllGlobals()
  })

  it('Caso 3: ES JEFE DE PROYECTO (SÍ) | EMAIL VÁLIDO (NO) | CONTRASEÑA >= 8 (SÍ) -> Error (Formato de email incorrecto)', async () => {
    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(LoginView)
    await wrapper.findAll('.tab-btn')[1].trigger('click')

    const registerForm = wrapper.findAll('form')[1]
    await registerForm.find('input[placeholder="Tu nombre"]').setValue('Luis Jefe')
    await registerForm.find('input[type="email"]').setValue('jefe-invalido')
    await registerForm.find('select').setValue('JEFE_PROYECTO')
    await registerForm.findAll('input[type="password"]')[0].setValue('Password123!')
    await registerForm.findAll('input[type="password"]')[1].setValue('Password123!')

    await registerForm.trigger('submit.prevent')
    await flushPromises()

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Formato de email incorrecto'))
    vi.unstubAllGlobals()
  })

  it('Caso 4: ES JEFE DE PROYECTO (SÍ) | EMAIL VÁLIDO (NO) | CONTRASEÑA >= 8 (NO) -> Error (Datos inválidos)', async () => {
    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(LoginView)
    await wrapper.findAll('.tab-btn')[1].trigger('click')

    const registerForm = wrapper.findAll('form')[1]
    await registerForm.find('input[placeholder="Tu nombre"]').setValue('Luis Jefe')
    await registerForm.find('input[type="email"]').setValue('jefe-invalido')
    await registerForm.find('select').setValue('JEFE_PROYECTO')
    await registerForm.findAll('input[type="password"]')[0].setValue('Pass12')
    await registerForm.findAll('input[type="password"]')[1].setValue('Pass12')

    await registerForm.trigger('submit.prevent')
    await flushPromises()

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Datos inválidos'))
    vi.unstubAllGlobals()
  })

  it('Caso 5: ES JEFE DE PROYECTO (NO) | EMAIL VÁLIDO (SÍ) | CONTRASEÑA >= 8 (SÍ) -> Error (Permisos insuficientes)', async () => {
    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(LoginView)
    await wrapper.findAll('.tab-btn')[1].trigger('click')

    const registerForm = wrapper.findAll('form')[1]
    await registerForm.find('input[placeholder="Tu nombre"]').setValue('Luis Alumno')
    await registerForm.find('input[type="email"]').setValue('alumno@orbiplan.com')
    await registerForm.find('select').setValue('ALUMNO')
    await registerForm.findAll('input[type="password"]')[0].setValue('Password123!')
    await registerForm.findAll('input[type="password"]')[1].setValue('Password123!')

    await registerForm.trigger('submit.prevent')
    await flushPromises()

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Permisos insuficientes'))
    vi.unstubAllGlobals()
  })

})
