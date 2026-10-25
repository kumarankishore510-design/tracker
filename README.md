# SKS Travels — Tamil Nadu Tourist Van Rental & Group Tour Packages

A full-stack, responsive, and bilingual web application for **SKS Travels**, a premier tourist van rental and group travel services company operating across all **38 districts of Tamil Nadu, India**.

Brand Tagline: **“Explore Tamil Nadu. Travel Together.”**

---

## 🌟 Key Features

### 1. Bilingual Experience (English & Tamil)
- Native one-click language toggle across navigation, hero, packages, fleet specifications, and contact channels.

### 2. Dedicated 5-Van Fleet with Real-Time Seating Capacities
- **Van 1:** 17 Passengers (Force Tempo Traveller Deluxe 17+D)
- **Van 2:** 18 Passengers (Force Urbania Luxury Edition 18+D)
- **Van 3:** 19 Passengers (Tempo Traveller Executive Plus 19+D)
- **Van 4:** 21 Passengers (Heavy-Duty Luxury Coach 21+D)
- **Van 5:** 22 Passengers (Maxi Luxury Mini-Coach 22+D)
- Interactive **Passenger Capacity Recommendation Engine** that matches customer group sizes to the ideal van.

### 3. All 38 Tamil Nadu Districts & Curated Destinations
- Full directory covering all 38 districts with zones, headquarters, top sights, and major pickup points.
- Detailed destination guides with day-by-day itineraries, photography, and distance calculators for:
  - **Ooty & Nilgiris**
  - **Kodaikanal**
  - **Madurai (Temple City)**
  - **Rameswaram & Dhanushkodi**
  - **Kanyakumari (Triveni Sangam)**
  - **Chennai**
  - **Mahabalipuram (UNESCO Heritage)**
  - **Thanjavur (Brihadeeswarar Big Temple)**
  - **Yercaud**
  - **Kumbakonam & Navagraha Circuit**
  - **Tiruvannamalai (Arunachala Girivalam)**
  - **Courtallam Waterfalls**
  - *Plus Hogenakkal, Chettinad, Tiruchendur, and more.*

### 4. Smart Trip Planner & Quotation Calculator
- 9-step interactive trip builder:
  1. Pickup anywhere in Tamil Nadu
  2. Multiple destinations selection
  3. Intermediate waypoints & stops
  4. Departure and return dates
  5. Passenger count
  6. Optimal van capacity recommendation
  7. Customer contact information
  8. Special trip requirements (luggage, AC, elder care, hill driving)
  9. Transparent cost estimate breakdown without double-counting
- Direct one-click **Send via WhatsApp** with pre-filled, properly URL-encoded summary.

### 5. Double-Booking Prevention & Real-Time Availability
- Date overlap checking prevents double-booking of any vehicle for overlapping confirmed trips.
- Server-side availability validation ensures vehicles are never falsely displayed as available.

### 6. Enquiry Tracker & Booking System
- Unique booking references generated in format: `SKS-YYYYMM-XXXX`.
- Status lifecycle: `New Enquiry` ➔ `Quotation Sent` ➔ `Awaiting Confirmation` ➔ `Confirmed` ➔ `In Progress` ➔ `Completed` ➔ `Cancelled`.

### 7. Protected Administrator Portal (`/admin`)
- Accessible at `/admin/login`.
- Interactive **Booking Calendar View** and **List View**.
- Status updates, quotation editing, and chauffeur notes assignment.
- Vehicle availability and maintenance toggle.
- Pricing engine configuration (per-km rates, min km/day, driver allowance, night halt).
- Company contact settings management.
- One-click **CSV Export** for bookings and operational records.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons
- **Backend:** Bun Native High-Performance Server with REST API
- **Persistence:** SQLite (`sks_travels.sqlite` with WAL mode & foreign keys) + optional Supabase PostgreSQL integration
- **Styling Palette:**
  - Deep Navy Blue: `#102A43`
  - Travel Orange: `#F28C28`
  - Light Background: `#F5F7FA`
  - Dark Text: `#172B4D`
  - Pure White: `#FFFFFF`

---

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed (v1.0+)

### Installation
```bash
# Clone or navigate to the project directory
cd sks-travels

# Install dependencies (already installed)
bun install
```

### Running the Application

You can run the full-stack server and frontend:

1. **Start the Backend REST API Server:**
```bash
bun run server/server.ts
# Server runs at http://localhost:3001
```

2. **Start the Frontend Development Server:**
```bash
bun run dev
# Frontend runs at http://localhost:5173
```

3. **Or Build and Serve in Production Mode:**
```bash
bun run build
bun run server/server.ts
```

---

## 🔐 Administrator Setup & Login

- **Admin Login Route:** [`/admin/login`](http://localhost:5173/admin/login)
- **Default Username:** `admin`
- **Default Password:** `admin123`
*(Can be customized via the `ADMIN_PASSWORD` environment variable in `.env` or in the database).*

---

## 📄 Database Migrations & Schema

The SQL schema is located in `server/schema.sql`, defining:
- `company_settings`
- `vehicles`
- `destinations`
- `tour_packages`
- `pricing_rules`
- `bookings`
- `admin_users`

The SQLite database (`sks_travels.sqlite`) automatically seeds initial fleet configurations, 38 district records, tour packages, and pricing rules on first run.
