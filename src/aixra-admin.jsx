import { useState, useEffect } from "react";

const PLANS = {
  starter: { name: "Starter", price: 99, color: "#6EE7B7", messages: 1000 },
  business: { name: "Business", price: 299, color: "#60A5FA", messages: 5000 },
  enterprise: { name: "Enterprise", price: null, color: "#F59E0B", messages: Infinity },
};

const MOCK_CLIENTS = [
  {
    id: "c1",
    name: "متجر الأناقة",
    email: "store@anaka.sa",
    plan: "business",
    sk: "sk-aixra-7f3a9b2c1d4e5f6a",
    status: "active",
    created: "2026-01-15",
    usage: 3241,
    domain: "anaka.sa",
    industry: "تجزئة",
    conversations: 847,
    satisfaction: 94,
    lastActive: "منذ ساعتين",
  },
  {
    id: "c2",
    name: "أكاديمية النخبة",
    email: "info@nokba.edu",
    plan: "starter",
    sk: "sk-aixra-2a4c6e8f0b1d3e5f",
    status: "active",
    created: "2026-02-01",
    usage: 612,
    domain: "nokba.edu",
    industry: "تعليم",
    conversations: 203,
    satisfaction: 91,
    lastActive: "منذ 5 دقائق",
  },
  {
    id: "c3",
    name: "عيادة الإشراق",
    email: "hello@eshraq.med",
    plan: "enterprise",
    sk: "sk-aixra-9d1b3f5e7a2c4d6e",
    status: "active",
    created: "2025-11-20",
    usage: 12488,
    domain: "eshraq.med",
    industry: "صحة",
    conversations: 3102,
    satisfaction: 97,
    lastActive: "منذ دقيقة",
  },
  {
    id: "c4",
    name: "شركة الأفق",
    email: "tech@ufuq.com",
    plan: "starter",
    sk: "sk-aixra-4e6f8a0c2d4e6f8a",
    status: "suspended",
    created: "2026-01-28",
    usage: 1001,
    domain: "ufuq.com",
    industry: "تقنية",
    conversations: 91,
    satisfaction: 78,
    lastActive: "منذ 3 أيام",
  },
];

function generateSK() {
  const chars = "0123456789abcdef";
  let key = "sk-aixra-";
  for (let i = 0; i < 16; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

function Stat({ label, value, sub, color = "#6EE7B7" }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "24px 28px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}>
      <span style={{ color: "#666", fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
      <span style={{ color, fontSize: 36, fontWeight: 800, lineHeight: 1, fontFamily: "'Space Mono', monospace" }}>{value}</span>
      {sub && <span style={{ color: "#444", fontSize: 12 }}>{sub}</span>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: { label: "نشط", bg: "rgba(110,231,183,0.15)", color: "#6EE7B7" },
    suspended: { label: "موقوف", bg: "rgba(239,68,68,0.15)", color: "#EF4444" },
    trial: { label: "تجريبي", bg: "rgba(245,158,11,0.15)", color: "#F59E0B" },
  };
  const s = map[status] || map.active;
  return (
    <span style={{
      background: s.bg, color: s.color, borderRadius: 20, padding: "3px 12px",
      fontSize: 12, fontWeight: 600, border: `1px solid ${s.color}33`,
    }}>{s.label}</span>
  );
}

function UsageBar({ used, total, color }) {
  const pct = total === Infinity ? 30 : Math.min((used / total) * 100, 100);
  return (
    <div style={{ width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%", borderRadius: 4,
        background: pct > 85 ? "#EF4444" : color,
        transition: "width 0.8s ease",
      }} />
    </div>
  );
}

function AddClientModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", email: "", domain: "", plan: "starter", industry: "تجزئة" });

  const submit = () => {
    const newClient = {
      id: "c" + Date.now(),
      ...form,
      sk: generateSK(),
      status: "active",
      created: new Date().toISOString().split("T")[0],
      usage: 0,
      conversations: 0,
      satisfaction: 100,
      lastActive: "الآن",
    };
    onAdd(newClient);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#0E0E12", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: 40, width: 520, direction: "rtl",
      }}>
        <h2 style={{ color: "#fff", fontFamily: "'Space Mono', monospace", fontSize: 20, marginBottom: 28 }}>
          ➕ إضافة عميل جديد
        </h2>
        {[
          { key: "name", label: "اسم الشركة", type: "text" },
          { key: "email", label: "البريد الإلكتروني", type: "email" },
          { key: "domain", label: "الدومين", type: "text" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 6 }}>{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={{
                width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, color: "#fff", padding: "10px 14px", fontSize: 14, outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
          <div>
            <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 6 }}>الباقة</label>
            <select value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))}
              style={{ width: "100%", background: "#1a1a22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", padding: "10px 14px", fontSize: 14 }}>
              {Object.entries(PLANS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 6 }}>المجال</label>
            <select value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
              style={{ width: "100%", background: "#1a1a22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", padding: "10px 14px", fontSize: 14 }}>
              {["تجزئة", "تعليم", "صحة", "تقنية", "عقارات", "مطاعم", "سياحة", "أخرى"].map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#aaa", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontSize: 14 }}>
            إلغاء
          </button>
          <button onClick={submit} style={{ background: "#6EE7B7", color: "#000", border: "none", borderRadius: 10, padding: "10px 28px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
            إنشاء العميل + مفتاح SK
          </button>
        </div>
      </div>
    </div>
  );
}

function ClientDrawer({ client, onClose, onUpdate }) {
  const [copied, setCopied] = useState(false);
  const plan = PLANS[client.plan];
  const embedCode = `<script src="https://cdn.aixraai.com/widget.js" data-sk="${client.sk}" data-lang="ar"></script>`;

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999, display: "flex", justifyContent: "flex-end",
    }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
      <div style={{
        position: "relative", width: 480, background: "#0A0A0F", borderLeft: "1px solid rgba(255,255,255,0.08)",
        height: "100%", overflowY: "auto", padding: 36, direction: "rtl", zIndex: 1,
      }}>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#666", fontSize: 22, cursor: "pointer", marginBottom: 24 }}>✕</button>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: `${plan.color}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, border: `2px solid ${plan.color}44`,
          }}>
            {client.industry === "تجزئة" ? "🛍️" : client.industry === "تعليم" ? "📚" : client.industry === "صحة" ? "🏥" : "💼"}
          </div>
          <div>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>{client.name}</h2>
            <span style={{ color: "#555", fontSize: 13 }}>{client.domain}</span>
          </div>
          <StatusBadge status={client.status} />
        </div>

        {/* SK Key */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ color: "#555", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>مفتاح SK الخاص</label>
          <div style={{
            background: "rgba(110,231,183,0.05)", border: "1px solid rgba(110,231,183,0.2)",
            borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <code style={{ color: "#6EE7B7", fontSize: 12, fontFamily: "'Space Mono', monospace" }}>
              {client.sk}
            </code>
            <button onClick={() => copyCode(client.sk)} style={{
              background: "rgba(110,231,183,0.15)", border: "none", color: "#6EE7B7",
              borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>
              {copied ? "✓" : "نسخ"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
          {[
            { l: "الرسائل المستخدمة", v: client.usage.toLocaleString("ar") },
            { l: "المحادثات", v: client.conversations.toLocaleString("ar") },
            { l: "الرضا", v: `${client.satisfaction}%` },
            { l: "آخر نشاط", v: client.lastActive },
          ].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "16px" }}>
              <div style={{ color: "#444", fontSize: 11, marginBottom: 6 }}>{s.l}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, fontFamily: "'Space Mono', monospace" }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Usage Bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#555", fontSize: 12 }}>استهلاك الباقة</span>
            <span style={{ color: plan.color, fontSize: 12 }}>
              {plan.messages === Infinity ? "غير محدود" : `${client.usage.toLocaleString("ar")} / ${plan.messages.toLocaleString("ar")}`}
            </span>
          </div>
          <UsageBar used={client.usage} total={plan.messages} color={plan.color} />
        </div>

        {/* Embed Code */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ color: "#555", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>كود التضمين للموقع</label>
          <div style={{
            background: "#060608", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16,
          }}>
            <code style={{ color: "#a78bfa", fontSize: 11, fontFamily: "'Space Mono', monospace", wordBreak: "break-all", display: "block", lineHeight: 1.6 }}>
              {embedCode}
            </code>
            <button onClick={() => copyCode(embedCode)} style={{
              marginTop: 12, background: "rgba(167,139,250,0.15)", border: "none", color: "#a78bfa",
              borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600, width: "100%",
            }}>
              نسخ كود التضمين
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onUpdate(client.id, { status: client.status === "active" ? "suspended" : "active" })} style={{
            flex: 1, background: client.status === "active" ? "rgba(239,68,68,0.15)" : "rgba(110,231,183,0.15)",
            border: `1px solid ${client.status === "active" ? "#EF444444" : "#6EE7B744"}`,
            color: client.status === "active" ? "#EF4444" : "#6EE7B7",
            borderRadius: 10, padding: "12px", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>
            {client.status === "active" ? "إيقاف الحساب" : "تفعيل الحساب"}
          </button>
          <button onClick={() => onUpdate(client.id, { sk: generateSK() })} style={{
            flex: 1, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
            color: "#F59E0B", borderRadius: 10, padding: "12px", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>
            تجديد مفتاح SK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [tab, setTab] = useState("clients");

  const filtered = clients.filter(c => {
    const matchSearch = c.name.includes(search) || c.email.includes(search) || c.domain.includes(search);
    const matchPlan = filterPlan === "all" || c.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  const updateClient = (id, updates) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...updates }));
  };

  const totalRevenue = clients.filter(c => c.status === "active").reduce((sum, c) => {
    return sum + (PLANS[c.plan].price || 1200);
  }, 0);

  const totalMessages = clients.reduce((s, c) => s + c.usage, 0);

  return (
    <div style={{
      minHeight: "100vh", background: "#07070A", color: "#fff",
      fontFamily: "'Cairo', sans-serif", direction: "rtl",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        input::placeholder { color: #444; }
        input:focus { border-color: rgba(110,231,183,0.4) !important; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        position: "fixed", right: 0, top: 0, height: "100vh", width: 240,
        background: "#0A0A0E", borderLeft: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", padding: "28px 20px", zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
              borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "#000",
            }}>A</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, lineHeight: 1 }}>AixraAI</div>
              <div style={{ color: "#444", fontSize: 10, marginTop: 2 }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        {[
          { id: "clients", icon: "👥", label: "العملاء" },
          { id: "analytics", icon: "📊", label: "التحليلات" },
          { id: "billing", icon: "💳", label: "الفواتير" },
          { id: "settings", icon: "⚙️", label: "الإعدادات" },
        ].map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
            borderRadius: 12, marginBottom: 4, cursor: "pointer", width: "100%",
            background: tab === item.id ? "rgba(110,231,183,0.1)" : "transparent",
            border: tab === item.id ? "1px solid rgba(110,231,183,0.2)" : "1px solid transparent",
            color: tab === item.id ? "#6EE7B7" : "#555",
            fontSize: 14, fontWeight: tab === item.id ? 700 : 400, transition: "all 0.2s",
          }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
          <div style={{ color: "#333", fontSize: 11, marginBottom: 8 }}>المدير</div>
          <div style={{ color: "#6EE7B7", fontSize: 13, fontWeight: 600 }}>Mohammed ✦</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginRight: 240, padding: "40px 48px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
            لوحة التحكم الرئيسية
          </h1>
          <p style={{ color: "#444", fontSize: 14 }}>
            {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
          <Stat label="إجمالي العملاء" value={clients.length} sub={`${clients.filter(c => c.status === "active").length} نشط`} />
          <Stat label="الإيرادات الشهرية" value={`${totalRevenue.toLocaleString("ar")} ر.س`} color="#60A5FA" sub="تقريبي" />
          <Stat label="الرسائل الكلية" value={totalMessages.toLocaleString("ar")} color="#a78bfa" />
          <Stat label="متوسط الرضا" value="95%" color="#F59E0B" sub="هذا الشهر" />
        </div>

        {/* Clients Table */}
        {tab === "clients" && (
          <>
            {/* Toolbar */}
            <div style={{ display: "flex", gap: 14, marginBottom: 24, alignItems: "center" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#444" }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="بحث بالاسم، البريد، أو الدومين..."
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, color: "#fff", padding: "12px 44px 12px 16px", fontSize: 14, outline: "none",
                  }}
                />
              </div>
              <select
                value={filterPlan}
                onChange={e => setFilterPlan(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12, color: "#fff", padding: "12px 16px", fontSize: 14, cursor: "pointer",
                }}
              >
                <option value="all">كل الباقات</option>
                {Object.entries(PLANS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
              <button
                onClick={() => setShowAdd(true)}
                style={{
                  background: "#6EE7B7", color: "#000", border: "none", borderRadius: 12,
                  padding: "12px 24px", cursor: "pointer", fontSize: 14, fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                + عميل جديد
              </button>
            </div>

            {/* Table */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1fr 1fr",
                padding: "14px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                color: "#444", fontSize: 12, letterSpacing: 1, textTransform: "uppercase",
              }}>
                {["الشركة", "الباقة", "الاستهلاك", "آخر نشاط", "الحالة", ""].map((h, i) => (
                  <span key={i}>{h}</span>
                ))}
              </div>

              {filtered.map(client => {
                const plan = PLANS[client.plan];
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelected(client)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1fr 1fr",
                      padding: "18px 24px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      alignItems: "center",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{client.name}</div>
                      <div style={{ color: "#444", fontSize: 12 }}>{client.email}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: plan.color }} />
                      <span style={{ color: plan.color, fontSize: 13, fontWeight: 600 }}>{plan.name}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ color: "#fff", fontSize: 13, fontFamily: "'Space Mono', monospace" }}>
                        {client.usage.toLocaleString("ar")}
                      </span>
                      <UsageBar used={client.usage} total={plan.messages} color={plan.color} />
                    </div>
                    <span style={{ color: "#555", fontSize: 13 }}>{client.lastActive}</span>
                    <StatusBadge status={client.status} />
                    <span style={{ color: "#444", fontSize: 18 }}>›</span>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div style={{ padding: 48, textAlign: "center", color: "#444" }}>لا توجد نتائج</div>
              )}
            </div>
          </>
        )}

        {tab !== "clients" && (
          <div style={{
            height: 400, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#333", fontSize: 18, border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 20,
          }}>
            قريباً — {tab === "analytics" ? "التحليلات" : tab === "billing" ? "الفواتير" : "الإعدادات"}
          </div>
        )}
      </div>

      {selected && (
        <ClientDrawer
          client={clients.find(c => c.id === selected.id) || selected}
          onClose={() => setSelected(null)}
          onUpdate={updateClient}
        />
      )}
      {showAdd && (
        <AddClientModal
          onClose={() => setShowAdd(false)}
          onAdd={c => setClients(prev => [c, ...prev])}
        />
      )}
    </div>
  );
}
