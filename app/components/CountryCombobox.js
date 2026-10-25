"use client";
import React, { useId, useMemo, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { buildCountryIndex, searchCountries } from "../lib/countrySearch";

const SIZES = {
  compact: "h-11",
  hero: "h-14",
};

// Shared country search: accessible combobox + listbox over the loaded
// dataset. Used by the Topbar (CountrySearch) and the homepage intro
// (HomeCountrySearch). It only reports the picked feature, selection itself
// stays in the page's single handler.
const CountryCombobox = ({
  countries,
  onSelectCountry,
  label = "Search for a country",
  placeholder = "Search for a country",
  size = "compact",
}) => {
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const listId = `${baseId}-list`;
  const optionId = (id) => `${baseId}-opt-${id}`;

  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const index = useMemo(() => buildCountryIndex(countries), [countries]);
  const results = useMemo(() => searchCountries(index, query), [index, query]);

  const hasQuery = query.trim().length > 0;
  const showList = open && hasQuery && results.length > 0;
  const showEmpty = open && hasQuery && results.length === 0;
  const active = showList ? results[activeIndex] : null;

  const handleChange = (e) => {
    setQuery(e.target.value);
    setActiveIndex(0);
    setOpen(true);
  };

  const select = (entry) => {
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
    onSelectCountry?.(entry.feature);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!hasQuery || results.length === 0) return;
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((i) => (i + step + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (active) {
        e.preventDefault();
        select(active);
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
      }
    }
  };

  // Close when focus leaves the whole widget (outside click or Tab away).
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const status = !hasQuery
    ? ""
    : results.length === 0
    ? "No countries found. Try another name."
    : `${results.length} ${results.length === 1 ? "country" : "countries"} found.`;

  return (
    <div className="relative w-full" onBlur={handleBlur}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <FiSearch
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
          size={18}
        />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active ? optionId(active.id) : undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${SIZES[size]} w-full rounded-md border border-border-strong bg-surface pl-10 pr-11 text-base text-foreground placeholder:text-foreground-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand`}
        />
        {hasQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-foreground-secondary hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <FiX aria-hidden="true" size={18} />
          </button>
        )}
      </div>

      <ul
        id={listId}
        role="listbox"
        aria-label="Countries"
        hidden={!showList}
        className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[min(20rem,40dvh)] overflow-y-auto overscroll-contain rounded-md border border-border bg-surface-elevated shadow-lg"
      >
        {showList &&
          results.map((entry, i) => (
            <li
              key={entry.id}
              id={optionId(entry.id)}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => select(entry)}
              className={`flex min-h-11 cursor-pointer items-center px-3 text-foreground ${
                i === activeIndex ? "bg-brand/10" : ""
              }`}
            >
              {entry.name}
            </li>
          ))}
      </ul>

      {showEmpty && (
        <p className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-border bg-surface-elevated px-3 py-3 text-sm text-foreground-secondary shadow-lg">
          No countries found. Try another name.
        </p>
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {status}
      </div>
    </div>
  );
};

export default CountryCombobox;
