"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, Sparkles, Loader2 } from "lucide-react";
import "./AISearchSuggestions.css";

interface AISearchSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function AISearchSuggestions({
  value,
  onChange,
  placeholder = "Search restaurants…",
}: AISearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const debouncedValue = useDebounce(value, 400);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Position the portal dropdown to align with the input
  const updateDropdownPosition = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
    });
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const dropdown = document.getElementById("aisearch-portal");
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        !dropdown?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    const handler = () => updateDropdownPosition();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open]);

  // Fetch AI suggestions
  useEffect(() => {
    if (debouncedValue.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      console.log("[AISearch] Fetching suggestions for:", debouncedValue);
      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{
                text: `You are a search assistant for Platera, a Bangladesh-based food delivery platform.
Given a partial search query, return exactly 5 short relevant search suggestions.
Suggestions should relate to: restaurant names, food types, cuisines, meal names, or business types.
Focus on Bangladeshi food culture: biryani, hilsa, kebab, pitha, fuchka, halal, Bengali cuisine, etc.
Return ONLY a JSON array of 5 strings. No explanation, no markdown, no extra text.
Example: ["Biryani restaurants", "Halal food", "Home Kitchen near me", "Bengali sweets", "Chicken kebab"]`,
              }],
            },
            contents: [{
              role: "user",
              parts: [{ text: `Search query: "${debouncedValue}"` }],
            }],
            generationConfig: { maxOutputTokens: 150, temperature: 0.4 },
          }),
        });

        const data = await res.json();
        console.log("[AISearch] Raw API response:", data);

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
        console.log("[AISearch] Text from Gemini:", text);

        const cleaned = text.replace(/```json|```/g, "").trim();
        const parsed: string[] = JSON.parse(cleaned);
        console.log("[AISearch] Parsed suggestions:", parsed);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setSuggestions(parsed.slice(0, 5));
          updateDropdownPosition();
          setOpen(true);
        }
      } catch (err) {
        console.error("[AISearch] Error:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const dropdown = open && suggestions.length > 0 && mounted ? (
    createPortal(
      <ul
        id="aisearch-portal"
        className="aisearch__dropdown"
        style={dropdownStyle}
        role="listbox"
      >
        <li className="aisearch__dropdown-header">
          <Sparkles size={11} />
          <span>AI suggestions</span>
        </li>
        {suggestions.map((s, i) => (
          <li
            key={i}
            className="aisearch__item"
            role="option"
            onMouseDown={() => handleSelect(s)}
          >
            <Search size={12} className="aisearch__item-icon" />
            {s}
          </li>
        ))}
      </ul>,
      document.body
    )
  ) : null;

  return (
    <div className="aisearch" ref={wrapperRef}>
      <Search size={14} className="aisearch__icon" />

      <input
        ref={inputRef}
        className="rp__filter-input aisearch__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) {
            updateDropdownPosition();
            setOpen(true);
          }
        }}
        autoComplete="off"
      />

      {loading && <Loader2 size={13} className="aisearch__spinner" />}

      {dropdown}
    </div>
  );
}