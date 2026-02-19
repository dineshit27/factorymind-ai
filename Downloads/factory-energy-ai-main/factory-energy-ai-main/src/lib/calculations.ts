// Energy loss and ROI calculation utilities

export interface MachineData {
  machineName: string;
  machineType: 'compressor' | 'motor' | 'pump' | 'boiler' | 'chiller' | 'hvac';
  ratedPower: number;
  powerUnit: 'HP' | 'kW';
  dailyHours: number;
  electricityCost: number;
  lastThreeMonthsBills: [number, number, number];
  machineAge: number;
  maintenanceHistory: string;
}

export interface FaultDiagnosis {
  faultName: string;
  confidence: number;
  excessPercentage: number;
  explanation: string;
  recommendedAction: string;
}

export interface EnergyLoss {
  baseMonthlyKwh: number;
  excessKwh: number;
  monthlyCostLoss: number;
  annualCostLoss: number;
  co2ReductionKg: number;
}

export interface ROIOption {
  type: 'Repair' | 'Replace' | 'Upgrade';
  cost: number;
  monthlySaving: number;
  annualSaving: number;
  paybackMonths: number;
  recommended: boolean;
}

const CO2_PER_KWH = 0.82;

export function convertToKw(power: number, unit: 'HP' | 'kW'): number {
  return unit === 'HP' ? power * 0.746 : power;
}

export function calculateEnergyLoss(machine: MachineData, fault: FaultDiagnosis): EnergyLoss {
  const powerKw = convertToKw(machine.ratedPower, machine.powerUnit);
  const daysPerMonth = 26;
  const baseMonthlyKwh = powerKw * machine.dailyHours * daysPerMonth;
  const excessKwh = baseMonthlyKwh * (fault.excessPercentage / 100);
  const monthlyCostLoss = excessKwh * machine.electricityCost;
  const annualCostLoss = monthlyCostLoss * 12;
  const co2ReductionKg = excessKwh * 12 * CO2_PER_KWH;

  return { baseMonthlyKwh, excessKwh, monthlyCostLoss, annualCostLoss, co2ReductionKg };
}

export function calculateROI(energyLoss: EnergyLoss, machine: MachineData): ROIOption[] {
  const powerKw = convertToKw(machine.ratedPower, machine.powerUnit);
  const repairCost = powerKw * 800;
  const replaceCost = powerKw * 4000;
  const upgradeCost = powerKw * 6000;

  const repairSavingPercent = 0.7;
  const replaceSavingPercent = 0.95;
  const upgradeSavingPercent = 1.0;

  const options: ROIOption[] = [
    {
      type: 'Repair',
      cost: Math.round(repairCost),
      monthlySaving: Math.round(energyLoss.monthlyCostLoss * repairSavingPercent),
      annualSaving: Math.round(energyLoss.annualCostLoss * repairSavingPercent),
      paybackMonths: Math.round(repairCost / (energyLoss.monthlyCostLoss * repairSavingPercent)),
      recommended: false,
    },
    {
      type: 'Replace',
      cost: Math.round(replaceCost),
      monthlySaving: Math.round(energyLoss.monthlyCostLoss * replaceSavingPercent),
      annualSaving: Math.round(energyLoss.annualCostLoss * replaceSavingPercent),
      paybackMonths: Math.round(replaceCost / (energyLoss.monthlyCostLoss * replaceSavingPercent)),
      recommended: false,
    },
    {
      type: 'Upgrade',
      cost: Math.round(upgradeCost),
      monthlySaving: Math.round(energyLoss.monthlyCostLoss * upgradeSavingPercent),
      annualSaving: Math.round(energyLoss.annualCostLoss * upgradeSavingPercent),
      paybackMonths: Math.round(upgradeCost / (energyLoss.monthlyCostLoss * upgradeSavingPercent)),
      recommended: false,
    },
  ];

  // Mark best payback as recommended
  const minPayback = Math.min(...options.map(o => o.paybackMonths));
  options.forEach(o => {
    if (o.paybackMonths === minPayback) o.recommended = true;
  });

  return options;
}

export const COMPRESSOR_FAULTS: Omit<FaultDiagnosis, 'confidence'>[] = [
  { faultName: 'Valve Wear', excessPercentage: 30, explanation: 'Worn intake/discharge valves cause air to leak back, making the compressor work harder.', recommendedAction: 'Replace valves and inspect seats for damage.' },
  { faultName: 'Piston Ring Wear', excessPercentage: 25, explanation: 'Worn piston rings reduce compression efficiency, wasting energy.', recommendedAction: 'Replace piston rings and check cylinder bore.' },
  { faultName: 'Air Leak', excessPercentage: 20, explanation: 'Leaks in pipes, fittings, or hoses waste compressed air continuously.', recommendedAction: 'Conduct ultrasonic leak detection and repair all leaks.' },
  { faultName: 'Bearing Failure', excessPercentage: 15, explanation: 'Damaged bearings create friction, increasing power consumption.', recommendedAction: 'Replace bearings and check alignment.' },
  { faultName: 'Pressure Switch Fault', excessPercentage: 17, explanation: 'Faulty pressure switch causes the compressor to run longer than needed.', recommendedAction: 'Calibrate or replace the pressure switch.' },
];

export const MOTOR_FAULTS: Omit<FaultDiagnosis, 'confidence'>[] = [
  { faultName: 'Worn Windings', excessPercentage: 25, explanation: 'Deteriorated motor windings increase resistance and energy waste.', recommendedAction: 'Rewind motor or replace if severely damaged.' },
  { faultName: 'Bearing Degradation', excessPercentage: 20, explanation: 'Worn bearings cause extra friction and vibration, wasting energy.', recommendedAction: 'Replace bearings and check shaft alignment.' },
  { faultName: 'Insulation Failure', excessPercentage: 30, explanation: 'Failed insulation causes current leakage and overheating.', recommendedAction: 'Test insulation resistance and rewind if needed.' },
  { faultName: 'Overloading', excessPercentage: 15, explanation: 'Motor running above rated capacity draws excess current.', recommendedAction: 'Review mechanical load and consider a higher-rated motor.' },
  { faultName: 'Power Factor Drop', excessPercentage: 20, explanation: 'Low power factor means more current is drawn for the same work.', recommendedAction: 'Install power factor correction capacitors.' },
];

export const PUMP_FAULTS: Omit<FaultDiagnosis, 'confidence'>[] = [
  { faultName: 'Impeller Wear', excessPercentage: 25, explanation: 'Worn impeller reduces pump efficiency, requiring more power.', recommendedAction: 'Replace impeller and check for cavitation damage.' },
  { faultName: 'Seal Leakage', excessPercentage: 18, explanation: 'Leaking seals waste fluid and reduce pump efficiency.', recommendedAction: 'Replace mechanical seals and check shaft alignment.' },
  { faultName: 'Cavitation', excessPercentage: 30, explanation: 'Cavitation damages pump internals and wastes energy.', recommendedAction: 'Increase suction pressure or install a booster pump.' },
  { faultName: 'Motor Misalignment', excessPercentage: 15, explanation: 'Misaligned motor creates friction and vibration.', recommendedAction: 'Perform precision alignment and replace couplings.' },
  { faultName: 'Blocked Strainer', excessPercentage: 20, explanation: 'Clogged strainers increase pressure drop and energy use.', recommendedAction: 'Clean or replace strainers regularly.' },
];

export const BOILER_FAULTS: Omit<FaultDiagnosis, 'confidence'>[] = [
  { faultName: 'Scale Buildup', excessPercentage: 35, explanation: 'Scale on heat exchanger surfaces reduces heat transfer efficiency.', recommendedAction: 'Descale boiler and improve water treatment.' },
  { faultName: 'Combustion Air Imbalance', excessPercentage: 20, explanation: 'Incorrect air-fuel ratio wastes fuel and energy.', recommendedAction: 'Tune burner and calibrate air dampers.' },
  { faultName: 'Insulation Degradation', excessPercentage: 15, explanation: 'Damaged insulation causes heat loss to surroundings.', recommendedAction: 'Repair or replace thermal insulation.' },
  { faultName: 'Blowdown Valve Leak', excessPercentage: 18, explanation: 'Leaking blowdown valve wastes steam and energy.', recommendedAction: 'Replace valve and check controls.' },
  { faultName: 'Soot Accumulation', excessPercentage: 25, explanation: 'Soot on tubes reduces heat transfer, increasing fuel use.', recommendedAction: 'Clean tubes and optimize combustion.' },
];

export const CHILLER_FAULTS: Omit<FaultDiagnosis, 'confidence'>[] = [
  { faultName: 'Refrigerant Leak', excessPercentage: 30, explanation: 'Low refrigerant charge reduces cooling capacity and efficiency.', recommendedAction: 'Locate and repair leak, then recharge system.' },
  { faultName: 'Condenser Fouling', excessPercentage: 25, explanation: 'Dirty condenser coils reduce heat rejection efficiency.', recommendedAction: 'Clean condenser coils and improve maintenance schedule.' },
  { faultName: 'Compressor Wear', excessPercentage: 28, explanation: 'Worn compressor reduces cooling efficiency.', recommendedAction: 'Rebuild or replace compressor.' },
  { faultName: 'Evaporator Scaling', excessPercentage: 22, explanation: 'Scale on evaporator tubes reduces cooling efficiency.', recommendedAction: 'Clean evaporator and improve water treatment.' },
  { faultName: 'Control Sensor Drift', excessPercentage: 15, explanation: 'Faulty sensors cause inefficient operation.', recommendedAction: 'Calibrate or replace temperature sensors.' },
];

export const HVAC_FAULTS: Omit<FaultDiagnosis, 'confidence'>[] = [
  { faultName: 'Filter Clogging', excessPercentage: 20, explanation: 'Dirty filters reduce airflow, increasing fan power consumption.', recommendedAction: 'Replace filters and establish regular maintenance.' },
  { faultName: 'Duct Leakage', excessPercentage: 25, explanation: 'Leaking ducts waste conditioned air and energy.', recommendedAction: 'Seal duct joints and insulate ducts.' },
  { faultName: 'Refrigerant Undercharge', excessPercentage: 28, explanation: 'Low refrigerant reduces cooling capacity and efficiency.', recommendedAction: 'Check for leaks and recharge system.' },
  { faultName: 'Fan Belt Slippage', excessPercentage: 12, explanation: 'Loose or worn belts reduce fan speed and efficiency.', recommendedAction: 'Adjust tension or replace belts.' },
  { faultName: 'Thermostat Malfunction', excessPercentage: 18, explanation: 'Faulty thermostat causes system to run unnecessarily.', recommendedAction: 'Calibrate or replace thermostat.' },
];

export function diagnoseFault(machineType: 'compressor' | 'motor' | 'pump' | 'boiler' | 'chiller' | 'hvac', symptoms: string): FaultDiagnosis {
  let faults;
  if (machineType === 'compressor') faults = COMPRESSOR_FAULTS;
  else if (machineType === 'motor') faults = MOTOR_FAULTS;
  else if (machineType === 'pump') faults = PUMP_FAULTS;
  else if (machineType === 'boiler') faults = BOILER_FAULTS;
  else if (machineType === 'chiller') faults = CHILLER_FAULTS;
  else faults = HVAC_FAULTS;
  
  const symptomsLower = symptoms.toLowerCase();

  // Simple keyword matching for demo; real AI would replace this
  const keywords: Record<string, string[]> = {
    'Valve Wear': ['valve', 'pressure drop', 'noisy', 'rattling', 'air loss'],
    'Piston Ring Wear': ['piston', 'oil', 'blow-by', 'compression', 'smoking'],
    'Air Leak': ['leak', 'hissing', 'pressure loss', 'air loss', 'leaking'],
    'Bearing Failure': ['bearing', 'vibration', 'noise', 'grinding', 'overheating'],
    'Pressure Switch Fault': ['switch', 'cycling', 'running continuously', 'won\'t stop', 'cuts out'],
    'Worn Windings': ['winding', 'overheating', 'burning smell', 'hot', 'insulation'],
    'Bearing Degradation': ['bearing', 'vibration', 'noise', 'grinding', 'wobble'],
    'Insulation Failure': ['insulation', 'shock', 'leakage', 'tripping', 'earth fault'],
    'Overloading': ['overload', 'tripping', 'slow', 'hot', 'drawing more current'],
    'Power Factor Drop': ['power factor', 'capacitor', 'high bill', 'penalty', 'lagging'],
    'Impeller Wear': ['impeller', 'reduced flow', 'low pressure', 'cavitation'],
    'Seal Leakage': ['seal', 'leak', 'dripping', 'puddle', 'fluid loss'],
    'Cavitation': ['cavitation', 'bubbles', 'noise', 'pitting', 'erosion'],
    'Motor Misalignment': ['misaligned', 'vibration', 'coupling wear', 'wobble'],
    'Blocked Strainer': ['strainer', 'blocked', 'clogged', 'low pressure', 'flow drop'],
    'Scale Buildup': ['scale', 'hard water', 'deposit', 'efficiency drop', 'heat loss'],
    'Combustion Air Imbalance': ['combustion', 'smoke', 'yellow flame', 'soot', 'air'],
    'Insulation Degradation': ['insulation', 'heat loss', 'cold surface', 'damaged'],
    'Blowdown Valve Leak': ['blowdown', 'valve', 'leak', 'steam loss', 'water loss'],
    'Soot Accumulation': ['soot', 'black', 'dirty', 'tubes', 'efficiency drop'],
    'Refrigerant Leak': ['refrigerant', 'leak', 'low charge', 'poor cooling', 'hissing'],
    'Condenser Fouling': ['condenser', 'dirty', 'fouled', 'high pressure', 'efficiency'],
    'Compressor Wear': ['compressor', 'noise', 'vibration', 'efficiency', 'capacity'],
    'Evaporator Scaling': ['evaporator', 'scale', 'poor cooling', 'flow'],
    'Control Sensor Drift': ['sensor', 'control', 'temperature', 'calibration', 'inaccurate'],
    'Filter Clogging': ['filter', 'dirty', 'clogged', 'low airflow', 'restricted'],
    'Duct Leakage': ['duct', 'leak', 'air loss', 'poor airflow', 'hot spot'],
    'Refrigerant Undercharge': ['refrigerant', 'low', 'undercharged', 'poor cooling'],
    'Fan Belt Slippage': ['belt', 'slipping', 'squealing', 'loose', 'worn'],
    'Thermostat Malfunction': ['thermostat', 'temperature', 'control', 'not working'],
  };

  let bestFault = faults[0];
  let bestScore = 0;

  for (const fault of faults) {
    const kws = keywords[fault.faultName] || [];
    const score = kws.filter(kw => symptomsLower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestFault = fault;
    }
  }

  const confidence = bestScore > 0 ? Math.min(60 + bestScore * 12, 95) : 55 + Math.floor(Math.random() * 20);

  return { ...bestFault, confidence };
}
