import { expect, test } from '@playwright/test'

import { apiForecast, apiSummary } from './mocked_api.ts'

test('Mocked response breadcrumb', async ({ page }) => {
  await page.route('*/**/air-pollutant/forecast*', async (route) => {
    await route.fulfill({ json: apiForecast })
  })
  await page.route(
    '*/**/air-pollutant/measurements/summary*',
    async (route) => {
      await route.fulfill({ json: apiSummary })
    },
  )
  await page.goto('/city/summary')
  await page.getByRole('link', { name: 'Kampala' }).click()
  await expect(page.locator('text=Cities')).toBeVisible()
  await expect(page.locator('text=Kampala')).toBeVisible()
  await page.getByRole('link', { name: 'Cities' }).click()
  // Abu Dhabi test
  await page.getByRole('link', { name: 'Abu Dhabi' }).click()
  await expect(page.locator('text=Cities')).toBeVisible()
  await expect(page.locator('text=Abu Dhabi')).toBeVisible()
  await page.getByRole('link', { name: 'Cities' }).click()
  // Zurich Test
  await page.getByRole('link', { name: 'Zurich' }).click()
  await expect(page.locator('text=Cities')).toBeVisible()
  await expect(page.locator('text=Zurich')).toBeVisible()
  await page.getByRole('link', { name: 'Cities' }).click()
})