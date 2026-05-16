"use client";

// S34 — TipTap editor pour la review/édition d'un article.
// SSR-safe : `immediatelyRender: false` (sinon hydration mismatch sur Next App Router).
// Form submission via useActionState(saveArticle) — input title + hidden body_html sync depuis onUpdate.
// Bouton "Publier sur WordPress" = form séparé sur publishArticle (action existante, redirect).

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Undo2,
  Save,
  Send,
  CheckCircle2,
} from "lucide-react";
import { saveArticle, publishArticle, type SaveArticleState } from "../actions";

interface Props {
  articleId: string;
  initialTitle: string;
  initialHtml: string;
  status: string;
}

const INITIAL_STATE: SaveArticleState = { ok: false };

const SAVE_ERROR_LABELS: Record<string, string> = {
  missing_article: "Article manquant.",
  missing_title: "Le titre ne peut pas être vide.",
  empty_body: "Le contenu ne peut pas être vide.",
  not_found: "Article introuvable.",
  save_failed: "Échec de la sauvegarde — réessayez.",
};

export function ArticleEditor({ articleId, initialTitle, initialHtml, status }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [html, setHtml] = useState(initialHtml);
  const [state, formAction] = useActionState(saveArticle, INITIAL_STATE);
  const isPublished = status === "published";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder: "Commencez à écrire…" }),
    ],
    content: initialHtml,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap-editor min-h-[400px] focus:outline-none prose-headings:text-ink prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2 prose-p:text-ink prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-ink prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-li:mb-1",
      },
    },
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  // Reset feedback transitoire après succès de sauvegarde.
  const [savedFlash, setSavedFlash] = useState<string | null>(null);
  useEffect(() => {
    if (state.ok && state.saved_at) {
      setSavedFlash(state.saved_at);
      const t = setTimeout(() => setSavedFlash(null), 3000);
      return () => clearTimeout(t);
    }
  }, [state]);

  const saveErrorMsg = !state.ok && state.error ? SAVE_ERROR_LABELS[state.error] ?? "Erreur de sauvegarde." : null;

  return (
    <div className="bg-white border border-DEFAULT rounded-xl shadow-card overflow-hidden">
      {/* Titre éditable */}
      <div className="border-b border-DEFAULT px-5 py-4">
        <label htmlFor="article-title" className="block font-mono uppercase text-ink-subtle mb-1.5" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
          Titre
        </label>
        <input
          id="article-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPublished}
          maxLength={200}
          className="w-full bg-transparent text-ink focus:outline-none disabled:opacity-60"
          style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3 }}
        />
      </div>

      {/* Toolbar */}
      {editor && !isPublished && (
        <div className="border-b border-DEFAULT bg-surface px-3 py-1.5 flex items-center gap-0.5 flex-wrap">
          <ToolbarButton
            label="Gras"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            label="Italique"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarSep />
          <ToolbarButton
            label="Titre H2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            label="Titre H3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarSep />
          <ToolbarButton
            label="Liste à puces"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={14} strokeWidth={2} />
          </ToolbarButton>
          <ToolbarSep />
          <ToolbarButton
            label="Annuler"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo2 size={14} strokeWidth={2} />
          </ToolbarButton>
        </div>
      )}

      {/* Editor body */}
      <div className="px-5 py-5">
        <EditorContent editor={editor} />
      </div>

      {/* Footer : feedback + actions */}
      <div className="border-t border-DEFAULT px-5 py-3 flex items-center justify-between gap-3 flex-wrap bg-surface/50">
        <div className="text-ink-muted" style={{ fontSize: 12 }}>
          {savedFlash ? (
            <span className="inline-flex items-center gap-1.5 text-success">
              <CheckCircle2 size={14} strokeWidth={2} />
              Sauvegardé · {fmtTime(savedFlash)}
            </span>
          ) : saveErrorMsg ? (
            <span className="text-danger">{saveErrorMsg}</span>
          ) : isPublished ? (
            <span className="text-ink-subtle italic">Article publié — modifications désactivées</span>
          ) : (
            <span className="text-ink-subtle">Auto-save manuel — pensez à sauvegarder avant de publier</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isPublished && (
            <form action={formAction}>
              <input type="hidden" name="article_id" value={articleId} />
              <input type="hidden" name="title" value={title} />
              <input type="hidden" name="body_html" value={html} />
              <SaveButton />
            </form>
          )}
          {!isPublished && (
            <form action={publishArticle}>
              <input type="hidden" name="article_id" value={articleId} />
              <PublishButton />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-DEFAULT bg-white hover:bg-surface disabled:opacity-60 text-ink-muted hover:text-ink transition-colors"
      style={{ fontSize: 12, fontWeight: 500 }}
    >
      <Save size={13} strokeWidth={2} />
      {pending ? "Sauvegarde…" : "Sauvegarder le brouillon"}
    </button>
  );
}

function PublishButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/60 text-white transition-colors"
      style={{ fontSize: 12, fontWeight: 600 }}
    >
      <Send size={13} strokeWidth={2} />
      {pending ? "Publication…" : "Publier sur WordPress"}
    </button>
  );
}

function ToolbarButton({
  children,
  active,
  disabled,
  onClick,
  label,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  // useTransition pour ne pas figer l'UI sur les ops lourdes (rare avec TipTap mais propre).
  const [, startTransition] = useTransition();
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={!!active}
      disabled={disabled}
      onClick={() => startTransition(onClick)}
      className={`inline-flex items-center justify-center rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? "bg-brand-500/10 text-brand-600" : "text-ink-muted hover:bg-white hover:text-ink"
      }`}
      style={{ width: 28, height: 28 }}
    >
      {children}
    </button>
  );
}

function ToolbarSep() {
  return <span aria-hidden="true" className="bg-DEFAULT" style={{ width: 1, height: 16, margin: "0 4px" }} />;
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return "";
  }
}
