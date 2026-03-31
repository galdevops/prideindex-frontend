"use client";
import React from "react";

const IndividualModalSwipe = ({
  individual,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}) => {
  if (!individual) return null;

  const swipeStartX = React.useRef(null);
  const swipeStartY = React.useRef(null);
  const swipeThreshold = 40;

  const handleTouchStart = (e) => {
    swipeStartX.current = e.changedTouches[0].clientX;
    swipeStartY.current = e.changedTouches[0].clientY;
    };

  const handleTouchEnd = (e) => {

    if (swipeStartX.current == null || swipeStartY.current == null) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const deltaX = endX - swipeStartX.current;
    const deltaY = endY - swipeStartY.current;

    // Ignore scroll-like gestures
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
        swipeStartX.current = null;
        swipeStartY.current = null;
        return;
    }

    if (deltaX <= -swipeThreshold && hasNext && onNext) {
        onNext();
    } else if (deltaX >= swipeThreshold && hasPrev && onPrev) {
        onPrev();
    }

    swipeStartX.current = null;
    swipeStartY.current = null;

    console.log("swipe", { deltaX, deltaY, hasPrev, hasNext });
    };

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatYears = (birthYear, deathYear) => {
    if (birthYear && deathYear) return `${birthYear}–${deathYear}`;
    if (birthYear) return `Born ${birthYear}`;
    if (deathYear) return `${deathYear}`;
    return null;
  };

  const yearsLabel = formatYears(individual.birth_year, individual.death_year);

  return (
    <div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-[2px]"
        aria-modal="true"
        role="dialog"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
    >
      <div
        className="w-full md:w-[500px] bg-gray-900 text-white rounded-t-2xl md:rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto space-y-5 animate-[fadeInUp_0.3s_ease]"

      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold underline">
            {individual.name || "Not found"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`px-2 py-1 rounded border ${
              hasPrev
                ? "border-gray-700 hover:border-cyan-400 hover:text-cyan-400"
                : "border-gray-800 text-gray-600 cursor-not-allowed"
            }`}
          >
            ← Previous
          </button>

          <span className="flex items-center gap-2 text-cyan-400 font-medium">
  <span>←</span>
  <span>Swipe</span>
  <span>→</span>
</span>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`px-2 py-1 rounded border ${
              hasNext
                ? "border-gray-700 hover:border-cyan-400 hover:text-cyan-400"
                : "border-gray-800 text-gray-600 cursor-not-allowed"
            }`}
          >
            Next →
          </button>
        </div>

        {/* Country + Aspect Tags */}
        <div className="flex flex-wrap gap-2">
          {individual.country ? (
            <span className="bg-gray-800 text-cyan-400 text-xs px-2 py-1 rounded-full">
              {individual.country}
            </span>
          ) : null}

          {individual.primary_aspect ? (
            <span className="bg-gray-800 text-cyan-400 text-xs px-2 py-1 rounded-full">
              {individual.primary_aspect}
            </span>
          ) : null}

          {individual.aspects &&
            individual.aspects.map((a) => (
              <span
                key={a}
                className="bg-gray-800 text-cyan-400 text-xs px-2 py-1 rounded-full"
              >
                {a}
              </span>
            ))}
        </div>

        {/* Profile Summary */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center text-2xl font-semibold overflow-hidden">
            {individual.profile_image_url ? (
              <img
                src={individual.profile_image_url}
                alt={individual.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(individual.name)
            )}
          </div>

          <div className="flex flex-col">
            <p className="font-semibold text-lg">
              {individual.name || "Not found"}
            </p>

            {individual.role_type?.length > 0 ? (
              <p className="text-sm text-gray-400">
                {individual.role_type.join(", ")}
              </p>
            ) : (
              <p className="text-sm text-gray-400">Not found</p>
            )}

            {yearsLabel ? (
              <p className="text-xs text-gray-500">{yearsLabel}</p>
            ) : null}
          </div>
        </div>

        {/* Visibility */}
        {individual.visibility && (
          <div>
            <p className="text-sm text-gray-400 mb-1">Visibility</p>
            <p className="font-bold text-lg text-white">
              {individual.visibility}
            </p>

            {(() => {
              const visibilityLevelMap = {
                Local: 1,
                National: 2,
                Regional: 3,
                Global: 4,
                International: 4,
              };

              const segmentColors = [
                "#f87171",
                "#facc15",
                "#22d3ee",
                "#4ade80",
              ];

              const activeSegments =
                visibilityLevelMap[individual.visibility] || 0;

              return (
                <div className="w-full flex gap-1 mt-2">
                  {segmentColors.map((color, index) => {
                    const isActive = index < activeSegments;

                    return (
                      <div
                        key={index}
                        className="h-2 flex-1 rounded"
                        style={{
                          backgroundColor: isActive ? color : "#374151",
                        }}
                      />
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Bio */}
        <div>
          <h3 className="text-md font-semibold mb-2">Profile</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {individual.bio || "Not found"}
          </p>
        </div>

        {/* Notable Works */}
        {individual.notable_contributions?.length > 0 && (
          <div>
            <h3 className="text-md font-semibold mb-2">
              Notable Contributions
            </h3>
            <ul className="space-y-1">
              {individual.notable_contributions.map((work, idx) => (
                <li key={idx} className="border-b border-gray-700 pb-1">
                  <span className="text-sm">{work || "Unknown"}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sources */}
        {individual.sources?.length > 0 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Sources</h3>
            <ul className="space-y-1">
              {individual.sources.map((source, idx) => (
                <li key={idx}>
                  <a
                    href={source.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 text-sm hover:underline"
                  >
                    {source.title || "Unknown"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <details className="text-sm text-gray-400">
          <summary className="cursor-pointer select-none">Disclaimer</summary>
          <div className="mt-2">
            The information is based on publicly available web sources. Source
            quality and availability may vary, and some information may be
            incomplete, outdated, or inaccurate. Use this content as a starting
            point, not as a substitute for independent verification.
          </div>
        </details>
      </div>
    </div>
  );
};

export default IndividualModalSwipe;