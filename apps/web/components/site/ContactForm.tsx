"use client";

import React, { useState } from "react";
import { EnquirySubmissionSchema } from "@music-label/shared";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const maxChars = 180;
  const remainingChars = maxChars - formData.message.length;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for field as user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate using Zod schema
    const result = EnquirySubmissionSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
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
        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      setSubmitted(true);
      setFormData({ firstName: "", email: "", phone: "", message: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-3xl glass-panel p-8 sm:p-12 border border-white/10 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase">
              Transmission Received
            </h3>

            <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-md font-light leading-relaxed">
              Thank you for reaching out to Velvet Noir. Our executive A&R and management team has logged your enquiry and will respond within 24 to 48 hours.
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="mt-8 px-8 py-3 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#F5D77F] hover:text-[#070709] text-xs font-bold tracking-widest uppercase transition-all"
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
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-sm flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-xs font-semibold tracking-wider text-zinc-300 uppercase"
                >
                  First Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Julian"
                  className={`w-full px-4 py-3.5 rounded-xl bg-black/50 border text-white placeholder-zinc-500 focus:outline-none transition-colors text-sm ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-[#D4AF37]"
                  }`}
                />
                {errors.firstName && (
                  <span className="text-xs text-red-400 font-medium">
                    {errors.firstName}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold tracking-wider text-zinc-300 uppercase"
                >
                  Email Address <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. julian@studio.com"
                  className={`w-full px-4 py-3.5 rounded-xl bg-black/50 border text-white placeholder-zinc-500 focus:outline-none transition-colors text-sm ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-[#D4AF37]"
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-red-400 font-medium">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="phone"
                className="text-xs font-semibold tracking-wider text-zinc-300 uppercase"
              >
                Phone Number <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-3.5 rounded-xl bg-black/50 border text-white placeholder-zinc-500 focus:outline-none transition-colors text-sm ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-[#D4AF37]"
                }`}
              />
              {errors.phone && (
                <span className="text-xs text-red-400 font-medium">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Message with 180 character limit */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="message"
                  className="text-xs font-semibold tracking-wider text-zinc-300 uppercase"
                >
                  Enquiry Message <span className="text-[#D4AF37]">*</span>
                </label>
                <span
                  className={`text-xs font-mono ${
                    remainingChars < 20 ? "text-amber-400 font-bold" : "text-zinc-500"
                  }`}
                >
                  {remainingChars} chars remaining
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={maxChars}
                value={formData.message}
                onChange={handleChange}
                placeholder="Briefly state your booking, licensing, or press enquiry (max 180 characters)..."
                className={`w-full px-4 py-3.5 rounded-xl bg-black/50 border text-white placeholder-zinc-500 focus:outline-none transition-colors text-sm resize-none ${
                  errors.message
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-[#D4AF37]"
                }`}
              />
              {errors.message && (
                <span className="text-xs text-red-400 font-medium">
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
                className="w-full inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] text-[#070709] font-bold text-sm tracking-wider uppercase shadow-xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/35 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-200 cursor-pointer"
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
