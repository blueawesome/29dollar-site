// src/store/siteStore.js
import { atom } from 'nanostores';

export const siteType = atom(null);
export const siteSubType = atom(null);
export const selectedVibe = atom('minimal');
export const customizationOptions = atom({});

// Methods to update state
export function setSiteType(type) {
  siteType.set(type);
  // Reset subtype when main type changes
  siteSubType.set(null);
}

export function setSiteSubType(subType) {
  siteSubType.set(subType);
}

export function setVibe(vibe) {
  selectedVibe.set(vibe);
}

export function updateCustomization(options) {
  customizationOptions.set({
    ...customizationOptions.get(),
    ...options
  });
}