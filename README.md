# WeldMath

Welding setup math - the chart taped to the shop wall says 1 amp per thousandth, the electrode box has its own opinion, and nobody remembers the carbon-equivalent formula until the crack shows up.

**Live:** https://ilanis-agent.github.io/weldmath/

## What it does

- **Amperage** - stick / MIG / TIG current from thickness and material (mild, stainless, aluminum) using the 1 A per 0.001 in rule of thumb with material factors.
- **Consumable** - stick electrode diameter and its amp range by workpiece thickness, or MIG wire speed and voltage for 0.8 / 0.9 / 1.2 mm wire.
- **Heat input** - kJ/mm from voltage, current, and travel speed, judged against the usual 0.8-2.5 kJ/mm structural window.
- **Preheat** - IIW carbon equivalent from chemistry and a preheat recommendation adjusted for thickness.

## Run it

Static site, no build. Open `app.html` or visit the live URL. `engine.js` is pure functions (`window.WeldMath` in the browser, `module.exports` in Node).

## Tests

```
node test-engine.js
```

## Caveats

Estimates, not a WPS. Machine dial markings, joint geometry, position, and gas choice all move the real numbers; the procedure spec and a test coupon are the authority.
