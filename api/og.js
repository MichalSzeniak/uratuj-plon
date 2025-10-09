export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const isSocialBot = 
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('Twitterbot') ||
    userAgent.includes('LinkedInBot');

  // If it's NOT a social bot, redirect to main app
  if (!isSocialBot) {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    res.writeHead(302, { Location: pathname });
    res.end();
    return;
  }

  // Extract UUID from pathname
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const pathSegments = pathname.split('/').filter(Boolean);
  const uuid = pathSegments[1]; // Gets the UUID from /listing/{uuid}

  try {
    // Fetch listing data based on UUID
    const listingData = await getListingData(uuid);
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${listingData.title}</title>
  <meta property="og:title" content="${listingData.title}" />
  <meta property="og:description" content="${listingData.description}" />
  <meta property="og:image" content="${listingData.image}" />
  <meta property="og:url" content="https://ratujplon.pl${pathname}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="My App" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${listingData.title}" />
  <meta name="twitter:description" content="${listingData.description}" />
  <meta name="twitter:image" content="${listingData.image}" />
  
  <meta name="description" content="${listingData.description}" />
</head>
<body>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5;">
    <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px;">
      <h1 style="margin: 0 0 1rem 0;">${listingData.title}</h1>
      <p style="margin: 0 0 1rem 0; color: #666;">${listingData.description}</p>
      <img src="${listingData.image}" alt="${listingData.title}" style="max-width: 100%; border-radius: 4px;" />
    </div>
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    // Fallback if listing not found
    const fallbackHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Listing - My App</title>
  <meta property="og:title" content="Property Listing" />
  <meta property="og:description" content="Check out this amazing property listing" />
  <meta property="og:image" content="https://ratujplon.pl/og-image.jpg" />
  <meta property="og:url" content="https://ratujplon.pl${pathname}" />
  <meta property="og:type" content="website" />
</head>
<body>
  <h1>Property Listing</h1>
</body>
</html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(fallbackHtml);
  }
}

// Mock function - replace with your actual data fetching
async function getListingData(uuid) {
  // Option A: Fetch from your database/API
  const response = await fetch(`https://your-backend.com/api/listings/${uuid}`);
  if (response.ok) {
    return await response.json();
  }

  // Option B: Mock data for demonstration
  return {
    title: `Beautiful Property ${uuid.substring(0, 8)}`,
    description: 'Stunning property with modern amenities and great location. Perfect for families and professionals alike.',
    image: 'https://ratujplon.pl/og-image2.jpg',
    price: '$450,000',
    location: 'New York, NY'
  };
}