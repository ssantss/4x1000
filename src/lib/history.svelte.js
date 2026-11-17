// Historial local (sólo en este dispositivo); se guarda al dejar de escribir
export class History {
  items = $state([])
  #key
  #timer

  constructor(key) {
    this.#key = key
  }

  load() {
    try {
      this.items = JSON.parse(localStorage.getItem(this.#key) || '[]')
    } catch {
      this.items = []
    }
  }

  // Guarda la entrada 1,5 s después del último cambio, sin repetir la anterior
  schedule(entry) {
    clearTimeout(this.#timer)
    if (!entry) return
    this.#timer = setTimeout(() => {
      if (this.items[0]?.id === entry.id) return
      this.#save([{ ...entry, date: new Date().toLocaleString('es-CO') }, ...this.items].slice(0, 8))
    }, 1500)
  }

  clear() {
    this.#save([])
  }

  #save(items) {
    this.items = items
    try {
      localStorage.setItem(this.#key, JSON.stringify(items))
    } catch {}
  }
}

// Evento de Umami sin datos: sólo el nombre, una vez por carga
const tracked = new Set()
export function trackOnce(name) {
  if (tracked.has(name)) return
  tracked.add(name)
  try {
    window.umami?.track(name)
  } catch {}
}
