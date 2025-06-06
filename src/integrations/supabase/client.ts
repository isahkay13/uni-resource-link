
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://afiazerohjxxejrtwmxa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaWF6ZXJvaGp4eGVqcnR3bXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTgxMDcsImV4cCI6MjA2MjkzNDEwN30.Z_aNSmJNEGx8-ChH4aQm7kimHjeEQJOQcbslCdk9ToA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);
