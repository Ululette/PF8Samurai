import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qeubfsxlcvapzvjihzep.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDMyNDU4NCwiZXhwIjoxOTM1OTAwNTg0fQ.l9ZzKLUoPFsMWMCismH6RkXsEzBiSrDMylGB9V_HHjI';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;