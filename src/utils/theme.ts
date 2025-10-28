export function init() {
  if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (prefersDark) localStorage.setItem('theme', 'dark')
    else localStorage.setItem('theme', 'light')
  }

  apply()
}

export async function change() {
  if (localStorage.getItem('theme') == 'dark') localStorage.setItem('theme', 'light')
  else localStorage.setItem('theme', 'dark')

  apply()
}

function apply() {
  if (localStorage.getItem('theme') == 'dark') {
    document.documentElement.style.setProperty('--body-bg', 'var(--bs-dark)')
    document.documentElement.style.setProperty('--main-text', 'var(--bs-white)')
    document.documentElement.style.setProperty('--main-bg', 'var(--bs-gray-dark)')
    document.documentElement.style.setProperty('--main-gray', 'var(--bs-gray-400)')
    document.documentElement.style.setProperty('--main-prim', 'var(--secondary-color)')
    document.documentElement.style.setProperty('--line', 'var(--bs-gray-700)')
    document.documentElement.style.setProperty('--line-clickable', 'var(--bs-gray-600)')
  } else {
    document.documentElement.style.setProperty('--body-bg', 'var(--bs-light)')
    document.documentElement.style.setProperty('--main-text', 'var(--bs-dark)')
    document.documentElement.style.setProperty('--main-bg', 'var(--bs-white)')
    document.documentElement.style.setProperty('--main-gray', 'var(--bs-gray)')
    document.documentElement.style.setProperty('--main-prim', 'var(--primary-color)')
    document.documentElement.style.setProperty('--line', 'var(--bs-gray-200)')
    document.documentElement.style.setProperty('--line-clickable', 'var(--bs-gray-400)')
  }
}
