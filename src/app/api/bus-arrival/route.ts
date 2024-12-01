import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const busStopCode = searchParams.get('busStop') || '66291';

  try {
    const response = await fetch(
      `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}`,
      {
        headers: {
          'AccountKey': process.env.LTA_API_KEY!,
          'accept': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.Services) {
      return NextResponse.json({ 
        Services: [],
        BusStopCode: busStopCode,
        'odata.metadata': ''
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      Services: [],
      BusStopCode: busStopCode,
      'odata.metadata': '',
      error: 'Failed to fetch bus arrival data'
    }, { status: 200 }); // Return 200 with empty data instead of 500
  }
} 