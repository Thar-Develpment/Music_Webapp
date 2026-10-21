"use client";

import React from "react";
import { Setting, ContactPageContent } from "@music-label/shared";
import ContactForm from "@/components/site/ContactForm";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { GlassTiltCard } from "@/components/animations/GlassTiltCard";
import { Mail, Phone, MapPin, Headphones } from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { useTheme } from "@/components/theme/ThemeProvider";

interface ContactPageViewProps {
  settings: Setting;
  content: ContactPageContent;
}

export default function ContactPageView({ settings, content }: ContactPageViewProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex flex-col w-full pt-32 pb-24 transition-colors duration-300 ${
        isDark ? "bg-[#08080A] text-[#F4F4F6]" : "bg-[#FAFAFC] text-[#09090B]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <MotionReveal direction="up">
            <div
              className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border mb-6 ${
                isDark
                  ? "border-[#E51E2B]/40 bg-[#E51E2B]/10 text-[#E51E2B]"
                  : "border-[#E51E2B]/40 bg-red-50/80 text-[#E51E2B]"
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-[#E51E2B]" />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase">
                Direct Communications
              </span>
            </div>

            <h1
              className={`font-heading font-extrabold text-4xl sm:text-6xl uppercase tracking-tight ${
                isDark ? "text-white" : "text-[#09090B]"
              }`}
            >
              {content.headline}
            </h1>

            <p className="mt-4 text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#E51E2B] uppercase">
              {content.subheadline}
            </p>

            <p
              className={`mt-4 text-sm sm:text-base font-light max-w-xl mx-auto ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {content.instructions}
            </p>
          </MotionReveal>
        </div>

        {/* 2-Column Layout: Direct Details + Enquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Contact Info & Socials (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <MotionReveal direction="left" delay={0.1}>
              <GlassTiltCard
                className={`p-8 sm:p-10 border shadow-xl glass-shimmer rounded-3xl transition-all ${
                  isDark
                    ? "border-white/10 bg-[#121217] hover:border-[#E51E2B]/60 shadow-black/50"
                    : "border-black/10 bg-white hover:border-[#E51E2B]/60"
                }`}
              >
                <h3
                  className={`font-heading font-extrabold text-xl uppercase tracking-wider pb-4 border-b ${
                    isDark
                      ? "text-white border-white/10"
                      : "text-zinc-900 border-black/10"
                  }`}
                >
                  Label Headquarters
                </h3>

                <div className="space-y-6 text-sm mt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-[#E51E2B]/30 flex items-center justify-center text-[#E51E2B] shrink-0 mt-0.5 shadow-sm">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p
                        className={`text-xs uppercase tracking-wider font-bold ${
                          isDark ? "text-zinc-400" : "text-zinc-500"
                        }`}
                      >
                        Booking & Licensing
                      </p>
                      <a
                        href={`mailto:${settings.bookingEmail}`}
                        className={`font-semibold transition-colors text-base ${
                          isDark
                            ? "text-white hover:text-[#E51E2B]"
                            : "text-zinc-900 hover:text-[#E51E2B]"
                        }`}
                      >
                        {settings.bookingEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-[#E51E2B]/30 flex items-center justify-center text-[#E51E2B] shrink-0 mt-0.5 shadow-sm">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p
                        className={`text-xs uppercase tracking-wider font-bold ${
                          isDark ? "text-zinc-400" : "text-zinc-500"
                        }`}
                      >
                        Direct Phone
                      </p>
                      <a
                        href={`tel:${settings.bookingPhone}`}
                        className={`font-semibold transition-colors text-base ${
                          isDark
                            ? "text-white hover:text-[#E51E2B]"
                            : "text-zinc-900 hover:text-[#E51E2B]"
                        }`}
                      >
                        {settings.bookingPhone}
                      </a>
                    </div>
                  </div>

                  {settings.address && (
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-[#E51E2B]/30 flex items-center justify-center text-[#E51E2B] shrink-0 mt-0.5 shadow-sm">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p
                          className={`text-xs uppercase tracking-wider font-bold ${
                            isDark ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          Studio Sanctuary
                        </p>
                        <p
                          className={`leading-relaxed font-light text-base ${
                            isDark ? "text-zinc-300" : "text-zinc-700"
                          }`}
                        >
                          {settings.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </GlassTiltCard>
            </MotionReveal>

            {/* Social Network Links */}
            <MotionReveal direction="left" delay={0.2}>
              <div
                className={`p-8 rounded-3xl border shadow-lg transition-all ${
                  isDark
                    ? "bg-[#121217] border-white/10 shadow-black/40"
                    : "bg-white border-black/10"
                }`}
              >
                <h4 className="text-xs font-bold tracking-[0.25em] text-[#E51E2B] uppercase mb-4">
                  Official Channels
                </h4>
                <div className="flex items-center space-x-4">
                  {settings.socialLinks.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shadow-sm ${
                        isDark
                          ? "bg-[#181820] border-white/10 text-zinc-300 hover:text-[#E51E2B] hover:border-[#E51E2B]"
                          : "bg-zinc-50 border-black/10 text-zinc-700 hover:text-[#E51E2B] hover:border-[#E51E2B]"
                      }`}
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="w-5 h-5" />
                    </a>
                  )}
                  {settings.socialLinks.youtube && (
                    <a
                      href={settings.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shadow-sm ${
                        isDark
                          ? "bg-[#181820] border-white/10 text-zinc-300 hover:text-[#E51E2B] hover:border-[#E51E2B]"
                          : "bg-zinc-50 border-black/10 text-zinc-700 hover:text-[#E51E2B] hover:border-[#E51E2B]"
                      }`}
                      aria-label="YouTube"
                    >
                      <YoutubeIcon className="w-5 h-5" />
                    </a>
                  )}
                  {settings.socialLinks.facebook && (
                    <a
                      href={settings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shadow-sm ${
                        isDark
                          ? "bg-[#181820] border-white/10 text-zinc-300 hover:text-[#E51E2B] hover:border-[#E51E2B]"
                          : "bg-zinc-50 border-black/10 text-zinc-700 hover:text-[#E51E2B] hover:border-[#E51E2B]"
                      }`}
                      aria-label="Facebook"
                    >
                      <FacebookIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </MotionReveal>
          </div>

          {/* Right: Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <MotionReveal direction="right" delay={0.2}>
              <ContactForm />
            </MotionReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
