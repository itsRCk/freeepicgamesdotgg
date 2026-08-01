import { NextResponse } from 'next/server';

// Official Epic Games Launcher OAuth Client Credentials (Publicly documented in Legendary/Heroic/Open-Source projects)
const EPIC_LAUNCHER_AUTH = 'Basic MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { exchangeCode, code, accessToken: providedToken } = body;
    const inputCode = exchangeCode || code || '';

    let accessToken = providedToken;
    let accountId = '';

    // Clean and extract code (handles pasted JSON, pasted URLs, or plain 32-char codes)
    const rawInput = String(inputCode).trim();
    let extractedCode = rawInput;

    if (rawInput.startsWith('{') && rawInput.endsWith('}')) {
      try {
        const parsed = JSON.parse(rawInput);
        extractedCode = parsed.authorizationCode || parsed.code || parsed.exchangeCode || rawInput;
      } catch {
        // ignore JSON parse failure
      }
    } else if (rawInput.includes('code=')) {
      const match = rawInput.match(/code=([a-fA-F0-9]{32})/);
      if (match && match[1]) {
        extractedCode = match[1];
      }
    }

    // 1. If a code was provided, exchange it for an Epic OAuth access token
    if (extractedCode && !accessToken) {
      // First try as authorization_code (with redirect_uri required by Epic's OAuth 2.0 implementation)
      let tokenRes = await fetch('https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token', {
        method: 'POST',
        headers: {
          'Authorization': EPIC_LAUNCHER_AUTH,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${encodeURIComponent(extractedCode)}&redirect_uri=https%3A%2F%2Flocalhost%2Flauncher%2Fauthorized`,
      });

      // If authorization_code failed with 400, automatically retry as exchange_code
      if (!tokenRes.ok && tokenRes.status === 400) {
        tokenRes = await fetch('https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token', {
          method: 'POST',
          headers: {
            'Authorization': EPIC_LAUNCHER_AUTH,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=exchange_code&exchange_code=${encodeURIComponent(extractedCode)}`,
        });
      }

      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        let errorJson: any = {};
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          errorJson = { errorMessage: errorText };
        }

        let readableMessage = `Epic Games Error: ${errorJson.errorMessage || errorJson.errorCode || tokenRes.status}`;
        if (errorText.includes('oauth.authorization_code_not_found') || errorText.includes('oauth.exchange_code_not_found')) {
          readableMessage = 'Your Epic code has expired (codes expire after 60 seconds) or was already used. Please click "Open Epic Login" to generate a fresh code and click Sync immediately.';
        } else if (errorText.includes('redirect_uri')) {
          readableMessage = 'Redirect URI mismatch during Epic authentication.';
        }

        return NextResponse.json(
          {
            success: false,
            error: errorJson.errorCode || 'OAUTH_FAILED',
            message: readableMessage,
            details: errorJson,
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
          message: 'A valid Epic Exchange Code or Authorization Code is required to sync your library.',
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
          message: `Epic Games Library API returned ${libRes.status}. Ensure your account has access to the library service.`,
          details: libErr,
        },
        { status: libRes.status }
      );
    }

    const libData = await libRes.json();
    const records = Array.isArray(libData?.records)
      ? libData.records
      : Array.isArray(libData?.elements)
      ? libData.elements
      : Array.isArray(libData)
      ? libData
      : [];

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
