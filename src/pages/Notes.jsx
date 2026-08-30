import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, StickyNote, Search } from "lucide-react";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  readNotes,
  writeNotes,
  newNote,
  upsertNote,
  removeNote,
} from "../notes/notesStore.js";

const formatTime = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay
      ? d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

const titlePreview = (note) => note.title?.trim() || "Untitled";
const bodyPreview = (note) =>
  (note.body || "").trim().replace(/\s+/g, " ").slice(0, 80) ||
  "No additional text";

const Notes = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [notes, setNotes] = useState(() => readNotes(userId));
  const [activeId, setActiveId] = useState(
    () => readNotes(userId)[0]?.id || null,
  );
  const [query, setQuery] = useState("");

  // If the user changes (sign out / sign in in another tab), reload notes
  useEffect(() => {
    const loaded = readNotes(userId);
    setNotes(loaded);
    setActiveId(loaded[0]?.id || null);
  }, [userId]);

  // Persist on every change
  useEffect(() => {
    writeNotes(userId, notes);
  }, [notes, userId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
    );
  }, [notes, query]);

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeId) || null,
    [notes, activeId],
  );

  const handleCreate = () => {
    const fresh = newNote();
    setNotes((prev) => [fresh, ...prev]);
    setActiveId(fresh.id);
    if (typeof pendo !== "undefined") {
      pendo.track("note_created", {
        source: "notes_page",
        totalNoteCount: notes.length + 1,
      });
    }
  };

  const handleUpdate = (patch) => {
    if (!activeNote) return;
    setNotes((prev) => upsertNote(prev, { ...activeNote, ...patch }));
  };

  const handleDelete = (id) => {
    setNotes((prev) => {
      const next = removeNote(prev, id);
      if (id === activeId) {
        setActiveId(next[0]?.id || null);
      }
      return next;
    });
    if (typeof pendo !== "undefined") {
      pendo.track("note_deleted", {
        noteId: id,
        remainingNoteCount: notes.length - 1,
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Notes
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Personal scratchpad — saves automatically
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-[6px] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>

        {/* Two-pane layout */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-[6px] overflow-hidden min-h-[60vh]">
          {/* List pane */}
          <aside className="bg-white dark:bg-slate-800 flex flex-col">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => {
                    if (query.trim() && typeof pendo !== 'undefined') {
                      pendo.track('notes_searched', {
                        query: query.trim().substring(0, 100),
                        resultsCount: filtered.length,
                        totalNoteCount: notes.length
                      });
                    }
                  }}
                  placeholder="Search notes"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto">
              {filtered.length === 0 && (
                <li className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  {notes.length === 0
                    ? "No notes yet — create your first one."
                    : "No notes match this search."}
                </li>
              )}
              {filtered.map((note) => {
                const isActive = note.id === activeId;
                return (
                  <li key={note.id}>
                    <button
                      onClick={() => setActiveId(note.id)}
                      className={`w-full text-left p-3 border-b border-slate-100 dark:border-slate-700/60 transition-colors ${
                        isActive
                          ? "bg-slate-100 dark:bg-slate-700"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {titlePreview(note)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {bodyPreview(note)}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                          {formatTime(note.updatedAt)}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Editor pane */}
          <section className="bg-white dark:bg-slate-800 flex flex-col">
            {activeNote ? (
              <>
                <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Last edited {formatTime(activeNote.updatedAt)}
                  </span>
                  <button
                    onClick={() => handleDelete(activeNote.id)}
                    className="flex items-center space-x-1 px-2 py-1 text-[11px] font-medium text-[#dc2626] hover:text-white hover:bg-[#dc2626] rounded-[6px] transition-colors"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleUpdate({ title: e.target.value })}
                  placeholder="Untitled"
                  className="px-4 pt-4 pb-2 text-xl font-semibold bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none"
                />
                <textarea
                  value={activeNote.body}
                  onChange={(e) => handleUpdate({ body: e.target.value })}
                  placeholder="Start writing…"
                  className="flex-1 px-4 pb-4 text-sm bg-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none focus:outline-none"
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <StickyNote className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  No note selected
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Pick one from the list or create a new note to get started.
                </p>
                <button
                  onClick={handleCreate}
                  className="mt-4 flex items-center space-x-2 px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-[6px] hover:opacity-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Note</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Notes;
