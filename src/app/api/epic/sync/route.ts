import { NextResponse } from 'next/server';

// Official Epic Games Launcher OAuth Client Credentials (Publicly documented in Legendary/Heroic/Open-Source projects)
const EPIC_LAUNCHER_AUTH = 'Basic MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3MzZmYzUyMjVkNmVmZDNhMDFlMDA4ZDU=';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { exchangeCode, code, accessToken: providedToken } = body;
    const inputCode = exchangeCode || code;

    let accessToken = providedToken;
    let accountId = '';

    // 1. If an exchangeCode was provided, exchange it for an Epic OAuth access token
    if (inputCode && !accessToken) {
      const tokenRes = await fetch('https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token', {
        method: 'POST',
        headers: {
          'Authorization': EPIC_LAUNCHER_AUTH,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=exchange_code&exchange_code=${encodeURIComponent(inputCode.trim())}`,
      });

      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        return NextResponse.json(
          {
            success: false,
            error: 'OAUTH_FAILED',
            message: `Failed to authenticate with Epic Games (${tokenRes.status}). Please check if your Exchange Code has expired (codes expire in 5 minutes).`,
            details: errorText,
          },
          { status: tokenRes.status }
        );
      }

      const tokenData = await tokenRes.json();
      accessToken = tokenData.access_token;
      accountId = tokenData.account_id;
    }

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_TOKEN',
          message: 'An Exchange Code or OAuth Access Token is required to sync your Epic Games library.',
        },
        { status: 400 }
      );
    }

    // 2. Query Epic Games Store Internal Library API
    const libraryUrl = 'https://library-service.epicgames.com/library/api/public/items?includeMetadata=true';
    const libRes = await fetch(libraryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!libRes.ok) {
      const libErr = await libRes.text();
      return NextResponse.json(
        {
          success: false,
          error: 'LIBRARY_FETCH_FAILED',
          message: `Epic Games Library API returned ${libRes.status}. If Epic blocks datacenter IPs, use the Browser Console Script in the modal to sync directly!`,
          details: libErr,
        },
        { status: libRes.status }
      );
    }

    const libData = await libRes.json();
    const records = Array.isArray(libData?.records) ? libData.records : Array.isArray(libData) ? libData : [];

    // 3. Extract unique owned titles and metadata
    const ownedItems = records.map((item: any) => ({
      title: item.title || item.appName || 'Unknown Title',
      appName: item.appName || '',
      namespace: item.namespace || '',
      catalogItemId: item.catalogItemId || '',
    }));

    return NextResponse.json({
      success: true,
      accountId,
      totalOwned: ownedItems.length,
      items: ownedItems,
      syncedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: err?.message || 'An unexpected error occurred during Epic Games sync.',
      },
      { status: 500 }
    );
  }
}
