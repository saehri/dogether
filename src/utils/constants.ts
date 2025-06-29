export const APP_NAME = 'Dogether';
export const APP_DESCRIPTION = 'Social Goals & Tasks';

export const API_BASE_URL = 'https://dogether.etalasepro.com/api';
export const API_TIMEOUT = 10000;

export const ROUTES = {
  HOME: '/',
  GOALS: '/goals',
  FRIENDS: '/friends',
  BADGES: '/badges',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  THEME: 'theme',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const TASK_TYPES = {
  TASK: 'task',
  GOAL: 'goal',
} as const;

export const FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
} as const;