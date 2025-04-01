import { NextResponse } from "next/server";

// These configs are required for static export
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  try {
    console.log("Fetching data from infrared.finance, in proxy");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(
      "https://infrared.finance/api/vault/infrared-ibgt?chainId=80094",
      {
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    console.log("Response received from infrared.finance");
    console.log(response);
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Data fetched successfully");
    
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Proxy API error:", error);
    
    // Return error without hardcoded data
    return NextResponse.json(
      { 
        message: "Error fetching data", 
        error: error instanceof Error ? error.message : String(error)
      },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    );
  }
}
