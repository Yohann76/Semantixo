import { test, expect } from '@playwright/test'

test.describe('Navigation and UI', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/mot de passe/i).fill('password123')
    await page.getByRole('button', { name: /se connecter/i }).click()
    
    // Attendre la redirection vers le dashboard
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test.describe('Dashboard Navigation', () => {
    test('should display dashboard correctly', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
      await expect(page.getByText(/bienvenue/i)).toBeVisible()
    })

    test('should navigate to all analysis pages', async ({ page }) => {
      // Navigation vers Text SEO
      await page.getByRole('link', { name: /analyse de texte/i }).click()
      await expect(page).toHaveURL(/.*text-seo/)
      await expect(page.getByRole('heading', { name: /analyse de texte/i })).toBeVisible()

      // Navigation vers Page SEO
      await page.getByRole('link', { name: /analyse de page/i }).click()
      await expect(page).toHaveURL(/.*page-seo/)
      await expect(page.getByRole('heading', { name: /analyse de page/i })).toBeVisible()

      // Navigation vers Domain Analysis
      await page.getByRole('link', { name: /analyse de domaine/i }).click()
      await expect(page).toHaveURL(/.*domain/)
      await expect(page.getByRole('heading', { name: /analyse de domaine/i })).toBeVisible()

      // Navigation vers Internal Links
      await page.getByRole('link', { name: /liens internes/i }).click()
      await expect(page).toHaveURL(/.*internal-link/)
      await expect(page.getByRole('heading', { name: /liens internes/i })).toBeVisible()
    })
  })

  test.describe('Sidebar Navigation', () => {
    test('should toggle sidebar on mobile', async ({ page }) => {
      // Simuler un écran mobile
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Vérifier que le menu hamburger est visible
      await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
      
      // Ouvrir le menu
      await page.getByRole('button', { name: /menu/i }).click()
      
      // Vérifier que la sidebar est ouverte
      await expect(page.getByRole('navigation')).toBeVisible()
    })

    test('should display all menu items', async ({ page }) => {
      // Vérifier que tous les éléments du menu sont présents
      await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /analyse de texte/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /analyse de page/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /analyse de domaine/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /liens internes/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /historique/i })).toBeVisible()
    })
  })

  test.describe('User Interface', () => {
    test('should display user profile information', async ({ page }) => {
      // Cliquer sur le menu utilisateur
      await page.getByRole('button', { name: /profil/i }).click()
      
      // Vérifier les informations utilisateur
      await expect(page.getByText(/test@example.com/i)).toBeVisible()
      await expect(page.getByRole('link', { name: /déconnexion/i })).toBeVisible()
    })

    test('should logout successfully', async ({ page }) => {
      // Cliquer sur déconnexion
      await page.getByRole('button', { name: /profil/i }).click()
      await page.getByRole('link', { name: /déconnexion/i }).click()
      
      // Vérifier la redirection vers la page de login
      await expect(page).toHaveURL(/.*login/)
      await expect(page.getByRole('heading', { name: /connexion/i })).toBeVisible()
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await expect(page.getByRole('navigation')).toBeVisible()
    })

    test('should work on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await expect(page.getByRole('navigation')).toBeVisible()
    })

    test('should work on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      // Sur mobile, la navigation peut être cachée par défaut
      await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
    })
  })
}) 