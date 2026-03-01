import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════
// AixraAI Embeddable Widget — Production-Ready Component
// Usage: <AixraWidget sk="sk-aixra-..." lang="ar" theme="dark" />
// Or via script tag: <script src="cdn.aixraai.com/widget.js" data-sk="..." />
// ═══════════════════════════════════════════════════════

const DEFAULT_CONFIG = {
  sk: "sk-aixra-7f3a9b2c1d4e5f6a",
  lang: "ar",
  theme: "dark",
  primaryColor: "#6EE7B7",
  position: "left",
  greeting: "مرحباً! 👋 كيف أقدر أساعدك؟",
  placeholder: "اكتب سؤالك...",
  botName: "مساعد الذكاء الاصطناعي",
  businessName: "متجر الأناقة",
  systemPrompt: "أنت مساعد ذكي ومفيد. ردودك موجزة وودودة باللغة العربية.",
};

const MOCK_SUGGESTED = [
  "ما طرق الدفع المتاحة؟",
  "هل يوجد توصيل مجاني؟",
  "كيف أرجع منتج؟",
];

function TypingIndicator({ color }) {
  return (
    <div style={{ display: "flex", gap: 4, padding: "8px 12px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: color,
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:0.5}40%{transform:translateY(-6px);opacity:1}}`}</style>
    </div>
  );
}

function Message({ msg, color }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-start" : "flex-end", marginBottom: 10, animation: "fadein 0.2s ease" }}>
      {!isUser && (
        <div style={{ width: 28, height: 28, background: `${color}22`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, marginLeft: 8, flexShrink: 0, border: `1px solid ${color}44` }}>A</div>
      )}
      <div style={{
        maxWidth: "78%", background: isUser ? "rgba(255,255,255,0.08)" : `rgba(0,0,0,0.4)`,
        border: `1px solid ${isUser ? "rgba(255,255,255,0.1)" : `${color}33`}`,
        borderRadius: isUser ? "16px 16px 16px 4px" : "16px 4px 16px 16px",
        padding: "10px 14px", color: "#fff", fontSize: 13.5, lineHeight: 1.65,
        fontFamily: "'Cairo', sans-serif",
      }}>
        {msg.text}
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, marginTop: 4, textAlign: "left" }}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}

export function AixraWidget({ config = {} }) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { role: "bot", text: cfg.greeting, time: now() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showSuggested, setShowSuggested] = useState(true);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  function now() {
    return new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 300); }
  }, [open]);

  const send = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setShowSuggested(false);
    setMsgs(prev => [...prev, { role: "user", text: userText, time: now() }]);
    setLoading(true);
    try {
      const history = msgs.map(m => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.text,
      }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `${cfg.systemPrompt} أنت مساعد "${cfg.businessName}".`,
          messages: [...history, { role: "user", content: userText }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "عذراً، لم أستطع الرد الآن.";
      setMsgs(prev => [...prev, { role: "bot", text: reply, time: now() }]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMsgs(prev => [...prev, { role: "bot", text: "تعذّر الاتصال. الرجاء المحاولة لاحقاً.", time: now() }]);
    }
    setLoading(false);
  };

  const color = cfg.primaryColor;
  const isRTL = cfg.lang === "ar";
  const side = cfg.position === "left" ? { left: 24 } : { right: 24 };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
        @keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideup{from{opacity:0;transform:translateY(20px)scale(0.95)}to{opacity:1;transform:translateY(0)scale(1)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 ${color}66}50%{box-shadow:0 0 0 10px ${color}00}}
        .aixra-input:focus{outline:none;border-color:${color}88 !important;}
        .aixra-send:hover{transform:scale(1.05);}
        .aixra-suggest:hover{background:${color}22 !important;border-color:${color}88 !important;}
        .aixra-close:hover{opacity:1 !important;}
      `}</style>

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 92, ...side,
          width: 360, maxHeight: 560,
          background: "#0C0C10", borderRadius: 24, overflow: "hidden",
          boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)`,
          display: "flex", flexDirection: "column",
          direction: isRTL ? "rtl" : "ltr",
          zIndex: 9999,
          animation: "slideup 0.25s ease",
        }}>
          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${color}22, rgba(59,130,246,0.15))`,
            borderBottom: `1px solid ${color}22`,
            padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, background: `linear-gradient(135deg, ${color}, #3B82F6)`,
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 900, color: "#000",
              }}>A</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'Cairo', sans-serif" }}>{cfg.botName}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, background: "#6EE7B7", borderRadius: "50%", boxShadow: "0 0 4px #6EE7B7" }} />
                  <span style={{ color: "#6EE7B7", fontSize: 11 }}>متاح الآن</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="aixra-close" style={{ background: "none", border: "none", color: "#fff", opacity: 0.5, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", maxHeight: 380, scrollbarWidth: "thin", scrollbarColor: "#2a2a2a transparent" }}>
            {msgs.map((m, i) => <Message key={i} msg={m} color={color} />)}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <div style={{ background: `rgba(0,0,0,0.4)`, border: `1px solid ${color}33`, borderRadius: "16px 4px 16px 16px" }}>
                  <TypingIndicator color={color} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {showSuggested && (
            <div style={{ padding: "4px 16px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {MOCK_SUGGESTED.map(s => (
                <button key={s} className="aixra-suggest" onClick={() => send(s)} style={{
                  background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: 20, padding: "5px 12px", color: "#ccc", fontSize: 11,
                  cursor: "pointer", transition: "all 0.15s", fontFamily: "'Cairo', sans-serif",
                }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid rgba(255,255,255,0.06)`, display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              className="aixra-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder={cfg.placeholder}
              style={{
                flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14, color: "#fff", padding: "10px 14px", fontSize: 13,
                fontFamily: "'Cairo', sans-serif", transition: "border-color 0.2s",
              }}
            />
            <button className="aixra-send" onClick={() => send()} disabled={loading || !input.trim()} style={{
              width: 42, height: 42, background: input.trim() ? color : "rgba(255,255,255,0.06)",
              border: "none", borderRadius: 14, cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: input.trim() ? "#000" : "#444", fontSize: 18, fontWeight: 900,
              transition: "all 0.2s", flexShrink: 0,
            }}>›</button>
          </div>

          {/* Branding */}
          <div style={{ textAlign: "center", padding: "6px 0 10px", color: "#333", fontSize: 10 }}>
            مدعوم بـ <span style={{ color: color, fontWeight: 700 }}>AixraAI</span>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, ...side,
          width: 60, height: 60, borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}, #3B82F6)`,
          border: "none", cursor: "pointer", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 8px 32px ${color}66`,
          animation: open ? "none" : "pulse 2.5s ease infinite",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open ? (
          <span style={{ color: "#000", fontSize: 22, fontWeight: 900, lineHeight: 1 }}>×</span>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#000" />
          </svg>
        )}
        {!open && unread > 0 && (
          <div style={{
            position: "absolute", top: -4, right: -4,
            width: 20, height: 20, background: "#EF4444", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 11, fontWeight: 800, border: "2px solid #07070A",
          }}>{unread}</div>
        )}
      </button>
    </>
  );
}

// ─── Demo Page ──────────────────────────────────────────
export default function WidgetDemo() {
  const [theme, setTheme] = useState("dark");
  const [color, setColor] = useState("#6EE7B7");
  const [pos, setPos] = useState("left");
  const [name, setName] = useState("مساعد ذكي");

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FB", fontFamily: "'Cairo', sans-serif", direction: "rtl" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Mock Website Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, background: color, borderRadius: 10 }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: "#111" }}>متجر الأناقة</span>
        </div>
        <nav style={{ display: "flex", gap: 28, color: "#555", fontSize: 14 }}>
          {["الرئيسية", "المنتجات", "العروض", "تواصل معنا"].map(n => <a key={n} href="#" style={{ color: "#555", textDecoration: "none" }}>{n}</a>)}
        </nav>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 0, height: "calc(100vh - 69px)" }}>
        {/* Config Panel */}
        <div style={{ background: "#fff", borderLeft: "1px solid #E5E7EB", padding: 32, overflowY: "auto" }}>
          <div style={{ color: "#111", fontWeight: 800, fontSize: 16, marginBottom: 4 }}>🎛️ تخصيص الويدجت</div>
          <div style={{ color: "#999", fontSize: 13, marginBottom: 28 }}>غيّر الإعدادات وشاهد التغيير فوراً</div>

          {[
            { label: "اللون الأساسي", type: "color", val: color, set: setColor },
            { label: "اسم المساعد", type: "text", val: name, set: setName },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 20 }}>
              <label style={{ color: "#555", fontSize: 12, display: "block", marginBottom: 8 }}>{f.label}</label>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 14, color: "#111" }} />
            </div>
          ))}

          <div style={{ marginBottom: 20 }}>
            <label style={{ color: "#555", fontSize: 12, display: "block", marginBottom: 8 }}>موضع الزر</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["left", "right"].map(p => (
                <button key={p} onClick={() => setPos(p)} style={{
                  flex: 1, padding: "10px", border: `2px solid ${pos === p ? color : "#E5E7EB"}`,
                  borderRadius: 10, background: pos === p ? `${color}22` : "#fff",
                  color: pos === p ? "#111" : "#666", cursor: "pointer", fontSize: 13, fontWeight: 600,
                }}>{p === "left" ? "يسار" : "يمين"}</button>
              ))}
            </div>
          </div>

          <div style={{ background: "#F8F9FB", borderRadius: 14, padding: 20, marginTop: 28 }}>
            <div style={{ color: "#444", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>🔌 كود التركيب</div>
            <code style={{ color: "#7C3AED", fontSize: 11, lineHeight: 1.8, display: "block", background: "#fff", borderRadius: 8, padding: 12 }}>
              {`<script\n  src="cdn.aixraai.com/widget.js"\n  data-sk="sk-aixra-..."\n  data-color="${color}"\n  data-lang="ar"\n/>`}
            </code>
          </div>
        </div>

        {/* Mock Website Content */}
        <div style={{ padding: 48, overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
            {[
              { name: "فستان صيفي أنيق", price: "٢٤٩ ر.س", img: "🌸" },
              { name: "حقيبة جلدية فاخرة", price: "٥٩٩ ر.س", img: "👜" },
              { name: "نظارات شمسية عصرية", price: "١٨٩ ر.س", img: "🕶️" },
            ].map(p => (
              <div key={p.name} style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #F0F0F0" }}>
                <div style={{ height: 120, background: "#F8F9FB", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, marginBottom: 14 }}>{p.img}</div>
                <div style={{ fontWeight: 700, color: "#111", marginBottom: 4 }}>{p.name}</div>
                <div style={{ color, fontWeight: 800 }}>{p.price}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", color: "#999", fontSize: 14, padding: 20, background: "#fff", borderRadius: 16, border: "1px dashed #E5E7EB" }}>
            هذا تمثيل لموقع عميلك — لاحظ الزر في الأسفل 👇
          </div>
        </div>
      </div>

      {/* The actual widget */}
      <AixraWidget config={{ primaryColor: color, botName: name, position: pos, businessName: "متجر الأناقة" }} />
    </div>
  );
}
