import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GestionTareas from '@/views/TareasView.vue'

describe('Orbiplan - Tabla: Gestión de Tareas (Maestro) - Matriz 3', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Mock local fetch to return empty task lists on mount
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    })
  })

  // Helper function to open the new task modal
  const openModal = async (wrapper) => {
    const buttons = wrapper.findAll('.btn-primary')
    const nuevaTareaBtn = buttons.find(b => b.text().includes('Nueva Tarea'))
    if (nuevaTareaBtn) {
      await nuevaTareaBtn.trigger('click')
    } else {
      await wrapper.find('.btn-primary').trigger('click')
    }
  }

  it('Caso 1: Rol == Maestro (NO) -> Error (Permisos Insuficientes)', async () => {
    localStorage.setItem('usuarioRol', 'ALUMNO') // No es Maestro

    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(GestionTareas)
    await openModal(wrapper)

    // Hacemos clic en el botón de guardar directamente
    const saveButton = wrapper.findAll('.btn-primary').find(b => b.text().includes('Guardar'))
    if (saveButton) {
      await saveButton.trigger('click')
    } else {
      await wrapper.find('.modal-actions .btn-primary').trigger('click')
    }

    await flushPromises()
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Permisos Insuficientes'))
    vi.unstubAllGlobals()
  })

  it('Caso 2: Rol == Maestro (SÍ) | ¿Titulo valido? (NO) | Prioridad (SÍ) | Vencimiento (SÍ) -> Error (Titulo Vacio o Nulo)', async () => {
    localStorage.setItem('usuarioRol', 'MAESTRO')

    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(GestionTareas)
    await openModal(wrapper)

    // Título vacío, llenamos los demás campos
    await wrapper.find('select').setValue('ALTA')
    await wrapper.find('input[type="date"]').setValue('2026-05-30')

    const saveButton = wrapper.findAll('.btn-primary').find(b => b.text().includes('Guardar'))
    if (saveButton) {
      await saveButton.trigger('click')
    } else {
      await wrapper.find('.modal-actions .btn-primary').trigger('click')
    }

    await flushPromises()
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Titulo Vacio o Nulo'))
    vi.unstubAllGlobals()
  })

  it('Caso 3: Rol == Maestro (SÍ) | ¿Titulo valido? (SÍ) | Prioridad (NO) | Vencimiento (SÍ) -> Error (Faltan Datos / Prioridad)', async () => {
    localStorage.setItem('usuarioRol', 'MAESTRO')

    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(GestionTareas)
    await openModal(wrapper)

    // Llenamos título, vaciamos prioridad, llenamos fecha
    await wrapper.find('input[type="text"]').setValue('Proyecto Final')
    await wrapper.find('select').setValue('') // Vaciamos prioridad
    await wrapper.find('input[type="date"]').setValue('2026-05-30')

    const saveButton = wrapper.findAll('.btn-primary').find(b => b.text().includes('Guardar'))
    if (saveButton) {
      await saveButton.trigger('click')
    } else {
      await wrapper.find('.modal-actions .btn-primary').trigger('click')
    }

    await flushPromises()
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Faltan Datos / Prioridad'))
    vi.unstubAllGlobals()
  })

  it('Caso 4: Rol == Maestro (SÍ) | ¿Titulo valido? (SÍ) | Prioridad (SÍ) | Vencimiento (NO) -> Error (Formato de Fecha Invalido)', async () => {
    localStorage.setItem('usuarioRol', 'MAESTRO')

    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    const wrapper = mount(GestionTareas)
    await openModal(wrapper)

    // Llenamos título y prioridad, dejamos fecha de vencimiento vacía
    await wrapper.find('input[type="text"]').setValue('Proyecto Final')
    await wrapper.find('select').setValue('ALTA')
    await wrapper.find('input[type="date"]').setValue('') // Fecha vacía

    const saveButton = wrapper.findAll('.btn-primary').find(b => b.text().includes('Guardar'))
    if (saveButton) {
      await saveButton.trigger('click')
    } else {
      await wrapper.find('.modal-actions .btn-primary').trigger('click')
    }

    await flushPromises()
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Formato de Fecha Invalido'))
    vi.unstubAllGlobals()
  })

  it('Caso 5: Rol == Maestro (SÍ) | ¿Titulo valido? (SÍ) | Prioridad (SÍ) | Vencimiento (SÍ) -> tarea/proyecto creado', async () => {
    localStorage.setItem('usuarioRol', 'MAESTRO')

    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    })

    const wrapper = mount(GestionTareas)
    await openModal(wrapper)

    // Todos los campos válidos
    await wrapper.find('input[type="text"]').setValue('Proyecto Final')
    await wrapper.find('select').setValue('ALTA')
    await wrapper.find('input[type="date"]').setValue('2026-05-30')

    const saveButton = wrapper.findAll('.btn-primary').find(b => b.text().includes('Guardar'))
    if (saveButton) {
      await saveButton.trigger('click')
    } else {
      await wrapper.find('.modal-actions .btn-primary').trigger('click')
    }

    await flushPromises()
    expect(alertMock).not.toHaveBeenCalled()
    expect(wrapper.find('.modal-title').exists()).toBe(false) // El modal se cerró exitosamente
    vi.unstubAllGlobals()
  })

})
