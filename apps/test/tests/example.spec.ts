import path from 'node:path'
import { ElectronApplication, Page, _electron as electron, expect, test } from '@playwright/test'

let electronApp: ElectronApplication
test.beforeAll(async () => {
  electronApp = await electron.launch({
    args: [path.join(__dirname, '../../electron')],
  })
})
test.afterAll(async () => {
  await electronApp.close()
})

let page: Page

test.describe('Titlebar Window Test', async () => {
  test('Close', async () => {
    page = await electronApp.firstWindow()
    await page.click('#close_btn')
    expect(page.isClosed()).toBe(true)
  })
  test('Maximize and Unmaximize and Minimize', async () => {
    page = await electronApp.firstWindow()
    const winHandle = await electronApp.browserWindow(page)
    await page.click('#maximize_btn')
    let isMaximized = await winHandle.evaluate(win => win.isMaximized())
    expect(isMaximized).toBe(true)
    await page.click('#maximize_btn')
    isMaximized = await winHandle.evaluate(win => win.isMaximized())
    expect(isMaximized).toBe(false)
    await page.click('#minimize_btn')
    const isMinimized = await winHandle.evaluate(win => win.isMinimized())
    expect(isMinimized).toBe(true)
  })
})
