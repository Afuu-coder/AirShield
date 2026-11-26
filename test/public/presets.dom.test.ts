/**
 * Tests for quick city chips and sample profile preset buttons.
 */
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { byId, inputEl, loadApp, selectEl } from '../support/page.dom';

beforeEach(async () => {
  await loadApp();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

it('fills the city from quick chips and syncs pressed state on input', () => {
  const mumbai = document.querySelector<HTMLButtonElement>('[data-city="Mumbai"]');
  const delhi = document.querySelector<HTMLButtonElement>('[data-city="Delhi"]');
  inputEl('place').setAttribute('aria-invalid', 'true');
  mumbai?.click();
  expect(inputEl('place').value).toBe('Mumbai');
  expect(inputEl('place').hasAttribute('aria-invalid')).toBe(false);
  expect(mumbai?.getAttribute('aria-pressed')).toBe('true');
  expect(delhi?.getAttribute('aria-pressed')).toBe('false');
  inputEl('place').value = 'delhi';
  inputEl('place').dispatchEvent(new Event('input'));
  expect(delhi?.getAttribute('aria-pressed')).toBe('true');
  expect(mumbai?.getAttribute('aria-pressed')).toBe('false');
});

it('applies family and community sample presets and ignores unknown names', () => {
  document.querySelector<HTMLButtonElement>('[data-preset="delhi-family"]')?.click();
  expect(byId('mode-family', HTMLInputElement).checked).toBe(true);
  expect(inputEl('place').value).toBe('Delhi');
  expect(inputEl('children').value).toBe('1');
  expect(selectEl('cookingFuel').value).toBe('lpg_png');
  expect(byId('sensitive', HTMLInputElement).checked).toBe(true);

  document.querySelector<HTMLButtonElement>('[data-preset="gurugram-rwa"]')?.click();
  expect(byId('mode-community', HTMLInputElement).checked).toBe(true);
  expect(inputEl('place').value).toBe('Gurugram');
  expect(inputEl('people').value).toBe('250');
  expect(byId('wasteBurning', HTMLInputElement).checked).toBe(true);

  const btn = document.querySelector<HTMLButtonElement>('[data-preset="delhi-family"]');
  btn?.setAttribute('data-preset', 'unknown');
  btn?.click();
  expect(inputEl('place').value).toBe('Gurugram');
});
