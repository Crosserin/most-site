import { useState, useEffect, useCallback } from "react";
import { Phone, Menu, X, CheckCircle, Home, Archive, RefreshCw, Users, Star, ChevronDown, LogIn, LogOut, Settings } from "lucide-react";
// Replit auth removed for Cloudflare deployment — stub useAuth to always logged-out
const useAuth = () => ({
  isAuthenticated: false,
  isOwner: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  user: null as any,
});

const PHONE = "5038662352";
const PHONE_DISPLAY = "(503) 866-2352";
const PHONE_HREF = `tel:${PHONE}`;

function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    window.addEventListener("most-navigate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("most-navigate", onPop);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
    const full = `${base}${to.startsWith("/") ? to : `/${to}`}`;
    window.history.pushState({}, "", full);
    window.dispatchEvent(new Event("most-navigate"));
  }, []);

  return { path, navigate };
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isOwner, isLoading, login, logout, user } = useAuth();
  const { navigate } = useRoute();

  const links = [
    { label: "Services", href: "#services" },
    { label: "About Meg", href: "#about" },
    { label: "How It Works", href: "#process" },
    { label: "Tips & Blog", href: "#blog" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  const scroll = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a
          href="#"
          className="flex flex-col leading-tight"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        >
          <span className="text-xl font-bold tracking-wider text-primary" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            M.O.S.T.
          </span>
          <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-medium">
            Meg's Organization Situation Transition
          </span>
        </a>

        <div className="flex items-center gap-3">
          <a
            href={PHONE_HREF}
            className="hidden sm:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Phone className="w-3.5 h-3.5" />
            {PHONE_DISPLAY}
          </a>
          {!isLoading && (
            isAuthenticated ? (
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-border hover:bg-muted transition-colors text-foreground"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out
              </button>
            ) : (
              <button
                onClick={login}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-border hover:bg-muted transition-colors text-foreground"
              >
                <LogIn className="w-3.5 h-3.5" />
                Log in
              </button>
            )
          )}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-sm font-medium hidden sm:block">Menu</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="bg-white border-t border-border shadow-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 grid sm:grid-cols-2 gap-1">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => scroll(l.href)}
                className="text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
              >
                {l.label}
              </button>
            ))}
            {!isLoading && isOwner && (
              <button
                onClick={() => { setOpen(false); navigate("/admin"); }}
                className="text-left px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-accent transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Blog Admin
              </button>
            )}
          </div>
          <div className="border-t border-border px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <a
              href={PHONE_HREF}
              className="sm:hidden flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full text-sm font-semibold justify-center"
            >
              <Phone className="w-4 h-4" />
              {PHONE_DISPLAY}
            </a>
            {!isLoading && (
              isAuthenticated ? (
                <button
                  onClick={logout}
                  className="sm:hidden flex items-center gap-2 justify-center px-4 py-3 rounded-full text-sm font-semibold border border-border hover:bg-muted transition-colors text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  {user?.firstName ? `Log out (${user.firstName})` : "Log out"}
                </button>
              ) : (
                <button
                  onClick={login}
                  className="sm:hidden flex items-center gap-2 justify-center px-4 py-3 rounded-full text-sm font-semibold border border-border hover:bg-muted transition-colors text-foreground"
                >
                  <LogIn className="w-4 h-4" />
                  Log in
                </button>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const scroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen pt-16 flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <img src="/hero-organize.jpg" alt="Organized home" className="w-full h-full object-cover" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full py-24">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-white/20">
            Professional Organizing Services
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Transform Your
            <span className="text-[#5A9681] block">Space & Life</span>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-md">
            Whether you're moving, downsizing, or simply reclaiming your home — Meg brings calm, clarity, and a system that actually works for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={PHONE_HREF}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-opacity shadow-md"
            >
              <Phone className="w-4 h-4" />
              Call {PHONE_DISPLAY}
            </a>
            <button
              onClick={() => scroll("#services")}
              className="flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-3.5 rounded-full font-semibold text-base hover:bg-white/25 transition-colors"
            >
              See Services
            </button>
          </div>

          <div className="flex items-center gap-8 mt-12">
            {[["100+", "Homes Organized"], ["5★", "Avg. Rating"], ["Free", "Consultation"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{val}</div>
                <div className="text-xs text-white/60 font-medium mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => scroll("#services")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
}

function Services() {
  const services = [
    {
      icon: <Home className="w-7 h-7" />,
      title: "Home Organization",
      description: "Kitchens, closets, garages, offices — every space gets a functional, beautiful system tailored to how you actually live.",
      features: ["Custom storage solutions", "Declutter & categorize", "Label & maintain systems"],
    },
    {
      icon: <Archive className="w-7 h-7" />,
      title: "Move & Transition Support",
      description: "Moving is stressful. Let Meg handle the sorting, packing strategy, and setup so you feel at home from day one.",
      features: ["Pre-move sorting", "Packing strategy", "Unpacking & setup"],
    },
    {
      icon: <RefreshCw className="w-7 h-7" />,
      title: "Downsizing & Estate Help",
      description: "Compassionate, practical support for life's big transitions — whether downsizing, inheriting a home, or preparing an estate.",
      features: ["Thoughtful decision support", "Donation coordination", "Room-by-room guidance"],
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Ongoing Maintenance",
      description: "Stay organized long-term with regular sessions that keep your systems fresh and working as your life evolves.",
      features: ["Monthly or seasonal visits", "System refreshes", "Seasonal swaps"],
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">What I Offer</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Services Built Around Your Life
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Every home, every situation is different. Meg meets you where you are and creates solutions that last.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div key={s.title} className="group bg-background rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {s.icon}
              </div>
              <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.description}</p>
              <ul className="space-y-1.5">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-foreground/70">
                    <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-[hsl(36,33%,97%)] to-[hsl(158,40%,95%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-14 items-center">
        <div className="relative flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72 rounded-full bg-primary/10" />
          </div>
          <div className="relative w-64 h-80 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src="/founder.jpeg"
              alt="Meg, founder of M.O.S.T."
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 10%" }}
            />
          </div>
          <div className="absolute top-4 -left-4 bg-white rounded-2xl shadow-md px-4 py-3 border border-border max-w-40">
            <p className="text-xs font-bold text-primary mb-1">M.O.S.T.</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Meg's Organization Situation Transition</p>
          </div>
        </div>

        <div>
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Meet Meg</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Your Partner in Creating a Home You Love
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Hi, I'm Meg! I founded M.O.S.T. with a simple belief: a well-organized space creates a well-organized mind. I've helped hundreds of families find clarity and peace in their homes — and I'd love to do the same for you.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Whether you're overwhelmed by clutter, facing a big move, or going through a life transition, I bring empathy, expertise, and a no-judgment approach to every home I step into.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {["Clutter-Free Homes", "Stress-Free Moves", "Compassionate Approach", "Judgment-Free Zone"].map((tag) => (
              <span key={tag} className="bg-accent text-accent-foreground text-xs font-medium px-3 py-1.5 rounded-full border border-accent-border">
                {tag}
              </span>
            ))}
          </div>
          <a href={PHONE_HREF} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
            <Phone className="w-4 h-4" />
            Call Meg: {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { num: "01", title: "Free Consultation", desc: "We chat about your space, your goals, and what's been holding you back. No pressure, just conversation." },
    { num: "02", title: "Custom Plan", desc: "Meg creates a tailored organizing plan that fits your lifestyle, timeline, and budget." },
    { num: "03", title: "Transform Together", desc: "Side-by-side, we work through your space systematically — keeping what serves you, releasing what doesn't." },
    { num: "04", title: "Lasting Systems", desc: "You leave with intuitive systems and the confidence to maintain them long after Meg is gone." },
  ];

  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">The Process</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            How It Works
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Simple, clear, and designed to get you results — without the overwhelm.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-1rem)] w-8 h-px bg-primary/30 z-10" />
              )}
              <div className="text-5xl font-black text-primary/10 leading-none mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {s.num}
              </div>
              <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FALLBACK_POSTS = [
  {
    id: -1,
    category: "Decluttering",
    title: "The 15-Minute Rule: How to Start When You're Overwhelmed",
    excerpt: "When your home feels like too much to tackle, the secret isn't a big plan — it's giving yourself permission to start small. Here's the technique that works.",
    imageUrl: null as string | null,
    createdAt: "",
  },
  {
    id: -2,
    category: "Moving Tips",
    title: "Pack Like a Pro: The Room-by-Room Strategy That Saves Hours",
    excerpt: "Most people pack all wrong. A simple category-first, room-second approach can cut your unpacking time in half and make your new home feel settled in days, not weeks.",
    imageUrl: null as string | null,
    createdAt: "",
  },
  {
    id: -3,
    category: "Organizing",
    title: "Why Your Closet System Fails (And What Actually Works)",
    excerpt: "Beautiful organizer bins from the store look great on Instagram. But most don't account for real life. Meg breaks down the systems that stick — and why.",
    imageUrl: null as string | null,
    createdAt: "",
  },
];

function categoryFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("pack") || t.includes("mov")) return "Moving Tips";
  if (t.includes("closet") || t.includes("kitchen") || t.includes("organiz")) return "Organizing";
  return "Decluttering";
}

function categoryEmoji(cat: string): string {
  if (cat === "Moving Tips") return "📦";
  if (cat === "Organizing") return "✨";
  return "🗂️";
}

interface DbPost {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  createdAt: string;
}

function Blog() {
  const [dbPosts, setDbPosts] = useState<DbPost[] | null>(null);

  useEffect(() => {
    fetch("/api/blog-posts", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setDbPosts(data.posts ?? []))
      .catch(() => setDbPosts([]));
  }, []);

  const hasPosts = dbPosts !== null && dbPosts.length > 0;
  const displayPosts = hasPosts
    ? dbPosts.slice(0, 3).map((p) => ({
        id: p.id,
        category: categoryFromTitle(p.title),
        title: p.title,
        excerpt: p.excerpt,
        imageUrl: p.imageUrl,
        createdAt: p.createdAt,
      }))
    : FALLBACK_POSTS;

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Tips & Ideas</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            From Meg's Blog
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Practical advice, real talk, and organizing ideas you can use today — no Pinterest-perfect home required.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {displayPosts.map((post) => (
            <article key={post.id} className="group bg-background rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col">
              <div className="h-40 overflow-hidden">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent to-[hsl(158,40%,90%)] flex items-center justify-center">
                    <span className="text-4xl">{categoryEmoji(post.category)}</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">{post.category}</span>
                  {post.createdAt && (
                    <>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="font-bold text-base leading-snug mb-3 group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote: "Meg transformed our chaotic garage into something we actually love walking into. She's patient, professional, and incredibly intuitive about what works for real life.",
      name: "Sarah M.",
    },
    {
      quote: "After my mother passed, I was completely overwhelmed by her home. Meg handled everything with such grace and compassion. I couldn't have done it without her.",
      name: "David R.",
    },
    {
      quote: "Moving across town felt impossible until Meg stepped in. She organized our entire home in two days and set up systems I still use every day.",
      name: "Jennifer K.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-primary/5 to-accent/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Kind Words</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            What Clients Say
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed italic flex-1 mb-5">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("https://formspree.io/f/xykbzdve", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Something went wrong. Please try calling directly at (503) 866-2352.");
      }
    } catch {
      setError("Something went wrong. Please try calling directly at (503) 866-2352.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Ready to Get Organized?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Your first consultation is completely free. Reach out and let's talk about how M.O.S.T. can bring calm and order to your space.
          </p>
          <div className="space-y-4">
            <a href={PHONE_HREF} className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Call or Text</p>
                <p className="font-semibold text-foreground">{PHONE_DISPLAY}</p>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Service Area</p>
                <p className="font-semibold text-foreground">In-Home Service Available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Message Sent!</h3>
              <p className="text-muted-foreground text-sm">Thanks! Meg will be in touch within 24 hours. You can also reach her directly at {PHONE_DISPLAY}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Send a Message</h3>
              <p className="text-xs text-muted-foreground mb-4">Free consultation — no obligation.</p>
              {[
                { label: "Your Name", key: "name", type: "text", placeholder: "Jane Smith" },
                { label: "Email Address", key: "email", type: "email", placeholder: "jane@email.com" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "(503) 000-0000" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wide">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.key !== "phone"}
                    value={(formData as any)[field.key]}
                    onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wide">How Can Meg Help?</label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your space, your situation, and what you're hoping to achieve..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Request Free Consultation"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background/80 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-background" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>M.O.S.T.</p>
          <p className="text-xs text-background/50 mt-0.5">Meg's Organization Situation Transition</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-primary" />
          <a href={PHONE_HREF} className="hover:text-background transition-colors">{PHONE_DISPLAY}</a>
        </div>
        <p className="text-xs text-background/40">© {new Date().getFullYear()} M.O.S.T.</p>
      </div>
    </footer>
  );
}

function MainPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Process />
      <Blog />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default function App() {
  // Admin panel removed in Cloudflare build — marketing site only
  return <MainPage />;
}
