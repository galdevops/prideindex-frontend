"use client";
import React from "react";

const AspectModal = ({ aspectName, individuals, onClose, onSelectIndividual }) => {
  if (!aspectName || !individuals) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-[2px]">
      {/* Modal container */}
      <div className="w-full md:w-[500px] bg-gray-900 text-white rounded-t-2xl md:rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold capitalize">{aspectName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-x"
          >
            Back →
          </button>
        </div>

        {/* Individual list */}
        {individuals.length > 0 ? (
          <ul className="divide-y divide-gray-700">
            {individuals.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-800 rounded-md px-2 transition-colors"
                onClick={() => onSelectIndividual && onSelectIndividual(person)}
              >
                <div className="flex items-center space-x-3">
                  {/* Circle with initials */}
                  <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-semibold">
                    {person.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  {/* Name and role */}
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-xs text-gray-400">
                      {person.role_type?.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Impact score */}
                <span className="text-cyan-400 font-semibold text-sm">
                  {person.impact_score?.toFixed(2) || "0.00"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No individuals found.</p>
        )}
      </div>
    </div>
  );
};

export default AspectModal;
