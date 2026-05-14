"use client";
import React from "react";
import VisibilityBadge from "./VibilityBadge";

const AspectModal = ({ aspectName, individuals, onClose, onSelectIndividual }) => {
  if (!aspectName || !individuals) return null;

  const visibilityBadgeStyles = {
    Local: "text-red-400 bg-red-400/10 border border-red-400/30",
    National: "text-yellow-300 bg-yellow-300/10 border border-yellow-300/30",
    Regional: "text-cyan-400 bg-cyan-400/10 border border-cyan-400/30",
    Global: "text-green-400 bg-green-400/10 border border-green-400/30",
  };


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
                key={person.uid}
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-800 rounded-md px-2 transition-colors"
                onClick={() => onSelectIndividual && onSelectIndividual(person)}
              >
                <div className="flex items-center space-x-3">
                  {/* Circle with initials */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-cyan-600 flex items-center justify-center text-white font-semibold">
                    {person.img_url ? (
                      <img
                        src={person.img_url}
                        alt={person.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      person.name_initials
                    )}
                  </div>

                  {/* Name and role */}
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-xs text-gray-400">
                      {person.role_type?.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="ml-3 shrink-0">
                  <VisibilityBadge visibility={person.visibility} />
                </div>
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
