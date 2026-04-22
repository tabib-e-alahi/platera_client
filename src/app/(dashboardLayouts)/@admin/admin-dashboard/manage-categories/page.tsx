"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "@/services/admin.service";
import "./admin-categories.css";

type TCategory = {
  id: string; name: string; slug: string; imageURL: string;
  displayOrder: number; isActive: boolean; createdAt: string;
  _count?: { meals: number };
};

const EMPTY_FORM = { name: "", slug: "", imageURL: "", displayOrder: 0 };

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function CategoryModal({
  initial,
  onSave,
  onClose,
  isSaving,
}: {
  initial?: TCategory | null;
  onSave: (data: typeof EMPTY_FORM) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(
    initial
      ? { name: initial.name, slug: initial.slug, imageURL: initial.imageURL, displayOrder: initial.displayOrder }
      : EMPTY_FORM
  );

  const setField = (k: keyof typeof EMPTY_FORM, v: string | number) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="acat-modal-overlay" onClick={onClose}>
      <div className="acat-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="acat-modal__title">
          {initial ? "Edit category" : "Create category"}
        </h2>

        <div className="acat-modal__field">
          <label className="acat-modal__label">Name <span style={{ color: "#EF4444" }}>*</span></label>
          <input
            className="acat-modal__input"
            value={form.name}
            onChange={(e) => {
              setField("name", e.target.value);
              if (!initial) setField("slug", slugify(e.target.value));
            }}
            placeholder="e.g. Biryani"
          />
        </div>

        <div className="acat-modal__field">
          <label className="acat-modal__label">Slug <span style={{ color: "#EF4444" }}>*</span></label>
          <input
            className="acat-modal__input"
            value={form.slug}
            onChange={(e) => setField("slug", slugify(e.target.value))}
            placeholder="e.g. biryani"
          />
          <span className="acat-modal__hint">Auto-generated from name. Lowercase, hyphens only.</span>
        </div>

        <div className="acat-modal__field">
          <label className="acat-modal__label">Image URL <span style={{ color: "#EF4444" }}>*</span></label>
          <input
            className="acat-modal__input"
            value={form.imageURL}
            onChange={(e) => setField("imageURL", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="acat-modal__field">
          <label className="acat-modal__label">Display order</label>
          <input
            className="acat-modal__input"
            type="number"
            value={form.displayOrder}
            onChange={(e) => setField("displayOrder", Number(e.target.value))}
            placeholder="0"
          />
          <span className="acat-modal__hint">Lower number = appears first.</span>
        </div>

        <div className="acat-modal__actions">
          <button className="acat-modal__cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="acat-modal__save-btn"
            disabled={isSaving || !form.name.trim() || !form.slug.trim() || !form.imageURL.trim()}
            onClick={() => onSave(form)}
          >
            {isSaving ? "Saving…" : initial ? "Save changes" : "Create category"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminManageCategoriesPage() {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminCategories();
      setCategories(res?.data ?? []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to load categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSave = async (form: typeof EMPTY_FORM) => {
    setIsSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, form);
        toast.success("Category updated.");
      } else {
        await createCategory(form);
        toast.success("Category created.");
      }
      setShowModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (cat: TCategory) => {
    setBusyId(cat.id);
    try {
      await toggleCategoryStatus(cat.id);
      toast.success(`Category ${cat.isActive ? "hidden" : "activated"}.`);
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to toggle.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (cat: TCategory) => {
    const mealCount = cat._count?.meals ?? 0;
    if (mealCount > 0) {
      toast.error(`Cannot delete "${cat.name}" — it has ${mealCount} meal${mealCount > 1 ? "s" : ""}. Reassign meals first.`);
      return;
    }
    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;

    setBusyId(cat.id);
    try {
      await deleteCategory(cat.id);
      toast.success("Category deleted.");
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to delete category.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="acat">
      <div className="acat__header">
        <div>
          <p className="acat__eyebrow">Admin Panel</p>
          <h1 className="acat__title">Manage categories</h1>
          <p className="acat__subtitle">
            Create and manage meal categories visible to customers.
          </p>
        </div>
        <button
          className="acat__add-btn"
          onClick={() => { setEditingCategory(null); setShowModal(true); }}
        >
          + New category
        </button>
      </div>

      {isLoading ? (
        <p className="acat__loading">Loading categories…</p>
      ) : categories.length === 0 ? (
        <div className="acat__empty">No categories yet. Create one to get started.</div>
      ) : (
        <div className="acat__grid">
          {categories.map((cat) => (
            <div key={cat.id} className={`acat-card${!cat.isActive ? " acat-card--inactive" : ""}`}>
              <div className="acat-card__image">
                {cat.imageURL ? (
                  <img src={cat.imageURL} alt={cat.name} />
                ) : (
                  <div className="acat-card__image-placeholder">🍽️</div>
                )}
                {!cat.isActive && (
                  <span className="acat-card__inactive-badge">Hidden</span>
                )}
              </div>

              <div className="acat-card__body">
                <p className="acat-card__name">{cat.name}</p>
                <p className="acat-card__slug">/{cat.slug}</p>
                <div className="acat-card__meta">
                  <span>{cat._count?.meals ?? 0} meal{(cat._count?.meals ?? 0) !== 1 ? "s" : ""}</span>
                  <span className="acat-card__order">Order #{cat.displayOrder}</span>
                </div>
              </div>

              <div className="acat-card__actions">
                <button
                  className="acat-card__btn acat-card__btn--edit"
                  onClick={() => { setEditingCategory(cat); setShowModal(true); }}
                  disabled={busyId === cat.id}
                >
                  Edit
                </button>
                <button
                  className="acat-card__btn acat-card__btn--toggle"
                  onClick={() => handleToggle(cat)}
                  disabled={busyId === cat.id}
                >
                  {cat.isActive ? "Hide" : "Show"}
                </button>
                <button
                  className="acat-card__btn acat-card__btn--delete"
                  onClick={() => handleDelete(cat)}
                  disabled={busyId === cat.id}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CategoryModal
          initial={editingCategory}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingCategory(null); }}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}