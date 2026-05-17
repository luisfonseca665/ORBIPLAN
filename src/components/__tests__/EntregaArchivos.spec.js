import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import EntregaArchivos from '@/views/ArchivosView.vue'

describe('Orbiplan - Tabla: Entrega de Archivos (Alumno) - Matriz 2', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    // Mock local fetch to return empty folders/files lists on mount
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    })
  })

  // Helper function to open upload modal
  const openModal = async (wrapper) => {
    const buttons = wrapper.findAll('.btn-primary')
    const uploadButton = buttons.find(b => b.text().includes('Subir Archivo'))
    if (uploadButton) {
      await uploadButton.trigger('click')
    } else {
      await wrapper.find('.btn-primary').trigger('click')
    }
  }

  it('Caso 1: Alumno | Tamaño <= 100MB | Formato permitido | Regla de entrega cumple -> Archivo Entregado', async () => {
    localStorage.setItem('usuarioRol', 'ALUMNO')
    localStorage.setItem('entregaVencida', 'false')

    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    })

    const wrapper = mount(EntregaArchivos)
    await openModal(wrapper)

    // Simulamos un archivo válido de 5MB en formato PDF
    const validFile = new File([''], 'evidencia.pdf', { type: 'application/pdf' })
    Object.defineProperty(validFile, 'size', { value: 5 * 1024 * 1024 })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [validFile] })
    await input.trigger('change')
    await flushPromises()

    // Comprobamos que no saltó ninguna alerta de error
    expect(alertMock).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('Caso 2: Alumno | Tamaño > 100MB | Formato permitido | Regla de entrega cumple -> Error (Archivo demasiado grande)', async () => {
    localStorage.setItem('usuarioRol', 'ALUMNO')
    localStorage.setItem('entregaVencida', 'false')

    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(EntregaArchivos)
    await openModal(wrapper)

    // Simulamos archivo grande de 150MB
    const bigFile = new File([''], 'evidencia.pdf', { type: 'application/pdf' })
    Object.defineProperty(bigFile, 'size', { value: 150 * 1024 * 1024 })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [bigFile] })
    await input.trigger('change')
    await flushPromises()

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Archivo demasiado grande'))
    vi.unstubAllGlobals()
  })

  it('Caso 3: Alumno | Tamaño <= 100MB | Formato NO permitido | Regla de entrega cumple -> Error (Tipo de archivo no permitido)', async () => {
    localStorage.setItem('usuarioRol', 'ALUMNO')
    localStorage.setItem('entregaVencida', 'false')

    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(EntregaArchivos)
    await openModal(wrapper)

    // Simulamos archivo no permitido (.exe)
    const badFile = new File([''], 'script.exe', { type: 'application/octet-stream' })
    Object.defineProperty(badFile, 'size', { value: 5 * 1024 * 1024 })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [badFile] })
    await input.trigger('change')
    await flushPromises()

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Tipo de archivo no permitido'))
    vi.unstubAllGlobals()
  })

  it('Caso 4: Alumno | Tamaño <= 100MB | Formato permitido | Regla de entrega NO cumple (Vencido) -> Error (La tarea ha vencido y no permite entregas tardías)', async () => {
    localStorage.setItem('usuarioRol', 'ALUMNO')
    localStorage.setItem('entregaVencida', 'true') // Tarea vencida

    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(EntregaArchivos)
    await openModal(wrapper)

    const validFile = new File([''], 'evidencia.pdf', { type: 'application/pdf' })
    Object.defineProperty(validFile, 'size', { value: 5 * 1024 * 1024 })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [validFile] })
    await input.trigger('change')
    await flushPromises()

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('La tarea a vencido y no permite entregas tardias'))
    vi.unstubAllGlobals()
  })

  it('Caso 5: Jefe de proyecto/Maestro | Tamaño <= 100MB | Formato permitido | Regla de entrega cumple -> Error (Solo los alumnos entregan tareas)', async () => {
    localStorage.setItem('usuarioRol', 'JEFE_PROYECTO') // No es alumno
    localStorage.setItem('entregaVencida', 'false')

    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(EntregaArchivos)
    await openModal(wrapper)

    const validFile = new File([''], 'evidencia.pdf', { type: 'application/pdf' })
    Object.defineProperty(validFile, 'size', { value: 5 * 1024 * 1024 })

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [validFile] })
    await input.trigger('change')
    await flushPromises()

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Solo los alumnos entregan tareas'))
    vi.unstubAllGlobals()
  })

})
