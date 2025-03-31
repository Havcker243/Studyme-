import { useEffect, useState } from "react";

export type SavedSummary = {
  id: string;
  fileName: string;
  summary: string;
  mode: "brief" | "detailed";
  date: string;
};

const STORAGE_KEY = "studyme:summaries";

export function useSavedSummaries() {
  const [summaries, setSummaries] = useState<SavedSummary[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setSummaries(JSON.parse(raw));
    }
  }, []);

  const saveSummary = (fileName: string, summary: string, mode: "brief" | "detailed") => {
    const newEntry: SavedSummary = {
      id: Date.now().toString(),
      fileName,
      summary,
      mode,
      date: new Date().toISOString(),
    };

    const updated = [newEntry, ...summaries];
    setSummaries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteSummary = (id: string) => {
    const updated = summaries.filter((s) => s.id !== id);
    setSummaries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { summaries, saveSummary, deleteSummary };
}
