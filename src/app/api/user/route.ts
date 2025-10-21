// 📁 app/api/user/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🟢 GET — Get all users
export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("id", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 🟢 POST — Add new user
export async function POST(request: Request) {
  const body = await request.json();
  const { name, email } = body;

  if (!name || !email)
    return NextResponse.json({ error: "Missing name or email" }, { status: 400 });

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

// 🟡 PUT — Full update by ID
export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, email } = body;

  if (!id) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  const { data, error } = await supabase
    .from("users")
    .update({ name, email })
    .eq("id", id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

// 🟠 PATCH — Partial update
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

// 🔴 DELETE — Remove by ID
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
