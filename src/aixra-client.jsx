import { useState, useEffect, useRef } from "react";

const CLIENT_DATA = {
  name: "متجر الأناقة",
  domain: "anaka.sa",
  plan: "business",
  sk: "sk-aixra-7f3a9b2c1d4e5f6a",
  status: "active",
  renewal: "2026-03-15",
  industry: "تجزئة",
  usage: 3241,
  limit: 5000,
  conversations: 847,
  satisfaction: 94,
  avgResponse: "1.2 ث",
  topQuestions: [
    { q: "ما هي طرق الدفع المتاحة؟", count: 142 },
    { q: "هل التوصيل مجاني؟", count: 118 },
    { q: "كيف أتابع طلبي؟", count: 97 },
    { q: "ما سياسة الإرجاع؟", count: 84 },
    { q: "استفسار عن توفر المنتج", count: 71 },
  ],
  dailyUsage: [120, 210, 180, 340, 290, 410, 380, 320, 440, 390, 280, 350, 420, 380],
  recentSessions: [
    { id: "s1", time: "منذ 3 دقائق", turns: 4, resolved: true, duration: "1:24" },
    { id: "s2", time: "منذ 18 دقيقة", turns: 7, resolved: true, duration: "3:12" },
    { id: "s3", time: "منذ 35 دقيقة", turns: 2, resolved: false, duration: "0:45" },
    { id: "s4", time: "منذ 1 ساعة", turns: 5, resolved: true, duration: "2:08" },
    { id: "s5", time: "منذ 2 ساعة", turns: 9, resolved: true, duration: "4:51" },
  ],
};

const PLAN_META = {
  starter: { name: "Starter", color: "#6EE7B7", price: "٩٩ ر.س/شهر", limit: 1000 },
  business: { name: "Business", color: "#60A5FA", price: "٢٩٩ ر.س/شهر", limit: 5000 },
  enterprise: { name: "Enterprise", color: "#F59E0B", price: "مخصص", limit: Infinity },
};

function MiniChart({ data, color, height = 60 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const normalize = v => height - ((v - min) / (max - min || 1)) * (height - 8);
  const w = 100 / (data.length - 1);
  const points = data.map((v, i) => `${i * w},${normalize(v)}`).join(" ");
  const area = `0,${height} ${points} ${(data.length - 1) * w},${height}`;
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      <defs>
        <linearGradient id="grad-chart" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#grad-chart)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function RingProgress({ value, max, color, size = 80 }) {
  const pct = max === Infinity ? 0.3 : Math.min(value / max, 1);
  const r = 32;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 40 40)" />
      <text x="40" y="44" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="monospace">
        {max === Infinity ? "∞" : `${Math.round(pct * 100)}%`}
      </text>
    </svg>
  );
}

function LiveChat({ plan }) {
  const [msgs, setMsgs] = useState([{ role: "bot", text: "مرحباً! كيف أقدر أساعدك اليوم؟" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMsgs(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `أنت مساعد ذكي لـ "${CLIENT_DATA.name}" في مجال "${CLIENT_DATA.industry}". ردودك باللغة العربية، موجزة ومفيدة.`,
          messages: [
            ...msgs.filter(m => m.role !== "system").map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })),
            { role: "user", content: userMsg },
          ],
        }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { role: "bot", text: data.content?.[0]?.text || "عذراً، حدث خطأ." }]);
    } catch {
      setMsgs(prev => [...prev, { role: "bot", text: "تعذّر الاتصال. الرجاء المحاولة لاحقاً." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", height: 420 }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6EE7B7", boxShadow: "0 0 6px #6EE7B7" }} />
        <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>اختبر المساعد الآن</span>
        <span style={{ color: "#444", fontSize: 12, marginRight: "auto" }}>مدعوم بـ Claude AI</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end" }}>
            <div style={{
              maxWidth: "80%", background: m.role === "user" ? "rgba(255,255,255,0.06)" : `rgba(96,165,250,0.12)`,
              borderRadius: 14, padding: "10px 14px", color: m.role === "user" ? "#ccc" : "#fff",
              fontSize: 13, lineHeight: 1.6, border: m.role === "bot" ? `1px solid ${plan.color}33` : "none",
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: "rgba(96,165,250,0.1)", borderRadius: 14, padding: "10px 16px", border: `1px solid ${plan.color}33` }}>
              <span style={{ color: plan.color, letterSpacing: 4 }}>···</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="اكتب سؤالك..."
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", padding: "10px 14px", fontSize: 13, outline: "none" }} />
        <button onClick={send} disabled={loading} style={{ background: plan.color, color: "#000", border: "none", borderRadius: 10, width: 42, cursor: "pointer", fontSize: 18, fontWeight: 800, opacity: loading ? 0.5 : 1 }}>›</button>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("overview");
  const plan = PLAN_META[CLIENT_DATA.plan];
  const usagePct = Math.round((CLIENT_DATA.usage / CLIENT_DATA.limit) * 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(CLIENT_DATA.renewal) - new Date()) / (1000 * 60 * 60 * 24)));
  const embedCode = `<script src="https://cdn.aixraai.com/widget.js"\n  data-sk="${CLIENT_DATA.sk}"\n  data-lang="ar"\n  data-theme="auto">\n</script>`;

  const copy = (text) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ minHeight: "100vh", background: "#07070A", color: "#fff", fontFamily: "'Cairo', sans-serif", direction: "rtl" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:4px;}input::placeholder{color:#444;}input:focus{outline:none;}`}</style>

      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,7,10,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${plan.color}, #3B82F6)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#000" }}>A</div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>AixraAI</span>
          <span style={{ color: "#333", fontSize: 14 }}>|</span>
          <span style={{ color: "#666", fontSize: 14 }}>{CLIENT_DATA.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ background: `${plan.color}22`, color: plan.color, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, border: `1px solid ${plan.color}44` }}>✦ {plan.name}</span>
          <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.05)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>مرحباً، <span style={{ color: plan.color }}>{CLIENT_DATA.name}</span> 👋</h1>
            <p style={{ color: "#555", fontSize: 14 }}>تجديد الاشتراك خلال <span style={{ color: daysLeft < 7 ? "#EF4444" : "#6EE7B7", fontWeight: 700 }}>{daysLeft} يوم</span> · {CLIENT_DATA.renewal}</p>
          </div>
          <button style={{ background: plan.color, color: "#000", border: "none", borderRadius: 12, padding: "12px 24px", cursor: "pointer", fontSize: 14, fontWeight: 800 }}>ترقية الباقة ↑</button>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 4, width: "fit-content" }}>
          {[{ id: "overview", label: "نظرة عامة" }, { id: "integration", label: "التكامل" }, { id: "chat", label: "اختبار المساعد" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? plan.color : "transparent", color: tab === t.id ? "#000" : "#555", border: "none", borderRadius: 10, padding: "9px 20px", cursor: "pointer", fontSize: 14, fontWeight: tab === t.id ? 700 : 400, transition: "all 0.2s" }}>{t.label}</button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "المحادثات", value: CLIENT_DATA.conversations.toLocaleString("ar"), icon: "💬", color: plan.color },
                { label: "الرضا", value: `${CLIENT_DATA.satisfaction}%`, icon: "⭐", color: "#F59E0B" },
                { label: "متوسط الرد", value: CLIENT_DATA.avgResponse, icon: "⚡", color: "#a78bfa" },
                { label: "الرسائل المستخدمة", value: CLIENT_DATA.usage.toLocaleString("ar"), icon: "📨", color: "#6EE7B7" },
              ].map(k => (
                <div key={k.label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "22px 24px" }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{k.icon}</div>
                  <div style={{ color: k.color, fontSize: 28, fontWeight: 800, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>{k.value}</div>
                  <div style={{ color: "#444", fontSize: 12, marginTop: 6 }}>{k.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 28 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <div style={{ color: "#666", fontSize: 13, alignSelf: "flex-start" }}>استهلاك الباقة</div>
                <RingProgress value={CLIENT_DATA.usage} max={CLIENT_DATA.limit} color={plan.color} size={100} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, fontFamily: "'Space Mono', monospace" }}>
                    {CLIENT_DATA.usage.toLocaleString("ar")}<span style={{ color: "#444", fontSize: 13 }}> / {CLIENT_DATA.limit.toLocaleString("ar")}</span>
                  </div>
                  <div style={{ color: "#444", fontSize: 12, marginTop: 4 }}>رسالة هذا الشهر</div>
                </div>
                {usagePct > 60 && (
                  <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: "10px 14px", textAlign: "center", color: "#F59E0B", fontSize: 12 }}>
                    ⚠️ اقتربت من حد الباقة
                  </div>
                )}
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ color: "#666", fontSize: 13 }}>الرسائل اليومية (آخر 14 يوم)</span>
                  <span style={{ color: plan.color, fontSize: 13, fontFamily: "'Space Mono', monospace" }}>↑ +23%</span>
                </div>
                <MiniChart data={CLIENT_DATA.dailyUsage} color={plan.color} height={100} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 24 }}>
                <div style={{ color: "#666", fontSize: 13, marginBottom: 18 }}>أكثر الأسئلة تكراراً</div>
                {CLIENT_DATA.topQuestions.map((q, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <span style={{ color: plan.color, fontFamily: "'Space Mono', monospace", fontSize: 11, width: 28 }}>{q.count}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#ccc", fontSize: 13, marginBottom: 4 }}>{q.q}</div>
                      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${(q.count / CLIENT_DATA.topQuestions[0].count) * 100}%`, height: "100%", background: plan.color, borderRadius: 2 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 24 }}>
                <div style={{ color: "#666", fontSize: 13, marginBottom: 18 }}>آخر المحادثات</div>
                {CLIENT_DATA.recentSessions.map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.resolved ? "#6EE7B7" : "#EF4444" }} />
                      <div>
                        <div style={{ color: "#ccc", fontSize: 13 }}>{s.turns} رسائل · {s.duration}</div>
                        <div style={{ color: "#444", fontSize: 11 }}>{s.time}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: s.resolved ? "rgba(110,231,183,0.1)" : "rgba(239,68,68,0.1)", color: s.resolved ? "#6EE7B7" : "#EF4444" }}>
                      {s.resolved ? "محلول" : "يحتاج متابعة"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "integration" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 32 }}>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>🔑 مفتاح SK الخاص بك</h3>
              <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>هذا المفتاح سري ويمنح الوصول لحسابك. لا تشاركه مع أي أحد.</p>
              <div style={{ background: "#060608", border: `1px solid ${plan.color}33`, borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <code style={{ color: plan.color, fontSize: 14, fontFamily: "'Space Mono', monospace" }}>{CLIENT_DATA.sk}</code>
                <button onClick={() => copy(CLIENT_DATA.sk)} style={{ background: `${plan.color}22`, border: `1px solid ${plan.color}44`, color: plan.color, borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                  {copied ? "✓ تم النسخ" : "نسخ"}
                </button>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 32 }}>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>🚀 كود التضمين لموقعك</h3>
              <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>ضع هذا الكود قبل &lt;/body&gt; في موقعك. المساعد سيظهر خلال ثوانٍ.</p>
              <div style={{ background: "#040408", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 14, padding: "20px 24px", position: "relative" }}>
                <pre style={{ color: "#a78bfa", fontSize: 13, fontFamily: "'Space Mono', monospace", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{embedCode}</pre>
                <button onClick={() => copy(embedCode)} style={{ position: "absolute", top: 16, left: 16, background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa", borderRadius: 10, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                  {copied ? "✓" : "نسخ الكود"}
                </button>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 32 }}>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📋 خطوات التركيب</h3>
              {[
                { step: "1", title: "انسخ الكود أعلاه", desc: "الكود يحتوي على مفتاحك الخاص تلقائياً" },
                { step: "2", title: "الصق في موقعك", desc: "أضفه قبل علامة </body> في ملف HTML" },
                { step: "3", title: "جرب وخصص", desc: "استخدم تبويب 'اختبر المساعد' للتأكد من الردود" },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, background: `${plan.color}22`, border: `1px solid ${plan.color}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: plan.color, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{s.step}</div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ color: "#555", fontSize: 13 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "chat" && <LiveChat plan={plan} />}
      </div>
    </div>
  );
}
