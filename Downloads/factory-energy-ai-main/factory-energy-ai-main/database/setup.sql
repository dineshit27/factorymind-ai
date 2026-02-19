-- Database Setup for FactoryMind AI
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create diagnoses table
CREATE TABLE IF NOT EXISTS public.diagnoses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    factory_name TEXT NOT NULL,
    machine_name TEXT NOT NULL,
    machine_type TEXT NOT NULL,
    diagnosis_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calibrations table
CREATE TABLE IF NOT EXISTS public.calibrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    predicted_bill NUMERIC NOT NULL,
    actual_bill NUMERIC NOT NULL,
    month TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS diagnoses_user_id_idx ON public.diagnoses(user_id);
CREATE INDEX IF NOT EXISTS diagnoses_created_at_idx ON public.diagnoses(created_at DESC);
CREATE INDEX IF NOT EXISTS calibrations_user_id_idx ON public.calibrations(user_id);
CREATE INDEX IF NOT EXISTS calibrations_created_at_idx ON public.calibrations(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calibrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for diagnoses
CREATE POLICY "Users can view their own diagnoses"
    ON public.diagnoses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnoses"
    ON public.diagnoses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnoses"
    ON public.diagnoses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnoses"
    ON public.diagnoses FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for calibrations
CREATE POLICY "Users can view their own calibrations"
    ON public.calibrations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calibrations"
    ON public.calibrations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calibrations"
    ON public.calibrations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calibrations"
    ON public.calibrations FOR DELETE
    USING (auth.uid() = user_id);
