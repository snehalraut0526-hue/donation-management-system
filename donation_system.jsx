import { useState, useEffect } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const DONORS = [
  { id: 1, name: "Priya Sharma", email: "priya@gmail.com", phone: "9812345678", city: "Pune", donations: 5, joined: "2024-01-15" },
  { id: 2, name: "Rahul Mehta", email: "rahul@outlook.com", phone: "9823456789", city: "Mumbai", donations: 3, joined: "2024-02-20" },
  { id: 3, name: "Sneha Patil", email: "sneha@yahoo.com", phone: "9834567890", city: "Nashik", donations: 7, joined: "2023-11-10" },
  { id: 4, name: "Amit Joshi", email: "amit@gmail.com", phone: "9845678901", city: "Pune", donations: 2, joined: "2024-03-05" },
  { id: 5, name: "Kavita Nair", email: "kavita@gmail.com", phone: "9856789012", city: "Kolhapur", donations: 4, joined: "2024-01-28" },
];

const NGOS = [
  { id: 1, name: "Asha Foundation", city: "Pune", focus: "Clothes", contact: "9900112233", status: "Active", requests: 8 },
  { id: 2, name: "Vidya Daan Trust", city: "Mumbai", focus: "Books", contact: "9900223344", status: "Active", requests: 12 },
  { id: 3, name: "Sahyog NGO", city: "Nashik", focus: "Both", contact: "9900334455", status: "Active", requests: 5 },
  { id: 4, name: "Jan Seva Samiti", city: "Nagpur", focus: "Clothes", contact: "9900445566", status: "Inactive", requests: 3 },
];

const VOLUNTEERS = [
  { id: 1, name: "Rohan Desai", phone: "9700112233", city: "Pune", deliveries: 12, status: "Available" },
  { id: 2, name: "Anjali Singh", phone: "9700223344", city: "Mumbai", deliveries: 8, status: "On Delivery" },
  { id: 3, name: "Suresh Kumar", phone: "9700334455", city: "Nashik", deliveries: 15, status: "Available" },
  { id: 4, name: "Meera Iyer", phone: "9700445566", city: "Pune", deliveries: 6, status: "Available" },
];

const DONATIONS = [
  { id: "DON001", donor: "Priya Sharma", type: "Clothes", qty: 10, desc: "Winter jackets & sweaters", date: "2024-04-01", status: "Delivered" },
  { id: "DON002", donor: "Rahul Mehta", type: "Books", qty: 25, desc: "Class 8-10 textbooks", date: "2024-04-02", status: "Pending" },
  { id: "DON003", donor: "Sneha Patil", type: "Clothes", qty: 15, desc: "Children's clothes", date: "2024-04-03", status: "In Transit" },
  { id: "DON004", donor: "Amit Joshi", type: "Books", qty: 30, desc: "Engineering reference books", date: "2024-04-04", status: "Delivered" },
  { id: "DON005", donor: "Kavita Nair", type: "Clothes", qty: 8, desc: "Formal shirts & trousers", date: "2024-04-05", status: "Pending" },
  { id: "DON006", donor: "Priya Sharma", type: "Books", qty: 20, desc: "Children's story books", date: "2024-04-06", status: "Approved" },
];

const REQUESTS = [
  { id: "REQ001", ngo: "Asha Foundation", type: "Clothes", qty: 50, urgency: "High", date: "2024-04-01", status: "Approved" },
  { id: "REQ002", ngo: "Vidya Daan Trust", type: "Books", qty: 100, urgency: "Medium", date: "2024-04-02", status: "Pending" },
  { id: "REQ003", ngo: "Sahyog NGO", type: "Both", qty: 30, urgency: "Low", date: "2024-04-03", status: "Pending" },
  { id: "REQ004", ngo: "Jan Seva Samiti", type: "Clothes", qty: 25, urgency: "High", date: "2024-04-04", status: "Approved" },
  { id: "REQ005", ngo: "Asha Foundation", type: "Books", qty: 60, urgency: "Medium", date: "2024-04-05", status: "Pending" },
];

const DELIVERIES = [
  { id: "DEL001", donation: "DON001", volunteer: "Rohan Desai", ngo: "Asha Foundation", date: "2024-04-03", status: "Delivered" },
  { id: "DEL002", donation: "DON003", volunteer: "Anjali Singh", ngo: "Sahyog NGO", date: "2024-04-05", status: "In Transit" },
  { id: "DEL003", donation: "DON004", volunteer: "Suresh Kumar", ngo: "Vidya Daan Trust", date: "2024-04-06", status: "Delivered" },
  { id: "DEL004", donation: "DON006", volunteer: "Meera Iyer", ngo: "Asha Foundation", date: "2024-04-08", status: "Assigned" },
];

const FEEDBACKS = [
  { id: 1, from: "Asha Foundation", type: "NGO", rating: 5, comment: "Excellent quality clothes received. Very well maintained.", date: "2024-04-04" },
  { id: 2, from: "Priya Sharma", type: "Donor", rating: 4, comment: "Smooth process, quick pickup. Happy to donate more.", date: "2024-04-05" },
  { id: 3, from: "Vidya Daan Trust", type: "NGO", rating: 5, comment: "Books in great condition, students are very happy!", date: "2024-04-06" },
  { id: 4, from: "Rahul Mehta", type: "Donor", rating: 3, comment: "Good initiative but pickup was slightly delayed.", date: "2024-04-07" },
  { id: 5, from: "Sahyog NGO", type: "NGO", rating: 4, comment: "Well organized and timely delivery.", date: "2024-04-08" },
];

const ACTIVITY = [
  { icon: "📦", text: "New donation by Priya Sharma – 10 Clothes", time: "2 hrs ago", color: "#3b82f6" },
  { icon: "🏢", text: "Asha Foundation request approved", time: "4 hrs ago", color: "#10b981" },
  { icon: "🚚", text: "Delivery DEL002 is now In Transit", time: "6 hrs ago", color: "#f59e0b" },
  { icon: "⭐", text: "Vidya Daan Trust left a 5-star review", time: "1 day ago", color: "#8b5cf6" },
  { icon: "👤", text: "New volunteer Meera Iyer registered", time: "1 day ago", color: "#ec4899" },
  { icon: "📚", text: "Amit Joshi donated 30 books", time: "2 days ago", color: "#3b82f6" },
];

// ─── SQL QUERIES ─────────────────────────────────────────────────────────────

const SQL_QUERIES = {
  "🔵 Basic Queries": [
    { id: 1, title: "All Donors", sql: "SELECT * FROM donors;", result: { cols: ["ID","Name","Email","City","Donations"], rows: DONORS.map(d=>[d.id,d.name,d.email,d.city,d.donations]) } },
    { id: 2, title: "All NGOs", sql: "SELECT * FROM ngos;", result: { cols: ["ID","Name","City","Focus","Status"], rows: NGOS.map(n=>[n.id,n.name,n.city,n.focus,n.status]) } },
    { id: 3, title: "All Donations", sql: "SELECT * FROM donations;", result: { cols: ["ID","Donor","Type","Qty","Status"], rows: DONATIONS.map(d=>[d.id,d.donor,d.type,d.qty,d.status]) } },
    { id: 4, title: "All Volunteers", sql: "SELECT * FROM volunteers;", result: { cols: ["ID","Name","City","Deliveries","Status"], rows: VOLUNTEERS.map(v=>[v.id,v.name,v.city,v.deliveries,v.status]) } },
    { id: 5, title: "All Requests", sql: "SELECT * FROM donation_requests;", result: { cols: ["ID","NGO","Type","Qty","Status"], rows: REQUESTS.map(r=>[r.id,r.ngo,r.type,r.qty,r.status]) } },
    { id: 6, title: "All Deliveries", sql: "SELECT * FROM deliveries;", result: { cols: ["ID","Donation","Volunteer","NGO","Status"], rows: DELIVERIES.map(d=>[d.id,d.donation,d.volunteer,d.ngo,d.status]) } },
    { id: 7, title: "Active NGOs Only", sql: "SELECT * FROM ngos WHERE status = 'Active';", result: { cols: ["ID","Name","City","Focus"], rows: NGOS.filter(n=>n.status==="Active").map(n=>[n.id,n.name,n.city,n.focus]) } },
    { id: 8, title: "Clothes Donations", sql: "SELECT * FROM donations WHERE type = 'Clothes';", result: { cols: ["ID","Donor","Qty","Status"], rows: DONATIONS.filter(d=>d.type==="Clothes").map(d=>[d.id,d.donor,d.qty,d.status]) } },
    { id: 9, title: "Pending Requests", sql: "SELECT * FROM donation_requests WHERE status = 'Pending';", result: { cols: ["ID","NGO","Type","Qty"], rows: REQUESTS.filter(r=>r.status==="Pending").map(r=>[r.id,r.ngo,r.type,r.qty]) } },
    { id: 10, title: "Available Volunteers", sql: "SELECT * FROM volunteers WHERE status = 'Available';", result: { cols: ["ID","Name","City","Deliveries"], rows: VOLUNTEERS.filter(v=>v.status==="Available").map(v=>[v.id,v.name,v.city,v.deliveries]) } },
    { id: 11, title: "Donors from Pune", sql: "SELECT * FROM donors WHERE city = 'Pune';", result: { cols: ["ID","Name","Email","Phone"], rows: DONORS.filter(d=>d.city==="Pune").map(d=>[d.id,d.name,d.email,d.phone]) } },
    { id: 12, title: "Delivered Donations", sql: "SELECT * FROM donations WHERE status = 'Delivered';", result: { cols: ["ID","Donor","Type","Qty"], rows: DONATIONS.filter(d=>d.status==="Delivered").map(d=>[d.id,d.donor,d.type,d.qty]) } },
  ],
  "🟢 Join Queries": [
    { id: 13, title: "Donations with Donor Details", sql: `SELECT d.donation_id, dn.name AS donor_name,\n  d.type, d.quantity, d.status\nFROM donations d\nJOIN donors dn ON d.donor_id = dn.donor_id;`, result: { cols: ["Donation ID","Donor","Type","Qty","Status"], rows: DONATIONS.map(d=>[d.id,d.donor,d.type,d.qty,d.status]) } },
    { id: 14, title: "Requests with NGO Info", sql: `SELECT r.request_id, n.name AS ngo_name,\n  n.city, r.type, r.quantity, r.status\nFROM donation_requests r\nJOIN ngos n ON r.ngo_id = n.ngo_id;`, result: { cols: ["Request ID","NGO","City","Type","Qty","Status"], rows: REQUESTS.map(r=>[r.id,r.ngo,"Pune",r.type,r.qty,r.status]) } },
    { id: 15, title: "Deliveries with Volunteer", sql: `SELECT dl.delivery_id, v.name AS volunteer,\n  dl.donation_id, dl.status\nFROM deliveries dl\nJOIN volunteers v ON dl.volunteer_id = v.volunteer_id;`, result: { cols: ["Delivery ID","Volunteer","Donation ID","Status"], rows: DELIVERIES.map(d=>[d.id,d.volunteer,d.donation,d.status]) } },
    { id: 16, title: "Donor & NGO City Match", sql: `SELECT dn.name AS donor, n.name AS ngo,\n  dn.city\nFROM donors dn\nJOIN ngos n ON dn.city = n.city;`, result: { cols: ["Donor","NGO","City"], rows: [["Priya Sharma","Asha Foundation","Pune"],["Amit Joshi","Asha Foundation","Pune"],["Meera Iyer","Asha Foundation","Pune"]] } },
    { id: 17, title: "Approved Requests & Deliveries", sql: `SELECT r.request_id, n.name, d.delivery_id\nFROM donation_requests r\nJOIN ngos n ON r.ngo_id = n.ngo_id\nJOIN deliveries d ON r.request_id = d.request_id\nWHERE r.status = 'Approved';`, result: { cols: ["Request ID","NGO","Delivery ID"], rows: [["REQ001","Asha Foundation","DEL001"],["REQ004","Jan Seva Samiti","DEL003"]] } },
    { id: 18, title: "Feedback with Ratings", sql: `SELECT f.feedback_id, f.from_entity,\n  f.rating, f.comment\nFROM feedbacks f\nORDER BY f.rating DESC;`, result: { cols: ["ID","From","Rating","Comment"], rows: FEEDBACKS.sort((a,b)=>b.rating-a.rating).map(f=>[f.id,f.from,f.rating,f.comment.slice(0,30)+"..."]) } },
    { id: 19, title: "Volunteer Delivery Count", sql: `SELECT v.name, COUNT(d.delivery_id) AS total\nFROM volunteers v\nLEFT JOIN deliveries d ON v.volunteer_id = d.volunteer_id\nGROUP BY v.name;`, result: { cols: ["Volunteer","Total Deliveries"], rows: VOLUNTEERS.map(v=>[v.name,v.deliveries]) } },
    { id: 20, title: "Donations per NGO Request", sql: `SELECT n.name, COUNT(r.request_id) AS requests\nFROM ngos n\nLEFT JOIN donation_requests r ON n.ngo_id = r.ngo_id\nGROUP BY n.name;`, result: { cols: ["NGO Name","Total Requests"], rows: NGOS.map(n=>[n.name,n.requests]) } },
  ],
  "🟡 Aggregation Queries": [
    { id: 21, title: "Total Donations Count", sql: "SELECT COUNT(*) AS total_donations FROM donations;", result: { cols: ["Total Donations"], rows: [[DONATIONS.length]] } },
    { id: 22, title: "Total Items Donated", sql: "SELECT SUM(quantity) AS total_items FROM donations;", result: { cols: ["Total Items"], rows: [[DONATIONS.reduce((a,d)=>a+d.qty,0)]] } },
    { id: 23, title: "Avg Donations per Donor", sql: "SELECT AVG(donation_count) AS avg FROM donors;", result: { cols: ["Average Donations"], rows: [[(DONORS.reduce((a,d)=>a+d.donations,0)/DONORS.length).toFixed(2)]] } },
    { id: 24, title: "Donations by Type", sql: `SELECT type, COUNT(*) AS count\nFROM donations\nGROUP BY type;`, result: { cols: ["Type","Count"], rows: [["Clothes",DONATIONS.filter(d=>d.type==="Clothes").length],["Books",DONATIONS.filter(d=>d.type==="Books").length]] } },
    { id: 25, title: "Requests by Status", sql: `SELECT status, COUNT(*) AS total\nFROM donation_requests\nGROUP BY status;`, result: { cols: ["Status","Count"], rows: [["Approved",REQUESTS.filter(r=>r.status==="Approved").length],["Pending",REQUESTS.filter(r=>r.status==="Pending").length]] } },
    { id: 26, title: "Max Donation Quantity", sql: "SELECT MAX(quantity) AS max_qty FROM donations;", result: { cols: ["Max Quantity"], rows: [[Math.max(...DONATIONS.map(d=>d.qty))]] } },
    { id: 27, title: "Min Donation Quantity", sql: "SELECT MIN(quantity) AS min_qty FROM donations;", result: { cols: ["Min Quantity"], rows: [[Math.min(...DONATIONS.map(d=>d.qty))]] } },
    { id: 28, title: "Average NGO Rating", sql: "SELECT AVG(rating) AS avg_rating FROM feedbacks WHERE type='NGO';", result: { cols: ["Average NGO Rating"], rows: [[(FEEDBACKS.filter(f=>f.type==="NGO").reduce((a,f)=>a+f.rating,0)/3).toFixed(2)]] } },
    { id: 29, title: "Volunteers per City", sql: `SELECT city, COUNT(*) AS volunteers\nFROM volunteers\nGROUP BY city;`, result: { cols: ["City","Volunteers"], rows: [["Pune",2],["Mumbai",1],["Nashik",1]] } },
    { id: 30, title: "Donors with 5+ Donations", sql: `SELECT name, donation_count FROM donors\nWHERE donation_count >= 5;`, result: { cols: ["Name","Donations"], rows: DONORS.filter(d=>d.donations>=5).map(d=>[d.name,d.donations]) } },
    { id: 31, title: "NGO Request Totals", sql: `SELECT ngo_name, SUM(quantity) AS total_items\nFROM donation_requests\nGROUP BY ngo_name\nORDER BY total_items DESC;`, result: { cols: ["NGO","Total Items Requested"], rows: [["Vidya Daan Trust",160],["Asha Foundation",110],["Sahyog NGO",30],["Jan Seva Samiti",25]] } },
    { id: 32, title: "Deliveries by Status", sql: `SELECT status, COUNT(*) AS count\nFROM deliveries GROUP BY status;`, result: { cols: ["Status","Count"], rows: [["Delivered",2],["In Transit",1],["Assigned",1]] } },
  ],
  "🔴 Advanced Queries": [
    { id: 33, title: "Top Donors by Quantity", sql: `SELECT dn.name, SUM(d.quantity) AS total\nFROM donors dn\nJOIN donations d ON dn.donor_id = d.donor_id\nGROUP BY dn.name\nORDER BY total DESC\nLIMIT 3;`, result: { cols: ["Donor","Total Items"], rows: [["Sneha Patil",42],["Priya Sharma",30],["Amit Joshi",30]] } },
    { id: 34, title: "NGOs with Pending High-Urgency", sql: `SELECT n.name, r.urgency, r.quantity\nFROM donation_requests r\nJOIN ngos n ON r.ngo_id = n.ngo_id\nWHERE r.status = 'Pending' AND r.urgency = 'High';`, result: { cols: ["NGO","Urgency","Quantity"], rows: [["Asha Foundation","High",50]] } },
    { id: 35, title: "Subquery: Donors Above Average", sql: `SELECT name, donation_count FROM donors\nWHERE donation_count > (\n  SELECT AVG(donation_count) FROM donors\n);`, result: { cols: ["Name","Donations"], rows: DONORS.filter(d=>d.donations>DONORS.reduce((a,d)=>a+d.donations,0)/DONORS.length).map(d=>[d.name,d.donations]) } },
    { id: 36, title: "Monthly Donation Trend", sql: `SELECT MONTH(donation_date) AS month,\n  COUNT(*) AS donations\nFROM donations\nGROUP BY month\nORDER BY month;`, result: { cols: ["Month","Count"], rows: [["April 2024",6],["March 2024",4],["February 2024",3]] } },
    { id: 37, title: "Unassigned Donations", sql: `SELECT d.donation_id, d.type, d.quantity\nFROM donations d\nLEFT JOIN deliveries dl ON d.donation_id = dl.donation_id\nWHERE dl.delivery_id IS NULL;`, result: { cols: ["Donation ID","Type","Qty"], rows: [["DON002","Books",25],["DON005","Clothes",8]] } },
    { id: 38, title: "NGOs with All Requests Approved", sql: `SELECT ngo_name FROM donation_requests\nGROUP BY ngo_name\nHAVING SUM(status = 'Pending') = 0;`, result: { cols: ["NGO Name"], rows: [["Jan Seva Samiti"]] } },
    { id: 39, title: "Volunteer Efficiency Rank", sql: `SELECT name, deliveries,\n  RANK() OVER (ORDER BY deliveries DESC) AS rank\nFROM volunteers;`, result: { cols: ["Volunteer","Deliveries","Rank"], rows: [["Suresh Kumar",15,1],["Rohan Desai",12,2],["Anjali Singh",8,3],["Meera Iyer",6,4]] } },
    { id: 40, title: "Cities Without Volunteers", sql: `SELECT DISTINCT city FROM donors\nWHERE city NOT IN (\n  SELECT city FROM volunteers\n);`, result: { cols: ["City"], rows: [["Kolhapur"],["Nagpur"]] } },
    { id: 41, title: "Full Donation Journey", sql: `SELECT d.donation_id, dn.name AS donor,\n  v.name AS volunteer, n.name AS ngo,\n  dl.status AS delivery_status\nFROM donations d\nJOIN donors dn ON d.donor_id = dn.donor_id\nJOIN deliveries dl ON d.donation_id = dl.donation_id\nJOIN volunteers v ON dl.volunteer_id = v.volunteer_id\nJOIN ngos n ON dl.ngo_id = n.ngo_id;`, result: { cols: ["Donation","Donor","Volunteer","NGO","Status"], rows: [["DON001","Priya Sharma","Rohan Desai","Asha Foundation","Delivered"],["DON003","Sneha Patil","Anjali Singh","Sahyog NGO","In Transit"],["DON004","Amit Joshi","Suresh Kumar","Vidya Daan Trust","Delivered"]] } },
    { id: 42, title: "Feedback Score by NGO", sql: `SELECT n.name, AVG(f.rating) AS avg_score\nFROM feedbacks f\nJOIN ngos n ON f.entity_id = n.ngo_id\nWHERE f.type = 'NGO'\nGROUP BY n.name\nORDER BY avg_score DESC;`, result: { cols: ["NGO","Avg Rating"], rows: [["Asha Foundation","5.00"],["Vidya Daan Trust","5.00"],["Sahyog NGO","4.00"]] } },
    { id: 43, title: "Cascade Delete Check", sql: `-- Check donations before deleting a donor\nSELECT COUNT(*) AS linked_donations\nFROM donations\nWHERE donor_id = 1;`, result: { cols: ["Linked Donations"], rows: [[2]] } },
    { id: 44, title: "Materialized View: Summary", sql: `CREATE VIEW donation_summary AS\nSELECT type, COUNT(*) AS count,\n  SUM(quantity) AS total_qty\nFROM donations\nGROUP BY type;`, result: { cols: ["Type","Count","Total Qty"], rows: [["Clothes",3,33],["Books",3,75]] } },
    { id: 45, title: "Trigger: Auto-update Stock", sql: `-- Simulates trigger on INSERT\nAFTER INSERT ON donations\nFOR EACH ROW\nUPDATE ngo_inventory\nSET available = available + NEW.quantity\nWHERE ngo_id = NEW.target_ngo;`, result: { cols: ["Trigger","Status"], rows: [["Auto Inventory Update","Active"]] } },
    { id: 46, title: "Stored Procedure: Assign Volunteer", sql: `CALL assign_volunteer(\n  p_delivery_id => 'DEL004',\n  p_volunteer_id => 3\n);`, result: { cols: ["Delivery ID","Assigned Volunteer","Status"], rows: [["DEL004","Suresh Kumar","Assigned"]] } },
    { id: 47, title: "Index Usage Analysis", sql: `EXPLAIN SELECT * FROM donations\nWHERE donor_id = 1\nAND status = 'Pending';`, result: { cols: ["Type","Key","Rows","Extra"], rows: [["ref","idx_donor_status",2,"Using index"]] } },
    { id: 48, title: "Transaction: Safe Transfer", sql: `BEGIN;\nUPDATE donations SET status='Approved'\nWHERE donation_id='DON002';\nINSERT INTO deliveries VALUES(...);\nCOMMIT;`, result: { cols: ["Transaction","Rows Affected","Status"], rows: [["BEGIN",0,"OK"],["UPDATE",1,"OK"],["INSERT",1,"OK"],["COMMIT",0,"Committed"]] } },
    { id: 49, title: "Recursive: Volunteer Chain", sql: `WITH RECURSIVE chain AS (\n  SELECT volunteer_id, supervisor_id, name\n  FROM volunteers WHERE supervisor_id IS NULL\n  UNION ALL\n  SELECT v.volunteer_id, v.supervisor_id, v.name\n  FROM volunteers v JOIN chain c\n  ON v.supervisor_id = c.volunteer_id\n)\nSELECT * FROM chain;`, result: { cols: ["ID","Supervisor","Name"], rows: [[1,"—","Suresh Kumar"],[2,"Suresh Kumar","Rohan Desai"],[3,"Suresh Kumar","Anjali Singh"],[4,"Rohan Desai","Meera Iyer"]] } },
    { id: 50, title: "Pivot: Monthly Type Summary", sql: `SELECT\n  MONTH(date) AS month,\n  SUM(CASE WHEN type='Clothes' THEN qty END) AS clothes,\n  SUM(CASE WHEN type='Books' THEN qty END) AS books\nFROM donations GROUP BY month;`, result: { cols: ["Month","Clothes","Books"], rows: [["April 2024",33,75],["March 2024",20,45],["February 2024",12,30]] } },
  ],
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

const DashboardPage = () => (
  <div>
    <SectionHeader title="📊 Dashboard Overview" subtitle="Welcome to Clothes & Books Donation Management System" />
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
      <StatCard icon="📦" label="Total Donations" value={DONATIONS.length} color="#3b82f6" sub="+2 this week" />
      <StatCard icon="👤" label="Total Donors" value={DONORS.length} color="#10b981" sub="+1 this month" />
      <StatCard icon="🏢" label="Partner NGOs" value={NGOS.length} color="#f59e0b" sub="3 active" />
      <StatCard icon="🤝" label="Volunteers" value={VOLUNTEERS.length} color="#8b5cf6" sub="3 available" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#1e293b" }}>Recent Activity</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ACTIVITY.map((a, i) => (
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
            { label: "Clothes", value: DONATIONS.filter(d => d.type === "Clothes").length, total: DONATIONS.length, color: "#3b82f6" },
            { label: "Books", value: DONATIONS.filter(d => d.type === "Books").length, total: DONATIONS.length, color: "#10b981" },
            { label: "Delivered", value: DONATIONS.filter(d => d.status === "Delivered").length, total: DONATIONS.length, color: "#f59e0b" },
            { label: "Pending", value: DONATIONS.filter(d => d.status === "Pending").length, total: DONATIONS.length, color: "#ef4444" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, color: "#475569" }}>
                <span style={{ fontWeight: 600 }}>{item.label}</span>
                <span>{item.value}/{item.total}</span>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 99, height: 8 }}>
                <div style={{
                  width: `${(item.value / item.total) * 100}%`,
                  background: item.color, height: 8, borderRadius: 99,
                  transition: "width 0.6s ease"
                }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Total Items", value: DONATIONS.reduce((a, d) => a + d.qty, 0) + " pcs", color: "#3b82f6" },
            { label: "Avg/Donation", value: (DONATIONS.reduce((a, d) => a + d.qty, 0) / DONATIONS.length).toFixed(1), color: "#10b981" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, background: s.color + "10", borderRadius: 12,
              padding: "12px 16px", border: `1px solid ${s.color}30`
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
    <Card>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#1e293b" }}>Recent Donations</div>
      <Table
        cols={["Donation ID", "Donor", "Type", "Qty", "Date", "Status"]}
        rows={DONATIONS.slice(0, 4).map(d => [d.id, d.donor, d.type, d.qty, d.date, d.status])}
      />
    </Card>
  </div>
);

const UserPage = ({ section }) => {
  const [tab, setTab] = useState("view");
  const data = section === "donors" ? DONORS : section === "ngos" ? NGOS : VOLUNTEERS;
  const cols = section === "donors"
    ? ["ID", "Name", "Email", "Phone", "City", "Donations", "Joined"]
    : section === "ngos"
    ? ["ID", "Name", "City", "Focus", "Contact", "Status", "Requests"]
    : ["ID", "Name", "Phone", "City", "Deliveries", "Status"];
  const rows = section === "donors"
    ? data.map(d => [d.id, d.name, d.email, d.phone, d.city, d.donations, d.joined])
    : section === "ngos"
    ? data.map(n => [n.id, n.name, n.city, n.focus, n.contact, n.status, n.requests])
    : data.map(v => [v.id, v.name, v.phone, v.city, v.deliveries, v.status]);

  const title = section === "donors" ? "👤 Donor Management" : section === "ngos" ? "🏢 NGO Management" : "🤝 Volunteer Management";
  const subtitle = section === "donors" ? `${DONORS.length} registered donors` : section === "ngos" ? `${NGOS.length} partner NGOs` : `${VOLUNTEERS.length} active volunteers`;

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
            {(section === "donors"
              ? ["Full Name", "Email Address", "Phone Number", "City"]
              : section === "ngos"
              ? ["Organization Name", "City", "Focus Area", "Contact Number"]
              : ["Full Name", "Phone Number", "City"]
            ).map(field => (
              <div key={field}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>{field}</label>
                <input placeholder={`Enter ${field.toLowerCase()}`} style={{
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
            <button style={{
              marginTop: 8, padding: "11px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer"
            }}>✅ Submit</button>
          </div>
        </Card>
      )}
    </div>
  );
};

const DonationPage = () => {
  const [tab, setTab] = useState("list");
  return (
    <div>
      <SectionHeader title="📦 Donation Management" subtitle={`${DONATIONS.length} total donations — ${DONATIONS.reduce((a, d) => a + d.qty, 0)} items`} />
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
            rows={DONATIONS.map(d => [d.id, d.donor, d.type, d.qty, d.desc, d.date, d.status])}
          />
        </Card>
      ) : (
        <Card style={{ maxWidth: 520 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: "#1e293b" }}>Add New Donation</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["Donor Name", "Donation Type", "Quantity", "Description", "Collection Address"].map(field => (
              <div key={field}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>{field}</label>
                {field === "Donation Type" ? (
                  <select style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none",
                    boxSizing: "border-box", color: "#334155", background: "#fff"
                  }}>
                    <option>Clothes</option><option>Books</option>
                  </select>
                ) : (
                  <input placeholder={`Enter ${field.toLowerCase()}`} type={field === "Quantity" ? "number" : "text"} style={{
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
            <button style={{
              marginTop: 8, padding: "11px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer"
            }}>✅ Submit Donation</button>
          </div>
        </Card>
      )}
    </div>
  );
};

const RequestsPage = () => (
  <div>
    <SectionHeader title="📋 Donation Requests" subtitle="NGO requests and approval status" />
    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
      {[
        { label: "Total Requests", value: REQUESTS.length, color: "#3b82f6" },
        { label: "Approved", value: REQUESTS.filter(r => r.status === "Approved").length, color: "#10b981" },
        { label: "Pending", value: REQUESTS.filter(r => r.status === "Pending").length, color: "#f59e0b" },
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
        rows={REQUESTS.map(r => [r.id, r.ngo, r.type, r.qty, r.urgency, r.date, r.status])}
      />
    </Card>
  </div>
);

const DeliveryPage = () => (
  <div>
    <SectionHeader title="🚚 Delivery Management" subtitle="Volunteer assignments and delivery tracking" />
    <Card style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#1e293b" }}>Assign Volunteer to Donation</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {["Donation ID", "Volunteer", "Target NGO"].map(f => (
          <div key={f} style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{f}</label>
            <select style={{
              width: "100%", padding: "10px 14px", borderRadius: 8,
              border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none",
              background: "#fff", color: "#334155"
            }}>
              {f === "Donation ID" && DONATIONS.map(d => <option key={d.id}>{d.id} – {d.donor}</option>)}
              {f === "Volunteer" && VOLUNTEERS.filter(v => v.status === "Available").map(v => <option key={v.id}>{v.name}</option>)}
              {f === "Target NGO" && NGOS.map(n => <option key={n.id}>{n.name}</option>)}
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
        rows={DELIVERIES.map(d => [d.id, d.donation, d.volunteer, d.ngo, d.date, d.status])}
      />
    </Card>
  </div>
);

const FeedbackPage = () => (
  <div>
    <SectionHeader title="⭐ Feedback & Ratings" subtitle="Reviews from donors and NGOs" />
    <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
      {[
        { label: "Total Reviews", value: FEEDBACKS.length, color: "#3b82f6" },
        { label: "Avg Rating", value: (FEEDBACKS.reduce((a, f) => a + f.rating, 0) / FEEDBACKS.length).toFixed(1) + " ★", color: "#f59e0b" },
        { label: "5-Star Reviews", value: FEEDBACKS.filter(f => f.rating === 5).length, color: "#10b981" },
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
      {FEEDBACKS.map(f => (
        <Card key={f.id} style={{ padding: "18px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: f.type === "NGO" ? "#3b82f620" : "#10b98120",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18
                }}>{f.type === "NGO" ? "🏢" : "👤"}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{f.from}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{f.type} · {f.date}</div>
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

  const handleRun = () => {
    if (!selectedQuery) return;
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(selectedQuery.result);
      setRunning(false);
    }, 800);
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
              {/* SQL Code Box */}
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 18px", background: "#1e293b", borderRadius: "16px 16px 0 0"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
                    <span style={{ color: "#94a3b8", fontSize: 12, marginLeft: 8, fontWeight: 600 }}>
                      Query #{selectedQuery.id} — {selectedQuery.title}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{
                      background: "#334155", color: "#94a3b8",
                      fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 600
                    }}>SQL</span>
                    <button onClick={handleRun} disabled={running} style={{
                      padding: "5px 16px", borderRadius: 6, border: "none",
                      background: running ? "#475569" : "linear-gradient(135deg, #3b82f6, #2563eb)",
                      color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6
                    }}>
                      {running ? "⏳ Running..." : "▶ Run Query"}
                    </button>
                  </div>
                </div>
                <pre style={{
                  margin: 0, padding: "18px 22px",
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  fontSize: 13, lineHeight: 1.7, color: "#e2e8f0",
                  background: "#0f172a", minHeight: 80,
                  overflowX: "auto"
                }}>
                  {selectedQuery.sql.split("\n").map((line, i) => {
                    const keywords = ["SELECT", "FROM", "WHERE", "JOIN", "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "INSERT", "UPDATE", "DELETE", "CREATE", "CALL", "WITH", "UNION", "BEGIN", "COMMIT", "AFTER", "FOR", "EXPLAIN"];
                    let highlighted = line;
                    keywords.forEach(kw => {
                      highlighted = highlighted.replace(new RegExp(`\\b${kw}\\b`, "g"), `\x01${kw}\x02`);
                    });
                    return (
                      <span key={i}>
                        {highlighted.split(/\x01|\x02/).map((part, j) =>
                          keywords.includes(part)
                            ? <span key={j} style={{ color: "#60a5fa", fontWeight: 700 }}>{part}</span>
                            : <span key={j} style={{ color: part.startsWith("--") ? "#64748b" : "#e2e8f0" }}>{part}</span>
                        )}
                        {"\n"}
                      </span>
                    );
                  })}
                </pre>
              </Card>

              {/* Result Table */}
              <Card style={{ flex: 1, overflow: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>📊 Query Results</div>
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
  { key: "queries", icon: "🔍", label: "Query Explorer" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    if (page === "dashboard") return <DashboardPage />;
    if (page === "donors") return <UserPage section="donors" />;
    if (page === "ngos") return <UserPage section="ngos" />;
    if (page === "volunteers") return <UserPage section="volunteers" />;
    if (page === "donations") return <DonationPage />;
    if (page === "requests") return <RequestsPage />;
    if (page === "delivery") return <DeliveryPage />;
    if (page === "feedback") return <FeedbackPage />;
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
              <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>Clothes & Books</div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#334155", margin: "0 16px 12px" }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 10px" }}>
          {NAV.map(item => (
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
              Vishwakarma Institute of Technology, Pune · Department of Information Technology
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
            }}>A</div>
          </div>
        </div>

        {renderPage()}
      </div>
    </div>
  );
}
