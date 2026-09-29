"use client";
import React from "react";
import { FiX } from "react-icons/fi";
import { getVisibilityRank, getVisibilitySegmentColors } from "../lib/visibility";
import Modal from "./ui/Modal";
import IconButton from "./ui/IconButton";
import Avatar from "./ui/Avatar";
import Chip from "./ui/Chip";

const VISIBILITY_SEGMENT_COLORS = getVisibilitySegmentColors();

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
    <Modal
      onClose={onClose}
      backdropOpacity={50}
      className="space-y-5"
      ariaLabel={individual.name || "Profile"}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-h3 font-bold underline">
          {individual.name || "Not found"}
        </h2>
        <IconButton
          icon={FiX}
          label="Close profile"
          size={22}
          className="p-3 -m-3"
          onClick={onClose}
        />
      </div>

      {/* Country + Aspect Tags */}
      <div className="flex flex-wrap gap-2">
        {individual.country ? <Chip>{individual.country}</Chip> : null}
        {individual.primary_aspect ? (
          <Chip>{individual.primary_aspect}</Chip>
        ) : null}
        {individual.aspects &&
          individual.aspects.map((a) => <Chip key={a}>{a}</Chip>)}
      </div>

      {/* Profile Summary */}
      <div className="flex items-center space-x-4">
        <Avatar
          src={individual.img_url}
          alt={individual.name}
          initials={getInitials(individual.name)}
          size={16}
        />
        <div className="flex flex-col">
          <p className="font-semibold text-lg">
            {individual.name || "Not found"}
          </p>
          {individual.role_type?.length > 0 ? (
            <p className="text-sm text-foreground-muted">
              {individual.role_type.join(", ")}
            </p>
          ) : (
            <p className="text-sm text-foreground-muted">Not found</p>
          )}
          {individual.birth_year || individual.death_year ? (
            <p className="text-xs text-foreground-muted">
              {individual.birth_year || "?"} –{" "}
              {individual.death_year || "present"}
            </p>
          ) : null}
        </div>
      </div>

      {/* Visibility */}
      {individual.visibility && (
        <div>
          <p className="text-sm text-foreground-muted mb-1">Visibility</p>
          <p className="font-bold text-lg text-foreground">
            {individual.visibility}
          </p>

          {(() => {
            const activeSegments = getVisibilityRank(individual.visibility);

            return (
              <div className="w-full flex gap-1 mt-2">
                {VISIBILITY_SEGMENT_COLORS.map((color, index) => {
                  const isActive = index < activeSegments;

                  return (
                    <div
                      key={index}
                      className="h-2 flex-1 rounded"
                      style={{
                        backgroundColor: isActive
                          ? color
                          : "var(--border-strong)",
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
        <h3 className="text-h4 font-semibold mb-2">Profile</h3>
        <p className="text-sm text-foreground-secondary leading-relaxed">
          {individual.bio || "Not found"}
        </p>
      </div>

      {/* Notable Works */}
      {individual.notable_contributions?.length > 0 && (
        <div>
          <h3 className="text-h4 font-semibold mb-2">
            Notable Contributions
          </h3>
          <ul className="space-y-1">
            {individual.notable_contributions.map((work, idx) => (
              <li key={idx} className="border-b border-border pb-1">
                <span className="text-sm">{work || "Unknown"}</span>
                {/* <span className="text-xs text-gray-400">
                  ({work.year || "?"}, {work.type || "?"})
                </span> */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources */}
      {individual.sources?.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer select-none text-h4 font-semibold">
            Sources
          </summary>
          <ul className="mt-2 space-y-1">
            {individual.sources.map((source, idx) => (
              <li key={idx}>
                <a
                  href={source.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand text-sm hover:underline"
                >
                  {source.title || "Unknown"}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}

      <details className="text-sm text-foreground-muted">
        <summary className="cursor-pointer select-none">Disclaimer</summary>
        <div className="mt-2">
          The information is based on publicly available web sources. Source
          quality and availability may vary, and some information may be
          incomplete, outdated, or inaccurate. Use this content as a starting
          point, not as a substitute for independent verification.
        </div>
      </details>
    </Modal>
  );
};

export default IndividualModal;
