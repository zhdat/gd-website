// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://cxxqevanvpwmaeqbaoaw.supabase.co";
export const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eHFldmFudnB3bWFlcWJhb2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3Mjg5NDEsImV4cCI6MjA0NjMwNDk0MX0.7zgQey8xrDF9R6mmh0JfOh6puS83BJo03XIfirKnJdc";

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase URL or Anon Key");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);