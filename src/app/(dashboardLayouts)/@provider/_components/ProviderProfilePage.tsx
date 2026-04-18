// src/components/provider/ProviderProfilePage.tsx

"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  getMyProviderProfile,
  updateProviderProfile,
  requestApproval,
} from "@/services/provider.service"
import { BANGLADESH_DISTRICTS } from "@/constants/bangladeshDistricts"

const BUSINESS_CATEGORIES = [
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "SHOP", label: "Shop" },
  { value: "HOME_KITCHEN", label: "Home Kitchen" },
  { value: "STREET_FOOD", label: "Street Food" },
]

const STATUS_CONFIG = {
  DRAFT: {
    label: "Profile draft",
    desc: "Complete your profile and request approval to start selling.",
    key: "draft",
  },
  PENDING: {
    label: "Under review",
    desc: "Our team is reviewing your profile. We will notify you within 2 to 3 business days.",
    key: "pending",
  },
  APPROVED: {
    label: "Approved",
    desc: "Your profile is live. Customers can discover your meals.",
    key: "approved",
  },
  REJECTED: {
    label: "Rejected",
    desc: "Your profile was not approved. See reason below and resubmit.",
    key: "rejected",
  },
}

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)

  // form fields
  const [businessName, setBusinessName] = useState("")
  const [businessCategory, setBusinessCategory] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [binNumber, setBinNumber] = useState("")
  const [city, setCity] = useState("")
  const [street, setStreet] = useState("")
  const [houseNumber, setHouseNumber] = useState("")
  const [apartment, setApartment] = useState("")
  const [postalCode, setPostalCode] = useState("")

  // image files
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState("")
  const [nidFrontFile, setNidFrontFile] = useState<File | null>(null)
  const [nidFrontPreview, setNidFrontPreview] = useState("")
  const [nidBackFile, setNidBackFile] = useState<File | null>(null)
  const [nidBackPreview, setNidBackPreview] = useState("")
  const [gateFile, setGateFile] = useState<File | null>(null)
  const [gatePreview, setGatePreview] = useState("")
  const [kitchenFile, setKitchenFile] = useState<File | null>(null)
  const [kitchenPreview, setKitchenPreview] = useState("")

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const res = await getMyProviderProfile()
      if (res?.data) {
        const p = res.data
        setProfile(p)
        setBusinessName(p.businessName ?? "")
        setBusinessCategory(p.businessCategory ?? "")
        setPhone(p.phone ?? "")
        setBio(p.bio ?? "")
        setBinNumber(p.binNumber ?? "")
        setCity(p.city ?? "")
        setStreet(p.street ?? "")
        setHouseNumber(p.houseNumber ?? "")
        setApartment(p.apartment ?? "")
        setPostalCode(p.postalCode ?? "")

        // parse existing NID URLs
        if (p.nidImageFront_and_BackURL) {
          const nids = JSON.parse(p.nidImageFront_and_BackURL)
          if (nids[0]) setNidFrontPreview(nids[0])
          if (nids[1]) setNidBackPreview(nids[1])
        }
        if (p.businessMainGateURL) setGatePreview(p.businessMainGateURL)
        if (p.businessKichenURL) setKitchenPreview(p.businessKichenURL)
        if (p.imageURL) setProfileImagePreview(p.imageURL)
      }
    } catch {
      toast.error("Failed to load profile.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const fd = new FormData()
      fd.append("businessName", businessName)
      fd.append("businessCategory", businessCategory)
      fd.append("phone", phone)
      fd.append("city", city)
      fd.append("street", street)
      fd.append("houseNumber", houseNumber)
      fd.append("postalCode", postalCode)
      if (bio) fd.append("bio", bio)
      if (binNumber) fd.append("binNumber", binNumber)
      if (apartment) fd.append("apartment", apartment)

      if (profileImageFile) fd.append("profileImage", profileImageFile)
      if (nidFrontFile) fd.append("nidImages", nidFrontFile)
      if (nidBackFile) fd.append("nidImages", nidBackFile)
      if (gateFile) fd.append("businessMainGate", gateFile)
      if (kitchenFile) fd.append("businessKitchen", kitchenFile)

      const res = await updateProviderProfile(fd)

      if (res?.success) {
        toast.success("Profile updated successfully.")
        fetchProfile()
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

  const handleRequestApproval = async () => {
    setIsRequesting(true)
    try {
      const res = await requestApproval()
      if (res?.success) {
        toast.success(
          "Approval request submitted. We will notify you within 24 hours."
        )
        fetchProfile()
      } else {
        toast.error(res?.message ?? "Failed to submit.")
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Something went wrong."
      )
    } finally {
      setIsRequesting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="pp-page">
        <div style={{ color: "hsl(20 10% 55%)", fontSize: 14 }}>
          Loading profile…
        </div>
      </div>
    )
  }

  const approvalStatus = profile?.approvalStatus ?? "DRAFT"
  const statusCfg = STATUS_CONFIG[approvalStatus as keyof typeof STATUS_CONFIG]

  return (
    <div className="pp-page">
      <div className="pp-header">
        <h1 className="pp-title">My profile</h1>
        <p className="pp-subtitle">
          Keep your business information up to date.
        </p>
      </div>

      {/* approval status banner */}
      <div
        className={`pp-status-banner pp-status-banner--${statusCfg.key}`}
      >
        <div className="pp-status-info">
          <div
            className={`pp-status-dot pp-status-dot--${statusCfg.key}`}
          />
          <div className="pp-status-text">
            <strong>{statusCfg.label}</strong>
            <span>{statusCfg.desc}</span>
          </div>
        </div>

        {(approvalStatus === "DRAFT" ||
          approvalStatus === "REJECTED") && (
            <button
              className="pp-request-btn"
              onClick={handleRequestApproval}
              disabled={isRequesting}
            >
              {isRequesting
                ? "Submitting…"
                : "Request approval"}
            </button>
          )}
      </div>

      {/* rejection reason */}
      {approvalStatus === "REJECTED" &&
        profile?.rejectionReason && (
          <div className="pp-rejection-note">
            <strong>Rejection reason:</strong>
            {profile.rejectionReason}
          </div>
        )}

      <form onSubmit={handleSubmit}>
        <div className="pp-card">

          {/* ── BUSINESS INFO ── */}
          <div className="pp-section">
            <p className="pp-section-title">Business information</p>
            <div className="pp-grid-2">

              <div className="pp-field pp-field--full">
                <label className="pp-label">Business name</label>
                <input
                  className="pp-input"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                />
              </div>

              <div className="pp-field">
                <label className="pp-label">Business category</label>
                <select
                  className="pp-select"
                  value={businessCategory}
                  onChange={(e) =>
                    setBusinessCategory(e.target.value)
                  }
                >
                  <option value="">Select category</option>
                  {BUSINESS_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pp-field">
                <label className="pp-label">Phone</label>
                <input
                  className="pp-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                />
              </div>

              {businessCategory === "RESTAURANT" && (
                <div className="pp-field">
                  <label className="pp-label">BIN / Tax number</label>
                  <input
                    className="pp-input"
                    value={binNumber}
                    onChange={(e) => setBinNumber(e.target.value)}
                    placeholder="Required for restaurants"
                  />
                </div>
              )}

              <div className="pp-field pp-field--full">
                <label className="pp-label">Bio</label>
                <textarea
                  className="pp-textarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell customers about your food and story"
                />
              </div>

            </div>
          </div>

          {/* ── ADDRESS ── */}
          <div className="pp-section">
            <p className="pp-section-title">Business address</p>
            <div className="pp-grid-2">

              <div className="pp-field">
                <label className="pp-label">District</label>
                <select
                  className="pp-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Select your district</option>
                  {BANGLADESH_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pp-field">
                <label className="pp-label">Postal code</label>
                <input
                  className="pp-input"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="1216"
                />
              </div>

              <div className="pp-field">
                <label className="pp-label">Street</label>
                <input
                  className="pp-input"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Mirpur Road"
                />
              </div>

              <div className="pp-field">
                <label className="pp-label">House number</label>
                <input
                  className="pp-input"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder="12B"
                />
              </div>

              <div className="pp-field">
                <label className="pp-label">
                  Apartment
                  <span style={{ fontSize: 11, fontWeight: 400, color: "hsl(20 10% 55%)", marginLeft: 4 }}>
                    optional
                  </span>
                </label>
                <input
                  className="pp-input"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Flat 3A"
                />
              </div>

            </div>
          </div>

          {/* ── IMAGES ── */}
          <div className="pp-section">
            <p className="pp-section-title">Profile image</p>
            <div className="pp-upload">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(
                    e,
                    setProfileImageFile,
                    setProfileImagePreview
                  )
                }
              />
              {profileImagePreview && (
                <img
                  src={profileImagePreview}
                  alt="profile"
                  className="pp-current-image"
                />
              )}
              <span className="pp-upload-text">
                {profileImagePreview
                  ? "Click to replace"
                  : "Click to upload profile photo"}
              </span>
              <span className="pp-upload-hint">
                JPG, PNG, WebP — max 5MB
              </span>
            </div>
          </div>

          {/* ── VERIFICATION IMAGES ── */}
          <div className="pp-section">
            <p className="pp-section-title">
              Verification images
            </p>

            {/* NID */}
            <div className="pp-field" style={{ marginBottom: 20 }}>
              <label className="pp-label">
                NID (front & back)
              </label>
              <div className="pp-nid-grid">
                {[
                  {
                    label: "Front",
                    file: nidFrontFile,
                    preview: nidFrontPreview,
                    setFile: setNidFrontFile,
                    setPreview: setNidFrontPreview,
                  },
                  {
                    label: "Back",
                    file: nidBackFile,
                    preview: nidBackPreview,
                    setFile: setNidBackFile,
                    setPreview: setNidBackPreview,
                  },
                ].map((nid) => (
                  <div className="pp-nid-item" key={nid.label}>
                    <span className="pp-nid-label">
                      {nid.label}
                    </span>
                    <div className="pp-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            nid.setFile,
                            nid.setPreview
                          )
                        }
                      />
                      {nid.preview ? (
                        <img
                          src={nid.preview}
                          alt={nid.label}
                          className="pp-current-image"

                        />
                      ) : (
                        <span className="pp-upload-text">
                          Upload {nid.label}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* gate + kitchen */}
            <div className="pp-grid-2">
              {[
                {
                  label: "Business main gate",
                  file: gateFile,
                  preview: gatePreview,
                  setFile: setGateFile,
                  setPreview: setGatePreview,
                },
                {
                  label: "Kitchen",
                  file: kitchenFile,
                  preview: kitchenPreview,
                  setFile: setKitchenFile,
                  setPreview: setKitchenPreview,
                  optional: true,
                },
              ].map((img) => (
                <div className="pp-field" key={img.label}>
                  <label className="pp-label">
                    {img.label}
                    {img.optional && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 400,
                          color: "hsl(20 10% 55%)",
                          marginLeft: 4,
                        }}
                      >
                        optional
                      </span>
                    )}
                  </label>
                  <div className="pp-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          img.setFile,
                          img.setPreview
                        )
                      }
                    />
                    {img.preview ? (
                      <img
                        src={img.preview}
                        alt={img.label}
                        className="pp-current-image"
                      />
                    ) : (
                      <>
                        <span className="pp-upload-text">
                          Click to upload
                        </span>
                        <span className="pp-upload-hint">
                          JPG, PNG, WebP
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="pp-footer">
          <button
            type="button"
            className="pp-btn-cancel"
            onClick={() => fetchProfile()}
          >
            Reset changes
          </button>
          <button
            type="submit"
            className="pp-btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  )
}