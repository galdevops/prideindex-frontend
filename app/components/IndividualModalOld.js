"use client";
import React from "react";

const IndividualModal = ({ individual, onClose }) => {
  if (!individual) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal container */}
      <div className="w-full md:w-[500px] bg-gray-900 text-white rounded-t-2xl md:rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{individual.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Profile summary */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center text-2xl font-semibold">
            {individual.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold">{individual.name}</p>
            {individual.role_type?.length > 0 && (
              <p className="text-sm text-gray-400">
                {individual.role_type.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Impact Score */}
        {individual.impact_score && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-1">Impact Score</p>
            <p className="text-cyan-400 font-bold text-lg">
              {individual.impact_score.toFixed(2)}
            </p>
          </div>
        )}

        {/* Description */}
        {individual.description && (
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Profile</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {individual.description}
            </p>
          </div>
        )}

        {/* Optional: Pride Index or Tags */}
        {individual.pride_index && (
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Pride Index Breakdown</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              {Object.entries(individual.pride_index).map(([key, value]) => (
                <li
                  key={key}
                  className="flex justify-between border-b border-gray-700 pb-1"
                >
                  <span className="capitalize">{key}</span>
                  <span>{value}</span>
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
