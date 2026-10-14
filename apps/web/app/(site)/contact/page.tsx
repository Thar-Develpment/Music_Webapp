import React from "react";
import { db } from "@/lib/mock-data";
import ContactForm from "@/components/site/ContactForm";
import { MotionReveal } from "@/components/animations/MotionReveal";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Headphones,
} from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/SocialIcons";

export const metadata = {
  title: "Contact & Bookings | Velvet Noir Recordings",
  description:
    "Direct booking, sync licensing, and press management enquiries for Velvet Noir Recordings.",
};

export default function ContactPage() {
  const settings = db.settings;
  const content = db.contactContent;

  return (
    <div className="flex flex-col w-full pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <MotionReveal direction="up">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/50 mb-6">
              <Headphones className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
                Direct Communications
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white uppercase tracking-tight">
              {content.headline}
            </h1>

            <p className="mt-4 text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              {content.subheadline}
            </p>

            <p className="mt-4 text-zinc-400 text-sm sm:text-base font-light max-w-xl mx-auto">
              {content.instructions}
            </p>
          </MotionReveal>
        </div>

        {/* 2-Column Layout: Direct Details + Enquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Contact Info & Socials (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <MotionReveal direction="left" delay={0.1}>
              <div className="p-8 rounded-3xl glass-panel flex flex-col space-y-6 border border-white/10">
                <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider pb-4 border-b border-white/10">
                  Label Headquarters
                </h3>

                <div className="space-y-6 text-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
                        Booking & Licensing
                      </p>
                      <a
                        href={`mailto:${settings.bookingEmail}`}
                        className="text-white hover:text-[#D4AF37] font-medium transition-colors text-base"
                      >
                        {settings.bookingEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
                        Direct Phone
                      </p>
                      <a
                        href={`tel:${settings.bookingPhone}`}
                        className="text-white hover:text-[#D4AF37] font-medium transition-colors text-base"
                      >
                        {settings.bookingPhone}
                      </a>
                    </div>
                  </div>

                  {settings.address && (
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
                          Studio Sanctuary
                        </p>
                        <p className="text-zinc-200 leading-relaxed font-light text-base">
                          {settings.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </MotionReveal>

            {/* Social Network Links */}
            <MotionReveal direction="left" delay={0.2}>
              <div className="p-8 rounded-3xl glass-panel border border-white/10">
                <h4 className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase mb-4">
                  Official Channels
                </h4>
                <div className="flex items-center space-x-4">
                  {settings.socialLinks.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-2xl glass-panel hover:border-[#D4AF37] flex items-center justify-center text-zinc-300 hover:text-[#D4AF37] transition-all"
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
                      className="w-12 h-12 rounded-2xl glass-panel hover:border-[#D4AF37] flex items-center justify-center text-zinc-300 hover:text-[#D4AF37] transition-all"
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
                      className="w-12 h-12 rounded-2xl glass-panel hover:border-[#D4AF37] flex items-center justify-center text-zinc-300 hover:text-[#D4AF37] transition-all"
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
