/**
 * Example usage of backend API client functions
 * 
 * This file shows how to use the API client helpers to call your backend server.
 * Delete this file once you understand the usage pattern.
 */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './apiClient';

// Example: Get user profile
export async function getUserProfile() {
  try {
    const profile = await apiGet('/users/profile');
    return profile;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
}

// Example: Create a new event
export async function createEvent(eventData: {
  title: string;
  description: string;
  date: string;
}) {
  try {
    const event = await apiPost('/events', eventData);
    return event;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
}

// Example: Update user settings
export async function updateUserSettings(settings: {
  email: string;
  notifications: boolean;
}) {
  try {
    const updated = await apiPut('/users/settings', settings);
    return updated;
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
}

// Example: Partial update
export async function updateEvent(eventId: string, updates: { title?: string }) {
  try {
    const event = await apiPatch(`/events/${eventId}`, updates);
    return event;
  } catch (error) {
    console.error('Failed to update event:', error);
    throw error;
  }
}

// Example: Delete an event
export async function deleteEvent(eventId: string) {
  try {
    await apiDelete(`/events/${eventId}`);
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw error;
  }
}

// Example: Custom fetch with query parameters
export async function searchEvents(query: string) {
  try {
    const events = await apiGet(`/events/search?q=${encodeURIComponent(query)}`);
    return events;
  } catch (error) {
    console.error('Failed to search events:', error);
    throw error;
  }
}

