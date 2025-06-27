import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://ogajfqpqkduvgpiqwhcx.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYWpmcXBxa2R1dmdwaXF3aGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODgzMzYsImV4cCI6MjA2NDc2NDMzNn0.RiNoXPXuh6Os5Pc0YNXOhjLkS4sLFiyu0dKnwOv2E-Q";

export const supabase = createClient(supabaseUrl, supabaseKey);
