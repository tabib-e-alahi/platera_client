"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  Store, ChefHat, ShoppingBag, Truck, Building2, Phone, MapPin, Navigation, Home,
  Upload, Camera, X, Check, AlertCircle, Info, HelpCircle, ChevronRight, ChevronLeft, Eye,
  Loader2, CheckCircle2, Image as ImageIcon, CreditCard, ArrowRight,
  Hash
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./ProviderSetup.css";
import { createProviderProfile } from "@/services/provider.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { validateImageDimensions } from "@/utils/imageValidation";
<<<<<<< HEAD
=======
import { error } from "console";
>>>>>>> dc5656236feee959b1e0e891718009336b905842
import { BANGLADESH_DISTRICTS } from "@/constants/bangladeshDistricts";

// ─── Types & Enums ────────────────────────────────────────────────────────────

type BusinessCategory = "RESTAURANT" | "SHOP" | "HOME_KITCHEN" | "STREET_FOOD";

interface ImageFile {
  file: File;
  preview: string;
  name: string;
}

interface FormData {
  // Step 1 — Business info
  businessName: string;
  businessCategory: BusinessCategory | "";
  phone: string;
  businessEmail: string;
  bio: string;
  binNumber: string;
  // Step 2 — Address
  city: string;
  street: string;
  houseNumber: string;
  apartment: string;
  postalCode: string;
}

<<<<<<< HEAD
=======
// ─── Zod Schemas ──────────────────────────────────────────────────────────────

>>>>>>> dc5656236feee959b1e0e891718009336b905842
const step1Schema = z.object({
  businessName: z
    .string()
    .min(1, "Business name is required.")
    .min(2, "Business name must be at least 2 characters.")
    .max(100, "Business name cannot exceed 100 characters."),
  businessCategory: z.enum(
    ["RESTAURANT", "SHOP", "HOME_KITCHEN", "STREET_FOOD"],
    { message: "Please select a business type" }
  ),
  phone: z
    .string()
    .min(1, "Phone number is required.")
    .min(8, "Phone number must be at least 8 digits.")
    .max(14, "Phone number cannot exceed 14 digits.")
    .regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number."),
  businessEmail: z.email(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  binNumber: z.string().optional(),
});

const step2Schema = z.object({
  city: z.string().min(1, "Please select your city"),
  street: z
    .string()
    .min(1, "Street is required.")
    .min(2, "Street must be at least 2 characters."),
  houseNumber: z.string().min(1, "House/Building number is required"),
  apartment: z.string().optional(),
  postalCode: z
    .string()
    .min(1, "Postal code is required.")
    .min(4, "Postal code must be at least 4 characters.")
    .max(4, "Postal code can not exceed 4 characters."),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

<<<<<<< HEAD
=======
// ─── Constants ────────────────────────────────────────────────────────────────
>>>>>>> dc5656236feee959b1e0e891718009336b905842

const BUSINESS_TYPES: {
  value: BusinessCategory;
  label: string;
  sub: string;
  Icon: React.ElementType;
}[] = [
    { value: "RESTAURANT", label: "Restaurant", sub: "Full dining setup", Icon: Store },
    { value: "HOME_KITCHEN", label: "Home Kitchen", sub: "Cook from home", Icon: ChefHat },
    { value: "SHOP", label: "Food Shop", sub: "Grocery / specialty", Icon: ShoppingBag },
    { value: "STREET_FOOD", label: "Street Food", sub: "Stall or food cart", Icon: Truck },
  ];

const STEPS = [
  { id: 1, label: "Business" },
  { id: 2, label: "Address" },
  { id: 3, label: "Photos" },
  { id: 4, label: "Review" },
];

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createImagePreview(file: File): ImageFile {
  return { file, preview: URL.createObjectURL(file), name: file.name };
}

function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
    return "Only JPG, PNG, and WebP are allowed";
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
    return `File must be under ${MAX_FILE_SIZE_MB}MB`;
  return null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Single image upload box */
function UploadBox({
  image,
  label,
  sublabel,
  required,
  onFile,
  onRemove,
  inputId,
}: {
  image: ImageFile | null;
  label: string;
  sublabel?: string;
  required?: boolean;
  onFile: (file: File) => void;
  onRemove: () => void;
  inputId: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (file: File) => {
    const err = validateImageFile(file);
    if (err) { setError(err); return; }
    setError("");
    onFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  return (
    <div>
      <label
        htmlFor={inputId}
        className={`ps-upload-box ${image ? "ps-upload-box--has-file" : ""} ${dragging ? "ps-upload-box--drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {/* Badge */}
        <span className={`ps-upload-box__badge ${required ? "ps-upload-box__badge--req" : "ps-upload-box__badge--opt"}`}>
          {required ? "Required" : "Optional"}
        </span>

        {image ? (
          <>
            <img src={image.preview} alt={label} className="ps-upload-preview" />
            <button
              type="button"
              className="ps-upload-remove"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <>
            <div className="ps-upload-box__icon">
              <Upload size={20} />
            </div>
            <span className="ps-upload-box__title">{label}</span>
            {sublabel && <span className="ps-upload-box__sub">{sublabel}</span>}
            <span className="ps-upload-box__sub" style={{ marginTop: 4 }}>
              JPG, PNG, WebP · max {MAX_FILE_SIZE_MB}MB
            </span>
          </>
        )}
      </label>
      <input
        id={inputId}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        style={{ display: "none" }}
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ""; }}
      />
      {error && <p className="ps-field-error" style={{ marginTop: 4 }}><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

/** Profile image upload — circular preview */
function ProfileUpload({
  image,
  onFile,
  onRemove,
}: {
  image: ImageFile | null;
  onFile: (file: File) => void;
  onRemove: () => void;
}) {
  const [error, setError] = useState("");

  const handleFile = (file: File) => {
    const err = validateImageFile(file);
    if (err) { setError(err); return; }
    setError("");
    onFile(file);
  };

  return (
    <div className="ps-profile-upload">
      <label htmlFor="profile-image" style={{ cursor: "pointer" }}>
        <div className={`ps-profile-circle ${image ? "ps-profile-circle--filled" : ""}`}>
          {image ? (
            <>
              <img src={image.preview} alt="Profile" />
              <div className="ps-profile-circle__overlay">
                <Camera size={22} color="#fff" />
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Camera size={28} color="var(--gold)" />
              <span style={{ fontSize: "0.625rem", color: "var(--muted-fg)", fontWeight: 500 }}>Upload</span>
            </div>
          )}
        </div>
      </label>
      <input
        id="profile-image"
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        style={{ display: "none" }}
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ""; }}
      />
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--foreground)" }}>Profile Photo</p>
        <p style={{ fontSize: "0.6875rem", color: "var(--muted-fg)", marginTop: 2 }}>Shown to customers</p>
        {image && (
          <button type="button" onClick={onRemove}
            style={{ fontSize: "0.6875rem", color: "hsl(0,65%,50%)", marginTop: 6, background: "none", border: "none", cursor: "pointer" }}>
            Remove
          </button>
        )}
      </div>
      {error && <p className="ps-field-error"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProviderSetupPage() {
  const { user, isLoading: isUserLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  // Accumulated form data
  const [saved1, setSaved1] = useState<Step1Values | null>(null);
  const [saved2, setSaved2] = useState<Step2Values | null>(null);

  // Images
  const [profileImg, setProfileImg] = useState<ImageFile | null>(null);
  const [nidFront, setNidFront] = useState<ImageFile | null>(null);
  const [nidBack, setNidBack] = useState<ImageFile | null>(null);
  const [mainGateImg, setMainGateImg] = useState<ImageFile | null>(null);
  const [kitchenImg, setKitchenImg] = useState<ImageFile | null>(null);
  const [profileImageError, setProfileImageError] = useState<string | null>(null);
  const [photoErrors, setPhotoErrors] = useState<{
    nidFront?: string;
    nidBack?: string;
    mainGate?: string;
  }>({});


  // ── Step 1 form
  const form1 = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: saved1 ?? { businessName: "", businessCategory: undefined, phone: "", businessEmail: user?.email || "", bio: "", binNumber: "" },
  });
  const selectedCategory = form1.watch("businessCategory");
  const bioValue = form1.watch("bio") ?? "";

  // ── Step 2 form
  const form2 = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: saved2 ?? { city: "", street: "", houseNumber: "", apartment: "", postalCode: "" },
  });

  // ── Navigation
  const handleStep1 = form1.handleSubmit((data) => {
    setSaved1(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const handleStep2 = form2.handleSubmit((data) => {
    setSaved2(data);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const handleStep3 = () => {
    const errors: {
      nidFront?: string;
      nidBack?: string;
      mainGate?: string;
    } = {};

    if (!nidFront) {
      errors.nidFront = "NID front image is required.";
    }

    if (!nidBack) {
      errors.nidBack = "NID back image is required.";
    }

    if (!mainGateImg) {
      errors.mainGate = "Main entrance image is required.";
    }

    if (Object.keys(errors).length > 0) {
      setPhotoErrors(errors);
      return; // ❗ STOP going to step 4
    }

    setPhotoErrors({});
    setStep(4); // go to review
  };

  const handleSubmit = async () => {
    if (!nidFront || !nidBack || !mainGateImg) {
      setStep(3); // go back to Step 3

      setPhotoErrors({
        nidFront: !nidFront ? "NID front image is required." : undefined,
        nidBack: !nidBack ? "NID back image is required." : undefined,
        mainGate: !mainGateImg
          ? "Main entrance image is required."
          : undefined,
      });

      return; // ❗ STOP submit
    }
    setIsLoading(true);
    // Build FormData for multipart submission
    const fd = new FormData();
    if (saved1) {
      fd.append("businessName", saved1.businessName);
      fd.append("businessCategory", saved1.businessCategory);
      fd.append("phone", saved1.phone);
      fd.append("businessEmail", saved1.businessEmail);
      if (saved1.bio) fd.append("bio", saved1.bio);
      if (saved1.binNumber) fd.append("binNumber", saved1.binNumber);
    }
    if (saved2) {
      fd.append("city", saved2.city);
      fd.append("street", saved2.street);
      fd.append("houseNumber", saved2.houseNumber);
      if (saved2.apartment) fd.append("apartment", saved2.apartment);
      fd.append("postalCode", saved2.postalCode);
    }
    if (profileImg) fd.append("profileImage", profileImg.file);
    if (nidFront) fd.append("nidImages", nidFront.file);
    if (nidBack) fd.append("nidImages", nidBack.file);
    if (mainGateImg) fd.append("businessMainGate", mainGateImg.file);
    if (kitchenImg) fd.append("businessKitchen", kitchenImg.file);
    // TODO: POST to /api/provider/profile
    const res = await createProviderProfile(fd)

    if (res?.success) {
      toast.success(
        "Profile Approval request send successfully! You will be notified within 2 to 3 business days."
      )
      setIsLoading(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.push(`/provider-dashboard/profile`);
    } else {
      toast.error(res?.message ?? "Failed to create profile.")
    }
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progress = (step / 4) * 100;

  const handleProfileImageUpload = async (file: File) => {
    const result = await validateImageDimensions(file, {
      minWidth: 1440,
      minHeight: 890,
    });

    if (!result.valid) {
      setProfileImageError(result.message || "Invalid image size! For best quality, please use at least 1440 × 890 pixels.");
      return;
    }
    setProfileImageError(null); // clear error
    setProfileImg(createImagePreview(file));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="ps-page">
      {/* Top bar */}
      <div className="ps-topbar">
        <Link href="/" className="ps-topbar__logo">
          Plate<span>ra</span>
        </Link>
        <div className="ps-topbar__help">
          <HelpCircle size={13} />
          Need help?
        </div>
      </div>

      {/* Progress bar */}
      <div className="ps-progress-bar">
        <div className="ps-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Hero */}
      <div className="ps-hero">
        <div className="ps-hero__eyebrow">
          <span className="ps-hero__dot" />
          Provider Registration
        </div>
        <h1 className="ps-hero__heading">
          Set up your <em>business</em> profile
        </h1>
        <p className="ps-hero__sub">
          Complete all steps to get approved and start receiving orders on Platera.
        </p>
      </div>

      {/* Stepper */}
      <div className="ps-stepper-wrap">
        <div className="ps-stepper">
          <div className="ps-stepper__line" />
          {STEPS.map((s) => {
            const state =
              submitted || step > s.id ? "done"
                : step === s.id ? "active"
                  : "idle";
            return (
              <div key={s.id} className={`ps-step ps-step--${state}`}
                onClick={() => !submitted && step > s.id && setStep(s.id)}>
                <div className="ps-step__circle">
                  {state === "done" ? <Check size={14} /> : s.id}
                </div>
                <span className="ps-step__label">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card */}
      <div className="ps-body">
        {submitted ? (
<<<<<<< HEAD
=======
          /* ── SUCCESS ───────────────────────────────────────────── */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
          <div className="ps-card">
            <div className="ps-success">
              <div className="ps-success__icon">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="ps-success__title">Profile <em>submitted!</em></h2>
              <p className="ps-success__sub">
                Your business profile has been saved as a draft. Request approval from your dashboard to go live.
              </p>
              <div className="ps-success__steps">
                <p className="ps-success__steps-title">What happens next</p>
                {[
                  "Profile saved — status: Draft",
                  "Click 'Request Approval' from your dashboard",
                  "Our team reviews within 1–2 business days",
                  "You're notified by email once approved",
                ].map((t, i) => (
                  <div key={i} className="ps-success__step">
                    <span className="ps-success__step-dot" />
                    {t}
                  </div>
                ))}
              </div>
              <Link href="/provider/status"
                className="ps-btn ps-btn--primary" style={{ marginTop: 8, borderRadius: "999px", padding: "12px 32px" }}>
                Go to Dashboard <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ) : (

          <div className="ps-card" key={step}>

<<<<<<< HEAD
=======
            {/* ── STEP 1: Business Information ──────────────────── */}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            {step === 1 && (
              <>
                <div className="ps-card__head">
                  <div className="ps-card__step-badge">
                    <Building2 size={11} /> Step 1 of 4
                  </div>
                  <h2 className="ps-card__title">Business <em>Information</em></h2>
                  <p className="ps-card__desc">Tell us about your food business. This information will be visible to customers.</p>
                </div>

                <div className="ps-card__body">
                  <form id="form-step1" onSubmit={handleStep1} className="ps-form">

                    {/* Business type */}
                    <div className="ps-field">
                      <label className="ps-label">
                        Business Type <span className="ps-label__req">*</span>
                      </label>
                      <div className="ps-biz-grid">
                        {BUSINESS_TYPES.map(({ value, label, sub, Icon }) => {
                          const selected = selectedCategory === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => form1.setValue("businessCategory", value, { shouldValidate: true })}
                              className={`ps-biz-option ${selected ? "ps-biz-option--selected" : ""}`}
                            >
                              <div className="ps-biz-check"><Check size={10} color="var(--wine-deep)" /></div>
                              <div className="ps-biz-option__icon"><Icon size={22} /></div>
                              <span className="ps-biz-option__label">{label}</span>
                              <span className="ps-biz-option__sub">{sub}</span>
                            </button>
                          );
                        })}
                      </div>
                      {form1.formState.errors.businessCategory && (
                        <p className="ps-field-error">
                          <AlertCircle size={11} />
                          {form1.formState.errors.businessCategory.message}
                        </p>
                      )}
                    </div>

                    {/* Business name */}
                    <div className="ps-field">
                      <label className="ps-label" htmlFor="businessName">
                        Business Name <span className="ps-label__req">*</span>
                      </label>
                      <div className="ps-input-wrap">
                        <Store size={14} className="ps-input-icon" />
                        <input
                          id="businessName"
                          {...form1.register("businessName")}
                          placeholder="e.g. Mama's Kitchen"
                          className={`ps-input ${form1.formState.errors.businessName ? "ps-input--error" : ""}`}
                        />
                      </div>
                      {form1.formState.errors.businessName && (
                        <p className="ps-field-error"><AlertCircle size={11} />{form1.formState.errors.businessName.message}</p>
                      )}
                    </div>
                    {/* buseness email */}
                    <div className="ps-field">
                      <label className="ps-label" htmlFor="businessEmail">
                        Business Email <span className="ps-label__req">*</span>
                      </label>
                      <div className="ps-input-wrap">
                        <Store size={14} className="ps-input-icon" />
                        <input
                          id="businessEmail"
                          {...form1.register("businessEmail")}
                          placeholder="Enter your business email"
                          className={`ps-input ${form1.formState.errors.businessEmail ? "ps-input--error" : ""}`}
                        />
                      </div>
                      {form1.formState.errors.businessEmail && (
                        <p className="ps-field-error"><AlertCircle size={11} />{form1.formState.errors.businessEmail.message}</p>
                      )}
                    </div>

                    {/* Phone + BIN (side by side) */}
                    <div className="ps-grid-2">
                      <div className="ps-field">
                        <label className="ps-label" htmlFor="phone">
                          Phone Number <span className="ps-label__req">*</span>
                        </label>
                        <div className="ps-input-wrap">
                          <Phone size={14} className="ps-input-icon" />
                          <input
                            id="phone"
                            {...form1.register("phone")}
                            placeholder="+880 1XXX-XXXXXX"
                            className={`ps-input ${form1.formState.errors.phone ? "ps-input--error" : ""}`}
                          />
                        </div>
                        {form1.formState.errors.phone && (
                          <p className="ps-field-error"><AlertCircle size={11} />{form1.formState.errors.phone.message}</p>
                        )}
                      </div>

                      <div className="ps-field">
                        <label className="ps-label" htmlFor="binNumber">
                          BIN / Tax Number
                          {selectedCategory === "RESTAURANT"
                            ? <span className="ps-label__req">*</span>
                            : <span className="ps-label__hint">(optional)</span>}
                        </label>
                        <div className="ps-input-wrap">
                          <CreditCard size={14} className="ps-input-icon" />
                          <input
                            id="binNumber"
                            type="number"
                            {...form1.register("binNumber")}
                            placeholder="Your BIN number"
                            className="ps-input"
                            min={0}
                          />
                        </div>
                        {selectedCategory === "RESTAURANT" && (
                          <p className="ps-field-hint">Required for restaurants by law</p>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="ps-field">
                      <label className="ps-label" htmlFor="bio">
                        Business Description
                        <span className="ps-label__hint">(optional)</span>
                      </label>
                      <textarea
                        id="bio"
                        {...form1.register("bio")}
                        rows={4}
                        placeholder="Tell customers what makes your food special, your cooking style, signature dishes…"
                        className="ps-textarea"
                        maxLength={500}
                      />
                      <p className={`ps-char-count ${bioValue.length > 450 ? bioValue.length >= 500 ? "ps-char-count--over" : "ps-char-count--warn" : ""}`}>
                        {bioValue.length} / 500
                      </p>
                    </div>

                    {/* Notice for restaurant BIN */}
                    {selectedCategory === "RESTAURANT" && (
                      <div className="ps-notice ps-notice--gold">
                        <Info size={14} />
                        Restaurants must provide a valid BIN number. It will be verified before approval.
                      </div>
                    )}
                  </form>
                </div>

                <div className="ps-card__foot">
                  <span className="ps-card__foot-left">Fields marked <span style={{ color: "red", fontWeight: 600, fontSize: "1.1rem" }}>*</span> are required</span>
                  <button type="submit" form="form-step1" className="ps-btn ps-btn--primary">
                    Continue <ChevronRight size={15} />
                  </button>
                </div>
              </>
            )}
<<<<<<< HEAD
=======

            {/* ── STEP 2: Address ───────────────────────────────── */}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            {step === 2 && (
              <>
                <div className="ps-card__head">
                  <div className="ps-card__step-badge">
                    <MapPin size={11} /> Step 2 of 4
                  </div>
                  <h2 className="ps-card__title">Business <em>Address</em></h2>
                  <p className="ps-card__desc">Your address helps customers find you and determines your delivery area.</p>
                </div>

                <div className="ps-card__body">
                  <form id="form-step2" onSubmit={handleStep2} className="ps-form">

                    <div className="ps-notice ps-notice--info">
                      <Info size={14} />
                      This address will be verified during approval and shown publicly to customers.
                    </div>

                    {/* City + Postal code */}
                    <div className="ps-grid-2">
                      <div className="ps-field">
                        <label className="ps-label" htmlFor="city">
                          District <span className="ps-label__req">*</span>
                        </label>

                        <div className="ps-input-wrap">
                          <Navigation size={14} className="ps-input-icon" />
                          <select
                            id="city"
                            {...form2.register("city")}
                            className={`ps-input ${form2.formState.errors.city ? "ps-input--error" : ""}`}
                            defaultValue={form2.getValues("city") || ""}
                          >
                            <option value="">Select your district</option>
                            {BANGLADESH_DISTRICTS.map((district) => (
                              <option key={district} value={district}>
                                {district}
                              </option>
                            ))}
                          </select>
                        </div>

                        {form2.formState.errors.city && (
                          <p className="ps-field-error">
                            <AlertCircle size={11} />
                            {form2.formState.errors.city.message}
                          </p>
                        )}
                      </div>

                      <div className="ps-field">
                        <label className="ps-label" htmlFor="postalCode">
                          Postal Code <span className="ps-label__req">*</span>
                        </label>
                        <div className="ps-input-wrap">
                          <Hash size={14} className="ps-input-icon" />
                          <input
                            id="postalCode"
                            type="number"
                            {...form2.register("postalCode")}
                            placeholder="e.g. 1216"
                            min={1000}
                            minLength={4}
                            maxLength={4}
                            max={9999}
                            className={`ps-input ${form2.formState.errors.postalCode ? "ps-input--error" : ""}`}
                          />
                        </div>
                        {form2.formState.errors.postalCode && (
                          <p className="ps-field-error"><AlertCircle size={11} />{form2.formState.errors.postalCode.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Street */}
                    <div className="ps-field">
                      <label className="ps-label" htmlFor="street">
                        Street Address <span className="ps-label__req">*</span>
                      </label>
                      <div className="ps-input-wrap">
                        <MapPin size={14} className="ps-input-icon" />
                        <input
                          id="street"
                          {...form2.register("street")}
                          placeholder="e.g. Mirpur Road, Section 10"
                          className={`ps-input ${form2.formState.errors.street ? "ps-input--error" : ""}`}
                        />
                      </div>
                      {form2.formState.errors.street && (
                        <p className="ps-field-error"><AlertCircle size={11} />{form2.formState.errors.street.message}</p>
                      )}
                    </div>

                    {/* House + Apartment */}
                    <div className="ps-grid-2">
                      <div className="ps-field">
                        <label className="ps-label" htmlFor="houseNumber">
                          House / Building No. <span className="ps-label__req">*</span>
                        </label>
                        <div className="ps-input-wrap">
                          <Home size={14} className="ps-input-icon" />
                          <input
                            id="houseNumber"
                            {...form2.register("houseNumber")}
                            placeholder="e.g. 42"
                            className={`ps-input ${form2.formState.errors.houseNumber ? "ps-input--error" : ""}`}
                          />
                        </div>
                        {form2.formState.errors.houseNumber && (
                          <p className="ps-field-error"><AlertCircle size={11} />{form2.formState.errors.houseNumber.message}</p>
                        )}
                      </div>

                      <div className="ps-field">
                        <label className="ps-label" htmlFor="apartment">
                          Apartment / Floor
                          <span className="ps-label__hint">(optional)</span>
                        </label>
                        <div className="ps-input-wrap">
                          <Building2 size={14} className="ps-input-icon" />
                          <input
                            id="apartment"
                            {...form2.register("apartment")}
                            placeholder="e.g. Floor 3, Apt B"
                            className="ps-input"
                          />
                        </div>
                      </div>
                    </div>

                  </form>
                </div>

                <div className="ps-card__foot">
                  <button type="button" className="ps-btn ps-btn--ghost" onClick={goBack}>
                    <ChevronLeft size={15} /> Back
                  </button>
                  <button type="submit" form="form-step2" className="ps-btn ps-btn--primary">
                    Continue <ChevronRight size={15} />
                  </button>
                </div>
              </>
            )}

<<<<<<< HEAD
=======
            {/* ── STEP 3: Photos ────────────────────────────────── */}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            {step === 3 && (
              <>
                <div className="ps-card__head">
                  <div className="ps-card__step-badge">
                    <ImageIcon size={11} /> Step 3 of 4
                  </div>
                  <h2 className="ps-card__title">Business <em>Photos</em></h2>
                  <p className="ps-card__desc">Upload clear photos to help our team verify your business and build customer trust.</p>
                </div>

                <div className="ps-card__body">
                  <div className="ps-form">

                    {/* Profile photo — centered */}
                    <div className="ps-field">
                      <label className="ps-label">Profile / Cover Photo</label>
                      <ProfileUpload
                        image={profileImg}
                        onFile={handleProfileImageUpload}
                        onRemove={() => {
                          setProfileImg(null);
                          setProfileImageError(null);
                        }}
                      />
                      {!profileImageError && (
                        <p className="text-sm font-medium text-[#de7010] mt-2">
                          *Recommended: 1440 × 890 px (landscape)
                        </p>
                      )}
                      {profileImageError && (
                        <p className="text-sm font-medium text-red-600 mt-2">
                          {profileImageError}
                        </p>
                      )}
                    </div>

                    <hr style={{ border: "none", borderTop: "1px solid hsl(38,70%,55%,0.1)" }} />

                    {/* NID photos */}
                    <div className="ps-field">
                      <label className="ps-label">
                        National ID (NID) Photos <span className="ps-label__req">*</span>
                        <span className="ps-label__hint">Front & back</span>
                      </label>
                      <div className="ps-notice ps-notice--gold" style={{ marginBottom: 12 }}>
                        <Info size={14} />
                        Upload the front and back of your National ID card. These are kept private and used only for verification.
                      </div>
                      <div className="ps-nid-pair">
                        <UploadBox
                          inputId="nid-front"
                          image={nidFront}
                          label="NID Front"
                          sublabel="Front side of your National ID"
                          required
                          onFile={(f) => {
                            setNidFront(createImagePreview(f));
                            setPhotoErrors((prev) => ({ ...prev, nidFront: undefined }));
                          }}
                          onRemove={() => setNidFront(null)}
                        />
                        <UploadBox
                          inputId="nid-back"
                          image={nidBack}
                          label="NID Back"
                          sublabel="Back side of your National ID"
                          required
                          onFile={(f) => {
                            setNidBack(createImagePreview(f));
                            setPhotoErrors((prev) => ({ ...prev, nidBack: undefined }));
                          }}
                          onRemove={() => setNidBack(null)}
                        />
                      </div>
                      {photoErrors.nidFront && (
                        <p className="mt-2 text-sm text-red-500">{photoErrors.nidFront}</p>
                      )}

                      {photoErrors.nidBack && (
                        <p className="mt-1 text-sm text-red-500">{photoErrors.nidBack}</p>
                      )}
                    </div>

                    <hr style={{ border: "none", borderTop: "1px solid hsl(38,70%,55%,0.1)" }} />

                    {/* Business photos */}
                    <div className="ps-field">
                      <label className="ps-label">Business Photos</label>
                      <div className="ps-upload-grid ps-upload-grid--3">
                        <UploadBox
                          inputId="main-gate"
                          image={mainGateImg}
                          label="Main Entrance"
                          sublabel="Clear photo of your entrance or storefront"
                          required
                          onFile={(f) => {
                            setMainGateImg(createImagePreview(f));
                            setPhotoErrors((prev) => ({ ...prev, mainGate: undefined }));
                          }}
                          onRemove={() => setMainGateImg(null)}
                        />

                        <UploadBox
                          inputId="kitchen"
                          image={kitchenImg}
                          label="Kitchen"
                          sublabel="Your cooking area or food prep space"
                          onFile={(f) => setKitchenImg(createImagePreview(f))}
                          onRemove={() => setKitchenImg(null)}
                        />
                      </div>
                      {photoErrors.mainGate && (
                        <p className="mt-2 text-sm text-red-500">
                          {photoErrors.mainGate}
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                <div className="ps-card__foot">
                  <button type="button" className="ps-btn ps-btn--ghost" onClick={goBack}>
                    <ChevronLeft size={15} /> Back
                  </button>
                  <button type="button" className="ps-btn ps-btn--primary" onClick={handleStep3}>
                    Review & Submit <ChevronRight size={15} />
                  </button>
                </div>
              </>
            )}

<<<<<<< HEAD
=======
            {/* ── STEP 4: Review ────────────────────────────────── */}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            {step === 4 && saved1 && saved2 && (
              <>
                <div className="ps-card__head">
                  <div className="ps-card__step-badge">
                    <Eye size={11} /> Step 4 of 4
                  </div>
                  <h2 className="ps-card__title">Review & <em>Submit</em></h2>
                  <p className="ps-card__desc">Review your information before submitting. You can go back and edit anything.</p>
                </div>

                <div className="ps-card__body">
                  <div className="ps-review-sections">

                    {/* Business info */}
                    <div className="ps-review-section">
                      <div className="ps-review-section__head">
                        <span className="ps-review-section__title">
                          <Building2 size={14} /> Business Information
                        </span>
                        <button type="button" className="ps-review-section__edit" onClick={() => setStep(1)}>
                          <ChevronLeft size={12} /> Edit
                        </button>
                      </div>
                      <div className="ps-review-body">
                        <div className="ps-review-grid">
                          <div className="ps-review-row">
                            <span className="ps-review-key">Business Name</span>
                            <span className="ps-review-val">{saved1.businessName}</span>
                          </div>
                          <div className="ps-review-row">
                            <span className="ps-review-key">Category</span>
                            <span className="ps-review-val">
                              {BUSINESS_TYPES.find((b) => b.value === saved1.businessCategory)?.label}
                            </span>
                          </div>
                          <div className="ps-review-row">
                            <span className="ps-review-key">Phone</span>
                            <span className="ps-review-val">{saved1.phone}</span>
                          </div>
                          {saved1.binNumber && (
                            <div className="ps-review-row">
                              <span className="ps-review-key">BIN Number</span>
                              <span className="ps-review-val">{saved1.binNumber}</span>
                            </div>
                          )}
                          {saved1.bio && (
                            <div className="ps-review-row ps-review-row--full">
                              <span className="ps-review-key">Description</span>
                              <span className="ps-review-val">{saved1.bio}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="ps-review-section">
                      <div className="ps-review-section__head">
                        <span className="ps-review-section__title">
                          <MapPin size={14} /> Business Address
                        </span>
                        <button type="button" className="ps-review-section__edit" onClick={() => setStep(2)}>
                          <ChevronLeft size={12} /> Edit
                        </button>
                      </div>
                      <div className="ps-review-body">
                        <div className="ps-review-grid">
                          <div className="ps-review-row">
                            <span className="ps-review-key">City</span>
                            <span className="ps-review-val">{saved2.city}</span>
                          </div>
                          <div className="ps-review-row">
                            <span className="ps-review-key">Postal Code</span>
                            <span className="ps-review-val">{saved2.postalCode}</span>
                          </div>
                          <div className="ps-review-row ps-review-row--full">
                            <span className="ps-review-key">Full Address</span>
                            <span className="ps-review-val">
                              {saved2.houseNumber} {saved2.street}
                              {saved2.apartment ? `, ${saved2.apartment}` : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Photos */}
                    <div className="ps-review-section">
                      <div className="ps-review-section__head">
                        <span className="ps-review-section__title">
                          <ImageIcon size={14} /> Photos
                        </span>
                        <button type="button" className="ps-review-section__edit" onClick={() => setStep(3)}>
                          <ChevronLeft size={12} /> Edit
                        </button>
                      </div>
                      <div className="ps-review-body">
                        {[profileImg, nidFront, nidBack, mainGateImg, kitchenImg].some(Boolean) ? (
                          <div className="ps-review-thumbs">
                            {[
                              { img: profileImg, label: "Profile" },
                              { img: nidFront, label: "NID Front" },
                              { img: nidBack, label: "NID Back" },
                              { img: mainGateImg, label: "Entrance" },
                              { img: kitchenImg, label: "Kitchen" },
                            ].map(({ img, label }) =>
                              img ? (
                                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                  <img src={img.preview} alt={label} className="ps-review-thumb" />
                                  <span style={{ fontSize: "0.5625rem", color: "var(--muted-fg)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                                </div>
                              ) : null
                            )}
                          </div>
                        ) : (
                          <p className="ps-review-val ps-review-val--muted">No photos uploaded</p>
                        )}

                        {/* Missing required images warning */}
                        {(!nidFront || !nidBack || !mainGateImg) && (
                          <div className="ps-notice ps-notice--gold" style={{ marginTop: 12 }}>
                            <AlertCircle size={14} />
                            <span>
                              NID photos (front &amp; back) and main entrance photo are required for approval.
                              {" "}<button type="button" onClick={() => setStep(3)} style={{ color: "var(--wine)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Upload now</button>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit notice */}
                    <div className="ps-notice ps-notice--info">
                      <Info size={14} />
                      Your profile will be saved as a <strong>Draft</strong>. From your dashboard, hit "Request Approval" to submit for review.
                    </div>
                  </div>
                </div>

                <div className="ps-card__foot">
                  <button type="button" className="ps-btn ps-btn--ghost" onClick={goBack}>
                    <ChevronLeft size={15} /> Back
                  </button>
                  <button
                    type="button"
                    className="ps-btn ps-btn--primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    style={{ borderRadius: "999px", padding: "11px 28px" }}
                  >
                    {isLoading ? (
                      <><Loader2 size={15} className="ps-spinner" /> Saving profile…</>
                    ) : (
                      <>Save Profile <Check size={15} /></>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
