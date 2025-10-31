"use client";
import React from "react";

const IndividualModal = ({ individual, onClose }) => {
  if (!individual) return null;

  // Helper for initials fallback
  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-[2px]"
      aria-modal="true"
      role="dialog"
    >
      {/* Modal container */}
      <div className="w-full md:w-[500px] bg-gray-900 text-white rounded-t-2xl md:rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto space-y-5 animate-[fadeInUp_0.3s_ease]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold underline">{individual.name || "Not found"}</h2>
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
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
              getInitials()
            )}
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-lg">{individual.name || "Not found"}</p>
            {individual.role_type?.length > 0 ? (
              <p className="text-sm text-gray-400">{individual.role_type.join(", ")}</p>
            ) : (
              <p className="text-sm text-gray-400">Not found</p>
            )}
            {individual.birth_year || individual.death_year ? (
              <p className="text-xs text-gray-500">
                {individual.birth_year || "?"}–{individual.death_year || "?"}
              </p>
            ) : null}
          </div>
        </div>

        {/* Impact Score */}
        {individual.impact_score != null && (
          <div>
            <p className="text-sm text-gray-400 mb-1">Impact Score</p>
            <p className="text-cyan-400 font-bold text-lg">
              {individual.impact_score.toFixed(2)}
            </p>
            {/* Horizontal bar */}
            <div className="w-full h-2 bg-gray-700 rounded mt-1">
              <div
                className="h-2 bg-cyan-400 rounded"
                style={{ width: `${(individual.impact_score || 0) * 100}%` }}
              />
            </div>
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
        {individual.notable_works?.length > 0 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Notable Works</h3>
            <ul className="space-y-1">
              {individual.notable_works.map((work, idx) => (
                <li key={idx} className="border-b border-gray-700 pb-1">
                  <span className="font-medium">{work.title || "Unknown"}</span>{" "}
                  <span className="text-xs text-gray-400">
                    ({work.year || "?"}, {work.type || "?"})
                  </span>
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
      </div>
    </div>
  );
};

export default IndividualModal;
