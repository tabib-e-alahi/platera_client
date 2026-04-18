// src/components/provider/AddMealForm.tsx

"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createMeal, getCategories } from "@/services/provider.service"

const DIETARY_OPTIONS = [
  { value: "VEGAN", label: "🌱 Vegan" },
  { value: "VEGETARIAN", label: "🥦 Vegetarian" },
  { value: "HALAL", label: "☪️ Halal" },
  { value: "GLUTEN_FREE", label: "🌾 Gluten free" },
  { value: "DAIRY_FREE", label: "🥛 Dairy free" },
  { value: "NUT_FREE", label: "🥜 Nut free" },
]

interface ICategory { id: string; name: string }
interface IAddOn { name: string; price: string }
interface ISize { name: string; extraPrice: string; isDefault: boolean }
interface ISpiceLevel { level: string; isDefault: boolean }

export default function AddMealForm() {
  const router = useRouter()
  const mainImageRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // core fields
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
  const [discountDateError, setDiscountDateError] = useState<string | null>(null)

  // arrays
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [allergens, setAllergens] = useState<string[]>([])
  const [allergenInput, setAllergenInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([])
  const [ingredientInput, setIngredientInput] = useState("")

  // nutrition
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [fat, setFat] = useState("")
  const [carbs, setCarbs] = useState("")

  // customization
  const [sizes, setSizes] = useState<ISize[]>([])
  const [spiceLevels, setSpiceLevels] = useState<ISpiceLevel[]>([])
  const [addOns, setAddOns] = useState<IAddOn[]>([])
  const [removeOptions, setRemoveOptions] = useState<string[]>([])
  const [removeInput, setRemoveInput] = useState("")

  // images
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState("")
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res?.data ?? []))
      .catch(() => { })
  }, [])

  const validateDiscountDates = (start: string, end: string) => {
    if (!start || !end) return null

    const startDate = new Date(start)
    const endDate = new Date(end)

    if (startDate > endDate) {
      return "Start date cannot be later than end date."
    }

    return null
  }

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMainImageFile(file)
    setMainImagePreview(URL.createObjectURL(file))
  }

  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const newFiles = [...galleryFiles, ...files].slice(0, 5)
    setGalleryFiles(newFiles)
    setGalleryPreviews(newFiles.map((f) => URL.createObjectURL(f)))
  }

  const toggleDietary = (val: string) => {
    setDietaryPreferences((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    )
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return toast.error("Meal name is required.")
    if (!categoryId) return toast.error("Please select a category.")
    if (!shortDescription.trim())
      return toast.error("Short description is required.")
    if (!basePrice) return toast.error("Base price is required.")
    if (!mainImageFile) return toast.error("Main image is required.")

    const base = parseFloat(basePrice)
    const discount = parseFloat(discountPrice)

    if (
      discountPrice &&
      !isNaN(base) &&
      !isNaN(discount) &&
      discount > base
    ) {
      setPriceError("Discount price cannot be greater than base price.")
      return toast.error("Discount price cannot be greater than base price.")
    }

    const dateError = validateDiscountDates(discountStartDate, discountEndDate)

    if (dateError) {
      setDiscountDateError(dateError)
      return toast.error(dateError)
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("categoryId", categoryId)
      formData.append("shortDescription", shortDescription)
      formData.append("basePrice", basePrice)
      formData.append("preparationTimeMinutes", preparationTime)
      formData.append("deliveryFee", deliveryFee)

      if (subcategory) formData.append("subcategory", subcategory)
      if (fullDescription) formData.append("fullDescription", fullDescription)
      if (portionSize) formData.append("portionSize", portionSize)
      if (discountPrice) {
        formData.append("discountPrice", discountPrice)
        if (discountStartDate)
          formData.append("discountStartDate", new Date(discountStartDate).toISOString())
        if (discountEndDate)
          formData.append("discountEndDate", new Date(discountEndDate).toISOString())
      }
      if (calories) formData.append("calories", calories)
      if (protein) formData.append("protein", protein)
      if (fat) formData.append("fat", fat)
      if (carbs) formData.append("carbohydrates", carbs)

      // arrays as JSON strings
      formData.append("dietaryPreferences", JSON.stringify(dietaryPreferences))
      formData.append("allergens", JSON.stringify(allergens))
      formData.append("tags", JSON.stringify(tags))
      formData.append(
        "ingredients",
        JSON.stringify(ingredients.map((name) => ({ name })))
      )
      formData.append("sizes", JSON.stringify(sizes.map((s) => ({
        name: s.name,
        extraPrice: Number(s.extraPrice) || 0,
        isDefault: s.isDefault,
      }))))
      formData.append("spiceLevels", JSON.stringify(spiceLevels))
      formData.append("addOns", JSON.stringify(addOns.map((a) => ({
        name: a.name,
        price: Number(a.price),
      }))))
      formData.append(
        "removeOptions",
        JSON.stringify(removeOptions.map((name) => ({ name })))
      )

      // images
      formData.append("mainImage", mainImageFile)
      galleryFiles.forEach((file) => formData.append("galleryImages", file))

      const res = await createMeal(formData)
      console.log(res);
      if (res?.success) {
        toast.success("Meal created successfully!")
        router.push("/provider-dashboard/menu")
      } else {
        toast.error(res?.message ?? "Failed to create meal.")
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Something went wrong."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="am-form-card">

        {/* ── BASIC INFO ── */}
        <div className="am-section">
          <p className="am-section-title">Basic information</p>
          <div className="am-grid-2">

            <div className="am-field am-field--full">
              <label className="am-label">Meal name</label>
              <input
                className="am-input"
                placeholder="e.g. Chicken Burger Deluxe"
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
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
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
                placeholder="e.g. Burger, Noodles"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </div>

            <div className="am-field am-field--full">
              <label className="am-label">Short description</label>
              <input
                className="am-input"
                placeholder="One line summary (max 200 chars)"
                maxLength={200}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>

            <div className="am-field am-field--full">
              <label className="am-label">
                Full description
                <span className="am-label-optional">optional</span>
              </label>
              <textarea
                className="am-textarea"
                placeholder="Detailed description of the meal"
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
              />
            </div>

            <div className="am-field">
              <label className="am-label">
                Portion size
                <span className="am-label-optional">optional</span>
              </label>
              <input
                className="am-input"
                placeholder="e.g. Serves 1, 250g"
                value={portionSize}
                onChange={(e) => setPortionSize(e.target.value)}
              />
            </div>

            <div className="am-field">
              <label className="am-label">Preparation time (min)</label>
              <input
                className="am-input"
                type="number"
                min="1"
                max="180"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* ── PRICING ── */}
        <div className="am-section">
          <p className="am-section-title">Pricing</p>
          <div className="am-grid-2">

            <div className="am-field">
              <label className="am-label">Base price (৳)</label>
              <input
                className="am-input"
                type="number"
                min="1"
                placeholder="180"
                value={basePrice}
                onChange={(e) => {
                  const value = e.target.value
                  setBasePrice(value)

                  const base = parseFloat(value)
                  const discount = parseFloat(discountPrice)

                  if (
                    discountPrice &&
                    !isNaN(base) &&
                    !isNaN(discount) &&
                    discount > base
                  ) {
                    setPriceError("Discount price cannot be greater than base price.")
                  } else {
                    setPriceError(null)
                  }
                }}
              />
            </div>

            <div className="am-field">
              <label className="am-label">
                Discount price (৳)
                <span className="am-label-optional">optional</span>
              </label>
              <input
                className={`am-input ${priceError ? "border border-red-500" : ""}`}
                type="number"
                min="1"
                placeholder="150"
                value={discountPrice}
                onChange={(e) => {
                  const value = e.target.value
                  setDiscountPrice(value)

                  if (!value) {
                    setPriceError(null)
                    return
                  }

                  const base = parseFloat(basePrice)
                  const discount = parseFloat(value)

                  if (!isNaN(base) && !isNaN(discount) && discount > base) {
                    setPriceError("Discount price cannot be greater than base price.")
                  } else {
                    setPriceError(null)
                  }
                }}
              />
              {priceError && (
                <p className="mt-1 text-sm text-red-500">{priceError}</p>
              )}
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
                    onChange={(e) => {
                      const value = e.target.value
                      setDiscountStartDate(value)

                      const error = validateDiscountDates(value, discountEndDate)
                      setDiscountDateError(error)
                    }}
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
                    onChange={(e) => {
                      const value = e.target.value
                      setDiscountEndDate(value)

                      const error = validateDiscountDates(discountStartDate, value)
                      setDiscountDateError(error)
                    }}
                  />
                </div>
                {discountDateError && (
                  <p className="mt-1 text-sm text-red-500">
                    {discountDateError}
                  </p>
                )}
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

        {/* ── IMAGES ── */}
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
                  onChange={handleMainImage}
                />
                {mainImagePreview ? (
                  <img
                    src={mainImagePreview}
                    alt="preview"
                    className="am-upload-thumb"
                    style={{ width: "100%", height: "120px", objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <span className="am-upload-icon">📷</span>
                    <span className="am-upload-text">
                      Click to upload main image
                    </span>
                    <span className="am-upload-hint">
                      JPG, PNG, WebP — max 5MB
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="am-field">
              <label className="am-label">
                Gallery images
                <span className="am-label-optional">up to 5</span>
              </label>
              <div className="am-upload">
                <input
                  ref={galleryRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGallery}
                />
                <span className="am-upload-icon">🖼️</span>
                <span className="am-upload-text">
                  Click to add gallery images
                </span>
                <span className="am-upload-hint">Max 5 images</span>
              </div>
              {galleryPreviews.length > 0 && (
                <div className="am-upload-preview">
                  {galleryPreviews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`gallery-${i}`}
                      className="am-upload-thumb"
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── DIETARY & ALLERGENS ── */}
        <div className="am-section">
          <p className="am-section-title">Dietary & allergens</p>

          <div className="am-field" style={{ marginBottom: 20 }}>
            <label className="am-label">Dietary preferences</label>
            <div className="am-checkbox-grid">
              {DIETARY_OPTIONS.map((opt) => (
                <label key={opt.value} className="am-checkbox-item">
                  <input
                    type="checkbox"
                    checked={dietaryPreferences.includes(opt.value)}
                    onChange={() => toggleDietary(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="am-field" style={{ marginBottom: 20 }}>
            <label className="am-label">
              Allergens
              <span className="am-label-optional">press Enter to add</span>
            </label>
            <div className="am-tag-wrap">
              {allergens.map((a) => (
                <span key={a} className="am-tag">
                  {a}
                  <button
                    type="button"
                    className="am-tag-remove"
                    onClick={() => removeTag(a, setAllergens)}
                  >×</button>
                </span>
              ))}
              <input
                className="am-tag-input"
                placeholder="e.g. Gluten, Dairy"
                value={allergenInput}
                onChange={(e) => setAllergenInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(allergenInput, allergens, setAllergens, setAllergenInput)
                  }
                }}
              />
            </div>
          </div>

          <div className="am-field">
            <label className="am-label">
              Tags
              <span className="am-label-optional">press Enter to add</span>
            </label>
            <div className="am-tag-wrap">
              {tags.map((t) => (
                <span key={t} className="am-tag">
                  {t}
                  <button
                    type="button"
                    className="am-tag-remove"
                    onClick={() => removeTag(t, setTags)}
                  >×</button>
                </span>
              ))}
              <input
                className="am-tag-input"
                placeholder="e.g. bestseller, spicy"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(tagInput, tags, setTags, setTagInput)
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* ── INGREDIENTS ── */}
        <div className="am-section">
          <p className="am-section-title">Ingredients</p>
          <div className="am-field">
            <label className="am-label">
              Ingredients
              <span className="am-label-optional">press Enter to add</span>
            </label>
            <div className="am-tag-wrap">
              {ingredients.map((ing) => (
                <span key={ing} className="am-tag">
                  {ing}
                  <button
                    type="button"
                    className="am-tag-remove"
                    onClick={() => removeTag(ing, setIngredients)}
                  >×</button>
                </span>
              ))}
              <input
                className="am-tag-input"
                placeholder="e.g. Chicken breast"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(
                      ingredientInput,
                      ingredients,
                      setIngredients,
                      setIngredientInput
                    )
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* ── NUTRITION ── */}
        <div className="am-section">
          <p className="am-section-title">
            Nutrition
            <span className="am-label-optional" style={{ textTransform: "none", letterSpacing: 0, fontSize: 12, marginLeft: 8 }}>
              all optional
            </span>
          </p>
          <div className="am-grid-3">
            {[
              { label: "Calories (kcal)", val: calories, set: setCalories },
              { label: "Protein (g)", val: protein, set: setProtein },
              { label: "Fat (g)", val: fat, set: setFat },
              { label: "Carbohydrates (g)", val: carbs, set: setCarbs },
            ].map(({ label, val, set }) => (
              <div className="am-field" key={label}>
                <label className="am-label">{label}</label>
                <input
                  className="am-input"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={val}
                  onChange={(e) => set(e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── CUSTOMIZATION ── */}
        <div className="am-section">
          <p className="am-section-title">Customization</p>

          {/* Sizes */}
          <div className="am-field" style={{ marginBottom: 24 }}>
            <label className="am-label">
              Sizes
              <span className="am-label-optional">optional</span>
            </label>
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
                      name="sizeDefault"
                      checked={size.isDefault}
                      onChange={() => {
                        setSizes(
                          sizes.map((s, j) => ({
                            ...s,
                            isDefault: j === i,
                          }))
                        )
                      }}
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
                  { name: "", extraPrice: "0", isDefault: sizes.length === 0 },
                ])
              }
            >
              <Plus size={14} /> Add size
            </button>
          </div>

          {/* Spice levels */}
          <div className="am-field" style={{ marginBottom: 24 }}>
            <label className="am-label">
              Spice levels
              <span className="am-label-optional">optional</span>
            </label>
            <div className="am-option-list">
              {spiceLevels.map((sp, i) => (
                <div
                  className="am-option-row"
                  key={i}
                  style={{ gridTemplateColumns: "1fr auto 36px" }}
                >
                  <input
                    className="am-input"
                    placeholder="e.g. Mild, Hot"
                    value={sp.level}
                    onChange={(e) => {
                      const next = [...spiceLevels]
                      next[i].level = e.target.value
                      setSpiceLevels(next)
                    }}
                  />
                  <label className="am-option-default">
                    <input
                      type="radio"
                      name="spiceDefault"
                      checked={sp.isDefault}
                      onChange={() => {
                        setSpiceLevels(
                          spiceLevels.map((s, j) => ({
                            ...s,
                            isDefault: j === i,
                          }))
                        )
                      }}
                    />
                    Default
                  </label>
                  <button
                    type="button"
                    className="am-addon-remove"
                    onClick={() =>
                      setSpiceLevels(spiceLevels.filter((_, j) => j !== i))
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
                setSpiceLevels([
                  ...spiceLevels,
                  { level: "", isDefault: spiceLevels.length === 0 },
                ])
              }
            >
              <Plus size={14} /> Add spice level
            </button>
          </div>

          {/* Add-ons */}
          <div className="am-field" style={{ marginBottom: 24 }}>
            <label className="am-label">
              Add-ons
              <span className="am-label-optional">optional</span>
            </label>
            <div className="am-addon-list">
              {addOns.map((addon, i) => (
                <div className="am-addon-row" key={i}>
                  <input
                    className="am-input"
                    placeholder="e.g. Extra cheese"
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
                      setAddOns(addOns.filter((_, j) => j !== i))
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
              onClick={() => setAddOns([...addOns, { name: "", price: "" }])}
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
                  >×</button>
                </span>
              ))}
              <input
                className="am-tag-input"
                placeholder="e.g. Cheese, Onions"
                value={removeInput}
                onChange={(e) => setRemoveInput(e.target.value)}
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
              />
            </div>
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div className="am-footer">
        <button
          type="button"
          className="am-btn-cancel"
          onClick={() => router.push("/provider-dashboard/menu")}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="am-btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating meal…" : "Create meal"}
        </button>
      </div>
    </form>
  )
}