// Vercel Serverless Function to proxy Groq API requests
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Try to get key from Authorization header first
    let key = req.headers.authorization?.replace('Bearer ', '');
    
    // 2. Fallback to the Vercel Environment Variable if header is empty/placeholder
    if (!key || key === 'undefined' || key === 'null' || key === '') {
      key = process.env.GROQ_API_KEY;
    }

    if (!key) {
      return res.status(400).json({ 
        error: { message: 'Groq API Key is not configured. Please add it to your Vercel Environment Variables or App Settings.' } 
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(req.body)
    });

    const responseBody = await response.json();
    return res.status(response.status).json(responseBody);
  } catch (error) {
    console.error('Serverless proxy error:', error);
    return res.status(500).json({ error: { message: error.message } });
  }
}
