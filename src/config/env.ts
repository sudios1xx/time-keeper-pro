export type DataSourceMode = 'mock' | 'api' | 'supabase';

function asDataSourceMode(value: unknown): DataSourceMode {
  if (value === 'api' || value === 'mock' || value === 'supabase') return value;
  return 'mock';
}

export const env = {
  API_URL: (import.meta.env.VITE_API_URL as string | undefined) || '',
  DATA_SOURCE: asDataSourceMode(import.meta.env.VITE_DATA_SOURCE),
  SUPABASE_URL: (import.meta.env.VITE_SUPABASE_URL as string | undefined) || '',
  SUPABASE_ANON_KEY: (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || '',
  DEV: import.meta.env.DEV,
} as const;


