// src/lib/auth.ts
import { supabase } from './supabase';

/**
 * Get the current user session
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Check if a user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Get the current user ID
 */
export async function getUserId() {
  const session = await getSession();
  return session?.user?.id;
}

/**
 * Log an event to the database
 */
export async function logEvent(type, payload = {}) {
  const userId = await getUserId();
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('events')
      .insert({
        user_id: userId,
        type,
        payload,
        created_at: new Date().toISOString()
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging event:', error);
    return null;
  }
}