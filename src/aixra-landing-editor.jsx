import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// هذا الكومبوننت يُضاف داخل aixra-admin.jsx كـ tab جديد
// يسمح بتعديل محتوى صفحة الهبوط وحفظه في Firestore
// ═══════════════════════════════════════════════════════════════

const INITIAL_CONTENT = {
  hero: {
    badge: "🤖 مدعوم بـ Claude AI",
    headline: "مساعد ذكي\nيتكلّم مع عملاءك",
    subheadline: "خدمة عملاء مدعومة بالذكاء الاصطناعي — ردود دقيقة، تحليلات حقيقية، تكامل في دقائق.",
    cta1: "جرّب مجاناً",
    cta2: "شاهد العرض",
    stat1_value: "+٩٥٪", stat1_label: "دقة الردود",
    stat2_value: "١.٢ث", stat2_label: "متوسط الرد",
    stat3_value: "+٤٠٪", stat3_label: "رفع التحويلات",
  },
  features: [
    { icon: "⚡", title: "ردود فورية", desc: "يرد في أقل من ثانيتين على أي سؤال، مبني على محتوى موقعك وسياساتك." },
    { icon: "🧠", title: "يتعلم من محتواك", desc: "أضف ملفاتك وروابطك وسياساتك — يطلع بإجابات بنفس نبرة علامتك." },
    { icon: "📊", title: "تحليلات حقيقية", desc: "اعرف أكثر سؤال، وين يتسرب العميل، وكيف ترفع معدل الشراء." },
    { icon: "🎛️", title: "تحكم كامل", desc: "حدد: كيف يتكلم، متى يعتذر، متى يصعّد لموظف." },
    { icon: "🔌", title: "تكامل بسطر واحد", desc: "ضع سطر JavaScript في موقعك والمساعد يظهر خلال دقيقتين." },
    { icon: "🛡️", title: "ردود موثوقة", desc: "مربوط بمصادر حقيقية. يقول 'ما أعرف' بدل اختراع إجابة." },
  ],
  cta_section: {
    headline: "جاهز تبدأ؟",
    sub: "أطلق مساعدك الذكي اليوم — الإعداد أقل من ١٠ دقائق.",
    cta: "ابدأ تجربتك المجانية",
  },
};

function Field({ label, value, onChange, multiline = false, mono = false }) {
  const style = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
    color: "#fff", padding: "10px 14px", fontSize: mono ? 12 : 13.5,
    fontFamily: mono ? "'Space Mono', monospace" : "'Cairo', sans-serif",
    outline: "none", resize: multiline ? "vertical" : "none",
    lineHeight: 1.6, boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ color: "#555", fontSize: 11, letterSpacing: 0.8, display: "block", marginBottom: 6, textTransform: "uppercase" }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={style} />
        : <input value={value} onChange={e => onChange(e.target.value)} style={style} />
      }
    </div>
  );
}

function Section({ title, children, accent = "#6EE7B7" }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, overflow: "hidden", marginBottom: 20 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", background: "transparent", border: "none", color: "#fff",
        padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", fontSize: 14, fontWeight: 700,
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 3, height: 16, background: accent, borderRadius: 2, display: "inline-block" }} />
          {title}
        </span>
        <span style={{ color: "#444", transform: open ? "rotate(90deg)" : "rotate(0)", transition: ".2s" }}>›</span>
      </button>
      {open && <div style={{ padding: "0 24px 24px" }}>{children}</div>}
    </div>
  );
}

export default function LandingEditor() {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  const update = (section, key, value) => {
    setContent(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const updateFeature = (i, key, value) => {
    const updated = [...content.features];
    updated[i] = { ...updated[i], [key]: value };
    setContent(prev => ({ ...prev, features: updated }));
  };

  const save = async () => {
    // في التطبيق الحقيقي: await setDoc(doc(db, 'siteContent', 'landing'), content);
    console.log("Saving to Firestore:", content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: "hero", label: "🚀 Hero" },
    { id: "features", label: "✦ الميزات" },
    { id: "cta", label: "🎯 CTA" },
    { id: "code", label: "{ } كود التصدير" },
  ];

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", direction: "rtl", color: "#fff" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');*{box-sizing:border-box;}textarea,input{transition:border-color .2s;}textarea:focus,input:focus{border-color:rgba(110,231,183,0.4)!important;outline:none!important;}`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>محرر صفحة الهبوط</h2>
          <p style={{ color: "#444", fontSize: 13, marginTop: 4 }}>التغييرات تنعكس فوراً على الموقع بعد الحفظ</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="#" style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa",
            borderRadius: 10, padding: "10px 20px", fontSize: 13, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            🔗 معاينة الموقع
          </a>
          <button onClick={save} style={{
            background: saved ? "rgba(110,231,183,0.2)" : "#6EE7B7",
            color: saved ? "#6EE7B7" : "#000",
            border: saved ? "1px solid rgba(110,231,183,0.3)" : "none",
            borderRadius: 10, padding: "10px 28px", fontSize: 14, fontWeight: 800, cursor: "pointer", transition: "all .3s",
          }}>
            {saved ? "✓ تم الحفظ" : "حفظ التغييرات"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 4, width: "fit-content" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: activeTab === t.id ? "rgba(110,231,183,0.15)" : "transparent",
            border: activeTab === t.id ? "1px solid rgba(110,231,183,0.25)" : "1px solid transparent",
            color: activeTab === t.id ? "#6EE7B7" : "#555",
            borderRadius: 10, padding: "9px 18px", cursor: "pointer", fontSize: 13, fontWeight: activeTab === t.id ? 700 : 400, transition: "all .2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Hero Editor */}
      {activeTab === "hero" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <Section title="النص الرئيسي">
              <Field label="Badge Text" value={content.hero.badge} onChange={v => update("hero", "badge", v)} />
              <Field label="العنوان الرئيسي (سطر جديد = \\n)" value={content.hero.headline} onChange={v => update("hero", "headline", v)} multiline />
              <Field label="النص التوضيحي" value={content.hero.subheadline} onChange={v => update("hero", "subheadline", v)} multiline />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="زر CTA الأساسي" value={content.hero.cta1} onChange={v => update("hero", "cta1", v)} />
                <Field label="زر CTA الثانوي" value={content.hero.cta2} onChange={v => update("hero", "cta2", v)} />
              </div>
            </Section>
          </div>
          <div>
            <Section title="الأرقام الإحصائية" accent="#60A5FA">
              {[
                { vk: "stat1_value", lk: "stat1_label", label: "إحصاء ١" },
                { vk: "stat2_value", lk: "stat2_label", label: "إحصاء ٢" },
                { vk: "stat3_value", lk: "stat3_label", label: "إحصاء ٣" },
              ].map(s => (
                <div key={s.vk} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
                  <Field label={`${s.label} — القيمة`} value={content.hero[s.vk]} onChange={v => update("hero", s.vk, v)} />
                  <Field label={`${s.label} — التسمية`} value={content.hero[s.lk]} onChange={v => update("hero", s.lk, v)} />
                </div>
              ))}
            </Section>
            {/* Preview Mini */}
            <div style={{ background: "#060608", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
              <div style={{ color: "#444", fontSize: 11, marginBottom: 14, letterSpacing: 0.8 }}>LIVE PREVIEW</div>
              <div style={{ display: "inline-block", background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#6EE7B7", marginBottom: 12 }}>
                {content.hero.badge}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.2, marginBottom: 8 }}>
                {content.hero.headline.split("\\n").map((line, i) => (
                  <span key={i} style={{ display: "block", color: i === 1 ? "#6EE7B7" : "#fff" }}>{line}</span>
                ))}
              </div>
              <p style={{ color: "#555", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>{content.hero.subheadline}</p>
              <div style={{ display: "flex", gap: 24 }}>
                {[
                  [content.hero.stat1_value, content.hero.stat1_label],
                  [content.hero.stat2_value, content.hero.stat2_label],
                  [content.hero.stat3_value, content.hero.stat3_label],
                ].map(([v, l], i) => (
                  <div key={i}>
                    <div style={{ color: "#6EE7B7", fontWeight: 900, fontSize: 18 }}>{v}</div>
                    <div style={{ color: "#444", fontSize: 11 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Editor */}
      {activeTab === "features" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {content.features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
              <div style={{ color: "#444", fontSize: 11, marginBottom: 12 }}>ميزة {i + 1}</div>
              <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 12, marginBottom: 12 }}>
                <Field label="أيقونة" value={f.icon} onChange={v => updateFeature(i, "icon", v)} />
                <Field label="العنوان" value={f.title} onChange={v => updateFeature(i, "title", v)} />
              </div>
              <Field label="الوصف" value={f.desc} onChange={v => updateFeature(i, "desc", v)} multiline />
            </div>
          ))}
        </div>
      )}

      {/* CTA Editor */}
      {activeTab === "cta" && (
        <div style={{ maxWidth: 600 }}>
          <Section title="قسم Call To Action النهائي" accent="#F59E0B">
            <Field label="العنوان" value={content.cta_section.headline} onChange={v => update("cta_section", "headline", v)} />
            <Field label="النص التوضيحي" value={content.cta_section.sub} onChange={v => update("cta_section", "sub", v)} multiline />
            <Field label="نص الزر" value={content.cta_section.cta} onChange={v => update("cta_section", "cta", v)} />
          </Section>
          {/* Preview */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 32, textAlign: "center" }}>
            <div style={{ color: "#333", fontSize: 11, marginBottom: 16 }}>PREVIEW</div>
            <h3 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>{content.cta_section.headline}</h3>
            <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>{content.cta_section.sub}</p>
            <button style={{ background: "#6EE7B7", color: "#000", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
              {content.cta_section.cta} ←
            </button>
          </div>
        </div>
      )}

      {/* Code Export */}
      {activeTab === "code" && (
        <div style={{ maxWidth: 700 }}>
          <div style={{ background: "rgba(110,231,183,0.05)", border: "1px solid rgba(110,231,183,0.2)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ color: "#6EE7B7", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>✦ كيفية الربط مع Firestore</div>
            <p style={{ color: "#666", fontSize: 13, lineHeight: 1.8 }}>
              في ملف <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: 6, color: "#a78bfa" }}>aixra-landing.jsx</code>، استبدل <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: 6, color: "#a78bfa" }}>SITE_CONTENT</code> بـ:
            </p>
          </div>
          <div style={{ background: "#040408", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 14, padding: 24 }}>
            <pre style={{ color: "#a78bfa", fontSize: 12, fontFamily: "'Space Mono', monospace", lineHeight: 1.9, margin: 0, overflow: "auto" }}>
{`// في أعلى ملف Landing Page:
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// داخل المكوّن الرئيسي:
const [content, setContent] = useState(null);

useEffect(() => {
  const load = async () => {
    const snap = await getDoc(
      doc(db, "siteContent", "landing")
    );
    if (snap.exists()) setContent(snap.data());
  };
  load();
}, []);

if (!content) return <LoadingScreen />;

// في محرر Admin (هذا الملف):
const save = async () => {
  await setDoc(
    doc(db, "siteContent", "landing"),
    content
  );
};`}
            </pre>
          </div>
          <div style={{ marginTop: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
            <div style={{ color: "#555", fontSize: 12, marginBottom: 12 }}>المحتوى الحالي (JSON) — هذا ما يُحفظ في Firestore:</div>
            <pre style={{ color: "#60A5FA", fontSize: 11, fontFamily: "'Space Mono', monospace", lineHeight: 1.7, maxHeight: 300, overflow: "auto", margin: 0 }}>
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
