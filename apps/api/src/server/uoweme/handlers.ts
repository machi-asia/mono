import { NextResponse } from "next/server";
import { createClient } from "@mono/database/server";

async function resolveSupabaseSession() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { supabase, user: null };
    }
    return { supabase, user };
  } catch {
    return { supabase: null, user: null };
  }
}

export async function handleUowemeGetDebts(): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ debts: [], isGuest: true });
    }

    const { data, error } = await supabase
      .from("debts")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const debts = (data ?? []).map((row) => ({
      ...row,
      amount: Number(row.amount),
    }));

    return NextResponse.json({ debts, isGuest: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load debts" },
      { status: 500 }
    );
  }
}

export async function handleUowemeCreateDebt(request: Request): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Sign in required to save entries" }, { status: 401 });
    }

    const body = (await request.json()) as {
      person?: string;
      amount?: number;
      direction?: "they_owe_me" | "i_owe_them";
      note?: string;
      date?: string;
      due_date?: string | null;
    };

    const person = body.person?.trim();
    const amount = Number(body.amount);
    if (!person || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Valid person and positive amount are required" },
        { status: 400 }
      );
    }

    const direction = body.direction === "i_owe_them" ? "i_owe_them" : "they_owe_me";
    const { data, error } = await supabase
      .from("debts")
      .insert({
        user_id: user.id,
        person,
        amount: Number(amount.toFixed(2)),
        direction,
        note: body.note?.trim() ?? "",
        date: body.date || new Date().toISOString().slice(0, 10),
        due_date: body.due_date || null,
        settled: false,
      })
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Failed to create debt" }, { status: 500 });
    }

    return NextResponse.json({ debt: { ...data, amount: Number(data.amount) } }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create debt" },
      { status: 500 }
    );
  }
}

export async function handleUowemeUpdateDebt(request: Request, id: string): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      settled?: boolean;
      note?: string;
      amount?: number;
      due_date?: string | null;
    };

    const updates: {
      settled?: boolean;
      note?: string;
      amount?: number;
      due_date?: string | null;
    } = {};
    if (typeof body.settled === "boolean") updates.settled = body.settled;
    if (typeof body.note === "string") updates.note = body.note;
    if (typeof body.amount === "number" && body.amount > 0) {
      updates.amount = Number(body.amount.toFixed(2));
    }
    if (body.due_date !== undefined) updates.due_date = body.due_date;

    const { data, error } = await supabase
      .from("debts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Failed to update debt" }, { status: 500 });
    }

    return NextResponse.json({ debt: { ...data, amount: Number(data.amount) } });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update debt" },
      { status: 500 }
    );
  }
}

export async function handleUowemeDeleteDebt(_request: Request, id: string): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.from("debts").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete debt" },
      { status: 500 }
    );
  }
}

export async function handleUowemeCheckout(request: Request): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { person?: string };
    const person = body.person?.trim();
    if (!person) {
      return NextResponse.json({ error: "Person name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("debts")
      .update({ settled: true })
      .eq("user_id", user.id)
      .ilike("person", person)
      .eq("settled", false)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      settledCount: (data ?? []).length,
      settledIds: (data ?? []).map((r) => r.id),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to checkout contact balance" },
      { status: 500 }
    );
  }
}

export async function handleUowemeGetUsers(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ contacts: [] });
    }

    const { data, error } = await supabase
      .from("debts")
      .select("person")
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const unique = Array.from(new Set((data ?? []).map((row) => row.person))).filter((name) =>
      query ? name.toLowerCase().includes(query) : true
    );

    return NextResponse.json({ contacts: unique.slice(0, 20) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
