import { initDatabase, db } from './db';
import { areDateRangesOverlapping } from '../src/utils/dateUtils';
import { calculateQuotation } from '../src/utils/pricingCalculator';
import {
  createAdminSessionToken,
  findAdminSession,
  hashAdminSessionToken,
  verifyAdminPassword,
  type AdminSession,
} from './auth';

// Initialize the database tables and seed data
initDatabase();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const ADMIN_SESSION_TTL_SECONDS = 12 * 60 * 60;

function authenticateAdmin(req: Request): AdminSession | null {
  const authorization = req.headers.get('authorization') || '';
  const match = authorization.match(/^Bearer ([A-Za-z0-9_-]{43})$/);
  if (!match) return null;
  return findAdminSession(db, match[1]);
}

const server = Bun.serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const method = req.method;

    if (method === 'OPTIONS') {
      return corsOptionsResponse();
    }

    try {
      const isProtectedAdminRoute =
        url.pathname.startsWith('/api/admin/') && url.pathname !== '/api/admin/login';
      const adminSession = isProtectedAdminRoute ? authenticateAdmin(req) : null;
      if (isProtectedAdminRoute && !adminSession) {
        return jsonResponse({ error: 'Authentication required.' }, 401);
      }

      // 1. GET /api/vehicles
      if (url.pathname === '/api/vehicles' && method === 'GET') {
        const rows = db.query('SELECT * FROM vehicles ORDER BY capacity ASC').all() as any[];
        const vehicles = rows.map((r) => ({
          id: r.id,
          name: r.name,
          tamilName: r.tamil_name,
          model: r.model,
          capacity: r.capacity,
          suitableGroupMin: r.suitable_group_min,
          suitableGroupMax: r.suitable_group_max,
          image: r.image,
          acType: r.ac_type,
          seatingType: r.seating_type,
          amenities: JSON.parse(r.amenities || '[]'),
          amenitiesTa: JSON.parse(r.amenities_ta || '[]'),
          pricing: {
            perKmRate: r.per_km_rate,
            minKmPerDay: r.min_km_per_day,
            driverAllowancePerDay: r.driver_allowance_per_day,
            dailyRent: r.daily_rent,
          },
          isAvailable: Boolean(r.is_available),
          description: r.description,
          descriptionTa: r.description_ta,
          luggageCapacity: r.luggage_capacity,
        }));
        return jsonResponse(vehicles);
      }

      // 2. GET /api/vehicles/check-availability
      if (url.pathname === '/api/vehicles/check-availability' && method === 'GET') {
        const vehicleId = url.searchParams.get('vehicleId');
        const departureDate = url.searchParams.get('departureDate');
        const returnDate = url.searchParams.get('returnDate');
        const excludeBookingId = url.searchParams.get('excludeBookingId');

        if (!vehicleId || !departureDate || !returnDate) {
          return jsonResponse({ error: 'Missing required parameters' }, 400);
        }

        // Check if vehicle exists
        const vehicle = db.query('SELECT * FROM vehicles WHERE id = ?').get(vehicleId) as any;
        if (!vehicle) {
          return jsonResponse({ error: 'Vehicle not found' }, 404);
        }

        if (!vehicle.is_available) {
          return jsonResponse({
            isAvailable: false,
            message: 'Vehicle is currently offline for scheduled maintenance.',
          });
        }

        // Query confirmed and in-progress bookings for this vehicle
        const bookings = db.query(`
          SELECT * FROM bookings 
          WHERE vehicle_id = ? AND status IN ('Confirmed', 'In Progress')
        `).all(vehicleId) as any[];

        const conflict = bookings.find((b) => {
          if (excludeBookingId && b.id === excludeBookingId) return false;
          return areDateRangesOverlapping(departureDate, returnDate, b.departure_date, b.return_date);
        });

        if (conflict) {
          return jsonResponse({
            isAvailable: false,
            conflictingBooking: {
              bookingRef: conflict.booking_ref,
              departureDate: conflict.departure_date,
              returnDate: conflict.return_date,
            },
            message: `Vehicle has a confirmed booking between ${conflict.departure_date} and ${conflict.return_date}.`,
          });
        }

        return jsonResponse({
          isAvailable: true,
          message: 'Vehicle is available for the requested dates.',
        });
      }

      // 3. GET /api/destinations
      if (url.pathname === '/api/destinations' && method === 'GET') {
        const rows = db.query('SELECT * FROM destinations ORDER BY is_popular DESC, name ASC').all() as any[];
        const destinations = rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          nameTa: r.name_ta,
          district: r.district,
          category: r.category,
          image: r.image,
          gallery: JSON.parse(r.gallery || '[]'),
          shortDescription: r.short_description,
          shortDescriptionTa: r.short_description_ta,
          overview: r.overview,
          overviewTa: r.overview_ta,
          highlights: JSON.parse(r.highlights || '[]'),
          highlightsTa: JSON.parse(r.highlights_ta || '[]'),
          suggestedAttractions: JSON.parse(r.suggested_attractions || '[]'),
          suggestedAttractionsTa: JSON.parse(r.suggested_attractions_ta || '[]'),
          suggestedDuration: r.suggested_duration,
          suggestedItinerary: JSON.parse(r.suggested_itinerary || '[]'),
          distanceFromChennai: r.distance_from_chennai,
          distanceFromMadurai: r.distance_from_madurai,
          distanceFromCoimbatore: r.distance_from_coimbatore,
          bestTimeToVisit: r.best_time_to_visit,
          isPopular: Boolean(r.is_popular),
        }));
        return jsonResponse(destinations);
      }

      // 4. GET /api/packages
      if (url.pathname === '/api/packages' && method === 'GET') {
        const rows = db.query('SELECT * FROM tour_packages ORDER BY duration_days ASC').all() as any[];
        const packages = rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          titleTa: r.title_ta,
          category: r.category,
          duration: r.duration,
          durationDays: r.duration_days,
          placesCovered: JSON.parse(r.places_covered || '[]'),
          placesCoveredTa: JSON.parse(r.places_covered_ta || '[]'),
          image: r.image,
          description: r.description,
          descriptionTa: r.description_ta,
          inclusions: JSON.parse(r.inclusions || '[]'),
          exclusions: JSON.parse(r.exclusions || '[]'),
          itinerary: JSON.parse(r.itinerary || '[]'),
          suitableVehicles: JSON.parse(r.suitable_vehicles || '[]'),
          basePriceEstimate: r.base_price_estimate,
        }));
        return jsonResponse(packages);
      }

      // 5. GET & PUT /api/pricing
      if (url.pathname === '/api/pricing' && method === 'GET') {
        const row = db.query("SELECT * FROM pricing_rules WHERE id = 'default'").get() as any;
        if (!row) return jsonResponse({ error: 'Pricing not configured' }, 404);
        return jsonResponse({
          perKmRates: JSON.parse(row.per_km_rates || '{}'),
          minKmPerDay: row.min_km_per_day,
          driverAllowancePerDay: row.driver_allowance_per_day,
          nightHaltCharge: row.night_halt_charge,
          parkingEstimationPerDay: row.parking_estimation_per_day,
          tollEstimationPer100Km: row.toll_estimation_per_100km,
          interStatePermitCharge: row.inter_state_permit_charge,
          extraKmCharge: row.extra_km_charge,
          pricingMode: row.pricing_mode,
        });
      }

      // 6. POST /api/pricing/calculate
      if (url.pathname === '/api/pricing/calculate' && method === 'POST') {
        const body = await req.json();
        const row = db.query("SELECT * FROM pricing_rules WHERE id = 'default'").get() as any;
        const rule = {
          perKmRates: JSON.parse(row.per_km_rates || '{}'),
          minKmPerDay: row.min_km_per_day,
          driverAllowancePerDay: row.driver_allowance_per_day,
          nightHaltCharge: row.night_halt_charge,
          parkingEstimationPerDay: row.parking_estimation_per_day,
          tollEstimationPer100Km: row.toll_estimation_per_100km,
          interStatePermitCharge: row.inter_state_permit_charge,
          extraKmCharge: row.extra_km_charge,
          pricingMode: row.pricing_mode,
        };

        const result = calculateQuotation({
          vehicleId: body.vehicleId,
          distanceKm: body.distanceKm,
          totalDays: body.totalDays,
          pricingRule: rule,
        });

        return jsonResponse(result);
      }

      // 7. GET /api/settings & PUT /api/admin/settings
      if (url.pathname === '/api/settings' && method === 'GET') {
        const row = db.query("SELECT * FROM company_settings WHERE id = 'default'").get() as any;
        if (!row) return jsonResponse({ error: 'Settings not configured' }, 404);
        return jsonResponse({
          companyName: row.company_name,
          tagline: row.tagline,
          taglineTa: row.tagline_ta,
          phone: row.phone,
          alternatePhone: row.alternate_phone,
          whatsappNumber: row.whatsapp_number,
          email: row.email,
          address: row.address,
          addressTa: row.address_ta,
          operatingDistrictsCount: row.operating_districts_count,
          gstNumber: row.gst_number,
          registrationNumber: row.registration_number,
          upiId: row.upi_id,
          workingHours: row.working_hours,
        });
      }

      // 8. POST /api/bookings (Create enquiry/booking)
      if (url.pathname === '/api/bookings' && method === 'POST') {
        const b = await req.json();

        // Server-side validation
        if (!b.customerName || !b.customerPhone || !b.pickupLocation || !b.dropLocation) {
          return jsonResponse({ error: 'Please provide all mandatory booking fields.' }, 400);
        }

        if (b.returnDate < b.departureDate) {
          return jsonResponse({ error: 'Return date cannot be earlier than departure date.' }, 400);
        }

        // If trying to create directly as Confirmed, verify no overlap!
        if (b.status === 'Confirmed') {
          const conflicting = db.query(`
            SELECT * FROM bookings 
            WHERE vehicle_id = ? AND status IN ('Confirmed', 'In Progress')
          `).all(b.vehicleId) as any[];

          const conflict = conflicting.find((c) =>
            areDateRangesOverlapping(b.departureDate, b.returnDate, c.departure_date, c.return_date)
          );

          if (conflict) {
            return jsonResponse(
              { error: `Vehicle is already booked from ${conflict.departure_date} to ${conflict.return_date}.` },
              409
            );
          }
        }

        const id = b.id || 'b-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
        const ref = b.bookingRef || `SKS-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

        const insert = db.prepare(`
          INSERT INTO bookings (
            id, booking_ref, customer_name, customer_phone, customer_email,
            pickup_location, drop_location, intermediate_stops, departure_date,
            return_date, total_days, passenger_count, vehicle_id, vehicle_name,
            estimated_distance_km, quotation_amount, quotation_breakdown,
            special_requirements, status, admin_notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insert.run(
          id,
          ref,
          b.customerName,
          b.customerPhone,
          b.customerEmail || null,
          b.pickupLocation,
          b.dropLocation,
          JSON.stringify(b.intermediateStops || []),
          b.departureDate,
          b.returnDate,
          b.totalDays || 1,
          b.passengerCount,
          b.vehicleId,
          b.vehicleName,
          b.estimatedDistanceKm || 0,
          b.quotationAmount || null,
          JSON.stringify(b.quotationBreakdown || null),
          b.specialRequirements || null,
          b.status || 'New Enquiry',
          b.adminNotes || null
        );

        return jsonResponse({ ...b, id, bookingRef: ref }, 201);
      }

      // 9. GET /api/bookings/track/:ref
      if (url.pathname.startsWith('/api/bookings/track/') && method === 'GET') {
        const ref = decodeURIComponent(url.pathname.replace('/api/bookings/track/', ''));
        const row = db.query('SELECT * FROM bookings WHERE LOWER(booking_ref) = LOWER(?)').get(ref) as any;
        if (!row) {
          return jsonResponse({ error: 'Enquiry reference not found.' }, 404);
        }

        return jsonResponse({
          id: row.id,
          bookingRef: row.booking_ref,
          customerName: row.customer_name,
          customerPhone: row.customer_phone,
          customerEmail: row.customer_email,
          pickupLocation: row.pickup_location,
          dropLocation: row.drop_location,
          intermediateStops: JSON.parse(row.intermediate_stops || '[]'),
          departureDate: row.departure_date,
          returnDate: row.return_date,
          totalDays: row.total_days,
          passengerCount: row.passenger_count,
          vehicleId: row.vehicle_id,
          vehicleName: row.vehicle_name,
          estimatedDistanceKm: row.estimated_distance_km,
          quotationAmount: row.quotation_amount,
          quotationBreakdown: JSON.parse(row.quotation_breakdown || 'null'),
          specialRequirements: row.special_requirements,
          status: row.status,
          adminNotes: row.admin_notes,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        });
      }

      // POST /api/admin/login
      if (url.pathname === '/api/admin/login' && method === 'POST') {
        const credentials = await req.json();
        const username = typeof credentials?.username === 'string' ? credentials.username.trim() : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';
        if (!username || !password || password.length > 1024) {
          return jsonResponse({ error: 'Invalid username or password.' }, 401);
        }

        const user = db.query('SELECT * FROM admin_users WHERE username = ?').get(username) as any;
        if (!user || !verifyAdminPassword(password, user.password_hash)) {
          return jsonResponse({ error: 'Invalid username or password.' }, 401);
        }

        const now = Math.floor(Date.now() / 1000);
        const expiresAt = now + ADMIN_SESSION_TTL_SECONDS;
        const token = createAdminSessionToken();
        const tokenHash = hashAdminSessionToken(token);
        db.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').run(now);
        db.prepare(
          'INSERT INTO admin_sessions (token_hash, admin_user_id, created_at, expires_at) VALUES (?, ?, ?, ?)'
        ).run(tokenHash, user.id, now, expiresAt);

        return jsonResponse({
          token,
          expiresAt: expiresAt * 1000,
          user: { username: user.username, role: user.role, name: user.name },
        });
      }

      // Validate a saved administrator session when the app starts.
      if (url.pathname === '/api/admin/session' && method === 'GET') {
        if (!adminSession) return jsonResponse({ error: 'Authentication required.' }, 401);
        return jsonResponse({ user: adminSession.user, expiresAt: adminSession.expiresAt * 1000 });
      }

      // Revoke the current administrator session on logout.
      if (url.pathname === '/api/admin/logout' && method === 'POST') {
        if (!adminSession) return jsonResponse({ error: 'Authentication required.' }, 401);
        db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(adminSession.tokenHash);
        return jsonResponse({ success: true });
      }

      // 11. GET /api/admin/bookings
      if (url.pathname === '/api/admin/bookings' && method === 'GET') {
        const rows = db.query('SELECT * FROM bookings ORDER BY created_at DESC').all() as any[];
        const bookings = rows.map((r) => ({
          id: r.id,
          bookingRef: r.booking_ref,
          customerName: r.customer_name,
          customerPhone: r.customer_phone,
          customerEmail: r.customer_email,
          pickupLocation: r.pickup_location,
          dropLocation: r.drop_location,
          intermediateStops: JSON.parse(r.intermediate_stops || '[]'),
          departureDate: r.departure_date,
          returnDate: r.return_date,
          totalDays: r.total_days,
          passengerCount: r.passenger_count,
          vehicleId: r.vehicle_id,
          vehicleName: r.vehicle_name,
          estimatedDistanceKm: r.estimated_distance_km,
          quotationAmount: r.quotation_amount,
          quotationBreakdown: JSON.parse(r.quotation_breakdown || 'null'),
          specialRequirements: r.special_requirements,
          status: r.status,
          adminNotes: r.admin_notes,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }));
        return jsonResponse(bookings);
      }

      // 12. PATCH /api/admin/bookings/:id
      if (url.pathname.startsWith('/api/admin/bookings/') && method === 'PATCH') {
        const id = url.pathname.replace('/api/admin/bookings/', '');
        const updates = await req.json();

        const current = db.query('SELECT * FROM bookings WHERE id = ?').get(id) as any;
        if (!current) return jsonResponse({ error: 'Booking not found' }, 404);

        // If status changing to Confirmed, check date collision
        if (updates.status === 'Confirmed') {
          const vehicleId = updates.vehicleId || current.vehicle_id;
          const depDate = updates.departureDate || current.departure_date;
          const retDate = updates.returnDate || current.return_date;

          const existingConfirmed = db.query(`
            SELECT * FROM bookings 
            WHERE vehicle_id = ? AND status IN ('Confirmed', 'In Progress') AND id != ?
          `).all(vehicleId, id) as any[];

          const conflict = existingConfirmed.find((c) =>
            areDateRangesOverlapping(depDate, retDate, c.departure_date, c.return_date)
          );

          if (conflict) {
            return jsonResponse(
              { error: `Conflict: Vehicle is already booked by ${conflict.customer_name} from ${conflict.departure_date} to ${conflict.return_date}.` },
              409
            );
          }
        }

        const updateStmt = db.prepare(`
          UPDATE bookings SET
            status = COALESCE(?, status),
            admin_notes = COALESCE(?, admin_notes),
            quotation_amount = COALESCE(?, quotation_amount),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);

        updateStmt.run(
          updates.status || null,
          updates.adminNotes !== undefined ? updates.adminNotes : null,
          updates.quotationAmount !== undefined ? updates.quotationAmount : null,
          id
        );

        const updated = db.query('SELECT * FROM bookings WHERE id = ?').get(id) as any;
        return jsonResponse({
          ...updated,
          intermediateStops: JSON.parse(updated.intermediate_stops || '[]'),
          quotationBreakdown: JSON.parse(updated.quotation_breakdown || 'null'),
        });
      }

      // 13. PUT /api/admin/pricing
      if (url.pathname === '/api/admin/pricing' && method === 'PUT') {
        const p = await req.json();
        const stmt = db.prepare(`
          UPDATE pricing_rules SET
            per_km_rates = ?,
            min_km_per_day = ?,
            driver_allowance_per_day = ?,
            night_halt_charge = ?,
            parking_estimation_per_day = ?,
            toll_estimation_per_100km = ?,
            inter_state_permit_charge = ?,
            extra_km_charge = ?,
            pricing_mode = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = 'default'
        `);

        stmt.run(
          JSON.stringify(p.perKmRates),
          p.minKmPerDay,
          p.driverAllowancePerDay,
          p.nightHaltCharge,
          p.parkingEstimationPerDay,
          p.tollEstimationPer100Km,
          p.interStatePermitCharge,
          p.extraKmCharge,
          p.pricingMode
        );

        return jsonResponse(p);
      }

      // 14. PUT /api/admin/settings
      if (url.pathname === '/api/admin/settings' && method === 'PUT') {
        const s = await req.json();
        const stmt = db.prepare(`
          UPDATE company_settings SET
            phone = ?,
            alternate_phone = ?,
            whatsapp_number = ?,
            email = ?,
            address = ?,
            address_ta = ?,
            gst_number = ?,
            registration_number = ?,
            upi_id = ?,
            working_hours = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = 'default'
        `);

        stmt.run(
          s.phone,
          s.alternatePhone,
          s.whatsappNumber,
          s.email,
          s.address,
          s.addressTa,
          s.gstNumber,
          s.registrationNumber,
          s.upiId,
          s.workingHours
        );

        return jsonResponse(s);
      }

      // 15. PUT /api/admin/vehicles/:id
      if (url.pathname.startsWith('/api/admin/vehicles/') && method === 'PUT') {
        const id = url.pathname.replace('/api/admin/vehicles/', '');
        const v = await req.json();
        const stmt = db.prepare(`
          UPDATE vehicles SET
            is_available = ?,
            per_km_rate = ?,
            min_km_per_day = ?,
            driver_allowance_per_day = ?,
            amenities = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        stmt.run(
          v.isAvailable ? 1 : 0,
          v.pricing.perKmRate,
          v.pricing.minKmPerDay,
          v.pricing.driverAllowancePerDay,
          JSON.stringify(v.amenities),
          id
        );
        return jsonResponse(v);
      }

      // 404 for unmatched API routes
      if (url.pathname.startsWith('/api/')) {
        return jsonResponse({ error: 'Endpoint not found' }, 404);
      }

      // In production or when serving build artifacts:
      const filePath = `./dist${url.pathname === '/' ? '/index.html' : url.pathname}`;
      const file = Bun.file(filePath);
      if (await file.exists()) {
        return new Response(file);
      }

      // Fallback for SPA routing to index.html if dist exists
      const indexFile = Bun.file('./dist/index.html');
      if (await indexFile.exists()) {
        return new Response(indexFile, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      return new Response('SKS Travels API Server is active.', { status: 200 });
    } catch (err: any) {
      console.error('Server error:', err);
      return jsonResponse({ error: err.message || 'Internal Server Error' }, 500);
    }
  },
});

console.log(`✅ SKS Travels Server running on http://localhost:${server.port}`);
