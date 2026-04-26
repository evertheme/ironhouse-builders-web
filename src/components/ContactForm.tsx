"use client";

import {
  formatUsPhoneMask,
  usPhoneDigitsOnly,
} from "@/lib/us-phone";
import { useEffect, useState } from "react";

const CONTACT_SUBMISSIONS_SESSION_KEY = "ihb_contact_submissions_count";
const MAX_CONTACT_SUBMISSIONS_PER_SESSION = 2;

function readSubmissionCountFromSession(): number {
  if (typeof window === "undefined") return 0;
  const raw = sessionStorage.getItem(CONTACT_SUBMISSIONS_SESSION_KEY);
  const n = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function persistSubmissionCount(count: number) {
  sessionStorage.setItem(CONTACT_SUBMISSIONS_SESSION_KEY, String(count));
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [sessionSubmissionCount, setSessionSubmissionCount] = useState(0);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    setSessionSubmissionCount(readSubmissionCountFromSession());
    setSessionReady(true);
  }, []);

  const submissionsRemaining = Math.max(
    0,
    MAX_CONTACT_SUBMISSIONS_PER_SESSION - sessionSubmissionCount,
  );
  const atSessionLimit =
    sessionReady && sessionSubmissionCount >= MAX_CONTACT_SUBMISSIONS_PER_SESSION;
  const formDisabled = !sessionReady || atSessionLimit || isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionReady) return;

    const used = readSubmissionCountFromSession();
    if (used >= MAX_CONTACT_SUBMISSIONS_PER_SESSION) {
      setSessionSubmissionCount(used);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone:
            formData.phone.length > 0
              ? formatUsPhoneMask(formData.phone)
              : null,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        setSubmitStatus("error");
        return;
      }

      const nextCount = used + 1;
      persistSubmissionCount(nextCount);
      setSessionSubmissionCount(nextCount);

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = usPhoneDigitsOnly(e.target.value);
    setFormData({
      ...formData,
      phone: next,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {atSessionLimit ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm">
          You&apos;ve reached the limit of {MAX_CONTACT_SUBMISSIONS_PER_SESSION}{" "}
          messages.
        </div>
      ) : null}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={formDisabled}
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={formDisabled}
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="(555) 555-5555"
          disabled={formDisabled}
          value={formatUsPhoneMask(formData.phone)}
          onChange={handlePhoneChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          disabled={formDisabled}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-transparent outline-none transition resize-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        />
      </div>

      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          Thank you! Your message has been sent successfully.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          Something went wrong. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={formDisabled}
        className="btn-primary w-full py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? "Sending..."
          : atSessionLimit
            ? "Send Message"
            : "Send Message"}
      </button>
    </form>
  );
}
