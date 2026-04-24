import { useState, useEffect } from "react";

// ─── DATA (Moving to state in App) ───────────────────────────────────────────
// These are now handled via API fetching in the App component.


// ─── SQL QUERIES ─────────────────────────────────────────────────────────────

const SQL_QUERIES = {
  "🔵 Basic Queries": [
    { id: 1, title: "All Donors", sql: "SELECT * FROM donors;" },
    { id: 2, title: "All NGOs", sql: "SELECT * FROM ngos;" },
    { id: 3, title: "All Donations", sql: "SELECT * FROM donations;" },
    { id: 4, title: "All Volunteers", sql: "SELECT * FROM volunteers;" },
    { id: 5, title: "All Requests", sql: "SELECT * FROM donation_requests;" },
    { id: 6, title: "All Deliveries", sql: "SELECT * FROM deliveries;" },
    { id: 7, title: "Active NGOs Only", sql: "SELECT * FROM ngos WHERE status = 'Active';" },
    { id: 8, title: "Clothes Donations", sql: "SELECT * FROM donations WHERE type = 'Clothes';" },
    { id: 9, title: "Pending Requests", sql: "SELECT * FROM donation_requests WHERE status = 'Pending';" },
    { id: 10, title: "Available Volunteers", sql: "SELECT * FROM volunteers WHERE status = 'Available';" },
    { id: 11, title: "Donors from Pune", sql: "SELECT * FROM donors WHERE city = 'Pune';" },
    { id: 12, title: "Delivered Donations", sql: "SELECT * FROM donations WHERE status = 'Delivered';" },
  ],
  "🟢 Join Queries": [
    { id: 13, title: "Donations with Donor Details", sql: `SELECT d.donation_id, dn.name AS donor_name,\n  d.type, d.quantity, d.status\nFROM donations d\nJOIN donors dn ON d.donor_id = dn.donor_id;` },
    { id: 14, title: "Requests with NGO Info", sql: `SELECT r.request_id, n.name AS ngo_name,\n  n.city, r.type, r.quantity, r.status\nFROM donation_requests r\nJOIN ngos n ON r.ngo_id = n.ngo_id;` },
    { id: 15, title: "Deliveries with Volunteer", sql: `SELECT dl.delivery_id, v.name AS volunteer,\n  dl.donation_id, dl.status\nFROM deliveries dl\nJOIN volunteers v ON dl.volunteer_id = v.volunteer_id;` },
    { id: 16, title: "Donor & NGO City Match", sql: `SELECT dn.name AS donor, n.name AS ngo,\n  dn.city\nFROM donors dn\nJOIN ngos n ON dn.city = n.city;` },
    { id: 17, title: "Approved Requests & Deliveries", sql: `SELECT r.request_id, n.name, d.delivery_id\nFROM donation_requests r\nJOIN ngos n ON r.ngo_id = n.ngo_id\nJOIN deliveries d ON r.request_id = d.request_id\nWHERE r.status = 'Approved';` },
    { id: 18, title: "Feedback with Ratings", sql: `SELECT f.feedback_id, f.from_entity,\n  f.rating, f.comment\nFROM feedbacks f\nORDER BY f.rating DESC;` },
    { id: 19, title: "Volunteer Delivery Count", sql: `SELECT v.name, COUNT(d.delivery_id) AS total\nFROM volunteers v\nLEFT JOIN deliveries d ON v.volunteer_id = d.volunteer_id\nGROUP BY v.name;` },
    { id: 20, title: "Donations per NGO Request", sql: `SELECT n.name, COUNT(r.request_id) AS requests\nFROM ngos n\nLEFT JOIN donation_requests r ON n.ngo_id = r.ngo_id\nGROUP BY n.name;` },
  ],
  "🟡 Aggregation Queries": [
    { id: 21, title: "Total Donations Count", sql: "SELECT COUNT(*) AS total_donations FROM donations;" },
    { id: 22, title: "Total Items Donated", sql: "SELECT SUM(quantity) AS total_items FROM donations;" },
    { id: 23, title: "Avg Donations per Donor", sql: "SELECT AVG(donation_count) AS avg FROM donors;" },
    { id: 24, title: "Donations by Type", sql: `SELECT type, COUNT(*) AS count\nFROM donations\nGROUP BY type;` },
    { id: 25, title: "Requests by Status", sql: `SELECT status, COUNT(*) AS total\nFROM donation_requests\nGROUP BY status;` },
    { id: 26, title: "Max Donation Quantity", sql: "SELECT MAX(quantity) AS max_qty FROM donations;" },
    { id: 27, title: "Min Donation Quantity", sql: "SELECT MIN(quantity) AS min_qty FROM donations;" },
    { id: 28, title: "Average NGO Rating", sql: "SELECT AVG(rating) AS avg_rating FROM feedbacks WHERE entity_type='NGO';" },
    { id: 29, title: "Volunteers per City", sql: `SELECT city, COUNT(*) AS volunteers\nFROM volunteers\nGROUP BY city;` },
    { id: 30, title: "Donors with 5+ Donations", sql: `SELECT name, donation_count FROM donors\nWHERE donation_count >= 5;` },
    { id: 31, title: "NGO Request Totals", sql: `SELECT n.name, SUM(r.quantity) AS total_items\nFROM donation_requests r JOIN ngos n ON r.ngo_id = n.ngo_id\nGROUP BY n.name\nORDER BY total_items DESC;` },
    { id: 32, title: "Deliveries by Status", sql: `SELECT status, COUNT(*) AS count\nFROM deliveries GROUP BY status;` },
  ],
  "🔴 Advanced Queries": [
    { id: 33, title: "Top Donors by Quantity", sql: `SELECT dn.name, SUM(d.quantity) AS total\nFROM donors dn\nJOIN donations d ON dn.donor_id = d.donor_id\nGROUP BY dn.name\nORDER BY total DESC\nLIMIT 3;` },
    { id: 34, title: "NGOs with Pending High-Urgency", sql: `SELECT n.name, r.urgency, r.quantity\nFROM donation_requests r\nJOIN ngos n ON r.ngo_id = n.ngo_id\nWHERE r.status = 'Pending' AND r.urgency = 'High';` },
    { id: 35, title: "Subquery: Donors Above Average", sql: `SELECT name, donation_count FROM donors\nWHERE donation_count > (\n  SELECT AVG(donation_count) FROM donors\n);` },
    { id: 36, title: "Monthly Donation Trend", sql: `SELECT TO_CHAR(donation_date, 'Month YYYY') AS month,\n  COUNT(*) AS donations\nFROM donations\nGROUP BY month\nORDER BY month;` },
    { id: 37, title: "Unassigned Donations", sql: `SELECT d.id, d.type, d.quantity\nFROM donations d\nLEFT JOIN deliveries dl ON d.id = dl.donation_id\nWHERE dl.id IS NULL;` },
    { id: 38, title: "NGOs with All Requests Approved", sql: `SELECT n.name FROM donation_requests r JOIN ngos n ON r.ngo_id = n.ngo_id\nGROUP BY n.name\nHAVING SUM(CASE WHEN r.status = 'Pending' THEN 1 ELSE 0 END) = 0;` },
    { id: 39, title: "Volunteer Efficiency Rank", sql: `SELECT name, deliveries_completed,\n  RANK() OVER (ORDER BY deliveries_completed DESC) AS rank\nFROM volunteers;` },
    { id: 40, title: "Cities Without Volunteers", sql: `SELECT DISTINCT city FROM donors\nWHERE city NOT IN (\n  SELECT city FROM volunteers\n);` },
    { id: 41, title: "Full Donation Journey", sql: `SELECT d.id AS donation, dn.name AS donor,\n  v.name AS volunteer, n.name AS ngo,\n  dl.status AS delivery_status\nFROM donations d\nJOIN donors dn ON d.donor_id = dn.id\nJOIN deliveries dl ON d.id = dl.donation_id\nJOIN volunteers v ON dl.volunteer_id = v.id\nJOIN ngos n ON dl.ngo_id = n.id;` },
    { id: 42, title: "Feedback Score by NGO", sql: `SELECT n.name, AVG(f.rating) AS avg_score\nFROM feedbacks f\nJOIN ngos n ON f.entity_id = n.id\nWHERE f.entity_type = 'NGO'\nGROUP BY n.name\nORDER BY avg_score DESC;` },
    { id: 43, title: "Cascade Delete Check", sql: `-- Check donations before deleting a donor\nSELECT COUNT(*) AS linked_donations\nFROM donations\nWHERE donor_id = 1;` },
    { id: 44, title: "Materialized View: Summary", sql: `SELECT type, COUNT(*) AS count,\n  SUM(quantity) AS total_qty\nFROM donations\nGROUP BY type;` },
    { id: 45, title: "Trigger Simulation", sql: `-- Simulates Stock Update Logic\nSELECT * FROM ngos WHERE id = 1;` },
    { id: 46, title: "Stored Procedure Simulation", sql: `UPDATE deliveries SET volunteer_id = 3 WHERE id = 4;` },
    { id: 47, title: "Query Performance Analysis", sql: `EXPLAIN SELECT * FROM donations\nWHERE donor_id = 1\nAND status = 'Pending';` },
    { id: 48, title: "Transaction Example", sql: `BEGIN; UPDATE donations SET status='Approved' WHERE id=2; COMMIT;` },
    { id: 49, title: "Recursive Example", sql: `WITH RECURSIVE subordinates AS (\n  SELECT id, name FROM volunteers WHERE id = 1\n  UNION ALL\n  SELECT v.id, v.name FROM volunteers v JOIN subordinates s ON v.id = s.id + 1 WHERE v.id <= 4\n) SELECT * FROM subordinates;` },
    { id: 50, title: "Pivot Example", sql: `SELECT type, SUM(quantity) as total FROM donations GROUP BY type;` },
  ],
  "🌌 Stored Procedures": [
    { id: 51, title: "CALL: Add Donation Proc", sql: "CALL add_donation_proc('Priya Sharma', 'Clothes', 10, 'Winter donation via Proc');" },
    { id: 52, title: "CALL: Register NGO Proc", sql: "CALL register_ngo_proc('New Hope NGO', 'Pune', 'Education', '9898989898');" },
    { id: 53, title: "CALL: Assign Delivery Proc", sql: "CALL assign_delivery_proc('DON002', 'Rohan Desai', 'Asha Foundation');" },
    { id: 54, title: "CALL: Complete Delivery Proc", sql: "CALL complete_delivery_proc('DEL003');" },
  ]
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const Badge = ({ status }) => {
  const map = {
    "Active": "#10b981", "Inactive": "#6b7280",
    "Delivered": "#10b981", "Pending": "#f59e0b",
    "In Transit": "#3b82f6", "Approved": "#10b981",
    "Assigned": "#8b5cf6", "Available": "#10b981",
    "On Delivery": "#f59e0b", "High": "#ef4444",
    "Medium": "#f59e0b", "Low": "#10b981",
  };
  const color = map[status] || "#6b7280";
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      whiteSpace: "nowrap"
    }}>{status}</span>
  );
};

const StarRating = ({ rating }) => (
  <span style={{ color: "#f59e0b", fontSize: 14 }}>
    {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    <span style={{ color: "#6b7280", marginLeft: 4, fontSize: 12 }}>{rating}/5</span>
  </span>
);

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{
    background: "#fff", borderRadius: 16, padding: "22px 24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex",
    alignItems: "center", gap: 18, flex: 1, minWidth: 160,
    borderTop: `4px solid ${color}`
  }}>
    <div style={{
      width: 54, height: 54, borderRadius: 14, background: color + "18",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 26, flexShrink: 0
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>{value}</div>
      <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ color, fontSize: 11, marginTop: 2, fontWeight: 600 }}>{sub}</div>}
    </div>
  </div>
);

const Table = ({ cols, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          {cols.map(c => (
            <th key={c} style={{
              textAlign: "left", padding: "10px 14px",
              background: "#f1f5f9", color: "#475569",
              fontWeight: 700, fontSize: 11, textTransform: "uppercase",
              letterSpacing: "0.05em", whiteSpace: "nowrap",
              borderBottom: "1px solid #e2e8f0"
            }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "11px 14px", color: "#334155", whiteSpace: "nowrap" }}>
                {["Delivered","Active","Available","Approved"].includes(cell) ||
                 ["Pending","In Transit","Assigned","Inactive","On Delivery","High","Medium","Low"].includes(cell)
                  ? <Badge status={cell} /> : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", margin: 0 }}>{title}</h2>
    {subtitle && <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 14 }}>{subtitle}</p>}
  </div>
);

const Card = ({ children, style }) => (
  <div style={{
    background: "#fff", borderRadius: 16, padding: 24,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)", ...style
  }}>{children}</div>
);

// ─── PAGES ───────────────────────────────────────────────────────────────────

const DashboardPage = ({ donations, donors, ngos, volunteers }) => (
  <div>
    <SectionHeader title="📊 Dashboard Overview" subtitle="Welcome to Clothes & Books Donation Management System" />
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
      <StatCard icon="📦" label="Total Donations" value={donations.length} color="#3b82f6" sub="+2 this week" />
      <StatCard icon="👤" label="Total Donors" value={donors.length} color="#10b981" sub="+1 this month" />
      <StatCard icon="🏢" label="Partner NGOs" value={ngos.length} color="#f59e0b" sub={`${ngos.filter(n=>n.status==='Active').length} active`} />
      <StatCard icon="🤝" label="Volunteers" value={volunteers.length} color="#8b5cf6" sub={`${volunteers.filter(v=>v.status==='Available').length} available`} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
      {/* Activity and Breakdown omitted for brevity in response, keeping them with mock data logic or updating */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#1e293b" }}>Recent Activity</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* We'll keep activity mock for now or implement if needed */}
          {[
            { icon: "📦", text: "New donation by Priya Sharma – 10 Clothes", time: "2 hrs ago", color: "#3b82f6" },
            { icon: "🏢", text: "Asha Foundation request approved", time: "4 hrs ago", color: "#10b981" },
            { icon: "🚚", text: "Delivery DEL002 is now In Transit", time: "6 hrs ago", color: "#f59e0b" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: a.color + "18",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0
              }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{a.text}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#1e293b" }}>Donation Breakdown</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Clothes", value: donations.filter(d => d.type === "Clothes").length, total: donations.length, color: "#3b82f6" },
            { label: "Books", value: donations.filter(d => d.type === "Books").length, total: donations.length, color: "#10b981" },
            { label: "Delivered", value: donations.filter(d => d.status === "Delivered").length, total: donations.length, color: "#f59e0b" },
            { label: "Pending", value: donations.filter(d => d.status === "Pending").length, total: donations.length, color: "#ef4444" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, color: "#475569" }}>
                <span style={{ fontWeight: 600 }}>{item.label}</span>
                <span>{item.value}/{item.total}</span>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 99, height: 8 }}>
                <div style={{
                  width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`,
                  background: item.color, height: 8, borderRadius: 99,
                  transition: "width 0.6s ease"
                }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
    <Card>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#1e293b" }}>Recent Donations</div>
      <Table
        cols={["Donation ID", "Donor", "Type", "Qty", "Date", "Status"]}
        rows={donations.slice(0, 4).map(d => [d.id, d.donor_name, d.type, d.quantity, d.donation_date ? new Date(d.donation_date).toLocaleDateString() : '—', d.status])}
      />
    </Card>
  </div>
);

const UserPage = ({ section, donors, ngos, volunteers, refresh }) => {
  const [tab, setTab] = useState("view");
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const rawData = section === "donors" ? donors : section === "ngos" ? ngos : volunteers;
  const cols = section === "donors"
    ? ["ID", "Name", "Email", "Phone", "City", "Donations", "Joined"]
    : section === "ngos"
    ? ["ID", "Name", "City", "Focus", "Contact", "Status", "Requests"]
    : ["ID", "Name", "Phone", "City", "Deliveries", "Status"];
    
  const rows = section === "donors"
    ? rawData.map(d => [d.id, d.name, d.email, d.phone, d.city, d.donation_count, d.joined_date ? new Date(d.joined_date).toLocaleDateString() : '—'])
    : section === "ngos"
    ? rawData.map(n => [n.id, n.name, n.city, n.focus_area, n.contact, n.status, n.total_requests])
    : rawData.map(v => [v.id, v.name, v.phone, v.city, v.deliveries_completed, v.status]);

  const title = section === "donors" ? "👤 Donor Management" : section === "ngos" ? "🏢 NGO Management" : "🤝 Volunteer Management";
  const subtitle = section === "donors" ? `${donors.length} registered donors` : section === "ngos" ? `${ngos.length} partner NGOs` : `${volunteers.length} active volunteers`;

  const fields = section === "donors"
    ? [{ name: "name", label: "Full Name" }, { name: "email", label: "Email Address" }, { name: "phone", label: "Phone Number" }, { name: "city", label: "City" }]
    : section === "ngos"
    ? [{ name: "name", label: "Organization Name" }, { name: "city", label: "City" }, { name: "focus_area", label: "Focus Area" }, { name: "contact", label: "Contact Number" }]
    : [{ name: "name", label: "Full Name" }, { name: "phone", label: "Phone Number" }, { name: "city", label: "City" }];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const endpoint = `/api/${section}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert(`${section.slice(0, -1)} added successfully!`);
        setFormData({});
        refresh();
        setTab("view");
      } else {
        alert("Failed to add record.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <SectionHeader title={title} subtitle={subtitle} />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["view", "add"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
            fontWeight: 600, fontSize: 13,
            background: tab === t ? "#3b82f6" : "#f1f5f9",
            color: tab === t ? "#fff" : "#64748b"
          }}>{t === "view" ? "📋 View All" : "➕ Add New"}</button>
        ))}
      </div>
      {tab === "view" ? (
        <Card><Table cols={cols} rows={rows} /></Card>
      ) : (
        <Card style={{ maxWidth: 520 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: "#1e293b" }}>
            Add New {section === "donors" ? "Donor" : section === "ngos" ? "NGO" : "Volunteer"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {fields.map(f => (
              <div key={f.name}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input 
                  placeholder={`Enter ${f.label.toLowerCase()}`}
                  value={formData[f.name] || ""}
                  onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none",
                    boxSizing: "border-box", transition: "border-color 0.2s",
                    color: "#334155"
                  }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            ))}
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                marginTop: 8, padding: "11px", borderRadius: 10, border: "none",
                background: submitting ? "#94a3b8" : "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer"
              }}
            >{submitting ? "⏳ Submitting..." : "✅ Submit"}</button>
          </div>
        </Card>
      )}
    </div>
  );
};

const DonationPage = ({ donations, refresh }) => {
  const [tab, setTab] = useState("list");
  const [formData, setFormData] = useState({ type: "Clothes" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Donation recorded successfully!");
        setFormData({ type: "Clothes" });
        refresh();
        setTab("list");
      } else {
        alert("Failed to add donation.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting donation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <SectionHeader title="📦 Donation Management" subtitle={`${donations.length} total donations — ${donations.reduce((a, d) => a + d.quantity, 0)} items`} />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["list", "add"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
            fontWeight: 600, fontSize: 13,
            background: tab === t ? "#3b82f6" : "#f1f5f9",
            color: tab === t ? "#fff" : "#64748b"
          }}>{t === "list" ? "📋 Donation List" : "➕ Add Donation"}</button>
        ))}
      </div>
      {tab === "list" ? (
        <Card>
          <Table
            cols={["ID", "Donor", "Type", "Qty", "Description", "Date", "Status"]}
            rows={donations.map(d => [d.id, d.donor_name, d.type, d.quantity, d.description, d.donation_date ? new Date(d.donation_date).toLocaleDateString() : '—', d.status])}
          />
        </Card>
      ) : (
        <Card style={{ maxWidth: 520 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: "#1e293b" }}>Add New Donation</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { name: "donor_name", label: "Donor Name" },
              { name: "type", label: "Donation Type" },
              { name: "quantity", label: "Quantity" },
              { name: "description", label: "Description" },
              { name: "address", label: "Collection Address" }
            ].map(f => (
              <div key={f.name}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>{f.label}</label>
                {f.name === "type" ? (
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8,
                      border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none",
                      boxSizing: "border-box", color: "#334155", background: "#fff"
                    }}>
                    <option>Clothes</option><option>Books</option>
                  </select>
                ) : (
                  <input 
                    placeholder={`Enter ${f.label.toLowerCase()}`} 
                    type={f.name === "quantity" ? "number" : "text"} 
                    value={formData[f.name] || ""}
                    onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8,
                      border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none",
                      boxSizing: "border-box", color: "#334155"
                    }}
                    onFocus={e => e.target.style.borderColor = "#3b82f6"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                )}
              </div>
            ))}
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                marginTop: 8, padding: "11px", borderRadius: 10, border: "none",
                background: submitting ? "#94a3b8" : "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer"
              }}
            >{submitting ? "⏳ Submitting..." : "✅ Submit Donation"}</button>
          </div>
        </Card>
      )}
    </div>
  );
};

const RequestsPage = ({ requests }) => (
  <div>
    <SectionHeader title="📋 Donation Requests" subtitle="NGO requests and approval status" />
    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
      {[
        { label: "Total Requests", value: requests.length, color: "#3b82f6" },
        { label: "Approved", value: requests.filter(r => r.status === "Approved").length, color: "#10b981" },
        { label: "Pending", value: requests.filter(r => r.status === "Pending").length, color: "#f59e0b" },
      ].map((s, i) => (
        <div key={i} style={{
          background: "#fff", borderRadius: 12, padding: "16px 22px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)", flex: 1, minWidth: 130,
          borderLeft: `4px solid ${s.color}`
        }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
    <Card>
      <Table
        cols={["Request ID", "NGO", "Type", "Quantity", "Urgency", "Date", "Status"]}
        rows={requests.map(r => [r.id, r.ngo_name, r.type, r.quantity, r.urgency, r.request_date ? new Date(r.request_date).toLocaleDateString() : '—', r.status])}
      />
    </Card>
  </div>
);

const DeliveryPage = ({ deliveries, donations, volunteers, ngos }) => (
  <div>
    <SectionHeader title="🚚 Delivery Management" subtitle="Volunteer assignments and delivery tracking" />
    <Card style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#1e293b" }}>Assign Volunteer to Donation (Simulator Only)</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {["Donation ID", "Volunteer", "Target NGO"].map(f => (
          <div key={f} style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{f}</label>
            <select style={{
              width: "100%", padding: "10px 14px", borderRadius: 8,
              border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none",
              background: "#fff", color: "#334155"
            }}>
              {f === "Donation ID" && donations.map(d => <option key={d.id}>{d.id} – {d.donor_name}</option>)}
              {f === "Volunteer" && volunteers.filter(v => v.status === "Available").map(v => <option key={v.id}>{v.name}</option>)}
              {f === "Target NGO" && ngos.map(n => <option key={n.id}>{n.name}</option>)}
            </select>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button style={{
            padding: "10px 22px", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer"
          }}>🚀 Assign</button>
        </div>
      </div>
    </Card>
    <Card>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#1e293b" }}>Delivery Tracker</div>
      <Table
        cols={["Delivery ID", "Donation ID", "Volunteer", "NGO", "Scheduled Date", "Status"]}
        rows={deliveries.map(d => [d.id, d.donation_id, d.volunteer_name, d.ngo_name, d.delivery_date ? new Date(d.delivery_date).toLocaleDateString() : '—', d.status])}
      />
    </Card>
  </div>
);

const FeedbackPage = ({ feedback }) => (
  <div>
    <SectionHeader title="⭐ Feedback & Ratings" subtitle="Reviews from donors and NGOs" />
    <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
      {[
        { label: "Total Reviews", value: feedback.length, color: "#3b82f6" },
        { label: "Avg Rating", value: feedback.length > 0 ? (feedback.reduce((a, f) => a + f.rating, 0) / feedback.length).toFixed(1) + " ★" : '—', color: "#f59e0b" },
        { label: "5-Star Reviews", value: feedback.filter(f => f.rating === 5).length, color: "#10b981" },
      ].map((s, i) => (
        <div key={i} style={{
          background: "#fff", borderRadius: 12, padding: "16px 22px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)", flex: 1, minWidth: 130,
          borderLeft: `4px solid ${s.color}`
        }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {feedback.map(f => (
        <Card key={f.id} style={{ padding: "18px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: f.entity_type === "NGO" ? "#3b82f620" : "#10b98120",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18
                }}>{f.entity_type === "NGO" ? "🏢" : "👤"}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{f.from_entity}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{f.entity_type} · {f.feedback_date ? new Date(f.feedback_date).toLocaleDateString() : '—'}</div>
                </div>
              </div>
              <p style={{ color: "#475569", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{f.comment}</p>
            </div>
            <StarRating rating={f.rating} />
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const QueryExplorer = () => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [search, setSearch] = useState("");

  const allQueries = Object.entries(SQL_QUERIES).flatMap(([cat, qs]) =>
    qs.map(q => ({ ...q, category: cat }))
  );
  const filtered = search
    ? allQueries.filter(q => q.title.toLowerCase().includes(search.toLowerCase()))
    : null;

  const handleRun = async () => {
    if (!selectedQuery) return;
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: selectedQuery.sql }),
      });
      const data = await res.json();
      if (data.error) {
        alert("SQL Error: " + data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      alert("Error executing query.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <SectionHeader title="🔍 SQL Query Explorer" subtitle="Browse 50+ queries across Basic, Joins, Aggregation & Advanced categories" />
      <div style={{ display: "flex", gap: 16, height: "calc(100vh - 200px)", minHeight: 520 }}>
        {/* Left Panel */}
        <div style={{
          width: 280, flexShrink: 0, background: "#fff",
          borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔎 Search queries..."
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 8,
                border: "1.5px solid #e2e8f0", fontSize: 12, outline: "none",
                boxSizing: "border-box", color: "#334155"
              }}
              onFocus={e => e.target.style.borderColor = "#3b82f6"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: "8px 0" }}>
            {(search && filtered ? [["🔎 Search Results", filtered]] : Object.entries(SQL_QUERIES)).map(([cat, queries]) => (
              <div key={cat}>
                <div style={{
                  padding: "8px 16px 4px", fontSize: 10, fontWeight: 800,
                  color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em"
                }}>{cat}</div>
                {queries.map(q => (
                  <div key={q.id} onClick={() => { setSelectedQuery(q); setResult(null); }}
                    style={{
                      padding: "9px 16px", cursor: "pointer", fontSize: 12,
                      fontWeight: selectedQuery?.id === q.id ? 700 : 500,
                      color: selectedQuery?.id === q.id ? "#3b82f6" : "#475569",
                      background: selectedQuery?.id === q.id ? "#eff6ff" : "transparent",
                      borderLeft: selectedQuery?.id === q.id ? "3px solid #3b82f6" : "3px solid transparent",
                      transition: "all 0.15s"
                    }}
                    onMouseEnter={e => { if (selectedQuery?.id !== q.id) e.currentTarget.style.background = "#f8fafc"; }}
                    onMouseLeave={e => { if (selectedQuery?.id !== q.id) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{
                      display: "inline-block", width: 22, height: 16, fontSize: 10,
                      background: "#f1f5f9", borderRadius: 4, textAlign: "center",
                      lineHeight: "16px", color: "#94a3b8", marginRight: 8, fontWeight: 700
                    }}>{q.id}</span>
                    {q.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          {!selectedQuery ? (
            <div style={{
              flex: 1, background: "#fff", borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", color: "#94a3b8"
            }}>
              <div style={{ fontSize: 48 }}>🗄️</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 12 }}>Select a query to begin</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>50+ SQL queries across 4 categories</div>
            </div>
          ) : (
            <>
              {/* Result Table */}
              <Card style={{ flex: 1, overflow: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>
                      📊 {selectedQuery.title}
                    </div>
                    <button onClick={handleRun} disabled={running} style={{
                      padding: "6px 16px", borderRadius: 8, border: "none",
                      background: running ? "#475569" : "linear-gradient(135deg, #3b82f6, #2563eb)",
                      color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6,
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                    }}>
                      {running ? "⏳ Running..." : "▶ Run Query"}
                    </button>
                  </div>
                  {result && (
                    <span style={{
                      background: "#10b98118", color: "#10b981",
                      fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600
                    }}>✓ {result.rows.length} row{result.rows.length !== 1 ? "s" : ""} returned</span>
                  )}
                </div>
                {running && (
                  <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                    <div style={{ fontSize: 24 }}>⏳</div>
                    <div style={{ fontSize: 13, marginTop: 8 }}>Executing query...</div>
                  </div>
                )}
                {!running && !result && (
                  <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 13 }}>
                    Click ▶ Run Query to see results
                  </div>
                )}
                {!running && result && (
                  <Table cols={result.cols} rows={result.rows.map(r => r.map(String))} />
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProceduresPage = ({ donations, volunteers, ngos, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ type: 'assign' });

  const handleCall = async (endpoint, payload) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/procedures/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Procedure executed successfully!");
        refresh();
      } else {
        alert("Business Rule Error: " + data.error);
      }
    } catch (err) {
      alert("Execution Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="⚙️ Database Stored Procedures" subtitle="Execute complex business logic through secure database routines" />
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Assign Delivery Card */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ fontSize: 24 }}>🚚</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Assign Delivery (Procedure)</div>
          </div>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
            Uses <code>assign_delivery_proc</code>. Ensures volunteer is <b>Available</b> and NGO is <b>Active</b>.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 5 }}>Donation ID</label>
              <select 
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13 }}
                onChange={e => setForm({...form, donation_id: e.target.value})}
              >
                <option value="">Select Donation</option>
                {donations.filter(d => d.status === 'Pending').map(d => (
                  <option key={d.id} value={d.id}>{d.id} - {d.donor_name} ({d.type})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 5 }}>Volunteer Name</label>
              <select 
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13 }}
                onChange={e => setForm({...form, volunteer_name: e.target.value})}
              >
                <option value="">Select Volunteer</option>
                {volunteers.map(v => (
                  <option key={v.id} value={v.name}>{v.name} ({v.status})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 5 }}>Target NGO</label>
              <select 
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13 }}
                onChange={e => setForm({...form, ngo_name: e.target.value})}
              >
                <option value="">Select NGO</option>
                {ngos.map(n => (
                  <option key={n.id} value={n.name}>{n.name} ({n.status})</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => handleCall('assign-delivery', { donation_id: form.donation_id, volunteer_name: form.volunteer_name, ngo_name: form.ngo_name })}
              disabled={loading}
              style={{
                marginTop: 10, padding: "12px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer"
              }}>
              {loading ? "⏳ Executing..." : "⚡ CALL assign_delivery_proc"}
            </button>
          </div>
        </Card>

        {/* Finish Delivery Card */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ fontSize: 24 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Complete Delivery (Procedure)</div>
          </div>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
            Uses <code>complete_delivery_proc</code>. Automatically updates volunteer score and donation status.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 5 }}>Select Active Delivery</label>
              <select 
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13 }}
                onChange={e => setForm({...form, delivery_id: e.target.value})}
              >
                <option value="">Select Delivery</option>
                {/* Fallback for initial demo */}
                <option value="DEL004">DEL004 - Meera Iyer to Asha Foundation</option>
                {/* Fallback for testing */}
                <option value="DEL001">DEL001 - Rohan Desai to Asha Foundation</option>
              </select>
            </div>
            <button 
              onClick={() => handleCall('complete-delivery', { delivery_id: form.delivery_id })}
              disabled={loading}
              style={{
                marginTop: 10, padding: "12px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer"
              }}>
              {loading ? "⏳ Executing..." : "⚡ CALL complete_delivery_proc"}
            </button>
            <div style={{ marginTop: 10, padding: 12, background: "#f8fafc", borderRadius: 8, fontSize: 11, color: "#64748b" }}>
              <b>Business Logic:</b> This procedure updates 3 tables simultaneously (Deliveries, Donations, Volunteers) ensuring data consistency.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── LOGIN PAGE ──────────────────────────────────────────────────────────────

const LoginPage = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleLogin = (role) => {
    setLoading(true);
    setTimeout(() => {
      onLogin(role);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(circle at top right, #f1f5f9 0%, #e2e8f0 100%)",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        width: 440, background: "#fff", borderRadius: 24, padding: 40,
        boxShadow: "0 20px 50px rgba(0,0,0,0.1)", textAlign: "center"
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: "0 auto 20px",
          background: "linear-gradient(135deg, #3b82f6, #10b981)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32
        }}>🫶</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: "0 0 8px" }}>Welcome Back</h1>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>Donation Management System (DBMS Project)</p>

        <div style={{
          display: "flex", background: "#f1f5f9", padding: 4, borderRadius: 12, marginBottom: 24
        }}>
          {["user", "admin"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 13, textTransform: "capitalize",
              background: activeTab === t ? "#fff" : "transparent",
              color: activeTab === t ? "#3b82f6" : "#64748b",
              boxShadow: activeTab === t ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s"
            }}>{t} Portal</button>
          ))}
        </div>

        <div style={{ textAlign: "left", marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8 }}>E-mail Address</label>
          <input disabled type="email" value={activeTab === 'admin' ? 'admin@donation.org' : 'user@community.org'} style={{
            width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 14
          }} />
        </div>

        <button 
          onClick={() => handleLogin(activeTab)}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
            boxShadow: "0 10px 20px rgba(15, 23, 42, 0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10
          }}>
          {loading ? "⌛ Logging in..." : `🚀 Enter ${activeTab === 'admin' ? 'Admin' : 'Entity'} Dashboard`}
        </button>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8" }}>
          {activeTab === 'user' ? 'Donors, Volunteers, and NGOs use this portal' : 'Only authorized administrators can access this area'}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────

const NAV = [
  { key: "dashboard", icon: "📊", label: "Dashboard" },
  { key: "donors", icon: "👤", label: "Donors" },
  { key: "ngos", icon: "🏢", label: "NGOs" },
  { key: "volunteers", icon: "🤝", label: "Volunteers" },
  { key: "donations", icon: "📦", label: "Donations" },
  { key: "requests", icon: "📋", label: "Requests" },
  { key: "delivery", icon: "🚚", label: "Delivery" },
  { key: "feedback", icon: "⭐", label: "Feedback" },
  { key: "procedures", icon: "⚙️", label: "Procedures" },
  { key: "queries", icon: "🔍", label: "Query Explorer" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [userRole, setUserRole] = useState(null); // 'user' or 'admin'
  const [data, setData] = useState({
    donors: [], ngos: [], volunteers: [], donations: [],
    requests: [], deliveries: [], feedback: []
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [donors, ngos, volunteers, donations, requests, deliveries, feedback] = await Promise.all([
        fetch('/api/donors').then(res => res.json()),
        fetch('/api/ngos').then(res => res.json()),
        fetch('/api/volunteers').then(res => res.json()),
        fetch('/api/donations').then(res => res.json()),
        fetch('/api/requests').then(res => res.json()),
        fetch('/api/deliveries').then(res => res.json()),
        fetch('/api/feedback').then(res => res.json()),
      ]);
      setData({ donors, ngos, volunteers, donations, requests, deliveries, feedback });
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole) fetchData();
  }, [userRole]);

  if (!userRole) {
    return <LoginPage onLogin={setUserRole} />;
  }

  const filteredNav = NAV.filter(item => {
    if (userRole === 'admin') return true;
    return item.key !== 'queries';
  });

  const renderPage = () => {
    const props = { ...data, refresh: fetchData };
    if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>⌛ Loading data from database...</div>;

    if (page === "dashboard") return <DashboardPage {...props} />;
    if (page === "donors") return <UserPage section="donors" {...props} />;
    if (page === "ngos") return <UserPage section="ngos" {...props} />;
    if (page === "volunteers") return <UserPage section="volunteers" {...props} />;
    if (page === "donations") return <DonationPage {...props} />;
    if (page === "requests") return <RequestsPage {...props} />;
    if (page === "delivery") return <DeliveryPage {...props} />;
    if (page === "feedback") return <FeedbackPage {...props} />;
    if (page === "procedures") return <ProceduresPage {...props} />;
    if (page === "queries") return <QueryExplorer />;
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#f1f5f9",
      fontFamily: "'Segoe UI', 'Inter', sans-serif"
    }}>
      {/* Sidebar */}
      <div style={{
        width: 230, background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
        display: "flex", flexDirection: "column", position: "fixed",
        top: 0, left: 0, bottom: 0, zIndex: 100, overflowY: "auto"
      }}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #3b82f6, #10b981)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0
            }}>🫶</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>DonationMS</div>
              <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>{userRole === 'admin' ? 'Admin Board' : 'User Portal'}</div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#334155", margin: "0 16px 12px" }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 10px" }}>
          {filteredNav.map(item => (
            <div key={item.key} onClick={() => setPage(item.key)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 10, marginBottom: 2,
                cursor: "pointer", transition: "all 0.15s",
                background: page === item.key ? "linear-gradient(135deg, #3b82f620, #10b98120)" : "transparent",
                borderLeft: page === item.key ? "3px solid #3b82f6" : "3px solid transparent",
              }}
              onMouseEnter={e => { if (page !== item.key) e.currentTarget.style.background = "#ffffff10"; }}
              onMouseLeave={e => { if (page !== item.key) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{
                fontSize: 13, fontWeight: page === item.key ? 700 : 500,
                color: page === item.key ? "#60a5fa" : "#94a3b8"
              }}>{item.label}</span>
              {item.key === "queries" && (
                <span style={{
                  marginLeft: "auto", background: "#3b82f6", color: "#fff",
                  fontSize: 9, padding: "2px 6px", borderRadius: 20, fontWeight: 700
                }}>50+</span>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "0 10px", marginBottom: 10 }}>
          <div onClick={() => setUserRole(null)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 10,
              cursor: "pointer", transition: "all 0.15s", color: "#ef4444"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#ef444410"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: 16 }}>🚪</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Sign Out</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 16px 20px",
          borderTop: "1px solid #334155", marginTop: 8
        }}>
          <div style={{ color: "#64748b", fontSize: 10, textAlign: "center", lineHeight: 1.6 }}>
            Clothes & Books<br />Donation Management System<br />
            <span style={{ color: "#475569" }}>VIT Pune · IT Dept · 2024</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 230, flex: 1, padding: 28, minWidth: 0 }}>
        {/* Header */}
        <div style={{
          background: "#fff", borderRadius: 14,
          padding: "14px 22px", marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
              {NAV.find(n => n.key === page)?.icon} {NAV.find(n => n.key === page)?.label}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
              Connected as: <span style={{ color: "#3b82f6", fontWeight: 700, textTransform: "uppercase" }}>{userRole}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              background: "#f1f5f9", borderRadius: 8, padding: "6px 14px",
              fontSize: 12, color: "#64748b", fontWeight: 500
            }}>
              📅 {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #10b981)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer"
            }} title={userRole}>{userRole?.charAt(0).toUpperCase()}</div>
          </div>
        </div>

        {renderPage()}
      </div>
    </div>
  );
}
