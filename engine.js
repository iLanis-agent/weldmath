/* WeldMath engine - welding setup math. Pure functions, no DOM. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WeldMath = api;
}(typeof self !== 'undefined' ? self : this, function () {

  var MATERIALS = { mild: 1.0, stainless: 0.85, aluminum: 1.2 };

  // Rule of thumb: 1 amp per 0.001 in of thickness for steel (~39.37 A per mm),
  // adjusted by material, rounded to the nearest 5 A.
  function ampsFor(mm, material, process) {
    if (!(mm > 0)) return 0;
    var f = MATERIALS[material] || 1.0;
    var a = mm * 39.37 * f;
    return Math.round(a / 5) * 5;
  }

  // Stick electrode size by workpiece thickness.
  function rodFor(mm) {
    if (mm < 3) return { size: '2.5 mm', low: 60, high: 100 };
    if (mm <= 6) return { size: '3.2 mm', low: 90, high: 140 };
    return { size: '4.0 mm', low: 120, high: 190 };
  }

  // MIG wire speed in inches per minute for a given current and wire diameter (mm).
  function wireSpeed(amps, dia) {
    var factor = { '0.8': 2.0, '0.9': 1.6, '1.2': 1.0 };
    var k = factor[String(dia)] || 2.0;
    return Math.round(amps * k);
  }

  // MIG voltage estimate by thickness (mm), clamped 14-26 V.
  function migVolts(mm) {
    var v = Math.min(26, Math.max(14, 15 + 1.6 * mm));
    return Math.round(v * 2) / 2;
  }

  // Heat input in kJ/mm: V * I * 60 / (travel speed mm/min * 1000).
  function heatInput(volts, amps, speed) {
    if (!(speed > 0)) return 0;
    return Math.round((volts * amps * 60.0) / (speed * 1000) * 1000) / 1000;
  }

  // Structural steels usually want heat input inside roughly 0.8-2.5 kJ/mm.
  function heatVerdict(h) {
    if (h < 0.8) return 'low - watch for lack of fusion on thick sections';
    if (h <= 2.5) return 'in the usual structural window (0.8-2.5 kJ/mm)';
    return 'high - distortion and grain growth risk; move faster or drop current';
  }

  // IIW carbon equivalent.
  function carbonEquivalent(C, Mn, Cr, Mo, V, Ni, Cu) {
    var ce = (C || 0) + (Mn || 0) / 6.0 + ((Cr || 0) + (Mo || 0) + (V || 0)) / 5.0 + ((Ni || 0) + (Cu || 0)) / 15.0;
    return Math.round(ce * 1000) / 1000;
  }

  function preheatFor(ce, mm) {
    if (ce < 0.40) return 'none needed - weld away';
    if (ce <= 0.50) return mm > 25 ? '100-150 C (thickness pushes it up)' : '75-125 C';
    return mm > 25 ? '150-200 C (thickness pushes it up)' : '125-175 C';
  }

  return {
    ampsFor: ampsFor,
    rodFor: rodFor,
    wireSpeed: wireSpeed,
    migVolts: migVolts,
    heatInput: heatInput,
    heatVerdict: heatVerdict,
    carbonEquivalent: carbonEquivalent,
    preheatFor: preheatFor
  };
}));
