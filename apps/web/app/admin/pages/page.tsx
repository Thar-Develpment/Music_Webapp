"use client";

import React, { useState, useEffect } from "react";
import { HomePageContent, AboutPageContent, ContactPageContent } from "@music-label/shared";
import { Save, Check, RefreshCw, AlertCircle, FileText } from "lucide-react";

export default function AdminPagesEditor() {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "contact">("home");

  const [homeData, setHomeData] = useState<HomePageContent | null>(null);
  const [aboutData, setAboutData] = useState<AboutPageContent | null>(null);
  const [contactData, setContactData] = useState<ContactPageContent | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllPages() {
      try {
        setLoading(true);
        const [hRes, aRes, cRes] = await Promise.all([
          fetch("/api/public/pages/home"),
          fetch("/api/public/pages/about"),
          fetch("/api/public/pages/contact"),
        ]);
        const hJson = await hRes.json();
        const aJson = await aRes.json();
        const cJson = await cRes.json();

        setHomeData(hJson.data);
        setAboutData(aJson.data);
        setContactData(cJson.data);
      } catch (err) {
        setErrorMessage("Failed to load page contents");
      } finally {
        setLoading(false);
      }
    }
    fetchAllPages();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    try {
      let bodyData;
      if (activeTab === "home") bodyData = homeData;
      if (activeTab === "about") bodyData = aboutData;
      if (activeTab === "contact") bodyData = contactData;

      const res = await fetch(`/api/admin/pages/${activeTab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        throw new Error(resJson.error || "Failed to update page");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-zinc-400">
        <RefreshCw className="w-6 h-6 animate-spin text-[#D4AF37] mr-3" />
        <span>Loading Page Contents...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
            Content Management
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white uppercase tracking-tight">
            Pages Content Editor
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Modify headings, introductions, hero showreel URLs, and button labels without code changes.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          id="admin-save-page-button"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] transition-all shadow-lg shrink-0 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4 text-emerald-950" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{savedSuccess ? "Saved Changes!" : saving ? "Saving..." : "Save Page"}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Page content has been saved successfully and is reflected on the live site.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-4">
        {(["home", "about", "contact"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            id={`tab-pages-${tab}`}
            className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-[#D4AF37] text-[#070709] font-bold shadow-md shadow-[#D4AF37]/20"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {tab === "home" ? "Home Page" : tab === "about" ? "About Page" : "Contact Page"}
          </button>
        ))}
      </div>

      {/* HOME PAGE FORM */}
      {activeTab === "home" && homeData && (
        <div className="space-y-8 max-w-4xl">
          {/* Hero Section */}
          <div className="p-6 rounded-2xl glass-panel space-y-6">
            <h2 className="font-heading font-bold text-lg text-[#F5D77F] uppercase tracking-wider border-b border-white/10 pb-3">
              Hero Section Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={homeData.hero.headline}
                  onChange={(e) =>
                    setHomeData({
                      ...homeData,
                      hero: { ...homeData.hero, headline: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Sub-headline / Badge Tag
                </label>
                <input
                  type="text"
                  value={homeData.hero.subheadline}
                  onChange={(e) =>
                    setHomeData({
                      ...homeData,
                      hero: { ...homeData.hero, subheadline: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Intro Narrative
                </label>
                <textarea
                  rows={3}
                  value={homeData.hero.introText}
                  onChange={(e) =>
                    setHomeData({
                      ...homeData,
                      hero: { ...homeData.hero, introText: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Featured Showreel Video URL (YouTube / Vimeo)
                </label>
                <input
                  type="url"
                  value={homeData.hero.featuredVideoUrl}
                  onChange={(e) =>
                    setHomeData({
                      ...homeData,
                      hero: { ...homeData.hero, featuredVideoUrl: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={homeData.hero.ctaPrimaryText}
                    onChange={(e) =>
                      setHomeData({
                        ...homeData,
                        hero: { ...homeData.hero, ctaPrimaryText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={homeData.hero.ctaSecondaryText}
                    onChange={(e) =>
                      setHomeData({
                        ...homeData,
                        hero: { ...homeData.hero, ctaSecondaryText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About Teaser Section */}
          <div className="p-6 rounded-2xl glass-panel space-y-6">
            <h2 className="font-heading font-bold text-lg text-[#F5D77F] uppercase tracking-wider border-b border-white/10 pb-3">
              About Teaser Section
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Teaser Heading
                </label>
                <input
                  type="text"
                  value={homeData.aboutTeaser.heading}
                  onChange={(e) =>
                    setHomeData({
                      ...homeData,
                      aboutTeaser: { ...homeData.aboutTeaser, heading: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Teaser Short Bio
                </label>
                <textarea
                  rows={3}
                  value={homeData.aboutTeaser.bio}
                  onChange={(e) =>
                    setHomeData({
                      ...homeData,
                      aboutTeaser: { ...homeData.aboutTeaser, bio: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={homeData.aboutTeaser.imageUrl}
                    onChange={(e) =>
                      setHomeData({
                        ...homeData,
                        aboutTeaser: { ...homeData.aboutTeaser, imageUrl: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={homeData.aboutTeaser.buttonText}
                    onChange={(e) =>
                      setHomeData({
                        ...homeData,
                        aboutTeaser: { ...homeData.aboutTeaser, buttonText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT PAGE FORM */}
      {activeTab === "about" && aboutData && (
        <div className="space-y-6 max-w-4xl p-6 rounded-2xl glass-panel">
          <h2 className="font-heading font-bold text-lg text-[#F5D77F] uppercase tracking-wider border-b border-white/10 pb-3">
            About Page Editorial Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Artist / Label Name
              </label>
              <input
                type="text"
                value={aboutData.artistName}
                onChange={(e) => setAboutData({ ...aboutData, artistName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={aboutData.headline}
                onChange={(e) => setAboutData({ ...aboutData, headline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Full Label Biography
              </label>
              <textarea
                rows={5}
                value={aboutData.fullBio}
                onChange={(e) => setAboutData({ ...aboutData, fullBio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Artistic Mission Statement
              </label>
              <textarea
                rows={3}
                value={aboutData.mission}
                onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTACT PAGE FORM */}
      {activeTab === "contact" && contactData && (
        <div className="space-y-6 max-w-4xl p-6 rounded-2xl glass-panel">
          <h2 className="font-heading font-bold text-lg text-[#F5D77F] uppercase tracking-wider border-b border-white/10 pb-3">
            Contact Page Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Headline
              </label>
              <input
                type="text"
                value={contactData.headline}
                onChange={(e) => setContactData({ ...contactData, headline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Sub-headline
              </label>
              <input
                type="text"
                value={contactData.subheadline}
                onChange={(e) => setContactData({ ...contactData, subheadline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Instructions
              </label>
              <textarea
                rows={3}
                value={contactData.instructions}
                onChange={(e) => setContactData({ ...contactData, instructions: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
