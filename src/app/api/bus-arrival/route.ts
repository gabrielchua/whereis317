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
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bus arrival data' }, { status: 500 });
  }
} 