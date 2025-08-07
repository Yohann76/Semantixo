import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /connexion/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /se connecter/i })
    await submitButton.click()

    await expect(page.getByText(/email requis/i)).toBeVisible()
    await expect(page.getByText(/mot de passe requis/i)).toBeVisible()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/mot de passe/i).fill('password123')
    await page.getByRole('button', { name: /se connecter/i }).click()

    // Vérifier la redirection vers le dashboard
    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.getByText(/bienvenue/i)).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('wrong@example.com')
    await page.getByLabel(/mot de passe/i).fill('wrongpassword')
    await page.getByRole('button', { name: /se connecter/i }).click()

    await expect(page.getByText(/identifiants invalides/i)).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.getByRole('link', { name: /s'inscrire/i }).click()
    await expect(page).toHaveURL(/.*register/)
    await expect(page.getByRole('heading', { name: /inscription/i })).toBeVisible()
  })
})

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('should register new user successfully', async ({ page }) => {
    const testEmail = `test${Date.now()}@example.com`
    
    await page.getByLabel(/nom d'utilisateur/i).fill('testuser')
    await page.getByLabel(/email/i).fill(testEmail)
    await page.getByLabel(/mot de passe/i).fill('password123')
    await page.getByLabel(/confirmer le mot de passe/i).fill('password123')
    await page.getByRole('button', { name: /s'inscrire/i }).click()

    // Vérifier la redirection vers le dashboard
    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.getByText(/compte créé avec succès/i)).toBeVisible()
  })
}) 