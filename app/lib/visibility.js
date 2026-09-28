// Single source of truth for the Local -> Global visibility taxonomy.
// Colors mirror the --visibility-* custom properties in globals.css.
export const VISIBILITY_LEVELS = {
  Local: { rank: 1, color: "#ef4444", tooltip: "Local" },
  National: { rank: 2, color: "#f59e0b", tooltip: "National" },
  Regional: { rank: 3, color: "#06b6d4", tooltip: "Regional" },
  Global: { rank: 4, color: "#22c55e", tooltip: "Global" },
  International: { rank: 4, color: "#22c55e", tooltip: "Global" },
};

export const VISIBILITY_UNKNOWN = { rank: 0, color: "#9ca3af", tooltip: "Visibility unknown" };

export function getVisibility(visibility) {
  return VISIBILITY_LEVELS[visibility] || VISIBILITY_UNKNOWN;
}

export function getVisibilityRank(visibility) {
  return getVisibility(visibility).rank;
}

// Ordered Local -> Global colors, for segmented visibility bars.
export function getVisibilitySegmentColors() {
  return ["Local", "National", "Regional", "Global"].map(
    (level) => VISIBILITY_LEVELS[level].color
  );
}
