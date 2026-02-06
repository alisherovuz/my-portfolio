import { useState, useEffect, useRef } from "react";
import { useArticles } from "./useArticles";

// ── Placeholder photos (replace with real URLs) ──
const PHOTO = "";
const PHOTO_DG = "";
const PHOTO_TEAM = "";
const PHOTO_MENTOR = "";
const PHOTO_EVENT = "";

// ── Data ──────────────────────────────────────
const TIMELINE = [
  {
    year: "Present",
    months: [
      { month: "", items: [
        { title: "Founded EduGrands", desc: "Built from my bedroom with just a laptop and frustration. Launched to connect youth with global opportunities — grew to 20,000+ users and generated $10,000+ through strategic partnerships.", type: "venture", duration: "Aug 2023 – Present" },
        { title: "AI Mentor — Digital Generation Uzbekistan", desc: "Mentored 350+ students across 4 national camps in AI and no-code tools. Designed inclusive curriculum for underrepresented and disabled youth.", type: "leadership", duration: "Mar 2024 – Present" },
        { title: "Co-Founded MentorGo", desc: "Built the platform with a 4-person team. Supported 200+ monthly sessions, 3,000+ users, and helped students collectively secure over $1M in scholarships.", type: "venture", duration: "Dec 2024 – Present" },
        { title: "Operations Head — Startup Ambassadors", desc: "Working with 208 young people to help them figure out if their ideas actually solve real problems. Mornings spent mentoring, weekends selling apples at the bazaar.", type: "leadership", duration: "Jan 2026 – Present" },
      ]},
    ],
  },
  {
    year: "2025",
    months: [
      { month: "September", items: [
        { title: "School President — NIS AI School", desc: "Led monthly debates, intellectual competitions, and organized 'Ideathon' with 100+ students fostering critical thinking.", type: "leadership", duration: "Sep – Nov 2025" },
      ]},
      { month: "July", items: [
        { title: "Co-Founded Lumora", desc: "Organized 15 national IT case competitions in 10 regions, engaging 1,000+ students and collaborating with 15 industries.", type: "venture", duration: "Jul – Dec 2025" },
      ]},
    ],
  },
  {
    year: "2024",
    months: [
      { month: "June", items: [
        { title: "AI Researcher — New Uzbekistan University", desc: "Developed DavomatAI, an AI-powered attendance system that reduced manual record-keeping time by ~4 hours per month for educators.", type: "research", duration: "Jun – Jul 2024" },
      ]},
      { month: "April", items: [
        { title: "Robotics Engineer Intern — Robbit", desc: "Built and tested robotics prototypes, contributed to debugging and iterative improvement processes.", type: "research", duration: "Apr – Jun 2024" },
      ]},
    ],
  },
];

// Articles data is managed by useArticles hook (Supabase or local fallback)

const PROJECTS = [
  { name: "EduGrands", role: "Founder", emoji: "🎓", color: "#B86200", colorBg: "#D9740012", colorBorder: "#D9740022", desc: "Built from my bedroom with just a laptop and frustration. EduGrands is an edtech platform that now serves 30,000+ students across Central Asia — proving that world-class education can start from a village in Uzbekistan." },
  { name: "MentorGo", role: "Co-Founder", emoji: "🤝", color: "#2563EB", colorBg: "#2563EB12", colorBorder: "#2563EB22", desc: "Students kept hearing 'you need experience' but nobody gave them a first chance. MentorGo connects students with grant winners and high achievers for 1-on-1 consultations. We've helped students secure over $1M in scholarships." },
  { name: "Lumora", role: "Co-Founder", emoji: "🏆", color: "#7C3AED", colorBg: "#7C3AED12", colorBorder: "#7C3AED22", desc: "My friends and I searched forever for internships and competitions, always hearing the same thing. So we built Lumora and brought 15 competitions to 10 cities. Over 1,000 students participated." },
];

const typeColors = {
  leadership: { bg: "#2563EB0D", text: "#2563EB", border: "#2563EB18" },
  venture: { bg: "#D974000D", text: "#B86200", border: "#D9740018" },
  research: { bg: "#7C3AED0D", text: "#7C3AED", border: "#7C3AED18" },
  community: { bg: "#0596690D", text: "#059669", border: "#05966918" },
};

// ── Animation ─────────────────────────────────
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ── Photo placeholder ─────────────────────────
function PhotoPlaceholder({ alt, style, gradient = "135deg, #e8e0d4, #d4c8b8" }) {
  const src = style?.src || "";
  if (src) {
    return <img src={src} alt={alt} style={{ ...style, src: undefined }} />;
  }
  return (
    <div style={{
      ...style,
      background: `linear-gradient(${gradient})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#1A1A1A18", fontSize: 13, fontFamily: "'JetBrains Mono'",
      letterSpacing: "0.05em",
    }}>
      {alt || "photo"}
    </div>
  );
}

// ── Shared Layout ─────────────────────────────
function Layout({ page, setPage, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [["About", "about"], ["Journey", "journey"], ["Projects", "projects"], ["Writing", "writing"], ["Contact", "contact"]];

  return (
    <div style={{ minHeight: "100vh", background: "#FDFBF7", color: "#1A1A1A", fontFamily: "'Source Serif 4', Georgia, serif" }}>
      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999,
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }} />

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0,
        padding: "0 40px", height: 64,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrolled ? "#FDFBF7E8" : "#FDFBF700",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled ? "1px solid #1A1A1A06" : "1px solid transparent",
        zIndex: 100,
        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <button onClick={() => setPage("home")} style={{
          fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 20,
          color: "#1A1A1A", background: "none", border: "none", cursor: "pointer",
          padding: 0, letterSpacing: "-0.02em",
          transition: "transform 0.3s",
        }}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        >
          N<span style={{ color: "#2563EB" }}>.</span>
        </button>

        {/* Desktop links */}
        <div className="desk-links" style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {links.map(([label, id]) => (
            <button key={id} onClick={() => setPage(id)} style={{
              fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 400,
              color: page === id ? "#1A1A1A" : "#1A1A1A40",
              background: page === id ? "#1A1A1A06" : "none",
              border: "none", cursor: "pointer",
              padding: "7px 16px", borderRadius: 8,
              transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
              position: "relative",
            }}
              onMouseEnter={e => { if (page !== id) { e.target.style.color = "#1A1A1A80"; e.target.style.background = "#1A1A1A04"; }}}
              onMouseLeave={e => { if (page !== id) { e.target.style.color = "#1A1A1A40"; e.target.style.background = "none"; }}}
            >{label}</button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button className="mob-ham" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none",
          cursor: "pointer", padding: 8, color: "#1A1A1A",
          fontSize: 18, transition: "transform 0.3s",
          transform: menuOpen ? "rotate(90deg)" : "none",
        }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className="mob-menu" style={{
        position: "fixed", inset: 0, paddingTop: 64,
        background: "#FDFBF7",
        zIndex: 99, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 8,
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "auto" : "none",
        transition: "opacity 0.35s ease",
      }}>
        {[["Home", "home"], ...links].map(([label, id], i) => (
          <button key={id} onClick={() => { setPage(id); setMenuOpen(false); }} style={{
            fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: page === id ? 600 : 300,
            color: page === id ? "#1A1A1A" : "#1A1A1A44",
            background: "none", border: "none", cursor: "pointer",
            padding: "8px 20px",
            transition: "all 0.3s",
            transform: menuOpen ? "translateY(0)" : "translateY(10px)",
            transitionDelay: `${i * 0.04}s`,
          }}>{label}</button>
        ))}
      </div>

      {/* Page content */}
      <div key={page} style={{ animation: "pageIn 0.6s cubic-bezier(0.22,1,0.36,1) both" }}>
        {children}
      </div>

      {/* Footer */}
      <footer style={{
        padding: "32px 40px", borderTop: "1px solid #1A1A1A06",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: 860, margin: "0 auto", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#1A1A1A20", letterSpacing: "0.02em" }}>© 2026 Nurbek Alisherov</span>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#1A1A1A20", letterSpacing: "0.02em" }}>Tashkent, Uzbekistan 🇺🇿</span>
      </footer>
    </div>
  );
}

// ── Pages ─────────────────────────────────────

function HomePage({ setPage }) {
  return (
    <section style={{ padding: "0 24px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", paddingTop: 100, paddingBottom: 40,
      }}>
        <div className="hero-flex" style={{
          display: "flex", alignItems: "center", gap: 56, width: "100%",
        }}>
          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#1A1A1A22",
              letterSpacing: "0.12em", marginBottom: 28, textTransform: "uppercase",
              animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both",
            }}>
              <span style={{ display: "inline-block", width: 20, height: 1, background: "#1A1A1A15", verticalAlign: "middle", marginRight: 10 }} />
              Tashkent, Uzbekistan
            </div>

            <h1 style={{
              fontSize: "clamp(38px, 6vw, 64px)", fontFamily: "'Source Serif 4', serif",
              fontWeight: 700, lineHeight: 1.05, marginBottom: 28, color: "#1A1A1A",
              animation: "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both",
              letterSpacing: "-0.02em",
            }}>
              Nurbek<br />Alisherov
            </h1>

            <p style={{
              fontSize: "clamp(16px, 2vw, 19px)", fontFamily: "'Source Serif 4', serif",
              fontWeight: 300, fontStyle: "italic", lineHeight: 1.7,
              color: "#1A1A1A44", maxWidth: 440, marginBottom: 36,
              animation: "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.35s both",
            }}>
              I see things that are broken and build things to fix them — starting with education in Central Asia.
            </p>

            <div style={{
              display: "flex", gap: 14, flexWrap: "wrap",
              animation: "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.5s both",
            }}>
              <button onClick={() => setPage("about")} className="btn-primary">
                About me
              </button>
              <button onClick={() => setPage("writing")} className="btn-ghost">
                Read my writing
              </button>
            </div>

            {/* Quick stats */}
            <div style={{
              display: "flex", gap: 32, marginTop: 56,
              animation: "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.65s both",
            }}>
              {[
                { num: "30K+", label: "students reached" },
                { num: "$1M+", label: "in scholarships" },
                { num: "350+", label: "mentored in AI" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 22, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.02em" }}>{s.num}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#1A1A1A22", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div style={{
            animation: "fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s both",
            flexShrink: 0,
          }}>
            <div className="hero-photo" style={{
              width: 240, height: 300, borderRadius: 24, overflow: "hidden",
              border: "1px solid #1A1A1A08",
              boxShadow: "0 20px 60px #0000000A, 0 4px 16px #0000000A",
              position: "relative",
            }}>
              {PHOTO ? (
                <img src={PHOTO} alt="Nurbek Alisherov" style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  objectPosition: "center top", display: "block",
                }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  background: "linear-gradient(145deg, #e8e0d4 0%, #d4c8b8 50%, #c8bcac 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 48, opacity: 0.3 }}>📷</span>
                </div>
              )}
              {/* Subtle overlay gradient at bottom */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                background: "linear-gradient(transparent, #FDFBF720)",
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        animation: "gentleBounce 2.5s ease-in-out infinite",
      }}>
        <div style={{
          width: 1, height: 32, background: "linear-gradient(#1A1A1A10, #1A1A1A00)",
        }} />
      </div>
    </section>
  );
}

function AboutPage({ aboutText = {} }) {
  const heading = aboutText.heading || "Every project starts the same — I see something broken, and I can't walk past it.";
  const p1 = aboutText.p1 || "I'm Nurbek Alisherov, a senior high school student from Uzbekistan.";
  const p2 = aboutText.p2 || "As an AI Mentor at Digital Generation Uzbekistan, I help the next wave of builders understand and harness artificial intelligence.";
  const p3 = aboutText.p3 || "My family grows apples — 2 hectares. On weekends I sell them at the bazaar.";

  return (
    <section style={{ padding: "140px 40px 100px", maxWidth: 860, margin: "0 auto" }}>
      <Reveal>
        <div className="section-label">About</div>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 style={{
          fontFamily: "'Source Serif 4', serif", fontSize: "clamp(26px, 4vw, 38px)",
          fontWeight: 600, lineHeight: 1.4, marginBottom: 36, color: "#1A1A1Abb",
          maxWidth: 640,
        }}>
          {heading}
        </h2>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="body-text" style={{ marginBottom: 52 }}>{p1}</p>
      </Reveal>

      {/* Photos grid */}
      <Reveal delay={0.2}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { photo: PHOTO_DG, alt: "Nurbek working", grad: "135deg, #ddd5c8, #c8bfb2" },
            { photo: PHOTO_TEAM, alt: "With team at Digital Generation", grad: "135deg, #d5cdc0, #c0b8ab" },
            { photo: PHOTO_MENTOR, alt: "Nurbek as AI Mentor", grad: "135deg, #cdc5b8, #b8b0a3" },
          ].map((item, i) => (
            <div key={i} className="photo-frame" style={{ borderRadius: 14, overflow: "hidden" }}>
              {item.photo ? (
                <img src={item.photo} alt={item.alt} style={{
                  width: "100%", height: 220, objectFit: "cover", objectPosition: "center", display: "block",
                }} />
              ) : (
                <div style={{
                  width: "100%", height: 220,
                  background: `linear-gradient(${item.grad})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: "#1A1A1A15", letterSpacing: "0.05em" }}>{item.alt}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <p style={{
          fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#1A1A1A22",
          marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase",
        }}>At Digital Generation Uzbekistan</p>
        <p className="body-text" style={{ marginBottom: 52 }}>{p2}</p>
      </Reveal>

      {/* Second Photo */}
      <Reveal delay={0.25}>
        <div className="photo-frame" style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
          {PHOTO_EVENT ? (
            <img src={PHOTO_EVENT} alt="Nurbek mentoring" style={{
              width: "100%", height: 320, objectFit: "cover", objectPosition: "center top", display: "block",
            }} />
          ) : (
            <div style={{
              width: "100%", height: 320,
              background: "linear-gradient(145deg, #ddd5c8 0%, #c8bfb2 50%, #b8b0a3 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: "#1A1A1A15", letterSpacing: "0.05em" }}>Between homework and building</span>
            </div>
          )}
        </div>
        <p style={{
          fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#1A1A1A22",
          marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase",
        }}>Between homework and building</p>
        <p className="body-text" style={{ marginBottom: 56 }}>{p3}</p>
      </Reveal>

      <Reveal delay={0.3}>
        <div style={{
          fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#1A1A1A22",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18,
        }}>Areas of Interest</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { label: "Artificial Intelligence", icon: "⚡" },
            { label: "Education Access", icon: "📚" },
            { label: "Entrepreneurship", icon: "🚀" },
            { label: "Uzbek Language & NLP", icon: "🌐" },
            { label: "Community Building", icon: "🤝" },
            { label: "Philosophy of Learning", icon: "💡" },
          ].map((item, i) => (
            <span key={i} className="interest-pill">
              <span>{item.icon}</span>{item.label}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function JourneyPage() {
  return (
    <section style={{ padding: "140px 40px 100px", maxWidth: 860, margin: "0 auto" }}>
      <Reveal>
        <div className="section-label">Journey</div>
      </Reveal>

      {/* Timeline */}
      <Reveal delay={0.05}>
        <div style={{
          fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#1A1A1A22",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 28,
        }}>Timeline</div>
      </Reveal>

      {TIMELINE.map((block, bi) => (
        <Reveal key={bi} delay={0.12 + bi * 0.06}>
          <div style={{ marginBottom: 52 }}>
            {/* Year header */}
            <div style={{
              fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 700,
              color: "#1A1A1A", marginBottom: 24,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: bi === 0 ? "#2563EB" : "#1A1A1A18",
                display: "inline-block",
                animation: bi === 0 ? "subtlePulse 2.5s ease-in-out infinite" : "none",
                boxShadow: bi === 0 ? "0 0 0 4px #2563EB15" : "none",
              }} />
              {block.year}
              {bi === 0 && <span style={{
                fontFamily: "'JetBrains Mono'", fontSize: 9, color: "#2563EB66",
                letterSpacing: "0.12em", textTransform: "uppercase",
                background: "#2563EB08", padding: "3px 10px", borderRadius: 100,
              }}>Now</span>}
              <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #1A1A1A08, transparent)" }} />
            </div>

            {/* Months */}
            {block.months.map((monthBlock, mi) => (
              <div key={mi} style={{ marginBottom: 20, paddingLeft: 22, borderLeft: "1.5px solid #1A1A1A06" }}>
                {monthBlock.month && <div style={{
                  fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 500,
                  color: "#1A1A1A25", textTransform: "uppercase", letterSpacing: "0.08em",
                  marginBottom: 12,
                }}>{monthBlock.month}</div>}

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {monthBlock.items.map((item, ii) => (
                    <div key={ii} className="tl-item">
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase",
                          padding: "3px 10px", borderRadius: 100,
                          background: typeColors[item.type].bg, color: typeColors[item.type].text,
                          border: `1px solid ${typeColors[item.type].border}`,
                        }}>{item.type}</span>
                        {item.duration && <span style={{
                          fontFamily: "'JetBrains Mono'", fontSize: 10,
                          color: item.duration.includes("Present") ? "#2563EB55" : "#1A1A1A22",
                        }}>{item.duration}</span>}
                      </div>
                      <h4 style={{ fontFamily: "'DM Sans'", fontSize: 16, fontWeight: 550, color: "#1A1A1Acc", marginBottom: 6, lineHeight: 1.3 }}>{item.title}</h4>
                      <p style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: "#1A1A1A48" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      ))}
    </section>
  );
}

function ProjectsPage({ projects = PROJECTS }) {
  return (
    <section style={{ padding: "140px 40px 100px", maxWidth: 860, margin: "0 auto" }}>
      <Reveal>
        <div className="section-label">Projects</div>
      </Reveal>

      <Reveal delay={0.05}>
        <p style={{
          fontFamily: "'Source Serif 4', serif", fontSize: 18, fontWeight: 300,
          fontStyle: "italic", color: "#1A1A1A38", marginBottom: 44, maxWidth: 460,
        }}>
          Things I'm building to make education and mentorship more accessible.
        </p>
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {projects.map((proj, i) => (
          <Reveal key={i} delay={0.1 + i * 0.08}>
            <div className="project-card">
              <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: `linear-gradient(135deg, ${proj.color}08, ${proj.color}14)`,
                  border: `1px solid ${proj.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, flexShrink: 0,
                  transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                }}>{proj.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                    <h3 style={{ fontFamily: "'DM Sans'", fontSize: 20, fontWeight: 600, color: "#1A1A1A", letterSpacing: "-0.01em" }}>{proj.name}</h3>
                    <span style={{
                      fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase",
                      padding: "3px 10px", borderRadius: 100,
                      background: `${proj.color}0A`, color: proj.color, border: `1px solid ${proj.color}15`,
                    }}>{proj.role}</span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: "#1A1A1A48" }}>{proj.desc}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function WritingPage({ articles = WRITING }) {
  const [hovered, setHovered] = useState(null);

  const MONTHS_ORDER = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const years = [...new Set(articles.map(p => p.year))].sort((a, b) => b - a);
  const grouped = {};
  years.forEach(y => {
    const yearPosts = articles.filter(p => p.year === y);
    const months = [...new Set(yearPosts.map(p => p.month))].sort((a, b) => MONTHS_ORDER.indexOf(b) - MONTHS_ORDER.indexOf(a));
    grouped[y] = {};
    months.forEach(m => { grouped[y][m] = yearPosts.filter(p => p.month === m); });
  });

  return (
    <section style={{ padding: "140px 40px 100px", maxWidth: 960, margin: "0 auto" }}>
      <Reveal>
        <div className="section-label">Writing</div>
      </Reveal>

      <Reveal delay={0.05}>
        <p style={{
          fontFamily: "'Source Serif 4', serif", fontSize: 18, fontWeight: 300,
          fontStyle: "italic", color: "#1A1A1A38", marginBottom: 52, maxWidth: 460,
        }}>
          I write to understand — about technology, education, and building things that matter.
        </p>
      </Reveal>

      {years.map((year, yi) => {
        const yearArticles = articles.filter(p => p.year === year);
        return (
          <div key={year} style={{ marginBottom: 56 }}>
            <Reveal delay={yi * 0.04}>
              <div style={{
                fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 700,
                color: "#1A1A1A", marginBottom: 28,
                display: "flex", alignItems: "center", gap: 16,
              }}>
                {year}
                <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #1A1A1A08, transparent)" }} />
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 400, color: "#1A1A1A18" }}>
                  {yearArticles.length} {yearArticles.length === 1 ? "post" : "posts"}
                </span>
              </div>
            </Reveal>

            {Object.keys(grouped[year]).map((month, mi) => (
              <div key={month} style={{ marginBottom: 32 }}>
                <Reveal delay={0.04 + mi * 0.03}>
                  <div style={{
                    fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 500,
                    color: "#1A1A1A30", marginBottom: 14,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>{month}</div>
                </Reveal>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
                  {grouped[year][month].map((post, i) => {
                    const idx = `${year}-${month}-${i}`;
                    return (
                      <Reveal key={idx} delay={0.04 + i * 0.05}>
                        <div
                          onMouseEnter={() => setHovered(idx)}
                          onMouseLeave={() => setHovered(null)}
                          className="writing-card-wrap"
                          style={{
                            borderRadius: 16, overflow: "hidden", cursor: "pointer",
                            background: "#fff", border: "1px solid #1A1A1A06",
                            transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                            transform: hovered === idx ? "translateY(-5px)" : "none",
                            boxShadow: hovered === idx ? "0 16px 50px #0000000C" : "0 1px 3px #00000005",
                          }}
                        >
                          {/* Cover */}
                          <div style={{
                            height: 130,
                            background: `linear-gradient(135deg, ${post.color}0C, ${post.color}04)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            position: "relative", overflow: "hidden",
                          }}>
                            {/* Decorative circles */}
                            <div style={{
                              position: "absolute", top: -24, right: -24,
                              width: 80, height: 80, borderRadius: "50%",
                              border: `1px solid ${post.color}10`,
                            }} />
                            <div style={{
                              position: "absolute", bottom: -18, left: -18,
                              width: 56, height: 56, borderRadius: "50%",
                              background: `${post.color}06`,
                            }} />
                            <span style={{
                              fontFamily: "'Source Serif 4', serif", fontSize: 48, fontWeight: 700,
                              color: `${post.color}0C`,
                              transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                              transform: hovered === idx ? "scale(1.1)" : "scale(1)",
                            }}>{post.title.charAt(0)}</span>
                          </div>

                          {/* Content */}
                          <div style={{ padding: "14px 20px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                              <span style={{
                                fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase",
                                color: post.color, padding: "3px 10px", borderRadius: 100,
                                background: `${post.color}08`,
                              }}>{post.tag}</span>
                            </div>
                            <h3 style={{
                              fontFamily: "'Source Serif 4', serif", fontSize: 16, fontWeight: 600,
                              lineHeight: 1.4, marginBottom: 8,
                              color: hovered === idx ? "#2563EB" : "#1A1A1Acc",
                              transition: "color 0.35s",
                            }}>{post.title}</h3>
                            <p style={{
                              fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 300,
                              lineHeight: 1.7, color: "#1A1A1A35",
                            }}>{post.excerpt}</p>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </section>
  );
}

function ContactPage() {
  return (
    <section style={{ padding: "140px 40px 100px", maxWidth: 860, margin: "0 auto" }}>
      <Reveal>
        <div className="section-label">Get in touch</div>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 style={{
          fontFamily: "'Source Serif 4', serif", fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 600, lineHeight: 1.2, marginBottom: 14, color: "#1A1A1A",
        }}>
          I'd love to{" "}
          <span style={{
            fontStyle: "italic", color: "#2563EB",
            backgroundImage: "linear-gradient(transparent 65%, #2563EB12 65%)",
          }}>connect</span>.
        </h2>
        <p style={{
          fontFamily: "'DM Sans'", fontSize: 15, fontWeight: 300,
          color: "#1A1A1A40", marginBottom: 48, maxWidth: 440, lineHeight: 1.75,
        }}>
          Whether you'd like to discuss a shared interest, explore collaboration, or just say hello — my inbox is always open.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
          {[
            { icon: "✉️", label: "hello@imnurbek.uz", href: "mailto:hello@imnurbek.uz" },
            { icon: "💼", label: "LinkedIn", href: "https://linkedin.com/in/uzalisherov" },
            { icon: "💬", label: "Telegram", href: "https://t.me/uzalisherov" },
          ].map((item, i) => (
            <a key={i} href={item.href} target={item.href.startsWith("mailto") ? undefined : "_blank"} className="contact-row">
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
              <span style={{ marginLeft: "auto", color: "#1A1A1A18", fontSize: 14, transition: "transform 0.3s" }}>→</span>
            </a>
          ))}
        </div>
      </Reveal>

      {/* Decorative */}
      <Reveal delay={0.35}>
        <div style={{
          marginTop: 80, padding: "28px 0",
          borderTop: "1px solid #1A1A1A06",
        }}>
          <p style={{
            fontFamily: "'Source Serif 4', serif", fontSize: 15,
            fontStyle: "italic", color: "#1A1A1A18", lineHeight: 1.6,
          }}>
            "The best time to plant a tree was twenty years ago. The second best time is now."
          </p>
        </div>
      </Reveal>
    </section>
  );
}

// ── Admin Panel ──────────────────────────────

const ADMIN_PASS = "nurbek2026";

function AdminLogin({ onLogin }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FDFBF7", fontFamily: "'DM Sans'" }}>
      <div style={{
        width: 380, padding: 44, background: "#fff", borderRadius: 24,
        border: "1px solid #1A1A1A06",
        boxShadow: "0 12px 50px #0000000A",
      }}>
        <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#1A1A1A22", marginBottom: 28, fontFamily: "'JetBrains Mono'" }}>Admin</div>
        <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Welcome back</h2>
        <p style={{ fontSize: 13, color: "#1A1A1A40", marginBottom: 32 }}>Enter your password to continue.</p>
        <input
          type="password" value={pass}
          onChange={e => { setPass(e.target.value); setError(false); }}
          onKeyDown={e => { if (e.key === "Enter") { pass === ADMIN_PASS ? onLogin() : setError(true); } }}
          placeholder="Password"
          style={{
            width: "100%", padding: "13px 18px", borderRadius: 12,
            border: error ? "1.5px solid #EF4444" : "1.5px solid #1A1A1A0A",
            fontSize: 14, outline: "none", background: "#FDFBF7",
            marginBottom: error ? 8 : 18,
            fontFamily: "'DM Sans'",
            transition: "border-color 0.3s",
          }}
        />
        {error && <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 14 }}>Incorrect password</p>}
        <button onClick={() => pass === ADMIN_PASS ? onLogin() : setError(true)} className="btn-primary" style={{ width: "100%", borderRadius: 12, padding: "13px" }}>
          Sign in
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{
      padding: 24, borderRadius: 18, background: "#fff",
      border: "1px solid #1A1A1A06", flex: 1, minWidth: 150,
      transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{
          fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: "0.06em",
          textTransform: "uppercase", color: color, padding: "3px 10px",
          borderRadius: 100, background: `${color}08`,
        }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 34, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.02em" }}>{value}</div>
    </div>
  );
}

function AdminPanel({ articles, projects, aboutText, onUpdate, onLogout, onAddArticle, onUpdateArticle, onDeleteArticle, isSupabase }) {
  const [tab, setTab] = useState("dashboard");
  const [editingArticle, setEditingArticle] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [aboutDraft, setAboutDraft] = useState(aboutText);
  const [saved, setSaved] = useState(false);

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "articles", label: "Articles", icon: "✍️" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "about", label: "About", icon: "👤" },
  ];

  const tagOptions = ["AI / Tech", "Education", "Startups", "Reflection"];
  const colorMap = { "AI / Tech": "#2563EB", Education: "#059669", Startups: "#B86200", Reflection: "#7C3AED" };
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const emptyArticle = { title: "", excerpt: "", tag: "AI / Tech", color: "#2563EB", year: 2026, month: "January", date: "January 2026" };

  const saveArticle = async (art) => {
    if (art._editId != null) {
      // Editing existing
      await onUpdateArticle(art._editId, art);
    } else {
      // New article
      await onAddArticle(art);
    }
    setEditingArticle(null);
    showSaved();
  };

  const handleDeleteArticle = async (article, idx) => {
    // For Supabase use article.id (UUID), for local use index
    await onDeleteArticle(isSupabase ? article.id : idx);
    showSaved();
  };

  const emptyProject = { name: "", role: "", emoji: "🎯", desc: "", color: "#2563EB", colorBg: "#2563EB12", colorBorder: "#2563EB22" };

  const saveProject = (proj) => {
    const withColors = { ...proj, colorBg: `${proj.color}12`, colorBorder: `${proj.color}22` };
    const updated = proj.id != null
      ? projects.map((p, i) => i === proj.id ? withColors : p)
      : [...projects, withColors];
    const cleaned = updated.map(({ id, ...rest }) => rest);
    onUpdate("projects", cleaned);
    setEditingProject(null);
    showSaved();
  };

  const deleteProject = (idx) => { onUpdate("projects", projects.filter((_, i) => i !== idx)); showSaved(); };

  const inputStyle = {
    width: "100%", padding: "11px 16px", borderRadius: 12,
    border: "1.5px solid #1A1A1A0A", fontSize: 13, outline: "none",
    background: "#FDFBF7", fontFamily: "'DM Sans'", marginBottom: 14,
    transition: "border-color 0.3s",
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F0", fontFamily: "'DM Sans'" }}>
      {saved && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 200,
          padding: "12px 24px", borderRadius: 14, background: "#059669", color: "#fff",
          fontSize: 13, fontWeight: 500, boxShadow: "0 8px 30px #05966925",
          animation: "fadeUp 0.3s ease both",
        }}>✓ Saved</div>
      )}

      {/* Sidebar */}
      <div className="admin-sidebar" style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 220,
        background: "#fff", borderRight: "1px solid #1A1A1A06",
        padding: "32px 16px", display: "flex", flexDirection: "column",
        zIndex: 50,
      }}>
        <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 20, fontWeight: 700, marginBottom: 6, paddingLeft: 12 }}>
          N<span style={{ color: "#2563EB" }}>.</span> <span style={{ fontSize: 14, fontWeight: 400, color: "#1A1A1A44" }}>Admin</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#1A1A1A20", paddingLeft: 12, marginBottom: 36 }}>imnurbek.uz</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10, border: "none",
              background: tab === t.id ? "#1A1A1A06" : "none",
              color: tab === t.id ? "#1A1A1A" : "#1A1A1A44",
              fontWeight: tab === t.id ? 500 : 400,
              fontSize: 13, cursor: "pointer", textAlign: "left",
              fontFamily: "'DM Sans'", transition: "all 0.25s",
            }}>
              <span style={{ fontSize: 15 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #1A1A1A06", paddingTop: 16 }}>
          <button onClick={onLogout} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderRadius: 10, border: "none",
            background: "none", color: "#EF444488", fontSize: 13,
            cursor: "pointer", fontFamily: "'DM Sans'",
            transition: "color 0.25s",
          }}
            onMouseEnter={e => e.target.style.color = "#EF4444"}
            onMouseLeave={e => e.target.style.color = "#EF444488"}
          >
            <span style={{ fontSize: 15 }}>🚪</span>Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 220, padding: "36px 44px", maxWidth: 920 }}>
        {tab === "dashboard" && (
          <>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 600, marginBottom: 6 }}>Dashboard</h2>
            <p style={{ fontSize: 13, color: "#1A1A1A40", marginBottom: 32 }}>Overview of your website content.</p>

            <div style={{ display: "flex", gap: 14, marginBottom: 44, flexWrap: "wrap" }}>
              <StatCard label="Articles" value={articles.length} icon="✍️" color="#2563EB" />
              <StatCard label="Projects" value={projects.length} icon="🚀" color="#B86200" />
              <StatCard label="Categories" value={[...new Set(articles.map(a => a.tag))].length} icon="🏷️" color="#7C3AED" />
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 14, color: "#1A1A1A66" }}>Articles by Category</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 44 }}>
              {tagOptions.map(tag => {
                const count = articles.filter(a => a.tag === tag).length;
                const pct = articles.length > 0 ? (count / articles.length) * 100 : 0;
                return (
                  <div key={tag} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, color: "#1A1A1A66", width: 100 }}>{tag}</span>
                    <div style={{ flex: 1, height: 6, background: "#1A1A1A04", borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: colorMap[tag], borderRadius: 100, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#1A1A1A30", width: 20, textAlign: "right" }}>{count}</span>
                  </div>
                );
              })}
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 14, color: "#1A1A1A66" }}>Recent Articles</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {articles.slice(0, 5).map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 18px", borderRadius: 12, background: "#fff",
                  border: "1px solid #1A1A1A06",
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: a.color, padding: "2px 8px", borderRadius: 100, background: `${a.color}08` }}>{a.tag}</span>
                  <span style={{ fontSize: 13, color: "#1A1A1A", flex: 1 }}>{a.title}</span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#1A1A1A22" }}>{a.date}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "articles" && !editingArticle && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div>
                <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>Articles</h2>
                <p style={{ fontSize: 13, color: "#1A1A1A40" }}>{articles.length} published</p>
              </div>
              <button onClick={() => setEditingArticle({ ...emptyArticle })} className="btn-primary" style={{ borderRadius: 12 }}>+ New Article</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {articles.map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "16px 20px", borderRadius: 14, background: "#fff",
                  border: "1px solid #1A1A1A06",
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: a.color, padding: "3px 10px", borderRadius: 100, background: `${a.color}08` }}>{a.tag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A", marginBottom: 2 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: "#1A1A1A30" }}>{a.date}</div>
                  </div>
                  <button onClick={() => setEditingArticle({ ...a, _editId: isSupabase ? a.id : i })} className="admin-btn">Edit</button>
                  <button onClick={() => handleDeleteArticle(a, i)} className="admin-btn-danger">Delete</button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "articles" && editingArticle && (
          <>
            <button onClick={() => setEditingArticle(null)} className="back-btn">← Back</button>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
              {editingArticle._editId != null ? "Edit Article" : "New Article"}
            </h2>
            <div style={{ maxWidth: 520 }}>
              <label className="form-label">Title</label>
              <input style={inputStyle} value={editingArticle.title} onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })} />
              <label className="form-label">Excerpt</label>
              <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={editingArticle.excerpt} onChange={e => setEditingArticle({ ...editingArticle, excerpt: e.target.value })} />
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select style={selectStyle} value={editingArticle.tag} onChange={e => setEditingArticle({ ...editingArticle, tag: e.target.value })}>
                    {tagOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Month</label>
                  <select style={selectStyle} value={editingArticle.month} onChange={e => setEditingArticle({ ...editingArticle, month: e.target.value })}>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ width: 100 }}>
                  <label className="form-label">Year</label>
                  <input style={inputStyle} type="number" value={editingArticle.year} onChange={e => setEditingArticle({ ...editingArticle, year: parseInt(e.target.value) || 2025 })} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => saveArticle(editingArticle)} className="btn-primary" style={{ borderRadius: 12 }}>Save</button>
                <button onClick={() => setEditingArticle(null)} className="admin-btn" style={{ padding: "10px 28px" }}>Cancel</button>
              </div>
            </div>
          </>
        )}

        {tab === "projects" && !editingProject && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div>
                <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>Projects</h2>
                <p style={{ fontSize: 13, color: "#1A1A1A40" }}>{projects.length} listed</p>
              </div>
              <button onClick={() => setEditingProject({ ...emptyProject })} className="btn-primary" style={{ borderRadius: 12 }}>+ New Project</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {projects.map((p, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "16px 20px", borderRadius: 14, background: "#fff",
                  border: "1px solid #1A1A1A06",
                }}>
                  <span style={{ fontSize: 22 }}>{p.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#1A1A1A30" }}>{p.role}</div>
                  </div>
                  <button onClick={() => setEditingProject({ ...p, id: i })} className="admin-btn">Edit</button>
                  <button onClick={() => deleteProject(i)} className="admin-btn-danger">Delete</button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "projects" && editingProject && (
          <>
            <button onClick={() => setEditingProject(null)} className="back-btn">← Back</button>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
              {editingProject.id != null ? "Edit Project" : "New Project"}
            </h2>
            <div style={{ maxWidth: 520 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 70 }}>
                  <label className="form-label">Emoji</label>
                  <input style={inputStyle} value={editingProject.emoji} onChange={e => setEditingProject({ ...editingProject, emoji: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Name</label>
                  <input style={inputStyle} value={editingProject.name} onChange={e => setEditingProject({ ...editingProject, name: e.target.value })} />
                </div>
              </div>
              <label className="form-label">Role</label>
              <input style={inputStyle} value={editingProject.role} placeholder="e.g. Founder, Co-Founder" onChange={e => setEditingProject({ ...editingProject, role: e.target.value })} />
              <label className="form-label">Description</label>
              <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={editingProject.desc} onChange={e => setEditingProject({ ...editingProject, desc: e.target.value })} />
              <label className="form-label">Accent Color</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                {["#2563EB", "#B86200", "#7C3AED", "#059669", "#EF4444", "#1A1A1A"].map(c => (
                  <button key={c} onClick={() => setEditingProject({ ...editingProject, color: c })} style={{
                    width: 34, height: 34, borderRadius: 10, background: c,
                    border: editingProject.color === c ? "3px solid #1A1A1A" : "3px solid transparent",
                    cursor: "pointer", transition: "all 0.25s",
                    transform: editingProject.color === c ? "scale(1.1)" : "scale(1)",
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => saveProject(editingProject)} className="btn-primary" style={{ borderRadius: 12 }}>Save</button>
                <button onClick={() => setEditingProject(null)} className="admin-btn" style={{ padding: "10px 28px" }}>Cancel</button>
              </div>
            </div>
          </>
        )}

        {tab === "about" && (
          <>
            <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 28, fontWeight: 600, marginBottom: 6 }}>About Page</h2>
            <p style={{ fontSize: 13, color: "#1A1A1A40", marginBottom: 28 }}>Edit your about section text.</p>
            <div style={{ maxWidth: 600 }}>
              {[
                { label: "Heading", key: "heading", h: 60 },
                { label: "First Paragraph", key: "p1", h: 100 },
                { label: "Digital Generation Paragraph", key: "p2", h: 100 },
                { label: "Building Paragraph", key: "p3", h: 100 },
              ].map(field => (
                <div key={field.key}>
                  <label className="form-label">{field.label}</label>
                  <textarea style={{ ...inputStyle, height: field.h, resize: "vertical" }} value={aboutDraft[field.key]} onChange={e => setAboutDraft({ ...aboutDraft, [field.key]: e.target.value })} />
                </div>
              ))}
              <button onClick={() => { onUpdate("about", aboutDraft); showSaved(); }} className="btn-primary" style={{ borderRadius: 12, marginTop: 4 }}>Save Changes</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────
export default function NurbekSite() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);

  const { articles, loading: articlesLoading, isSupabase, addArticle, updateArticle, deleteArticle } = useArticles();
  const [projectsList, setProjectsList] = useState(PROJECTS);
  const [aboutText, setAboutText] = useState({
    heading: "Every project starts the same — I see something broken, and I can't walk past it.",
    p1: "I'm Nurbek Alisherov, a senior high school student from Uzbekistan. My journey with technology started at six when my dad gifted me my first computer. By ten, I was teaching myself Python during power outages after the internet finally reached my village. But what really changed me wasn't code — it was watching my friends miss scholarships just because nobody told them they existed. Information only went to certain people, like some exclusive club. I couldn't ignore that.",
    p2: "I built EduGrands from my bedroom — just a laptop and frustration. Now 30,000 students use it. A student once messaged me saying they got into a prestigious program through the platform. Their parents were crying. I was 16, standing in our apple orchard, and it hit different. Something I'd built between homework and selling apples was affecting families I'd never meet. That's when I realized I couldn't stop at one platform. So I kept building: MentorGo, which helped students secure over $1M in scholarships. Lumora, which brought 15 competitions to 10 cities and over 1,000 students. At Digital Generation, I taught AI fundamentals to 350+ children from villages where people barely know what AI is.",
    p3: "My family grows apples — 2 hectares. On weekends I sell them at the bazaar, haggling with grandmas who've known me since I was five. In the mornings, I work with 208 youth through Startup Ambassadors, helping them figure out if their ideas actually solve real problems. It keeps me grounded. I'm not trying to be impressive. I just can't leave things broken.",
  });

  useEffect(() => {
    let buffer = "";
    const handler = (e) => {
      buffer += e.key;
      if (buffer.length > 5) buffer = buffer.slice(-5);
      if (buffer === "admin") { setIsAdmin(true); buffer = ""; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const handleUpdate = (type, data) => {
    if (type === "projects") setProjectsList(data);
    if (type === "about") setAboutText(data);
  };

  if (isAdmin && !adminAuth) return <AdminLogin onLogin={() => setAdminAuth(true)} />;
  if (isAdmin && adminAuth) return <AdminPanel articles={articles} projects={projectsList} aboutText={aboutText} onUpdate={handleUpdate} onLogout={() => { setIsAdmin(false); setAdminAuth(false); }} onAddArticle={addArticle} onUpdateArticle={updateArticle} onDeleteArticle={deleteArticle} isSupabase={isSupabase} />;

  const pages = {
    home: <HomePage setPage={setPage} />,
    about: <AboutPage aboutText={aboutText} />,
    journey: <JourneyPage />,
    projects: <ProjectsPage projects={projectsList} />,
    writing: <WritingPage articles={articles} />,
    contact: <ContactPage />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,300;1,8..60,400&family=JetBrains+Mono:wght@300;400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::selection { background: #2563EB20; color: #1A1A1A; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes gentleBounce {
          0%, 100% { opacity: 0.2; transform: translateX(-50%) translateY(0); }
          50% { opacity: 0.5; transform: translateX(-50%) translateY(8px); }
        }

        /* Shared classes */
        .section-label {
          font-family: 'JetBrains Mono'; font-size: 10px; letter-spacing: 0.15em;
          text-transform: uppercase; color: #1A1A1A20;
          margin-bottom: 48px; padding-bottom: 16px; border-bottom: 1px solid #1A1A1A06;
        }

        .body-text {
          font-family: 'DM Sans'; font-size: 15px; font-weight: 300;
          line-height: 1.9; color: #1A1A1A55;
        }

        .form-label {
          font-family: 'DM Sans'; font-size: 12px; color: #1A1A1A44;
          margin-bottom: 5px; display: block;
        }

        .btn-primary {
          font-family: 'DM Sans'; font-size: 13px; font-weight: 500;
          color: #fff; background: #1A1A1A; cursor: pointer;
          padding: 11px 28px; border-radius: 100px; border: none;
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 2px 12px #1A1A1A10;
        }
        .btn-primary:hover { background: #2563EB; transform: translateY(-1px); box-shadow: 0 6px 20px #2563EB20; }

        .btn-ghost {
          font-family: 'DM Sans'; font-size: 13px; font-weight: 400;
          color: #1A1A1A55; border: 1px solid #1A1A1A0A; background: none;
          padding: 11px 28px; border-radius: 100px; cursor: pointer;
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .btn-ghost:hover { border-color: #1A1A1A20; color: #1A1A1A; transform: translateY(-1px); }

        .admin-btn {
          padding: 7px 16px; border-radius: 10px; border: 1px solid #1A1A1A0A;
          background: none; font-size: 12px; cursor: pointer; color: #1A1A1A55;
          font-family: 'DM Sans'; transition: all 0.25s;
        }
        .admin-btn:hover { border-color: #1A1A1A18; color: #1A1A1A; }

        .admin-btn-danger {
          padding: 7px 16px; border-radius: 10px; border: 1px solid #EF444418;
          background: none; font-size: 12px; cursor: pointer; color: #EF444488;
          font-family: 'DM Sans'; transition: all 0.25s;
        }
        .admin-btn-danger:hover { border-color: #EF4444; color: #EF4444; background: #EF444408; }

        .back-btn {
          font-size: 13px; color: #1A1A1A44; background: none; border: none;
          cursor: pointer; margin-bottom: 20px; font-family: 'DM Sans';
          transition: color 0.25s;
        }
        .back-btn:hover { color: #1A1A1A; }

        .interest-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 100px;
          background: #fff; border: 1px solid #1A1A1A06;
          font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1A1A1A66;
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .interest-pill:hover {
          border-color: #1A1A1A12; color: #1A1A1A99;
          transform: translateY(-2px); box-shadow: 0 6px 16px #0000000A;
        }

        .tl-item {
          padding: 22px 26px; border-radius: 14px;
          background: #fff; border: 1px solid #1A1A1A06;
          transition: all 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .tl-item:hover { border-color: #1A1A1A0C; box-shadow: 0 8px 28px #0000000A; transform: translateX(4px); }

        .project-card {
          padding: 32px; border-radius: 18px;
          background: #fff; border: 1px solid #1A1A1A06;
          transition: all 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .project-card:hover { border-color: #1A1A1A0C; transform: translateY(-4px); box-shadow: 0 16px 48px #0000000C; }

        .contact-row {
          display: flex; align-items: center; gap: 16px;
          padding: 20px 26px; border-radius: 14px;
          background: #fff; border: 1px solid #1A1A1A06;
          text-decoration: none; color: #1A1A1A77;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          font-family: 'DM Sans', sans-serif; font-size: 15px;
        }
        .contact-row:hover {
          border-color: #2563EB14; color: #1A1A1A;
          transform: translateX(8px); box-shadow: 0 8px 28px #0000000A;
        }

        .photo-frame {
          border: 1px solid #1A1A1A06;
          box-shadow: 0 4px 24px #0000000A;
          transition: all 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .photo-frame:hover { box-shadow: 0 8px 36px #00000010; transform: translateY(-2px); }

        .stat-card:hover { box-shadow: 0 8px 28px #0000000A; transform: translateY(-2px); }

        @media (max-width: 640px) {
          .hero-flex { flex-direction: column-reverse !important; align-items: flex-start !important; gap: 32px !important; }
          .hero-photo { width: 160px !important; height: 200px !important; }
          .desk-links { display: none !important; }
          .mob-ham { display: block !important; }
          .admin-sidebar { display: none !important; }
          div[style*="marginLeft: 220"] { margin-left: 0 !important; }
        }
        @media (min-width: 641px) {
          .mob-ham { display: none !important; }
        }
      `}</style>
      <Layout page={page} setPage={setPage}>
        {pages[page]}
      </Layout>
    </>
  );
}
