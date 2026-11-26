// @ts-check
/** Formats and copies a plain-text clean-air plan summary to the clipboard. */
import { $, announce } from './dom.js';
import { formatNumber } from './shared/limits.js';

/** @typedef {import('../../src/features/plan/view').PlanView} PlanView */

let latestSummary = '';

/**
 * Store a readable text summary of the latest plan for copying.
 * @param {PlanView} view
 */
export function setPlanSummary({ place, air, totals, recommendations }) {
  const lines = [
    `AirShield Plan — ${place.name} (US AQI ${formatNumber(air.aqi)}: ${air.band.label})`,
    `Exposure avoided: ${formatNumber(totals.inhaledAvoidedUg)} µg/day | Not emitted: ${formatNumber(totals.notEmittedG)} g/wk | CO2e saved: ${formatNumber(totals.co2eSavedKg)} kg/wk`,
    ...recommendations.map((rec) => `- ${rec.title}: ${rec.action}`),
  ];
  latestSummary = lines.join('\n');
  $('copy-plan-btn', HTMLButtonElement).textContent = 'Copy clean-air plan';
}

/** Wire the copy button to write the stored summary to the clipboard. */
export function initCopyPlan() {
  const button = $('copy-plan-btn', HTMLButtonElement);
  button.addEventListener('click', () => {
    void (async () => {
      try {
        await navigator.clipboard.writeText(latestSummary);
        button.textContent = 'Plan copied';
        announce('Clean-air plan copied to clipboard.');
      } catch {
        button.textContent = 'Copy unavailable';
        announce('Could not copy the plan automatically.');
      }
    })();
  });
}
