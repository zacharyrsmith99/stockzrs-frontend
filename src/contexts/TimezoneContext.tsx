import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DateTime } from 'luxon';

interface TimezoneContextType {
  timezone: string;
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

export const TimezoneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    const localTimezone = DateTime.local().zoneName;
    setTimezone(localTimezone || 'UTC');
  }, []);

  return (
    <TimezoneContext.Provider value={{ timezone }}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = () => {
  const context = useContext(TimezoneContext);
  if (context === undefined) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }
  return context;
};