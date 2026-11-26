/**
 * Tests for copying the plain-text clean-air plan summary to the clipboard.
 */
import { afterEach, expect, it, vi } from 'vitest';
import { byId } from '../support/page.dom';
import { modelNarrative, okReply, planReply } from '../support/replies.dom';
import { renderWith } from '../support/results.dom';

afterEach(() => {
  vi.unstubAllGlobals();
});

it('copies the plan summary and announces success or unavailability', async () => {
  const writeText = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('no'));
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  await renderWith(okReply(planReply()), okReply(await modelNarrative()));

  const btn = byId('copy-plan-btn', HTMLButtonElement);
  btn.click();
  await vi.waitFor(() => {
    expect(btn.textContent).toBe('Plan copied');
  });
  expect(writeText).toHaveBeenCalledWith(expect.stringContaining('AirShield Plan — Delhi'));
  expect(byId('status').textContent).toBe('Clean-air plan copied to clipboard.');

  btn.click();
  await vi.waitFor(() => {
    expect(btn.textContent).toBe('Copy unavailable');
  });
  expect(byId('status').textContent).toBe('Could not copy the plan automatically.');
});
