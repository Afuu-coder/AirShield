// @ts-check
/** Visual indicators for the air card: 6-band AQI scale and 24-hour PM2.5 SVG chart. */
import { $ } from './dom.js';
import { formatNumber } from './shared/limits.js';

/** @typedef {import('../../src/features/plan/view').PlanView['air']} AirView */
/** @typedef {AirView['hours'][number]} HourView */

const SVG = 'http://www.w3.org/2000/svg';

/**
 * Build one SVG bar for an hourly PM2.5 reading.
 * @param {HourView} hour
 * @param {number} index
 * @param {{ max: number, best: string, worst: string }} stats
 * @returns {SVGRectElement}
 */
function chartBar(hour, index, stats) {
  const height = Math.max(6, Math.round((hour.pm25 / stats.max) * 58));
  const rect = document.createElementNS(SVG, 'rect');
  rect.setAttribute('x', String(index * 10 + 1));
  rect.setAttribute('y', String(64 - height));
  rect.setAttribute('width', '8');
  rect.setAttribute('height', String(height));
  rect.setAttribute('rx', '2');
  const mod = hour.time === stats.best ? ' best' : hour.time === stats.worst ? ' worst' : '';
  rect.setAttribute('class', mod ? `chart-bar chart-bar--${mod.trim()}` : 'chart-bar');
  const tip = document.createElementNS(SVG, 'title');
  tip.textContent = `${hour.time}: ${formatNumber(hour.pm25)} µg/m³`;
  rect.append(tip);
  return rect;
}

/**
 * Highlight the active AQI band and render the 24-hour PM2.5 bar chart.
 * @param {AirView} air
 */
export function renderAirVisuals(air) {
  for (const item of $('air-scale', HTMLElement).querySelectorAll('li')) {
    const on = item.getAttribute('data-band') === air.band.key;
    item.classList.toggle('aqi-scale__seg--active', on);
    if (on) item.setAttribute('aria-current', 'true');
    else item.removeAttribute('aria-current');
  }
  const stats = {
    max: Math.max(...air.hours.map((h) => h.pm25), 1),
    best: air.best.time,
    worst: air.worst.time,
  };
  document
    .getElementById('air-chart')
    ?.replaceChildren(...air.hours.map((hour, i) => chartBar(hour, i, stats)));
}
