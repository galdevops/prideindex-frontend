"use client";
import React from "react";
import VisibilityBadge from "./VibilityBadge";
import Modal from "./ui/Modal";
import Avatar from "./ui/Avatar";

const AspectModal = ({ aspectName, individuals, onClose, onSelectIndividual }) => {
  if (!aspectName || !individuals) return null;

  return (
    <Modal onClose={onClose} backdropOpacity={30} ariaLabel={aspectName}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold capitalize">{aspectName}</h2>
        <button
          onClick={onClose}
          className="text-foreground-muted hover:text-foreground text-sm"
        >
          Back →
        </button>
      </div>

      {/* Individual list */}
      {individuals.length > 0 ? (
        <ul className="divide-y divide-border">
          {individuals.map((person) => (
            <li
              key={person.uid}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-surface-muted rounded-md px-2 transition-colors"
              onClick={() => onSelectIndividual && onSelectIndividual(person)}
            >
              <div className="flex items-center space-x-3">
                <Avatar
                  src={person.img_url}
                  alt={person.name}
                  initials={person.name_initials}
                  size={10}
                />

                {/* Name and role */}
                <div>
                  <p className="font-medium">{person.name}</p>
                  <p className="text-xs text-foreground-muted">
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
        <p className="text-foreground-muted text-sm">No individuals found.</p>
      )}
    </Modal>
  );
};

export default AspectModal;
