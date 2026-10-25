import React, { useState, useEffect } from 'react';
import { Bus, Users, Edit, CheckCircle2, AlertCircle, Save, X } from 'lucide-react';
import { Vehicle } from '../../types';
import { api } from '../../services/api';
import { SEO } from '../../components/common/SEO';

export const AdminVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const data = await api.getVehicles();
        setVehicles(data);
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleToggleAvailability = async (v: Vehicle) => {
    const updated = { ...v, isAvailable: !v.isAvailable };
    await api.updateVehicle(updated);
    setVehicles(vehicles.map((item) => (item.id === v.id ? updated : item)));
    setSuccessMsg(`${v.name} status updated.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    setIsSaving(true);
    try {
      await api.updateVehicle(editingVehicle);
      setVehicles(vehicles.map((v) => (v.id === editingVehicle.id ? editingVehicle : v)));
      setEditingVehicle(null);
      setSuccessMsg('Vehicle specifications updated successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update vehicle');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#102A43] border-t-[#F28C28] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SEO title="Vehicle Fleet Management — SKS Admin Console" />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
          Fleet Management (5 Dedicated Vans)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure seating capacities (17, 18, 19, 21, 22 passengers), rental rates, and maintenance availability.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Vehicles Fleet Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Vehicle Details</th>
                <th className="px-6 py-4">Seating Capacity</th>
                <th className="px-6 py-4">Rental Rate</th>
                <th className="px-6 py-4">Min. Km / Day</th>
                <th className="px-6 py-4">Driver Allowance</th>
                <th className="px-6 py-4">Operational Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={v.image}
                        alt={v.name}
                        className="w-14 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div>
                        <strong className="text-slate-900 block font-bold">{v.name}</strong>
                        <span className="text-slate-500 text-[11px]">{v.model}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-slate-900 text-sm">
                    {v.capacity} Passengers
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    ₹{v.pricing.perKmRate} / km
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {v.pricing.minKmPerDay} km
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    ₹{v.pricing.driverAllowancePerDay} / day
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(v)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                        v.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                          : 'bg-rose-100 text-rose-800 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                      title="Click to toggle availability"
                    >
                      {v.isAvailable ? '✓ Active Fleet' : '✕ Maintenance'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingVehicle(v)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#102A43] hover:text-white text-slate-700 text-xs font-bold transition-colors inline-flex items-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-[#102A43] text-white p-6 relative">
              <button
                type="button"
                onClick={() => setEditingVehicle(null)}
                className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">Edit {editingVehicle.name}</h2>
              <p className="text-xs text-slate-300 mt-0.5">Capacity: {editingVehicle.capacity} Passengers</p>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Per-Kilometre Rate (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={editingVehicle.pricing.perKmRate}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      pricing: { ...editingVehicle.pricing, perKmRate: parseFloat(e.target.value) || 0 },
                    })
                  }
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Min. Km / Day</label>
                  <input
                    type="number"
                    min="100"
                    value={editingVehicle.pricing.minKmPerDay}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        pricing: { ...editingVehicle.pricing, minKmPerDay: parseFloat(e.target.value) || 250 },
                      })
                    }
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Driver Allowance / Day (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingVehicle.pricing.driverAllowancePerDay}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        pricing: {
                          ...editingVehicle.pricing,
                          driverAllowancePerDay: parseFloat(e.target.value) || 500,
                        },
                      })
                    }
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Luggage Capacity Description</label>
                <input
                  type="text"
                  value={editingVehicle.luggageCapacity}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, luggageCapacity: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium bg-slate-50"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-4 py-2 font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow"
                >
                  {isSaving ? 'Saving...' : 'Save Specifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
