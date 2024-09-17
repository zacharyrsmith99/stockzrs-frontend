import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ExtendedInstrument } from '../types/instrumentTypes';

interface SelectedInstrumentContextType {
  selectedInstrument: ExtendedInstrument | null;
  setSelectedInstrument: (instrument: ExtendedInstrument | null) => void;
  displayedInstrument: ExtendedInstrument | null;
  setDisplayedInstrument: (instrument: ExtendedInstrument | null) => void;
}

const SelectedInstrumentContext = createContext<SelectedInstrumentContextType | undefined>(undefined);

export const SelectedInstrumentProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [selectedInstrument, setSelectedInstrument] = useState<ExtendedInstrument | null>(null);
  const [displayedInstrument, setDisplayedInstrument] = useState<ExtendedInstrument | null>(null);

  return (
    <SelectedInstrumentContext.Provider value={{ 
      selectedInstrument, 
      setSelectedInstrument, 
      displayedInstrument, 
      setDisplayedInstrument 
    }}>
      {children}
    </SelectedInstrumentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSelectedInstrument = () => {
  const context = useContext(SelectedInstrumentContext);
  if (context === undefined) {
    throw new Error('useSelectedInstrument must be used within a SelectedInstrumentProvider');
  }
  return context;
};