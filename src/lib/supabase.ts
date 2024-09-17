import type { Database } from "@/util/database.types";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  import.meta.env.SUPABASE_URL as string,
  import.meta.env.SUPABASE_ANON_KEY as string,
);
