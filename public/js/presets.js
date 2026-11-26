// @ts-check
/** Quick city chips and one-click sample profiles for trying the planner fast. */
import { $ } from './dom.js';

/**
 * @typedef {{
 *   mode: 'family' | 'community',
 *   place: string,
 *   inputs: Record<string, string>,
 *   selects: Record<string, string>,
 *   checks: Record<string, boolean>,
 *   notes: string,
 * }} Preset
 */

/** @type {Record<string, Preset>} */
const PRESETS = {
  'delhi-family': {
    mode: 'family',
    place: 'Delhi',
    inputs: { adults: '2', children: '1', elders: '1', commuteKm: '12', outdoorMinutes: '40' },
    selects: {
      homeType: 'apartment',
      cookingFuel: 'lpg_png',
      commute: 'car',
      outdoorTime: 'morning',
    },
    checks: { purifier: false, sensitive: true },
    notes: 'Grandmother has mild asthma; child walks to school.',
  },
  'gurugram-rwa': {
    mode: 'community',
    place: 'Gurugram',
    inputs: { people: '250', commuteKm: '10', outdoorMinutes: '30' },
    selects: { groupType: 'rwa', commute: 'car', outdoorTime: 'evening' },
    checks: { wasteBurning: true, purifier: false, sensitive: false },
    notes: 'Planning winter clean-air actions for Block C residents.',
  },
};

/**
 * Highlight the matching city chip if one exists.
 * @param {string} city
 */
function syncCityChips(city) {
  const normalized = city.trim().toLowerCase();
  for (const chip of document.querySelectorAll('[data-city]')) {
    const label = chip.textContent.trim().toLowerCase();
    chip.setAttribute('aria-pressed', String(label === normalized));
  }
}

/**
 * Apply a named sample profile to the form.
 * @param {string} name
 */
function applyPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;
  const radio = $(`mode-${preset.mode}`, HTMLInputElement);
  radio.checked = true;
  radio.dispatchEvent(new Event('change'));
  $('place', HTMLInputElement).value = preset.place;
  syncCityChips(preset.place);
  for (const [id, val] of Object.entries(preset.inputs)) $(id, HTMLInputElement).value = val;
  for (const [id, val] of Object.entries(preset.selects)) $(id, HTMLSelectElement).value = val;
  for (const [id, val] of Object.entries(preset.checks)) $(id, HTMLInputElement).checked = val;
  $('notes', HTMLTextAreaElement).value = preset.notes;
}

/** Wire quick city picks and sample profile presets. */
export function initPresets() {
  const place = $('place', HTMLInputElement);
  place.addEventListener('input', () => {
    syncCityChips(place.value);
  });
  for (const btn of document.querySelectorAll('[data-city]')) {
    btn.addEventListener('click', () => {
      const city = btn.textContent.trim();
      place.value = city;
      place.removeAttribute('aria-invalid');
      syncCityChips(city);
      place.focus();
    });
  }
  for (const btn of document.querySelectorAll('[data-preset]')) {
    btn.addEventListener('click', () => {
      applyPreset(String(btn.getAttribute('data-preset')));
      place.focus();
    });
  }
}
