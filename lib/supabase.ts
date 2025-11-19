import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com as chaves fornecidas
const supabaseUrl = 'https://einkgouevvogawatsgbn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpbmtnb3VldnZvZ2F3YXRzZ2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1Njc3NjcsImV4cCI6MjA3OTE0Mzc2N30.3yaqK1mAoV06SJD1y0kKhPvDrXUI6KisNmtWEoPasIc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);