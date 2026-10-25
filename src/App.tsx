import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloating } from './components/layout/WhatsAppFloating';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { DistrictsPage } from './pages/DistrictsPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { PlanTripPage } from './pages/PlanTripPage';
import { BookingPage } from './pages/BookingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

// Admin Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminVehiclesPage } from './pages/admin/AdminVehiclesPage';
import { AdminDestinationsPage } from './pages/admin/AdminDestinationsPage';
import { AdminPackagesPage } from './pages/admin/AdminPackagesPage';
import { AdminPricingPage } from './pages/admin/AdminPricingPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Helper component to scroll to top on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Public Layout wrapper with Navbar, Footer, and Floating WhatsApp CTA
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloating />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Customer Routes */}
              <Route
                path="/"
                element={
                  <PublicLayout>
                    <HomePage />
                  </PublicLayout>
                }
              />
              <Route
                path="/destinations"
                element={
                  <PublicLayout>
                    <DestinationsPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/destinations/:slug"
                element={
                  <PublicLayout>
                    <DestinationDetailPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/districts"
                element={
                  <PublicLayout>
                    <DistrictsPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/vehicles"
                element={
                  <PublicLayout>
                    <VehiclesPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/vehicles/:id"
                element={
                  <PublicLayout>
                    <VehicleDetailPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/packages"
                element={
                  <PublicLayout>
                    <PackagesPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/packages/:slug"
                element={
                  <PublicLayout>
                    <PackageDetailPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/plan-your-trip"
                element={
                  <PublicLayout>
                    <PlanTripPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/booking"
                element={
                  <PublicLayout>
                    <BookingPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <PublicLayout>
                    <AboutPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <PublicLayout>
                    <ContactPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <PublicLayout>
                    <PrivacyPolicyPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/terms"
                element={
                  <PublicLayout>
                    <TermsPage />
                  </PublicLayout>
                }
              />

              {/* Admin Portal Authentication */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Administrator Dashboard Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="bookings" element={<AdminBookingsPage />} />
                <Route path="vehicles" element={<AdminVehiclesPage />} />
                <Route path="destinations" element={<AdminDestinationsPage />} />
                <Route path="packages" element={<AdminPackagesPage />} />
                <Route path="pricing" element={<AdminPricingPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Fallback 404 Route */}
              <Route
                path="*"
                element={
                  <PublicLayout>
                    <div className="min-h-[500px] flex flex-col items-center justify-center p-6 text-center">
                      <h1 className="text-4xl font-extrabold text-[#102A43] mb-2">404</h1>
                      <p className="text-slate-600 mb-6">The page you were looking for could not be found.</p>
                      <a
                        href="/"
                        className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] text-sm"
                      >
                        Return to SKS Travels Home
                      </a>
                    </div>
                  </PublicLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
