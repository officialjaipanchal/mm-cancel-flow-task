-- database.sql
-- Complete database schema and seed data for subscription cancellation flow
-- This file contains everything needed to set up the database from scratch

-- ============================================================================
-- DATABASE SCHEMA
-- ============================================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  monthly_price INTEGER NOT NULL, -- Price in USD cents
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_cancellation', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cancellations table with all feedback fields
CREATE TABLE IF NOT EXISTS cancellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  downsell_variant TEXT NOT NULL CHECK (downsell_variant IN ('A', 'B')),
  reason TEXT CHECK (LENGTH(reason) <= 2000), -- Limit reason length
  accepted_downsell BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Feedback fields for "found job" flow
  found_job_with_migratemate TEXT CHECK (LENGTH(found_job_with_migratemate) <= 500),
  one_thing_wish_helped_with TEXT CHECK (LENGTH(one_thing_wish_helped_with) <= 1000),
  company_providing_lawyer TEXT CHECK (LENGTH(company_providing_lawyer) <= 500),
  visa_type_to_apply TEXT CHECK (LENGTH(visa_type_to_apply) <= 500),
  
  -- Follow-up question response for "still looking" flow
  followup_response TEXT CHECK (LENGTH(followup_response) <= 1000),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one cancellation per user per subscription
  UNIQUE(user_id, subscription_id),
  
  -- Ensure created_at is not in the future
  CONSTRAINT valid_created_at CHECK (created_at <= NOW())
);

-- Create user_interactions table for logging user interactions
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (LENGTH(interaction_type) <= 100),
  interaction_value TEXT NOT NULL CHECK (LENGTH(interaction_value) <= 500),
  page TEXT CHECK (LENGTH(page) <= 100),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure timestamp is not in the future
  CONSTRAINT valid_timestamp CHECK (timestamp <= NOW())
);

-- Add indexes for performance and security
CREATE INDEX IF NOT EXISTS idx_cancellations_user_id ON cancellations(user_id);
CREATE INDEX IF NOT EXISTS idx_cancellations_subscription_id ON cancellations(subscription_id);
CREATE INDEX IF NOT EXISTS idx_cancellations_created_at ON cancellations(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_timestamp ON user_interactions(timestamp);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Enhanced RLS policies with comprehensive security
-- Users table policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Subscriptions table policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cancellations table policies
CREATE POLICY "Users can insert own cancellations" ON cancellations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own cancellations" ON cancellations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own cancellations" ON cancellations
  FOR UPDATE USING (auth.uid() = user_id);

-- User interactions table policies
CREATE POLICY "Users can insert own interactions" ON user_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own interactions" ON user_interactions
  FOR SELECT USING (auth.uid() = user_id);

-- Prevent deletion of critical data
CREATE POLICY "Prevent user deletion" ON users
  FOR DELETE USING (false);

CREATE POLICY "Prevent subscription deletion" ON subscriptions
  FOR DELETE USING (false);

CREATE POLICY "Prevent cancellation deletion" ON cancellations
  FOR DELETE USING (false);

CREATE POLICY "Prevent interaction deletion" ON user_interactions
  FOR DELETE USING (false);

-- Add comments to document field usage
COMMENT ON COLUMN cancellations.followup_response IS 'User response to follow-up question based on cancellation reason (max price willing to pay, platform improvements, job relevance, etc.)';

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Clear existing data (for clean seeding)
TRUNCATE TABLE user_interactions CASCADE;
TRUNCATE TABLE cancellations CASCADE;
TRUNCATE TABLE subscriptions CASCADE;
TRUNCATE TABLE users CASCADE;

-- Insert test users with realistic data
INSERT INTO users (id, email, created_at) VALUES
  -- Primary test users for A/B testing
  ('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', '2024-01-15 10:30:00+00'),
  ('550e8400-e29b-41d4-a716-446655440002', 'sarah.smith@example.com', '2024-02-20 14:45:00+00'),
  ('550e8400-e29b-41d4-a716-446655440003', 'mike.johnson@example.com', '2024-03-10 09:15:00+00');

-- Insert subscriptions with various states and pricing
INSERT INTO subscriptions (id, user_id, monthly_price, status, created_at, updated_at) VALUES
  -- Active subscriptions for A/B testing (Primary test cases)
  ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 2500, 'active', '2024-01-15 10:30:00+00', '2024-01-15 10:30:00+00'), -- $25.00
  ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 2900, 'active', '2024-02-20 14:45:00+00', '2024-02-20 14:45:00+00'), -- $29.00
  ('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 2500, 'active', '2024-03-10 09:15:00+00', '2024-03-10 09:15:00+00'); -- $25.00

-- Insert some existing cancellation records for testing with complete feedback data
INSERT INTO cancellations (id, user_id, subscription_id, downsell_variant, reason, accepted_downsell, found_job_with_migratemate, one_thing_wish_helped_with, company_providing_lawyer, visa_type_to_apply, followup_response, created_at) VALUES
  -- User who accepted downsell offer (Variant A) - Found job flow
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'A', 'User accepted 50% off downsell offer', true, 'Yes', 'More job recommendations in my field', 'No', 'H-1B', NULL, '2024-04-01 10:00:00+00'),
  
  -- User who accepted downsell offer (Variant B) - Found job flow
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', 'B', 'User accepted $10 off downsell offer', true, 'No', 'Better interview preparation resources', 'Yes', 'L-1', NULL, '2024-04-02 14:30:00+00'),
  
  -- User who declined downsell offer (Variant A) - Still looking flow
  ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', 'A', 'Too expensive', false, NULL, NULL, NULL, NULL, 'I would be willing to pay maximum $15 per month', '2024-04-03 16:45:00+00');

-- Insert sample user interactions for testing
INSERT INTO user_interactions (id, user_id, interaction_type, interaction_value, page, timestamp) VALUES
  -- Job status selection interactions
  ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', 'job_status_selection', 'found_job', 'cancel_page', '2024-04-01 10:00:00+00'),
  ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440002', 'job_status_selection', 'still_looking', 'cancel_page', '2024-04-01 10:05:00+00'),
  
  -- Button click interactions
  ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440003', 'button_click', 'accept_offer', 'flow_looking_step2', '2024-04-01 10:10:00+00'),
  ('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440001', 'button_click', 'decline_offer', 'flow_looking_step2', '2024-04-01 10:15:00+00');

