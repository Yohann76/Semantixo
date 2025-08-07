import { config } from '@vue/test-utils'

// Configuration globale pour les tests Vue
config.global.stubs = {
  // Stub des composants globaux si nécessaire
}

// Mock des modules externes si nécessaire
vi.mock('@/services/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn()
})) 