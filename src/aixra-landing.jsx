import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// كل هذا المحتوى يأتي من Firestore / Admin Dashboard
// في التكامل الحقيقي: استبدل SITE_CONTENT بـ fetch من Firestore
// ═══════════════════════════════════════════════════════════════
const SITE_CONTENT = {
  nav: {
    logo: "AixraAI",
    links: ["الميزات", "كيف يعمل", "الأسعار", "الأمان"],
    cta: "ابدأ مجاناً",
  },
  hero: {
    badge: "🤖 مدعوم بـ Claude AI",
    headline: "مساعد ذكي\nيتكلّم مع عملاءك",
    subheadline: "خدمة عملاء مدعومة بالذكاء الاصطناعي — ردود دقيقة، تحليلات حقيقية، تكامل في دقائق.",
    cta1: "جرّب مجاناً",
    cta2: "شاهد العرض",
    stats: [
      { value: "+٩٥٪", label: "دقة الردود" },
      { value: "١.٢ث", label: "متوسط الرد" },
      { value: "+٤٠٪", label: "رفع التحويلات" },
    ],
  },
  features: [
    { icon: "⚡", title: "ردود فورية", desc: "يرد في أقل من ثانيتين على أي سؤال، مبني على محتوى موقعك وسياساتك تحديداً." },
    { icon: "🧠", title: "يتعلم من محتواك", desc: "أضف ملفاتك وروابطك وسياساتك — يطلع بإجابات بنفس نبرة علامتك التجارية." },
    { icon: "📊", title: "تحليلات حقيقية", desc: "اعرف أكثر سؤال، وين يتسرب العميل، وكيف ترفع معدل إكمال الشراء." },
    { icon: "🎛️", title: "تحكم كامل", desc: "حدد: كيف يتكلم، متى يعتذر، متى يصعّد لموظف، وش الأشياء اللي ما يقولها." },
    { icon: "🔌", title: "تكامل بسطر واحد", desc: "ضع سطر JavaScript في موقعك والمساعد يظهر خلال دقيقتين — بدون مطوّر." },
    { icon: "🛡️", title: "ردود موثوقة", desc: "مربوط بمصادر حقيقية من محتواك. يقول 'ما أعرف' بدل اختراع إجابة خاطئة." },
  ],
  howItWorks: [
    { num: "01", title: "أضف محتواك", desc: "ارفع ملفاتك، روابط موقعك، سياساتك، أسئلة متكررة — في أي صيغة." },
    { num: "02", title: "خصّص النبرة", desc: "حدد كيف يتكلم مساعدك، ما يقوله، ومتى يحوّل لموظف بشري." },
    { num: "03", title: "أطلق في دقيقتين", desc: "انسخ سطر كود واحد، ضعه في موقعك، والمساعد حاضر للعمل فوراً." },
  ],
  plans: [
    {
      id: "starter",
      name: "Starter",
      price: "٩٩",
      period: "شهرياً",
      desc: "للمشاريع الصغيرة والمتاجر الناشئة",
      color: "#6EE7B7",
      features: ["١٠٠٠ رسالة/شهر", "إعداد مبدئي وضبط النبرة", "واجهة عربية كاملة", "تقارير مبسّطة", "دعم عبر واتساب"],
      cta: "ابدأ الآن",
      popular: false,
    },
    {
      id: "business",
      name: "Business",
      price: "٢٩٩",
      period: "شهرياً",
      desc: "للشركات التي تريد نتائج قابلة للقياس",
      color: "#60A5FA",
      features: ["٥٠٠٠ رسالة/شهر", "كل ميزات Starter", "تحليلات متقدمة", "تحسينات دورية للسيناريوهات", "تصعيد ذكي للموظفين", "تكاملات أساسية"],
      cta: "الأكثر قيمة",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "حسب الطلب",
      period: "",
      desc: "للمؤسسات والعمليات الكبيرة",
      color: "#F59E0B",
      features: ["رسائل غير محدودة", "تكاملات متقدمة وصلاحيات", "سياسات بيانات وامتثال", "سيناريوهات متعددة", "SLA ودعم مخصص", "إعدادات أمنية عالية"],
      cta: "تواصل معنا",
      popular: false,
    },
  ],
  testimonials: [
    { name: "أحمد الشمري", role: "مدير متجر إلكتروني", text: "انخفض حجم الاستفسارات المتكررة بأكثر من ٦٠٪ بعد شهر واحد فقط.", avatar: "AS" },
    { name: "نورة العتيبي", role: "مديرة أكاديمية تعليمية", text: "الطلاب يحصلون على إجابات فورية حتى في منتصف الليل — مذهل.", avatar: "NA" },
    { name: "فيصل الدوسري", role: "مؤسس شركة تقنية", text: "أفضل استثمار في خدمة العملاء. العائد واضح من الأسبوع الأول.", avatar: "FD" },
  ],
  cta_section: {
    headline: "جاهز تبدأ؟",
    sub: "أطلق مساعدك الذكي اليوم — الإعداد أقل من ١٠ دقائق.",
    cta: "ابدأ تجربتك المجانية",
  },
  footer: {
    tagline: "خدمة عملاء بالذكاء الاصطناعي — للأعمال العربية.",
    links: ["الميزات", "الأسعار", "سياسة الخصوصية", "تواصل معنا"],
    social: { twitter: "#", linkedin: "#", whatsapp: "#" },
  },
};

// ─── Animated Counter ────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = parseFloat(target.replace(/[^\d.]/g, ""));
    if (isNaN(num)) { setCount(target); return; }
    let start = 0;
    const step = num / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

// ─── Particle BG ─────────────────────────────────────────────
function ParticleField() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    dur: Math.random() * 8 + 6,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: "rgba(110,231,183,0.6)",
          animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
        }} />
      ))}
      <style>{`@keyframes float{from{transform:translate(0,0)opacity:.3}to{transform:translate(${Math.random()>0.5?'+':'-'}20px,-30px);opacity:.8}}`}</style>
    </div>
  );
}

// ─── Live Chat Demo ───────────────────────────────────────────
function LiveDemo() {
  const demos = [
    { u: "ما طرق الدفع المتاحة؟", b: "نقبل: مدى، فيزا، ماستركارد، وتحويل بنكي. كلها آمنة ومشفّرة ✓" },
    { u: "متى يوصل طلبي؟", b: "الطلبات داخل الرياض تصل خلال ٢٤ ساعة، وباقي المناطق ٢-٣ أيام عمل 📦" },
    { u: "كيف أرجع منتج؟", b: "سياسة الإرجاع ١٤ يوم من الاستلام. اضغط 'طلب إرجاع' من حسابك وسنتواصل معك خلال ساعة ✦" },
  ];
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("user");
  const [shown, setShown] = useState([]);

  useEffect(() => {
    if (step >= demos.length) return;
    const cur = demos[step];
    if (phase === "user") {
      const t = setTimeout(() => { setShown(p => [...p, { role: "user", text: cur.u }]); setPhase("typing"); }, 800);
      return () => clearTimeout(t);
    }
    if (phase === "typing") {
      const t = setTimeout(() => { setShown(p => [...p, { role: "bot", text: cur.b }]); setPhase("next"); }, 1400);
      return () => clearTimeout(t);
    }
    if (phase === "next") {
      const t = setTimeout(() => { setStep(s => s + 1); setPhase("user"); }, 2200);
      return () => clearTimeout(t);
    }
  }, [step, phase]);

  return (
    <div style={{
      background: "#0A0A0F", border: "1px solid rgba(110,231,183,0.2)",
      borderRadius: 20, overflow: "hidden", width: "100%", maxWidth: 360,
      boxShadow: "0 0 60px rgba(110,231,183,0.08)",
    }}>
      <div style={{ background: "rgba(110,231,183,0.08)", padding: "14px 18px", borderBottom: "1px solid rgba(110,231,183,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#6EE7B7,#3B82F6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#000" }}>A</div>
        <div>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>مساعد المتجر</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 5, height: 5, background: "#6EE7B7", borderRadius: "50%", boxShadow: "0 0 4px #6EE7B7" }} />
            <span style={{ color: "#6EE7B7", fontSize: 10 }}>نشط الآن</span>
          </div>
        </div>
      </div>
      <div style={{ padding: 16, minHeight: 200, display: "flex", flexDirection: "column", gap: 10 }}>
        {shown.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end", animation: "msgIn 0.3s ease" }}>
            <div style={{
              maxWidth: "82%", background: m.role === "user" ? "rgba(255,255,255,0.06)" : "rgba(110,231,183,0.1)",
              border: `1px solid ${m.role === "bot" ? "rgba(110,231,183,0.25)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: m.role === "user" ? "14px 14px 14px 4px" : "14px 4px 14px 14px",
              padding: "9px 13px", color: "#fff", fontSize: 12.5, lineHeight: 1.6,
              fontFamily: "'Cairo', sans-serif",
            }}>{m.text}</div>
          </div>
        ))}
        {phase === "typing" && step < demos.length && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.25)", borderRadius: "14px 4px 14px 14px", padding: "8px 14px", display: "flex", gap: 4, alignItems: "center" }}>
              {[0,1,2].map(i => <div key={i} style={{ width:5,height:5,borderRadius:"50%",background:"#6EE7B7",animation:`bounce 1s ${i*.2}s infinite` }} />)}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────
export default function LandingPage() {
  const c = SITE_CONTENT;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#06060A", color: "#fff", fontFamily: "'Cairo', sans-serif", direction: "rtl", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=Tajawal:wght@300;400;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:4px;}
        a{text-decoration:none;color:inherit;}
        .hover-lift{transition:transform .2s,box-shadow .2s;}
        .hover-lift:hover{transform:translateY(-4px);}
        .fade-in{animation:fadeUp .7s ease both;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        .glow-btn{transition:all .2s;}
        .glow-btn:hover{box-shadow:0 0 28px rgba(110,231,183,0.5)!important;transform:translateY(-2px);}
        .plan-card{transition:all .25s;}
        .plan-card:hover{transform:translateY(-6px);}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes grid-shift{0%{background-position:0 0}100%{background-position:50px 50px}}
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px", height: 68,
        background: scrolled ? "rgba(6,6,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#6EE7B7,#3B82F6)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: 15 }}>A</div>
          <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: -0.5 }}>{c.nav.logo}</span>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 14, color: "#888" }}>
          {c.nav.links.map(l => (
            <a key={l} href={`#${l}`} style={{ color: "#888", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color="#fff"} onMouseLeave={e => e.target.style.color="#888"}>{l}</a>
          ))}
        </div>
        <button className="glow-btn" style={{
          background: "#6EE7B7", color: "#000", border: "none", borderRadius: 12,
          padding: "10px 24px", fontSize: 14, fontWeight: 800, cursor: "pointer",
        }}>{c.nav.cta} ←</button>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", padding: "120px 80px 80px", overflow: "hidden" }}>
        {/* Grid BG */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(110,231,183,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,183,0.04) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          animation: "grid-shift 20s linear infinite",
        }} />
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "10%", left: "60%", width: 600, height: 600, background: "radial-gradient(ellipse,rgba(59,130,246,0.12),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", left: "50%", width: 400, height: 400, background: "radial-gradient(ellipse,rgba(110,231,183,0.08),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <ParticleField />

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          {/* Text */}
          <div>
            <div className="fade-in" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)", borderRadius: 30, padding: "6px 16px", fontSize: 12, color: "#6EE7B7", marginBottom: 28 }}>
              <span style={{ animation: "spin 4s linear infinite", display: "inline-block" }}>✦</span>
              {c.hero.badge}
            </div>
            <h1 className="fade-in" style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: -1, animationDelay: ".1s" }}>
              {c.hero.headline.split("\n").map((line, i) => (
                <span key={i} style={{ display: "block", color: i === 1 ? "transparent" : "#fff", backgroundImage: i === 1 ? "linear-gradient(135deg,#6EE7B7,#60A5FA)" : "none", WebkitBackgroundClip: i === 1 ? "text" : "none", backgroundClip: i === 1 ? "text" : "none" }}>{line}</span>
              ))}
            </h1>
            <p className="fade-in" style={{ fontSize: 17, color: "#666", lineHeight: 1.8, marginBottom: 40, maxWidth: 480, animationDelay: ".2s" }}>
              {c.hero.subheadline}
            </p>
            <div className="fade-in" style={{ display: "flex", gap: 14, marginBottom: 56, animationDelay: ".3s" }}>
              <button className="glow-btn" style={{ background: "#6EE7B7", color: "#000", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                {c.hero.cta1} ←
              </button>
              <button style={{ background: "transparent", color: "#aaa", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 28px", fontSize: 15, cursor: "pointer", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.3)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.12)"; e.currentTarget.style.color = "#aaa"; }}>
                ▶ {c.hero.cta2}
              </button>
            </div>
            {/* Stats */}
            <div className="fade-in" style={{ display: "flex", gap: 36, animationDelay: ".4s" }}>
              {c.hero.stats.map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#6EE7B7", fontFamily: "'Tajawal', sans-serif" }}>{s.value}</div>
                  <div style={{ color: "#444", fontSize: 12, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Widget */}
          <div style={{ display: "flex", justifyContent: "center", animation: "fadeUp .9s .3s ease both" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -20, background: "radial-gradient(ellipse,rgba(110,231,183,0.15),transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
              <LiveDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="الميزات" style={{ padding: "120px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ display: "inline-block", background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)", borderRadius: 30, padding: "5px 16px", fontSize: 12, color: "#6EE7B7", marginBottom: 18 }}>الميزات</div>
            <h2 style={{ fontSize: 44, fontWeight: 900, marginBottom: 16 }}>لماذا AixraAI<br /><span style={{ color: "#6EE7B7" }}>وليس مجرد بوت؟</span></h2>
            <p style={{ color: "#555", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>لأنه يجمع المحادثة + المعرفة + القياس في منتج واحد متكامل.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {c.features.map((f, i) => (
              <div key={i} className="hover-lift" style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20, padding: 28, cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(110,231,183,0.25)"; e.currentTarget.style.background = "rgba(110,231,183,0.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#fff" }}>{f.title}</h3>
                <p style={{ color: "#555", fontSize: 13.5, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="كيف يعمل" style={{ padding: "120px 80px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 30, padding: "5px 16px", fontSize: 12, color: "#60A5FA", marginBottom: 18 }}>كيف يعمل</div>
          <h2 style={{ fontSize: 44, fontWeight: 900, marginBottom: 64 }}>من الصفر إلى<br /><span style={{ color: "#60A5FA" }}>مساعد جاهز</span> في ٣ خطوات</h2>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative" }}>
            <div style={{ position: "absolute", top: 36, right: "16.5%", left: "16.5%", height: 1, background: "linear-gradient(90deg,rgba(96,165,250,0.4),rgba(110,231,183,0.4))", zIndex: 0 }} />
            {c.howItWorks.map((step, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: `linear-gradient(135deg, rgba(96,165,250,0.2), rgba(110,231,183,0.2))`,
                  border: "2px solid rgba(110,231,183,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
                  fontSize: 20, fontWeight: 900, color: "#6EE7B7",
                  fontFamily: "'Tajawal', sans-serif",
                }}>{step.num}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ color: "#555", fontSize: 13.5, lineHeight: 1.7, maxWidth: 200 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="الأسعار" style={{ padding: "120px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ display: "inline-block", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 30, padding: "5px 16px", fontSize: 12, color: "#F59E0B", marginBottom: 18 }}>الأسعار</div>
            <h2 style={{ fontSize: 44, fontWeight: 900 }}>باقات واضحة<br /><span style={{ color: "#F59E0B" }}>بدون مفاجآت</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "start" }}>
            {c.plans.map(plan => (
              <div key={plan.id} className="plan-card" style={{
                background: plan.popular ? `linear-gradient(160deg, ${plan.color}12, rgba(0,0,0,0))` : "rgba(255,255,255,0.02)",
                border: plan.popular ? `2px solid ${plan.color}44` : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 24, padding: 32, position: "relative",
                transform: plan.popular ? "scale(1.04)" : "scale(1)",
              }}>
                {plan.popular && (
                  <div style={{ position: "absolute", top: -14, right: "50%", transform: "translateX(50%)", background: plan.color, color: "#000", borderRadius: 20, padding: "4px 18px", fontSize: 12, fontWeight: 800 }}>الأكثر طلباً ✦</div>
                )}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ color: plan.color, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                  <div>
                    {plan.id !== "enterprise"
                      ? <><span style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{plan.price}</span><span style={{ color: "#555", fontSize: 14 }}> ر.س / {plan.period}</span></>
                      : <span style={{ fontSize: 28, fontWeight: 900 }}>{plan.price}</span>
                    }
                  </div>
                  <p style={{ color: "#555", fontSize: 13, marginTop: 8 }}>{plan.desc}</p>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, marginBottom: 28 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ color: plan.color, fontSize: 14 }}>✓</span>
                      <span style={{ color: "#aaa", fontSize: 13.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button style={{
                  width: "100%", background: plan.popular ? plan.color : "transparent",
                  color: plan.popular ? "#000" : plan.color,
                  border: plan.popular ? "none" : `1px solid ${plan.color}55`,
                  borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 800, cursor: "pointer",
                  transition: "all .2s",
                }}
                  onMouseEnter={e => { if (!plan.popular) { e.currentTarget.style.background = `${plan.color}15`; } }}
                  onMouseLeave={e => { if (!plan.popular) { e.currentTarget.style.background = "transparent"; } }}>
                  {plan.cta} ←
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{ padding: "100px 80px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, textAlign: "center", marginBottom: 60 }}>
            ماذا يقول <span style={{ color: "#6EE7B7" }}>عملاؤنا</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {c.testimonials.map((t, i) => (
              <div key={i} className="hover-lift" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28 }}>
                <div style={{ fontSize: 28, color: "#6EE7B7", marginBottom: 16 }}>"</div>
                <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,#6EE7B7,#3B82F6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#000" }}>{t.avatar}</div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ color: "#444", fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────── */}
      <section style={{ padding: "120px 80px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", inset: -80, background: "radial-gradient(ellipse,rgba(110,231,183,0.08),transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.2, marginBottom: 20 }}>
              {c.cta_section.headline.split("؟")[0]}؟<br />
              <span style={{ color: "#6EE7B7" }}>الإعداد ١٠ دقائق</span>
            </h2>
            <p style={{ color: "#555", fontSize: 16, marginBottom: 40 }}>{c.cta_section.sub}</p>
            <button className="glow-btn" style={{ background: "#6EE7B7", color: "#000", border: "none", borderRadius: 16, padding: "16px 44px", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>
              {c.cta_section.cta} ←
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer id="الأمان" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#6EE7B7,#3B82F6)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: 12 }}>A</div>
              <span style={{ fontWeight: 800, fontSize: 15 }}>AixraAI</span>
            </div>
            <p style={{ color: "#333", fontSize: 13 }}>{c.footer.tagline}</p>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {c.footer.links.map(l => <a key={l} href="#" style={{ color: "#444", fontSize: 13, transition: "color .2s" }} onMouseEnter={e => e.target.style.color="#fff"} onMouseLeave={e => e.target.style.color="#444"}>{l}</a>)}
          </div>
          <div style={{ color: "#333", fontSize: 12 }}>© 2026 AixraAI — <span style={{ color: "#444" }}>جميع الحقوق محفوظة</span></div>
        </div>
      </footer>
    </div>
  );
}
