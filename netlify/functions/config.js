exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    },
    body: JSON.stringify({
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '',
      hasGeminiKey: !!process.env.GEMINI_API_KEY
    })
  };
};
