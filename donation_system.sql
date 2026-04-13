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
