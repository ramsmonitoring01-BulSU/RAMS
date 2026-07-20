import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🚨 DIAGNOSTIC CHECK: Are these undefined?
console.log("🔍 Checking Env Vars:");
console.log("URL:", supabaseUrl ? "✅ Loaded" : "❌ UNDEFINED");
console.log("Key:", supabaseAnonKey ? "✅ Loaded" : "❌ UNDEFINED");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);