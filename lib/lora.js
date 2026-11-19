// LoRa time-on-air, from the Semtech SX1276 datasheet (section 4.1.1.7).
// Fixed link settings shown on the page: 12-byte payload, 125 kHz bandwidth,
// coding rate 4/5, 8-symbol preamble, explicit header, CRC on, low data rate
// optimisation on for SF11 and SF12.

export const PAYLOAD_BYTES = 12;
const BW = 125000;
const CR = 1; // 4/5

export function airtimeMs(sf, pl = PAYLOAD_BYTES) {
  const de = sf >= 11 ? 1 : 0;
  const tsym = (2 ** sf / BW) * 1000;
  const tpre = (8 + 4.25) * tsym;
  const num = 8 * pl - 4 * sf + 28 + 16; // explicit header (H=0), CRC on
  const n = 8 + Math.max(Math.ceil(num / (4 * (sf - 2 * de))) * (CR + 4), 0);
  return tpre + n * tsym;
}

// Receiver sensitivity at 125 kHz, SX1276 datasheet, band 1.
export const SENSITIVITY = { 7: -123, 8: -126, 9: -129, 10: -132, 11: -133, 12: -136 };

// EU868 g1 sub-band: 1% duty cycle, so each uplink must be followed by 99x its airtime off air.
export function uplinksPerHour(sf) {
  return Math.floor(3600000 / (airtimeMs(sf) * 100));
}

// Free-space range grows by 10^(dB/20) for each dB of extra link budget.
export function rangeFactor(sf) {
  return 10 ** ((SENSITIVITY[7] - SENSITIVITY[sf]) / 20);
}

export const SFS = [7, 8, 9, 10, 11, 12];
