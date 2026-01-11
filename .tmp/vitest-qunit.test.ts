
      import { describe, it, expect, vi } from 'vitest';
      import { browser } from '@vitest/browser';

      describe('QUnit tests for examples/vitest/test.html', () => {
        it('should pass all tests', async () => {
          await browser.visit('http://localhost:8083/examples/vitest/test.html');
          await browser.executeScript(`(function getQUnitSuiteReport() {
    return window._wdioQunitService.results;
})`);
          await vi.waitFor(async () => {
            const completed = await browser.executeScript(() => window._wdioQunitService?.results?.[0]?.completed);
            expect(completed).toBe(true);
          });
          const results = await browser.executeScript(() => window._wdioQunitService.results);
          expect(results[0].failed).toBe(0);
        });
      });
