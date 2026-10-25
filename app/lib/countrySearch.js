// Matching for the country search. Works on the features already loaded from
// the pride_index API, no second country list.

export const MAX_RESULTS = 8;

// Lowercase, trim, collapse spaces, strip diacritics ("Côte" matches "cote").
export const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

// Build once per dataset. The index is position-based, so the id stays unique
// even where the dataset repeats an iso_a2 (SO, CI).
export const buildCountryIndex = (features = []) =>
  features.map((feature, i) => {
    const { name, iso_a2: iso } = feature.properties;
    const code = normalizeText(iso);
    return {
      id: `${iso}-${i}`,
      feature,
      name,
      nameKey: normalizeText(name),
      // "-99" (N. Cyprus) is a placeholder, not a code anyone can type.
      codeKey: /^[a-z]{2}$/.test(code) ? code : "",
    };
  });

// Exact (name or ISO code), then name prefix, then name contains.
export const searchCountries = (index, query, limit = MAX_RESULTS) => {
  const q = normalizeText(query);
  if (!q) return [];

  const ranked = [];
  for (const entry of index) {
    let rank = -1;
    if (entry.nameKey === q || entry.codeKey === q) rank = 0;
    else if (entry.nameKey.startsWith(q)) rank = 1;
    else if (entry.nameKey.includes(q)) rank = 2;
    if (rank >= 0) ranked.push({ entry, rank });
  }

  ranked.sort(
    (a, b) => a.rank - b.rank || a.entry.nameKey.localeCompare(b.entry.nameKey)
  );
  return ranked.slice(0, limit).map((r) => r.entry);
};
