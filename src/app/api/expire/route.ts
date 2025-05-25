import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables")
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { data: expiredPastes, error: selectError } = await supabase
      .from("pastes")
      .select("id, views")
      .lt("expires_at", new Date().toISOString())

    if (selectError) throw selectError

    const { data, error } = await supabase.from("pastes").delete().lt("expires_at", new Date().toISOString())

    if (error) throw error

    const expiredCount = expiredPastes?.length || 0
    console.log(`Expired ${expiredCount} pastes`)

    return NextResponse.json({
      success: true,
      expired: expiredCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in expirePastes function:", error)
    return NextResponse.json({ error: "Failed to expire pastes" }, { status: 500 })
  }
}
