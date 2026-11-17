// Supabase Client for BeverageTrack AI
export const SUPABASE_URL = "https://pnwdmcceywmulvvghefx.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBud2RtY2NleXdtdWx2dmdoZWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MjMzMTAsImV4cCI6MjExMDQ5OTMxMH0.rRtEfPJJPeIkq3paUzGDPktVGwgCPh_lQBg4nCj1F9M";

// Direct REST fetch helper for Supabase tables (e.g., notes, batches)
export async function querySupabaseTable<T = any>(table: string): Promise<T[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Supabase query failed: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Supabase REST query warning on ${table}:`, err);
    return [];
  }
}
