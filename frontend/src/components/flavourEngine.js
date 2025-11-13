/**
 * BEANie Flavor Prediction Engine v2
 * Realistic flavor scoring based on extraction chemistry and sensory data.
 * Author: ChatGPT (2025)
 */

export function inferFlavors(params, wheelSelections = []) {
  const { brewMethod, roastLevel, grindSize, ratio, tempC } = params;

  // Categories: each influences certain flavors
  const baseProfile = {
    Sweet: 0.45,
    Fruity: 0.35,
    Floral: 0.25,
    Spice: 0.2,
    Nutty: 0.3,
    Herbal: 0.2,
    Bitter: 0.1,
    Acidic: 0.15,
  };

  /** 🔬 BREW METHOD BALANCE
   * - Pour-over: clarity, acidity, floral
   * - French Press: heavier body, nutty/sweet
   * - Espresso: intense, sweet, bitter, spice
   * - Cold Brew: sweet, muted acidity
   * - Aeropress: balanced, slight fruity
   */
  const methodWeights = {
    "Pour-over": { Floral: 0.25, Acidic: 0.2, Sweet: 0.1 },
    "French Press": { Nutty: 0.2, Sweet: 0.15, Herbal: 0.1 },
    "Espresso": { Sweet: 0.2, Bitter: 0.25, Spice: 0.15 },
    "Cold Brew": { Sweet: 0.3, Fruity: 0.1, Acidic: -0.15 },
    "Aeropress": { Fruity: 0.15, Sweet: 0.1, Floral: 0.1 },
  };

  /** 🔥 ROAST LEVEL EFFECTS
   * - Light: fruity & floral, acidic
   * - Medium: sweet & balanced
   * - Dark: bitter, spice, nutty
   */
  const roastWeights = {
    Light: { Fruity: 0.25, Floral: 0.2, Acidic: 0.15, Bitter: -0.1 },
    Medium: { Sweet: 0.15, Nutty: 0.1 },
    Dark: { Bitter: 0.25, Spice: 0.2, Nutty: 0.15, Fruity: -0.2 },
  };

  /** ⚙️ EXTRACTION FACTORS
   *  Ratio, grind, and temp adjust extraction balance.
   */
  let extraction = ratio * 1000; // normalize scale
  const grindMod = grindSize === "Fine" ? 0.1 : grindSize === "Coarse" ? -0.1 : 0;
  const tempMod = (tempC - 90) / 100; // hotter -> more bitterness/spice

  const extractionEffects = {
    Sweet: -Math.abs(extraction - 60) / 200 + 0.2,
    Fruity: extraction < 55 ? 0.15 : -0.1,
    Bitter: extraction > 65 ? 0.25 : 0,
    Spice: tempMod > 0.03 ? 0.1 : 0,
  };

  // Combine influences
  const combined = { ...baseProfile };
  const apply = (weights, mult = 1) => {
    for (const [k, v] of Object.entries(weights)) {
      combined[k] = (combined[k] || 0) + v * mult;
    }
  };

  apply(methodWeights[brewMethod] || {});
  apply(roastWeights[roastLevel] || {});
  apply(extractionEffects);

  // wheel selections get a boost
  wheelSelections.forEach(sel => {
    combined[categoryForFlavor(sel)] = (combined[categoryForFlavor(sel)] || 0) + 0.3;
  });

  // Map categories to flavor notes
  const flavorMap = {
    Chocolate: "Sweet",
    Caramel: "Sweet",
    Honey: "Sweet",
    "Red Apple": "Fruity",
    Citrus: "Fruity",
    Berry: "Fruity",
    Floral: "Floral",
    Nutty: "Nutty",
    Spice: "Spice",
    Herbal: "Herbal",
    "Roasted Bitter": "Bitter",
  };

  const scores = {};
  for (const [flavor, cat] of Object.entries(flavorMap)) {
    scores[flavor] = Math.max(0, combined[cat] || 0);
  }

  // normalize 0–1 range
  const max = Math.max(...Object.values(scores));
  const list = Object.entries(scores)
    .map(([flavor, score]) => ({ flavor, score: score / (max || 1) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return list;
}

function categoryForFlavor(flavor) {
  const map = {
    Chocolate: "Sweet",
    Caramel: "Sweet",
    Honey: "Sweet",
    "Red Apple": "Fruity",
    Citrus: "Fruity",
    Berry: "Fruity",
    Floral: "Floral",
    Nutty: "Nutty",
    Spice: "Spice",
    Herbal: "Herbal",
    "Roasted Bitter": "Bitter",
  };
  return map[flavor] || "Sweet";
}
