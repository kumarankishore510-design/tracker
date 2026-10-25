import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanySettings } from '../types';
import { defaultCompanySettings } from '../data/defaultSettings';

interface SettingsContextType {
  settings: CompanySettings;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('sks_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultCompanySettings;
      }
    }
    return defaultCompanySettings;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Attempt to load settings from server API
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data && data.companyName) {
            setSettings(data);
            localStorage.setItem('sks_settings', JSON.stringify(data));
          }
        }
      } catch {
        // Fallback to local
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('sks_settings', JSON.stringify(updated));

    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {
      // Local fallback already saved
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
