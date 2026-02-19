import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MachineData, FaultDiagnosis, EnergyLoss, ROIOption } from '@/lib/calculations';

interface DiagnosisState {
  machineData: MachineData | null;
  diagnosis: FaultDiagnosis | null;
  energyLoss: EnergyLoss | null;
  roiOptions: ROIOption[] | null;
  chatMessages: { role: 'user' | 'ai'; content: string }[];
  factoryName: string;
}

interface DiagnosisContextType extends DiagnosisState {
  setMachineData: (data: MachineData) => void;
  setDiagnosis: (d: FaultDiagnosis) => void;
  setEnergyLoss: (e: EnergyLoss) => void;
  setRoiOptions: (r: ROIOption[]) => void;
  addChatMessage: (msg: { role: 'user' | 'ai'; content: string }) => void;
  setFactoryName: (name: string) => void;
  reset: () => void;
}

const initialState: DiagnosisState = {
  machineData: null,
  diagnosis: null,
  energyLoss: null,
  roiOptions: null,
  chatMessages: [],
  factoryName: '',
};

const DiagnosisContext = createContext<DiagnosisContextType | undefined>(undefined);

export function DiagnosisProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DiagnosisState>(initialState);

  const setMachineData = (data: MachineData) => setState(s => ({ ...s, machineData: data }));
  const setDiagnosis = (d: FaultDiagnosis) => setState(s => ({ ...s, diagnosis: d }));
  const setEnergyLoss = (e: EnergyLoss) => setState(s => ({ ...s, energyLoss: e }));
  const setRoiOptions = (r: ROIOption[]) => setState(s => ({ ...s, roiOptions: r }));
  const addChatMessage = (msg: { role: 'user' | 'ai'; content: string }) =>
    setState(s => ({ ...s, chatMessages: [...s.chatMessages, msg] }));
  const setFactoryName = (name: string) => setState(s => ({ ...s, factoryName: name }));
  const reset = () => setState(initialState);

  return (
    <DiagnosisContext.Provider value={{ ...state, setMachineData, setDiagnosis, setEnergyLoss, setRoiOptions, addChatMessage, setFactoryName, reset }}>
      {children}
    </DiagnosisContext.Provider>
  );
}

export function useDiagnosis() {
  const ctx = useContext(DiagnosisContext);
  if (!ctx) throw new Error('useDiagnosis must be used within DiagnosisProvider');
  return ctx;
}
