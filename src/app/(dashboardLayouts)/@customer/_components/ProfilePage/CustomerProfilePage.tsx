"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  createCustomerProfile,
  getMyCustomerProfile,
  updateCustomerProfile,
} from "@/services/customer.service";
import { BANGLADESH_DISTRICTS } from "@/constants/bangladeshDistricts";
import "./CustomerProfilePage.css";

type TCustomerProfile = {
  id: string;
  userId: string;
  phone?: string | null;
  city: string;
  streetAddress: string;
  houseNumber?: string | null;
  apartment?: string | null;
  postalCode?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
};

const emptyForm = {
  phone: "",
  city: "",
  streetAddress: "",
  houseNumber: "",
  apartment: "",
  postalCode: "",
  latitude: "",
  longitude: "",
};

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<TCustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchProfile();
  }, []);

  const profileCompletion = useMemo(() => {
    const required = [form.city.trim(), form.streetAddress.trim()];
    const filled = required.filter(Boolean).length;
    return Math.round((filled / required.length) * 100);
  }, [form.city, form.streetAddress]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await getMyCustomerProfile();
      const data = res?.data;
      if (data) {
        setProfile(data);
        setHasProfile(true);
        setForm({
          phone: data.phone ?? "",
          city: data.city ?? "",
          streetAddress: data.streetAddress ?? "",
          houseNumber: data.houseNumber ?? "",
          apartment: data.apartment ?? "",
          postalCode: data.postalCode ?? "",
          latitude:
            data.latitude !== null && data.latitude !== undefined
              ? String(data.latitude)
              : "",
          longitude:
            data.longitude !== null && data.longitude !== undefined
              ? String(data.longitude)
              : "",
        });
      } else {
        setProfile(null);
        setHasProfile(false);
        setForm(emptyForm);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to load customer profile."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const setField = (key: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!form.city.trim()) {
      toast.error("Please select your district.");
      return false;
    }
    if (!form.streetAddress.trim()) {
      toast.error("Street address is required.");
      return false;
    }
    return true;
  };

  const buildPayload = () => ({
    phone: form.phone.trim() || undefined,
    city: form.city.trim(),
    streetAddress: form.streetAddress.trim(),
    houseNumber: form.houseNumber.trim() || undefined,
    apartment: form.apartment.trim() || undefined,
    postalCode: form.postalCode.trim() || undefined,
    latitude: form.latitude.trim() ? Number(form.latitude) : undefined,
    longitude: form.longitude.trim() ? Number(form.longitude) : undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      const res = hasProfile
        ? await updateCustomerProfile(payload)
        : await createCustomerProfile(payload);
      if (res?.success) {
        toast.success(
          hasProfile
            ? "Profile updated successfully."
            : "Profile created successfully."
        );
        await fetchProfile();
      } else {
        toast.error(res?.message ?? "Operation failed.");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── loading ── */
  if (isLoading) {
    return (
      <div className="cpp">
        <p className="cpp__loading">Loading profile…</p>
      </div>
    );
  }

  /* ── page ── */
  return (
    <div className="cpp">

      {/* header card */}
      <div className="cpp__header-card">
        <div className="cpp__header-text">
          <h1 className="cpp__title">My profile</h1>
          <p className="cpp__subtitle">
            Keep your delivery information up to date. You can order only from restauants that serve your city, so make sure to select the correct city.
          </p>
        </div>

        <div className="cpp__completion">
          <p className="cpp__completion-label">Profile completion</p>
          <p className="cpp__completion-value">{profileCompletion}%</p>
          <div className="cpp__completion-bar">
            <div
              className="cpp__completion-fill"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* no profile banner */}
      {!hasProfile && (
        <div className="cpp__banner">
          <span className="cpp__banner-icon">⚠️</span>
          <span>
            You do not have a delivery profile yet. Create it first
            before cart and order validation can work properly.
          </span>
        </div>
      )}

      {/* form */}
      <form onSubmit={handleSubmit} className="cpp__form-card">

        {/* contact section */}
        <div className="cpp__section">
          <p className="cpp__section-label">Contact</p>
          <div className="cpp__grid">

            <div className="cpp__field">
              <label htmlFor="cpp-phone" className="cpp__label">
                Phone number
                <span className="cpp__optional">optional</span>
              </label>
              <input
                id="cpp-phone"
                type="text"
                className="cpp__input"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="01700000000"
                autoComplete="tel"
              />
            </div>

            <div className="cpp__field">
              <label htmlFor="cpp-city" className="cpp__label">
                City / District
                <span className="cpp__required">*</span>
              </label>
              <select
                id="cpp-city"
                className="cpp__select"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
              >
                <option value="">Select your district</option>
                {BANGLADESH_DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* address section */}
        <div className="cpp__section">
          <p className="cpp__section-label">Delivery address</p>
          <div className="cpp__grid">

            <div className="cpp__field cpp__grid--full">
              <label htmlFor="cpp-street" className="cpp__label">
                Street address
                <span className="cpp__required">*</span>
              </label>
              <textarea
                id="cpp-street"
                className="cpp__textarea"
                value={form.streetAddress}
                onChange={(e) =>
                  setField("streetAddress", e.target.value)
                }
                placeholder="Road, area, landmark…"
                rows={3}
              />
            </div>

            <div className="cpp__field">
              <label htmlFor="cpp-house" className="cpp__label">
                House number
                <span className="cpp__optional">optional</span>
              </label>
              <input
                id="cpp-house"
                type="text"
                className="cpp__input"
                value={form.houseNumber}
                onChange={(e) =>
                  setField("houseNumber", e.target.value)
                }
                placeholder="32A"
              />
            </div>

            <div className="cpp__field">
              <label htmlFor="cpp-apartment" className="cpp__label">
                Apartment
                <span className="cpp__optional">optional</span>
              </label>
              <input
                id="cpp-apartment"
                type="text"
                className="cpp__input"
                value={form.apartment}
                onChange={(e) =>
                  setField("apartment", e.target.value)
                }
                placeholder="5B"
              />
            </div>

            <div className="cpp__field">
              <label htmlFor="cpp-postal" className="cpp__label">
                Postal code
                <span className="cpp__optional">optional</span>
              </label>
              <input
                id="cpp-postal"
                type="text"
                className="cpp__input"
                value={form.postalCode}
                onChange={(e) =>
                  setField("postalCode", e.target.value)
                }
                placeholder="1209"
              />
            </div>

          </div>
        </div>

        {/* coordinates section */}
        <div className="cpp__section">
          <p className="cpp__section-label">
            Location coordinates
          </p>
          <div className="cpp__grid">

            <div className="cpp__field">
              <label
                htmlFor="cpp-latitude"
                className="cpp__label"
              >
                Latitude
                <span className="cpp__optional">optional</span>
              </label>
              <input
                id="cpp-latitude"
                type="number"
                step="any"
                className="cpp__input"
                value={form.latitude}
                onChange={(e) =>
                  setField("latitude", e.target.value)
                }
                placeholder="23.7465"
              />
              <span className="cpp__coord-hint">
                For precise delivery location pinning
              </span>
            </div>

            <div className="cpp__field">
              <label
                htmlFor="cpp-longitude"
                className="cpp__label"
              >
                Longitude
                <span className="cpp__optional">optional</span>
              </label>
              <input
                id="cpp-longitude"
                type="number"
                step="any"
                className="cpp__input"
                value={form.longitude}
                onChange={(e) =>
                  setField("longitude", e.target.value)
                }
                placeholder="90.3760"
              />
            </div>

          </div>
        </div>

        {/* footer */}
        <div className="cpp__footer">
          <p className="cpp__footer-note">
            Your city is matched with the provider city before
            cart and order actions are allowed.
          </p>
          <button
            type="submit"
            className="cpp__submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? hasProfile
                ? "Updating…"
                : "Creating…"
              : hasProfile
                ? "Update profile"
                : "Create profile"}
          </button>
        </div>

      </form>
    </div>
  );
}