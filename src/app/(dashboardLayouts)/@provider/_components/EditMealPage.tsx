// src/components/provider/EditMealPage.tsx

"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import {
  getMyMealById,
  updateMeal,
  deleteMeal,
  getCategories,
  deleteGalleryImage,
} from "@/services/provider.service"
import "./editMealPage.css"

const DIETARY_OPTIONS = [
  { value: "VEGAN", label: "🌱 Vegan" },
  { value: "VEGETARIAN", label: "🥦 Vegetarian" },
  { value: "HALAL", label: "☪️ Halal" },
  { value: "GLUTEN_FREE", label: "🌾 Gluten free" },
  { value: "DAIRY_FREE", label: "🥛 Dairy free" },
  { value: "NUT_FREE", label: "🥜 Nut free" },
]

interface ICategory { id: string; name: string }

export default function EditMealPage({
  mealId,
}: {
  mealId: string
}) {
  const router = useRouter()
  const mainImageRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [categories, setCategories] = useState<ICategory[]>([])
  const [meal, setMeal] = useState<any>(null)

  // form state — same as AddMealForm
  const [categoryId, setCategoryId] = useState("")
  const [name, setName] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  const [portionSize, setPortionSize] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [discountPrice, setDiscountPrice] = useState("")
  const [discountStartDate, setDiscountStartDate] = useState("")
  const [discountEndDate, setDiscountEndDate] = useState("")
  const [preparationTime, setPreparationTime] = useState("15")
  const [deliveryFee, setDeliveryFee] = useState("0")
  const [isAvailable, setIsAvailable] = useState(true)

  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [allergens, setAllergens] = useState<string[]>([])
  const [allergenInput, setAllergenInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([])
  const [ingredientInput, setIngredientInput] = useState("")

  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [fat, setFat] = useState("")
  const [carbs, setCarbs] = useState("")

  const [sizes, setSizes] = useState<any[]>([])
  const [spiceLevels, setSpiceLevels] = useState<any[]>([])
  const [addOns, setAddOns] = useState<any[]>([])
  const [removeOptions, setRemoveOptions] = useState<string[]>([])
  const [removeInput, setRemoveInput] = useState("")

  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState("")
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res?.data ?? []))
      .catch(() => {})
    fetchMeal()
  }, [mealId])

  const fetchMeal = async () => {
    try {
      setIsLoading(true)
      const res = await getMyMealById(mealId)
      if (res?.data) {
        const m = res.data
        setMeal(m)
        setCategoryId(m.categoryId)
        setName(m.name)
        setSubcategory(m.subcategory ?? "")
        setShortDescription(m.shortDescription)
        setFullDescription(m.fullDescription ?? "")
        setPortionSize(m.portionSize ?? "")
        setBasePrice(String(m.basePrice))
        setDiscountPrice(m.discountPrice ? String(m.discountPrice) : "")
        setPreparationTime(String(m.preparationTimeMinutes))
        setDeliveryFee(String(m.deliveryFee))
        setIsAvailable(m.isAvailable)
        setDietaryPreferences(m.dietaryPreferences ?? [])
        setAllergens(m.allergens ?? [])
        setTags(m.tags ?? [])
        setIngredients(
          (m.ingredients ?? []).map((i: any) => i.name)
        )
        setCalories(m.calories ? String(m.calories) : "")
        setProtein(m.protein ? String(m.protein) : "")
        setFat(m.fat ? String(m.fat) : "")
        setCarbs(m.carbohydrates ? String(m.carbohydrates) : "")
        setSizes(
          (m.sizes ?? []).map((s: any) => ({
            name: s.name,
            extraPrice: String(s.extraPrice),
            isDefault: s.isDefault,
          }))
        )
        setSpiceLevels(m.spiceLevels ?? [])
        setAddOns(
          (m.addOns ?? []).map((a: any) => ({
            name: a.name,
            price: String(a.price),
          }))
        )
        setRemoveOptions(
          (m.removeOptions ?? []).map((r: any) => r.name)
        )
        setMainImagePreview(m.mainImageURL)
        setGalleryPreviews(m.galleryImageURLs ?? [])

        if (m.discountStartDate)
          setDiscountStartDate(
            new Date(m.discountStartDate)
              .toISOString()
              .slice(0, 16)
          )
        if (m.discountEndDate)
          setDiscountEndDate(
            new Date(m.discountEndDate)
              .toISOString()
              .slice(0, 16)
          )
      }
    } catch {
      toast.error("Failed to load meal.")
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmed = value.trim()
    if (!trimmed || list.includes(trimmed)) return
    setList([...list, trimmed])
    setInput("")
  }

  const removeTag = (
    val: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => setList((prev) => prev.filter((v) => v !== val))

  const handleDeleteGalleryImage = async (url: string) => {
    try {
      await deleteGalleryImage(mealId, url)
      setGalleryPreviews((prev) => prev.filter((u) => u !== url))
      toast.success("Gallery image removed.")
    } catch {
      toast.error("Failed to remove image.")
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this meal? This cannot be undone."
      )
    )
      return

    setIsDeleting(true)
    try {
      await deleteMeal(mealId)
      toast.success("Meal deleted.")
      router.push("/provider-dashboard/menu")
    } catch {
      toast.error("Failed to delete meal.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const fd = new FormData()

      if (name) fd.append("name", name)
      if (categoryId) fd.append("categoryId", categoryId)
      if (shortDescription)
        fd.append("shortDescription", shortDescription)
      if (basePrice) fd.append("basePrice", basePrice)
      fd.append("preparationTimeMinutes", preparationTime)
      fd.append("deliveryFee", deliveryFee)
      fd.append("isAvailable", String(isAvailable))

      if (subcategory) fd.append("subcategory", subcategory)
      if (fullDescription)
        fd.append("fullDescription", fullDescription)
      if (portionSize) fd.append("portionSize", portionSize)
      if (discountPrice) {
        fd.append("discountPrice", discountPrice)
        if (discountStartDate)
          fd.append(
            "discountStartDate",
            new Date(discountStartDate).toISOString()
          )
        if (discountEndDate)
          fd.append(
            "discountEndDate",
            new Date(discountEndDate).toISOString()
          )
      } else {
        fd.append("discountPrice", "")
      }

      if (calories) fd.append("calories", calories)
      if (protein) fd.append("protein", protein)
      if (fat) fd.append("fat", fat)
      if (carbs) fd.append("carbohydrates", carbs)

      fd.append(
        "dietaryPreferences",
        JSON.stringify(dietaryPreferences)
      )
      fd.append("allergens", JSON.stringify(allergens))
      fd.append("tags", JSON.stringify(tags))
      fd.append(
        "ingredients",
        JSON.stringify(ingredients.map((n) => ({ name: n })))
      )
      fd.append(
        "sizes",
        JSON.stringify(
          sizes.map((s) => ({
            name: s.name,
            extraPrice: Number(s.extraPrice) || 0,
            isDefault: s.isDefault,
          }))
        )
      )
      fd.append("spiceLevels", JSON.stringify(spiceLevels))
      fd.append(
        "addOns",
        JSON.stringify(
          addOns.map((a) => ({
            name: a.name,
            price: Number(a.price),
          }))
        )
      )
      fd.append(
        "removeOptions",
        JSON.stringify(removeOptions.map((n) => ({ name: n })))
      )

      if (mainImageFile) fd.append("mainImage", mainImageFile)

      const res = await updateMeal(mealId, fd)

      if (res?.success) {
        toast.success("Meal updated successfully.")
        fetchMeal()
      } else {
        toast.error(res?.message ?? "Update failed.")
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Something went wrong."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          color: "hsl(20 10% 55%)",
          fontSize: 14,
          padding: "40px 0",
        }}
      >
        Loading meal…
      </div>
    )
  }

  return (
    <div className="em-page">
      <div className="em-header">
        <Link
          href="/provider-dashboard/menu"
          className="em-back"
        >
          <ArrowLeft size={16} /> Back to menu
        </Link>

        <div className="em-header-text">
          <h1 className="em-title">{meal?.name}</h1>
          <p className="em-subtitle">
            Edit meal details below. Changes reset approval status.
          </p>
        </div>

        <button
          className="em-delete-btn"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 size={14} />
          {isDeleting ? "Deleting…" : "Delete meal"}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="am-form-card">

          {/* availability toggle at top */}
          <div className="am-section">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p className="am-section-title" style={{ margin: 0 }}>
                Availability
              </p>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  fontSize: 14,
                  color: "hsl(20 20% 12%)",
                  fontWeight: 500,
                }}
              >
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) =>
                    setIsAvailable(e.target.checked)
                  }
                  style={{ accentColor: "hsl(38 70% 55%)" }}
                />
                {isAvailable
                  ? "Available to customers"
                  : "Hidden from customers"}
              </label>
            </div>
          </div>

          {/* Basic info */}
          <div className="am-section">
            <p className="am-section-title">Basic information</p>
            <div className="am-grid-2">

              <div className="am-field am-field--full">
                <label className="am-label">Meal name</label>
                <input
                  className="am-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="am-field">
                <label className="am-label">Category</label>
                <select
                  className="am-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="am-field">
                <label className="am-label">
                  Subcategory
                  <span className="am-label-optional">optional</span>
                </label>
                <input
                  className="am-input"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                />
              </div>

              <div className="am-field am-field--full">
                <label className="am-label">Short description</label>
                <input
                  className="am-input"
                  value={shortDescription}
                  onChange={(e) =>
                    setShortDescription(e.target.value)
                  }
                />
              </div>

              <div className="am-field am-field--full">
                <label className="am-label">
                  Full description
                  <span className="am-label-optional">optional</span>
                </label>
                <textarea
                  className="am-textarea"
                  value={fullDescription}
                  onChange={(e) =>
                    setFullDescription(e.target.value)
                  }
                />
              </div>

              <div className="am-field">
                <label className="am-label">
                  Portion size
                  <span className="am-label-optional">optional</span>
                </label>
                <input
                  className="am-input"
                  value={portionSize}
                  onChange={(e) => setPortionSize(e.target.value)}
                />
              </div>

              <div className="am-field">
                <label className="am-label">
                  Preparation time (min)
                </label>
                <input
                  className="am-input"
                  type="number"
                  min="1"
                  max="180"
                  value={preparationTime}
                  onChange={(e) =>
                    setPreparationTime(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="am-section">
            <p className="am-section-title">Pricing</p>
            <div className="am-grid-2">
              <div className="am-field">
                <label className="am-label">Base price (৳)</label>
                <input
                  className="am-input"
                  type="number"
                  min="1"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                />
              </div>

              <div className="am-field">
                <label className="am-label">
                  Discount price (৳)
                  <span className="am-label-optional">optional</span>
                </label>
                <input
                  className="am-input"
                  type="number"
                  value={discountPrice}
                  onChange={(e) =>
                    setDiscountPrice(e.target.value)
                  }
                  placeholder="Leave empty to remove discount"
                />
              </div>

              {discountPrice && (
                <>
                  <div className="am-field">
                    <label className="am-label">
                      Discount start
                      <span className="am-label-optional">optional</span>
                    </label>
                    <input
                      className="am-input"
                      type="datetime-local"
                      value={discountStartDate}
                      onChange={(e) =>
                        setDiscountStartDate(e.target.value)
                      }
                    />
                  </div>
                  <div className="am-field">
                    <label className="am-label">
                      Discount end
                      <span className="am-label-optional">optional</span>
                    </label>
                    <input
                      className="am-input"
                      type="datetime-local"
                      value={discountEndDate}
                      onChange={(e) =>
                        setDiscountEndDate(e.target.value)
                      }
                    />
                  </div>
                </>
              )}

              <div className="am-field">
                <label className="am-label">Delivery fee (৳)</label>
                <input
                  className="am-input"
                  type="number"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="am-section">
            <p className="am-section-title">Images</p>
            <div className="am-grid-2">

              <div className="am-field">
                <label className="am-label">Main image</label>
                <div className="am-upload">
                  <input
                    ref={mainImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setMainImageFile(file)
                      setMainImagePreview(
                        URL.createObjectURL(file)
                      )
                    }}
                  />
                  {mainImagePreview && (
                    <img
                      src={mainImagePreview}
                      alt="main"
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                        marginBottom: 8,
                      }}
                    />
                  )}
                  <span className="am-upload-text">
                    Click to replace main image
                  </span>
                </div>
              </div>

              <div className="am-field">
                <label className="am-label">
                  Gallery images
                  <span className="am-label-optional">
                    click × to remove
                  </span>
                </label>
                {galleryPreviews.length > 0 && (
                  <div
                    className="am-upload-preview"
                    style={{ marginBottom: 8 }}
                  >
                    {galleryPreviews.map((url, i) => (
                      <div
                        key={i}
                        style={{ position: "relative" }}
                      >
                        <img
                          src={url}
                          alt={`gallery-${i}`}
                          className="am-upload-thumb"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteGalleryImage(url)
                          }
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: "hsl(0 60% 50%)",
                            color: "white",
                            border: "none",
                            fontSize: 12,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dietary */}
          <div className="am-section">
            <p className="am-section-title">
              Dietary & allergens
            </p>
            <div
              className="am-field"
              style={{ marginBottom: 20 }}
            >
              <label className="am-label">
                Dietary preferences
              </label>
              <div className="am-checkbox-grid">
                {DIETARY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="am-checkbox-item"
                  >
                    <input
                      type="checkbox"
                      checked={dietaryPreferences.includes(
                        opt.value
                      )}
                      onChange={() =>
                        setDietaryPreferences((prev) =>
                          prev.includes(opt.value)
                            ? prev.filter((v) => v !== opt.value)
                            : [...prev, opt.value]
                        )
                      }
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="am-field">
              <label className="am-label">
                Allergens
                <span className="am-label-optional">
                  press Enter to add
                </span>
              </label>
              <div className="am-tag-wrap">
                {allergens.map((a) => (
                  <span key={a} className="am-tag">
                    {a}
                    <button
                      type="button"
                      className="am-tag-remove"
                      onClick={() =>
                        removeTag(a, setAllergens)
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  className="am-tag-input"
                  value={allergenInput}
                  onChange={(e) =>
                    setAllergenInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag(
                        allergenInput,
                        allergens,
                        setAllergens,
                        setAllergenInput
                      )
                    }
                  }}
                  placeholder="e.g. Gluten, Dairy"
                />
              </div>
            </div>
          </div>

          {/* Nutrition */}
          <div className="am-section">
            <p className="am-section-title">Nutrition</p>
            <div className="am-grid-3">
              {[
                {
                  label: "Calories (kcal)",
                  val: calories,
                  set: setCalories,
                },
                {
                  label: "Protein (g)",
                  val: protein,
                  set: setProtein,
                },
                { label: "Fat (g)", val: fat, set: setFat },
                {
                  label: "Carbohydrates (g)",
                  val: carbs,
                  set: setCarbs,
                },
              ].map(({ label, val, set }) => (
                <div className="am-field" key={label}>
                  <label className="am-label">{label}</label>
                  <input
                    className="am-input"
                    type="number"
                    min="0"
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Customization */}
          <div className="am-section">
            <p className="am-section-title">Customization</p>

            {/* Sizes */}
            <div
              className="am-field"
              style={{ marginBottom: 24 }}
            >
              <label className="am-label">Sizes</label>
              <div className="am-option-list">
                {sizes.map((size, i) => (
                  <div className="am-option-row" key={i}>
                    <input
                      className="am-input"
                      placeholder="Size name"
                      value={size.name}
                      onChange={(e) => {
                        const next = [...sizes]
                        next[i].name = e.target.value
                        setSizes(next)
                      }}
                    />
                    <input
                      className="am-input"
                      type="number"
                      placeholder="Extra ৳"
                      value={size.extraPrice}
                      onChange={(e) => {
                        const next = [...sizes]
                        next[i].extraPrice = e.target.value
                        setSizes(next)
                      }}
                    />
                    <label className="am-option-default">
                      <input
                        type="radio"
                        name="editSizeDefault"
                        checked={size.isDefault}
                        onChange={() =>
                          setSizes(
                            sizes.map((s, j) => ({
                              ...s,
                              isDefault: j === i,
                            }))
                          )
                        }
                      />
                      Default
                    </label>
                    <button
                      type="button"
                      className="am-addon-remove"
                      onClick={() =>
                        setSizes(sizes.filter((_, j) => j !== i))
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="am-add-btn"
                onClick={() =>
                  setSizes([
                    ...sizes,
                    {
                      name: "",
                      extraPrice: "0",
                      isDefault: sizes.length === 0,
                    },
                  ])
                }
              >
                <Plus size={14} /> Add size
              </button>
            </div>

            {/* Add-ons */}
            <div
              className="am-field"
              style={{ marginBottom: 24 }}
            >
              <label className="am-label">Add-ons</label>
              <div className="am-addon-list">
                {addOns.map((addon, i) => (
                  <div className="am-addon-row" key={i}>
                    <input
                      className="am-input"
                      placeholder="Add-on name"
                      value={addon.name}
                      onChange={(e) => {
                        const next = [...addOns]
                        next[i].name = e.target.value
                        setAddOns(next)
                      }}
                    />
                    <input
                      className="am-input"
                      type="number"
                      placeholder="Price ৳"
                      value={addon.price}
                      onChange={(e) => {
                        const next = [...addOns]
                        next[i].price = e.target.value
                        setAddOns(next)
                      }}
                    />
                    <button
                      type="button"
                      className="am-addon-remove"
                      onClick={() =>
                        setAddOns(
                          addOns.filter((_, j) => j !== i)
                        )
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="am-add-btn"
                onClick={() =>
                  setAddOns([
                    ...addOns,
                    { name: "", price: "" },
                  ])
                }
              >
                <Plus size={14} /> Add add-on
              </button>
            </div>

            {/* Remove options */}
            <div className="am-field">
              <label className="am-label">
                Remove options
                <span className="am-label-optional">
                  press Enter to add
                </span>
              </label>
              <div className="am-tag-wrap">
                {removeOptions.map((r) => (
                  <span key={r} className="am-tag">
                    {r}
                    <button
                      type="button"
                      className="am-tag-remove"
                      onClick={() =>
                        removeTag(r, setRemoveOptions)
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  className="am-tag-input"
                  value={removeInput}
                  onChange={(e) =>
                    setRemoveInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag(
                        removeInput,
                        removeOptions,
                        setRemoveOptions,
                        setRemoveInput
                      )
                    }
                  }}
                  placeholder="e.g. Cheese, Onions"
                />
              </div>
            </div>
          </div>

        </div>

        <div className="am-footer">
          <Link
            href="/provider-dashboard/menu"
            className="am-btn-cancel"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", height: 44 }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="am-btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  )
}