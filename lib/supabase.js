import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kkflzxpwnpnhdhghgsph.supabase.co';
const supabaseKey = 'sb_publishable_DYXRtVLjF0CgFvCaa9VHTg_OVZIi3YB';

export const supabase = createClient(supabaseUrl, supabaseKey);
