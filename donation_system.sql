-- -------------------------------------------------------------
-- Donation Management System Database Script (PostgreSQL)
-- Generated for DBMS Course Project
-- -------------------------------------------------------------

-- Drop tables if they exist (to allow re-running the script)
DROP TABLE IF EXISTS feedbacks CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS donation_requests CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS ngos CASCADE;
DROP TABLE IF EXISTS donors CASCADE;

-- -------------------------------------------------------------
-- 1. Donors Table
-- -------------------------------------------------------------
CREATE TABLE donors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100),
    donation_count INTEGER DEFAULT 0,
    joined_date DATE
);

INSERT INTO donors (name, email, phone, city, donation_count, joined_date) VALUES
('Priya Sharma', 'priya@gmail.com', '9812345678', 'Pune', 5, '2024-01-15'),
('Rahul Mehta', 'rahul@outlook.com', '9823456789', 'Mumbai', 3, '2024-02-20'),
('Sneha Patil', 'sneha@yahoo.com', '9834567890', 'Nashik', 7, '2023-11-10'),
('Amit Joshi', 'amit@gmail.com', '9845678901', 'Pune', 2, '2024-03-05'),
('Kavita Nair', 'kavita@gmail.com', '9856789012', 'Kolhapur', 4, '2024-01-28');

-- -------------------------------------------------------------
-- 2. NGOs Table
-- -------------------------------------------------------------
CREATE TABLE ngos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    focus_area VARCHAR(50),
    contact VARCHAR(20),
    status VARCHAR(20),
    total_requests INTEGER DEFAULT 0
);

INSERT INTO ngos (name, city, focus_area, contact, status, total_requests) VALUES
('Asha Foundation', 'Pune', 'Clothes', '9900112233', 'Active', 8),
('Vidya Daan Trust', 'Mumbai', 'Books', '9900223344', 'Active', 12),
('Sahyog NGO', 'Nashik', 'Both', '9900334455', 'Active', 5),
('Jan Seva Samiti', 'Nagpur', 'Clothes', '9900445566', 'Inactive', 3);

-- -------------------------------------------------------------
-- 3. Volunteers Table
-- -------------------------------------------------------------
CREATE TABLE volunteers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    deliveries_completed INTEGER DEFAULT 0,
    status VARCHAR(20)
);

INSERT INTO volunteers (name, phone, city, deliveries_completed, status) VALUES
('Rohan Desai', '9700112233', 'Pune', 12, 'Available'),
('Anjali Singh', '9700223344', 'Mumbai', 8, 'On Delivery'),
('Suresh Kumar', '9700334455', 'Nashik', 15, 'Available'),
('Meera Iyer', '9700445566', 'Pune', 6, 'Available');

-- -------------------------------------------------------------
-- 4. Donations Table
-- -------------------------------------------------------------
CREATE TABLE donations (
    id VARCHAR(10) PRIMARY KEY,
    donor_name VARCHAR(255),
    type VARCHAR(50),
    quantity INTEGER,
    description TEXT,
    donation_date DATE,
    status VARCHAR(20)
);

INSERT INTO donations (id, donor_name, type, quantity, description, donation_date, status) VALUES
('DON001', 'Priya Sharma', 'Clothes', 10, 'Winter jackets & sweaters', '2024-04-01', 'Delivered'),
('DON002', 'Rahul Mehta', 'Books', 25, 'Class 8-10 textbooks', '2024-04-02', 'Pending'),
('DON003', 'Sneha Patil', 'Clothes', 15, 'Children''s clothes', '2024-04-03', 'In Transit'),
('DON004', 'Amit Joshi', 'Books', 30, 'Engineering reference books', '2024-04-04', 'Delivered'),
('DON005', 'Kavita Nair', 'Clothes', 8, 'Formal shirts & trousers', '2024-04-05', 'Pending'),
('DON006', 'Priya Sharma', 'Books', 20, 'Children''s story books', '2024-04-06', 'Approved');

-- -------------------------------------------------------------
-- 5. Donation Requests Table
-- -------------------------------------------------------------
CREATE TABLE donation_requests (
    id VARCHAR(10) PRIMARY KEY,
    ngo_name VARCHAR(255),
    type VARCHAR(50),
    quantity INTEGER,
    urgency VARCHAR(20),
    request_date DATE,
    status VARCHAR(20)
);

INSERT INTO donation_requests (id, ngo_name, type, quantity, urgency, request_date, status) VALUES
('REQ001', 'Asha Foundation', 'Clothes', 50, 'High', '2024-04-01', 'Approved'),
('REQ002', 'Vidya Daan Trust', 'Books', 100, 'Medium', '2024-04-02', 'Pending'),
('REQ003', 'Sahyog NGO', 'Both', 30, 'Low', '2024-04-03', 'Pending'),
('REQ004', 'Jan Seva Samiti', 'Clothes', 25, 'High', '2024-04-04', 'Approved'),
('REQ005', 'Asha Foundation', 'Books', 60, 'Medium', '2024-04-05', 'Pending');

-- -------------------------------------------------------------
-- 6. Deliveries Table
-- -------------------------------------------------------------
CREATE TABLE deliveries (
    id VARCHAR(10) PRIMARY KEY,
    donation_id VARCHAR(10),
    volunteer_name VARCHAR(255),
    ngo_name VARCHAR(255),
    delivery_date DATE,
    status VARCHAR(20)
);

INSERT INTO deliveries (id, donation_id, volunteer_name, ngo_name, delivery_date, status) VALUES
('DEL001', 'DON001', 'Rohan Desai', 'Asha Foundation', '2024-04-03', 'Delivered'),
('DEL002', 'DON003', 'Anjali Singh', 'Sahyog NGO', '2024-04-05', 'In Transit'),
('DEL003', 'DON004', 'Suresh Kumar', 'Vidya Daan Trust', '2024-04-06', 'Delivered'),
('DEL004', 'DON006', 'Meera Iyer', 'Asha Foundation', '2024-04-08', 'Assigned');

-- -------------------------------------------------------------
-- 7. Feedbacks Table
-- -------------------------------------------------------------
CREATE TABLE feedbacks (
    id SERIAL PRIMARY KEY,
    from_entity VARCHAR(255),
    entity_type VARCHAR(20),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    feedback_date DATE
);

INSERT INTO feedbacks (from_entity, entity_type, rating, comment, feedback_date) VALUES
('Asha Foundation', 'NGO', 5, 'Excellent quality clothes received. Very well maintained.', '2024-04-04'),
('Priya Sharma', 'Donor', 4, 'Smooth process, quick pickup. Happy to donate more.', '2024-04-05'),
('Vidya Daan Trust', 'NGO', 5, 'Books in great condition, students are very happy!', '2024-04-06'),
('Rahul Mehta', 'Donor', 3, 'Good initiative but pickup was slightly delayed.', '2024-04-07'),
('Sahyog NGO', 'NGO', 4, 'Well organized and timely delivery.', '2024-04-08');

-- -------------------------------------------------------------
-- Suggested Views & Queries for Presentation
-- -------------------------------------------------------------

-- View: Summary of Donations by Type
-- CREATE VIEW donation_summary AS
-- SELECT type, COUNT(*) as total_donations, SUM(quantity) as total_items
-- FROM donations
-- GROUP BY type;

-- Query: NGOs with the most requests
-- SELECT name, total_requests FROM ngos ORDER BY total_requests DESC;

-- -------------------------------------------------------------
-- 8. Dashboard & Query Explorer Queries
-- -------------------------------------------------------------

-- 🔵 Basic Queries
-- 1. All Donors
SELECT * FROM donors;

-- 2. All NGOs
SELECT * FROM ngos;

-- 3. All Donations
SELECT * FROM donations;

-- 4. All Volunteers
SELECT * FROM volunteers;

-- 5. All Requests
SELECT * FROM donation_requests;

-- 6. All Deliveries
SELECT * FROM deliveries;

-- 7. Active NGOs Only
SELECT * FROM ngos WHERE status = 'Active';

-- 8. Clothes Donations
SELECT * FROM donations WHERE type = 'Clothes';

-- 9. Pending Requests
SELECT * FROM donation_requests WHERE status = 'Pending';

-- 10. Available Volunteers
SELECT * FROM volunteers WHERE status = 'Available';

-- 11. Donors from Pune
SELECT * FROM donors WHERE city = 'Pune';

-- 12. Delivered Donations
SELECT * FROM donations WHERE status = 'Delivered';


-- 🟢 Join Queries
-- 13. Donations with Donor Details
SELECT d.id, d.donor_name, d.type, d.quantity, d.status 
FROM donations d 
JOIN donors dn ON d.donor_name = dn.name;

-- 14. Requests with NGO Info
SELECT r.id, n.name AS ngo_name, n.city, r.type, r.quantity, r.status 
FROM donation_requests r 
JOIN ngos n ON r.ngo_name = n.name;

-- 15. Deliveries with Volunteer
SELECT dl.id, dl.volunteer_name, dl.donation_id, dl.status 
FROM deliveries dl 
JOIN volunteers v ON dl.volunteer_name = v.name;

-- 16. Donor & NGO City Match
SELECT dn.name AS donor, n.name AS ngo, dn.city 
FROM donors dn 
JOIN ngos n ON dn.city = n.city;

-- 17. Approved Requests & Deliveries
SELECT r.id AS request_id, n.name, d.id AS delivery_id 
FROM donation_requests r 
JOIN ngos n ON r.ngo_name = n.name 
JOIN deliveries d ON r.id = d.id 
WHERE r.status = 'Approved';

-- 18. Feedback with Ratings
SELECT f.id, f.from_entity, f.rating, f.comment 
FROM feedbacks f 
ORDER BY f.rating DESC;

-- 19. Volunteer Delivery Count
SELECT v.name, COUNT(d.id) AS total 
FROM volunteers v 
LEFT JOIN deliveries d ON v.name = d.volunteer_name 
GROUP BY v.name;

-- 20. Donations per NGO Request
SELECT n.name, COUNT(r.id) AS requests 
FROM ngos n 
LEFT JOIN donation_requests r ON n.name = r.ngo_name 
GROUP BY n.name;


-- 🟡 Aggregation Queries
-- 21. Total Donations Count
SELECT COUNT(*) AS total_donations FROM donations;

-- 22. Total Items Donated
SELECT SUM(quantity) AS total_items FROM donations;

-- 23. Avg Donations per Donor
SELECT AVG(donation_count) AS avg FROM donors;

-- 24. Donations by Type
SELECT type, COUNT(*) AS count 
FROM donations 
GROUP BY type;

-- 25. Requests by Status
SELECT status, COUNT(*) AS total 
FROM donation_requests 
GROUP BY status;

-- 26. Max Donation Quantity
SELECT MAX(quantity) AS max_qty FROM donations;

-- 27. Min Donation Quantity
SELECT MIN(quantity) AS min_qty FROM donations;

-- 28. Average NGO Rating
SELECT AVG(rating) AS avg_rating FROM feedbacks WHERE entity_type='NGO';

-- 29. Volunteers per City
SELECT city, COUNT(*) AS volunteers 
FROM volunteers 
GROUP BY city;

-- 30. Donors with 5+ Donations
SELECT name, donation_count FROM donors WHERE donation_count >= 5;

-- 31. NGO Request Totals
SELECT ngo_name, SUM(quantity) AS total_items 
FROM donation_requests 
GROUP BY ngo_name 
ORDER BY total_items DESC;

-- 32. Deliveries by Status
SELECT status, COUNT(*) AS count 
FROM deliveries 
GROUP BY status;


-- 🔴 Advanced Queries
-- 33. Top Donors by Quantity
SELECT donor_name, SUM(quantity) AS total 
FROM donations 
GROUP BY donor_name 
ORDER BY total DESC 
LIMIT 3;

-- 34. NGOs with Pending High-Urgency
SELECT n.name, r.urgency, r.quantity 
FROM donation_requests r 
JOIN ngos n ON r.ngo_name = n.name 
WHERE r.status = 'Pending' AND r.urgency = 'High';

-- 35. Subquery: Donors Above Average
SELECT name, donation_count FROM donors 
WHERE donation_count > (SELECT AVG(donation_count) FROM donors);

-- 36. Monthly Donation Trend
SELECT EXTRACT(MONTH FROM donation_date) AS month, COUNT(*) AS donations 
FROM donations 
GROUP BY month 
ORDER BY month;

-- 37. Unassigned Donations
SELECT d.id, d.type, d.quantity 
FROM donations d 
LEFT JOIN deliveries dl ON d.id = dl.donation_id 
WHERE dl.id IS NULL;

-- 38. NGOs with All Requests Approved
SELECT ngo_name FROM donation_requests 
GROUP BY ngo_name 
HAVING SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) = 0;

-- 39. Volunteer Efficiency Rank
SELECT name, deliveries_completed, 
RANK() OVER (ORDER BY deliveries_completed DESC) AS rank 
FROM volunteers;

-- 40. Cities Without Volunteers
SELECT DISTINCT city FROM donors 
WHERE city NOT IN (SELECT city FROM volunteers);

-- 41. Full Donation Journey
SELECT d.id AS donation_id, d.donor_name, v.name AS volunteer, n.name AS ngo, dl.status AS delivery_status 
FROM donations d 
JOIN deliveries dl ON d.id = dl.donation_id 
JOIN volunteers v ON dl.volunteer_name = v.name 
JOIN ngos n ON dl.ngo_name = n.name;

-- 42. Feedback Score by NGO
SELECT n.name, AVG(f.rating) AS avg_score 
FROM feedbacks f 
JOIN ngos n ON f.from_entity = n.name 
WHERE f.entity_type = 'NGO' 
GROUP BY n.name 
ORDER BY avg_score DESC;

-- 43. Cascade Delete Check
SELECT COUNT(*) AS linked_donations FROM donations WHERE donor_name = 'Priya Sharma';

-- 44. Materialized View: Summary
-- Note: Simplified view for PostgreSQL
CREATE OR REPLACE VIEW donation_summary AS 
SELECT type, COUNT(*) AS count, SUM(quantity) AS total_qty 
FROM donations 
GROUP BY type;

-- 45. Trigger Simulation
-- Note: Actual trigger syntax requires a function in PostgreSQL
-- This is a representative query of the logic.
-- UPDATE ngo_inventory SET available = available + 10 WHERE ngo_id = 1;

-- 46. Stored Procedure Call Simulation
-- CALL assign_volunteer('DEL004', 3);

-- 47. Query Performance Analysis
EXPLAIN SELECT * FROM donations WHERE donor_name = 'Priya Sharma' AND status = 'Pending';

-- 48. Transaction: Safe Transfer
BEGIN;
UPDATE donations SET status='Approved' WHERE id='DON002';
-- INSERT INTO deliveries ...
COMMIT;

-- 49. Recursive: Volunteer Chain (Example for SQL Project)
WITH RECURSIVE chain AS (
  SELECT id, name FROM volunteers WHERE name = 'Suresh Kumar'
  UNION ALL
  SELECT v.id, v.name FROM volunteers v JOIN chain c ON v.id = c.id + 1 -- Simplified example
)
SELECT * FROM chain;

-- 50. Pivot: Monthly Type Summary
SELECT 
FROM donations GROUP BY month;

-- -------------------------------------------------------------
-- 9. STORED PROCEDURES WITH BUSINESS RULES
-- -------------------------------------------------------------

-- 1. Procedure to add a donation and increment donor's count
-- RULE: Minimum quantity must be 1
CREATE OR REPLACE PROCEDURE add_donation_proc(
    p_donor_name VARCHAR,
    p_type VARCHAR,
    p_quantity INTEGER,
    p_description TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id VARCHAR(10);
BEGIN
    -- Business Rule: Minimum quantity check
    IF p_quantity < 1 THEN
        RAISE EXCEPTION 'Invalid quantity: Donation must have at least 1 item.';
    END IF;

    -- Generate ID (e.g., DON999)
    v_id := 'DON' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
    
    -- Insert donation
    INSERT INTO donations (id, donor_name, type, quantity, description, donation_date, status)
    VALUES (v_id, p_donor_name, p_type, p_quantity, p_description, CURRENT_DATE, 'Pending');
    
    -- Update donor count
    UPDATE donors SET donation_count = donation_count + 1 WHERE name = p_donor_name;
END;
$$;

-- 2. Procedure to assign a volunteer to a donation
-- RULE: Volunteer must be 'Available' and NGO must be 'Active'
CREATE OR REPLACE PROCEDURE assign_delivery_proc(
    p_donation_id VARCHAR,
    p_volunteer_name VARCHAR,
    p_ngo_name VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id VARCHAR(10);
    v_vol_status VARCHAR(20);
    v_ngo_status VARCHAR(20);
BEGIN
    -- Check Volunteer Status
    SELECT status INTO v_vol_status FROM volunteers WHERE name = p_volunteer_name;
    IF v_vol_status != 'Available' THEN
        RAISE EXCEPTION 'Volunteer % is currently % and cannot accept new deliveries.', p_volunteer_name, v_vol_status;
    END IF;

    -- Check NGO Status
    SELECT status INTO v_ngo_status FROM ngos WHERE name = p_ngo_name;
    IF v_ngo_status != 'Active' THEN
        RAISE EXCEPTION 'NGO % is currently % and cannot receive donations.', p_ngo_name, v_ngo_status;
    END IF;

    v_id := 'DEL' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
    
    -- Create delivery
    INSERT INTO deliveries (id, donation_id, volunteer_name, ngo_name, delivery_date, status)
    VALUES (v_id, p_donation_id, p_volunteer_name, p_ngo_name, CURRENT_DATE + INTERVAL '1 day', 'Assigned');
    
    -- Update donation status
    UPDATE donations SET status = 'Approved' WHERE id = p_donation_id;
    
    -- Update volunteer status
    UPDATE volunteers SET status = 'On Delivery' WHERE name = p_volunteer_name;
END;
$$;

-- 3. Procedure to register an NGO
CREATE OR REPLACE PROCEDURE register_ngo_proc(
    p_name VARCHAR,
    p_city VARCHAR,
    p_focus_area VARCHAR,
    p_contact VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO ngos (name, city, focus_area, contact, status, total_requests)
    VALUES (p_name, p_city, p_focus_area, p_contact, 'Active', 0);
END;
$$;

-- 4. Procedure to mark delivery as finished
-- RULE: Updates volunteer stats and donation status to 'Delivered'
CREATE OR REPLACE PROCEDURE complete_delivery_proc(
    p_delivery_id VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_donation_id VARCHAR;
    v_vol_name VARCHAR;
    v_current_status VARCHAR;
BEGIN
    -- Get info
    SELECT donation_id, volunteer_name, status INTO v_donation_id, v_vol_name, v_current_status 
    FROM deliveries WHERE id = p_delivery_id;

    IF v_current_status = 'Delivered' THEN
        RAISE EXCEPTION 'Delivery % is already completed.', p_delivery_id;
    END IF;
    
    -- Update delivery
    UPDATE deliveries SET status = 'Delivered' WHERE id = p_delivery_id;
    
    -- Update donation
    UPDATE donations SET status = 'Delivered' WHERE id = v_donation_id;
    
    -- Update volunteer
    UPDATE volunteers SET status = 'Available', deliveries_completed = deliveries_completed + 1 
    WHERE name = v_vol_name;
END;
$$;
