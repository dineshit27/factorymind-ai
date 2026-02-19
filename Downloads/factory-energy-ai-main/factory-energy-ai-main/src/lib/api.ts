import { supabase } from './supabase';
import { MachineData } from './calculations';

// Diagnosis API
export const diagnosisAPI = {
  // Save diagnosis to database
  async saveDiagnosis(data: {
    factoryName: string;
    machineData: MachineData;
    diagnosis: any;
    energyLoss: any;
    roiOptions: any;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: result, error } = await supabase
      .from('diagnoses')
      .insert({
        user_id: user.id,
        factory_name: data.factoryName,
        machine_name: data.machineData.machineName,
        machine_type: data.machineData.machineType,
        diagnosis_data: {
          machineData: data.machineData,
          diagnosis: data.diagnosis,
          energyLoss: data.energyLoss,
          roiOptions: data.roiOptions,
        },
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Get all diagnoses for current user
  async getDiagnoses() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get single diagnosis
  async getDiagnosis(id: string) {
    const { data, error } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete diagnosis
  async deleteDiagnosis(id: string) {
    const { error } = await supabase
      .from('diagnoses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Calibration API
export const calibrationAPI = {
  // Save calibration
  async saveCalibration(data: {
    predictedBill: number;
    actualBill: number;
    month: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: result, error } = await supabase
      .from('calibrations')
      .insert({
        user_id: user.id,
        predicted_bill: data.predictedBill,
        actual_bill: data.actualBill,
        month: data.month,
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Get calibrations
  async getCalibrations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('calibrations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get latest calibration
  async getLatestCalibration() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('calibrations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  },
};

// User Profile API
export const profileAPI = {
  // Get user profile
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    return {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata.full_name,
      createdAt: user.created_at,
    };
  },

  // Update profile
  async updateProfile(updates: { fullName?: string }) {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: updates.fullName,
      },
    });

    if (error) throw error;
    return data;
  },
};
