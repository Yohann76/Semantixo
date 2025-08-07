import { test, expect } from '@playwright/test'

test.describe('SEO Analysis Features', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/mot de passe/i).fill('password123')
    await page.getByRole('button', { name: /se connecter/i }).click()
    
    // Attendre la redirection vers le dashboard
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test.describe('Text SEO Analysis', () => {
    test('should analyze text content', async ({ page }) => {
      await page.goto('/text-seo')
      
      // Vérifier que le formulaire est présent
      await expect(page.getByRole('heading', { name: /analyse de texte/i })).toBeVisible()
      await expect(page.getByLabel(/texte à analyser/i)).toBeVisible()
      
      // Remplir le formulaire
      const testText = 'Ceci est un texte de test pour l\'analyse SEO. Il contient des mots-clés importants.'
      await page.getByLabel(/texte à analyser/i).fill(testText)
      
      // Soumettre l'analyse
      await page.getByRole('button', { name: /analyser/i }).click()
      
      // Vérifier les résultats
      await expect(page.getByText(/résultats de l'analyse/i)).toBeVisible()
      await expect(page.getByText(/score/i)).toBeVisible()
    })

    test('should show error for empty text', async ({ page }) => {
      await page.goto('/text-seo')
      
      // Soumettre sans texte
      await page.getByRole('button', { name: /analyser/i }).click()
      
      // Vérifier le message d'erreur
      await expect(page.getByText(/texte requis/i)).toBeVisible()
    })
  })

  test.describe('Page SEO Analysis', () => {
    test('should analyze webpage URL', async ({ page }) => {
      await page.goto('/page-seo')
      
      // Vérifier le formulaire
      await expect(page.getByRole('heading', { name: /analyse de page/i })).toBeVisible()
      await expect(page.getByLabel(/url de la page/i)).toBeVisible()
      
      // Remplir avec une URL de test
      await page.getByLabel(/url de la page/i).fill('https://example.com')
      await page.getByRole('button', { name: /analyser/i }).click()
      
      // Vérifier que l'analyse est en cours
      await expect(page.getByText(/analyse en cours/i)).toBeVisible()
    })

    test('should show error for invalid URL', async ({ page }) => {
      await page.goto('/page-seo')
      
      // URL invalide
      await page.getByLabel(/url de la page/i).fill('invalid-url')
      await page.getByRole('button', { name: /analyser/i }).click()
      
      // Vérifier le message d'erreur
      await expect(page.getByText(/url invalide/i)).toBeVisible()
    })
  })

  test.describe('Domain Analysis', () => {
    test('should analyze domain', async ({ page }) => {
      await page.goto('/domain')
      
      // Vérifier le formulaire
      await expect(page.getByRole('heading', { name: /analyse de domaine/i })).toBeVisible()
      await expect(page.getByLabel(/nom de domaine/i)).toBeVisible()
      
      // Remplir avec un domaine de test
      await page.getByLabel(/nom de domaine/i).fill('example.com')
      await page.getByRole('button', { name: /analyser/i }).click()
      
      // Vérifier que l'analyse démarre
      await expect(page.getByText(/analyse en cours/i)).toBeVisible()
    })
  })

  test.describe('Internal Link Analysis', () => {
    test('should analyze internal links', async ({ page }) => {
      await page.goto('/internal-link')
      
      // Vérifier le formulaire
      await expect(page.getByRole('heading', { name: /analyse des liens internes/i })).toBeVisible()
      await expect(page.getByLabel(/url du site/i)).toBeVisible()
      
      // Remplir avec une URL de test
      await page.getByLabel(/url du site/i).fill('https://example.com')
      await page.getByRole('button', { name: /analyser/i }).click()
      
      // Vérifier que l'analyse démarre
      await expect(page.getByText(/analyse en cours/i)).toBeVisible()
    })
  })
}) 