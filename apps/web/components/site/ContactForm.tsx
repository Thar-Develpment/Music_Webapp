"use client";

import React, { useState } from "react";
import { contactFormSchema, ContactFormData } from "@music-label/shared";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function ContactForm() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: ContactFormData) => ({ ...prev, [name]: value }));
    // Clear field-specific error on change
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate with Zod schema from packages/shared
    const result = contactFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/public/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to submit enquiry.");
      }

      setSubmitted(true);
      setFormData({ firstName: "", email: "", phone: "", message: "" });
      setErrors({});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full p-8 sm:p-12 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${
        isDark ? "bg-[#121217] border-white/10 shadow-black/50" : "bg-white border-black/10"
      }`}
    >
      <div className="mb-8">
        <h3
          className={`font-heading font-extrabold text-2xl sm:text-3xl uppercase ${
            isDark ? "text-white" : "text-zinc-900"
          }`}
        >
          Direct Transmission
        </h3>
        <p
          className={`mt-2 text-sm font-light ${
            isDark ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          Fill out the secure form below. All licensing and tour requests are routed straight to our
          executive desks.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-[#e11d48] flex items-center justify-center text-[#e11d48] mb-6 shadow-md shadow-[#e11d48]/15">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3
              className={`font-heading font-extrabold text-2xl sm:text-3xl uppercase ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
            >
              Transmission Received
            </h3>

            <p
              className={`mt-4 text-sm sm:text-base max-w-md font-light leading-relaxed ${
                isDark ? "text-zinc-300" : "text-zinc-600"
              }`}
            >
              Thank you for reaching out to One Roof Entertainment. Our executive A&R and management team has
              logged your enquiry and will respond within 24 to 48 hours.
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="mt-8 px-8 py-3 rounded-full border border-[#e11d48] bg-red-50 hover:bg-[#e11d48] text-[#e11d48] hover:text-white text-xs font-bold tracking-widest uppercase transition-all"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col space-y-6"
            noValidate
          >
            {submitError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="firstName"
                  className={`text-xs font-bold tracking-wider uppercase ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  First Name <span className="text-[#e11d48]">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Julian"
                  className={`w-full px-4 py-3.5 rounded-xl border transition-colors text-sm focus:outline-none ${
                    isDark
                      ? "bg-[#181820] text-white placeholder-zinc-500 focus:bg-[#20202a]"
                      : "bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:bg-white"
                  } ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500"
                      : isDark
                      ? "border-white/10 focus:border-[#e11d48]"
                      : "border-black/10 focus:border-[#e11d48]"
                  }`}
                />
                {errors.firstName && (
                  <span className="text-xs text-red-500 font-medium">
                    {errors.firstName}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="email"
                  className={`text-xs font-bold tracking-wider uppercase ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  Email Address <span className="text-[#e11d48]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. julian@studio.com"
                  className={`w-full px-4 py-3.5 rounded-xl border transition-colors text-sm focus:outline-none ${
                    isDark
                      ? "bg-[#181820] text-white placeholder-zinc-500 focus:bg-[#20202a]"
                      : "bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:bg-white"
                  } ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : isDark
                      ? "border-white/10 focus:border-[#e11d48]"
                      : "border-black/10 focus:border-[#e11d48]"
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-red-500 font-medium">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="phone"
                className={`text-xs font-bold tracking-wider uppercase ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Phone Number <span className="text-[#e11d48]">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-3.5 rounded-xl border transition-colors text-sm focus:outline-none ${
                  isDark
                    ? "bg-[#181820] text-white placeholder-zinc-500 focus:bg-[#20202a]"
                    : "bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:bg-white"
                } ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : isDark
                    ? "border-white/10 focus:border-[#e11d48]"
                    : "border-black/10 focus:border-[#e11d48]"
                }`}
              />
              {errors.phone && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Message with 180 character limit */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="message"
                  className={`text-xs font-bold tracking-wider uppercase ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  Enquiry Message <span className="text-[#e11d48]">*</span>
                </label>
                <span
                  className={`text-xs font-mono ${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {formData.message.length}/180
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={180}
                value={formData.message}
                onChange={handleChange}
                placeholder="Briefly state your booking, licensing, or press enquiry (max 180 characters)..."
                className={`w-full px-4 py-3.5 rounded-xl border transition-colors text-sm resize-none focus:outline-none ${
                  isDark
                    ? "bg-[#181820] text-white placeholder-zinc-500 focus:bg-[#20202a]"
                    : "bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:bg-white"
                } ${
                  errors.message
                    ? "border-red-500 focus:border-red-500"
                    : isDark
                    ? "border-white/10 focus:border-[#e11d48]"
                    : "border-black/10 focus:border-[#e11d48]"
                }`}
              />
              {errors.message && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="contact-submit-button"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-[#e11d48] hover:bg-[#D81A26] text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-[#e11d48]/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-200 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Transmitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
