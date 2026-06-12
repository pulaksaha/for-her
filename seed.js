const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  const userId = '11111111-1111-1111-1111-111111111111';
  
  // Create user in auth.users if not exists (need to use admin API)
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    id: userId,
    email: 'test@example.com',
    email_confirm: true,
    user_metadata: { full_name: 'Test User' }
  });
  
  if (userError && !userError.message.includes('already exists')) {
    console.error('Error creating user:', userError);
  }

  // Create a world
  const { data: world, error: worldError } = await supabase.from('worlds').upsert({
    id: '22222222-2222-2222-2222-222222222222',
    slug: 'our-story',
    name: 'Our Story',
    owner_id: userId,
    type: 'couple'
  }).select().single();
  
  if (worldError) console.error('Error creating world:', worldError);

  // Add member
  const { error: memberError } = await supabase.from('world_members').upsert({
    world_id: '22222222-2222-2222-2222-222222222222',
    user_id: userId,
    role: 'owner'
  });
  
  if (memberError) console.error('Error adding member:', memberError);
  
  console.log('Seeded successfully. User ID:', userId);
}
seed();
