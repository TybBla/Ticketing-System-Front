import { expect, test } from '@playwright/test'

const createJwt = (payload: Record<string, unknown>) => {
  const encode = (value: unknown) => {
    return Buffer.from(JSON.stringify(value))
      .toString('base64url')
  }

  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.test-signature`
}

test('employee can sign in and create a ticket', async ({ page }) => {
  const employeeToken = createJwt({
    email: 'user@test.com',
    role: 'Employee',
    sub: 'employee-e2e',
  })

  await page.route('**/api/Auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: employeeToken }),
    })
  })

  await page.route('**/api/Tickets', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Ticket created' }),
      })
      return
    }

    await route.fallback()
  })

  await page.goto('/login')

  await page.getByLabel('Email').fill('user@test.com')
  await page.getByLabel('Hasło').fill('User123!')
  await page.getByRole('button', { name: 'Zaloguj' }).click()

  await expect(page.getByRole('heading', { name: 'Witaj w systemie zgłoszeń' })).toBeVisible()

  await page.getByRole('link', { name: /Nowe/ }).click()
  await expect(page.getByRole('heading', { name: 'Nowe zgłoszenie' })).toBeVisible()

  await page.getByLabel('Tytuł').fill('Awaria laptopa E2E')
  await page.getByLabel('Opis').fill('Laptop testowy nie uruchamia systemu po aktualizacji.')
  await page.getByRole('button', { name: 'Utwórz zgłoszenie' }).click()

  await expect(page.getByRole('heading', { name: 'Witaj w systemie zgłoszeń' })).toBeVisible()
})
