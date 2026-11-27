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

export async function handleQuicknoteGetNotes(): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ notes: [], isGuest: true });
    }

    const { data, error } = await supabase
      .from("quicknote_notes")
      .select("*")
      .eq("user_id", user.id)
      .order("order_index", { ascending: true })
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notes: data ?? [], isGuest: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load notes" },
      { status: 500 }
    );
  }
}

export async function handleQuicknoteCreateNote(request: Request): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Sign in required to save notes" }, { status: 401 });
    }

    const body = (await request.json()) as {
      title?: string;
      content?: string;
      tags?: string[];
      folder?: string;
      order_index?: number;
    };

    const title = body.title?.trim() || "Untitled Note";
    const { data, error } = await supabase
      .from("quicknote_notes")
      .insert({
        user_id: user.id,
        title: title.slice(0, 200),
        content: (body.content ?? "").slice(0, 50000),
        tags: Array.isArray(body.tags) ? body.tags : [],
        folder: body.folder?.trim() ?? "",
        order_index: typeof body.order_index === "number" ? body.order_index : 0,
      })
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Failed to create note" }, { status: 500 });
    }

    return NextResponse.json({ note: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create note" },
      { status: 500 }
    );
  }
}

export async function handleQuicknoteUpdateNote(request: Request): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      id?: number;
      title?: string;
      content?: string;
      tags?: string[];
      folder?: string;
      order_index?: number;
    };

    if (!body.id) {
      return NextResponse.json({ error: "Note id is required" }, { status: 400 });
    }

    const updates: {
      title?: string;
      content?: string;
      tags?: string[];
      folder?: string;
      order_index?: number;
    } = {};
    if (typeof body.title === "string" && body.title.trim()) {
      updates.title = body.title.trim().slice(0, 200);
    }
    if (typeof body.content === "string") {
      updates.content = body.content.slice(0, 50000);
    }
    if (Array.isArray(body.tags)) updates.tags = body.tags;
    if (typeof body.folder === "string") updates.folder = body.folder.trim();
    if (typeof body.order_index === "number") updates.order_index = body.order_index;

    const { data, error } = await supabase
      .from("quicknote_notes")
      .update(updates)
      .eq("id", body.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Failed to update note" }, { status: 500 });
    }

    return NextResponse.json({ note: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function handleQuicknoteDeleteNote(request: Request): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    const noteId = idParam ? Number(idParam) : NaN;
    if (!Number.isFinite(noteId)) {
      return NextResponse.json({ error: "Valid id parameter is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("quicknote_notes")
      .delete()
      .eq("id", noteId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete note" },
      { status: 500 }
    );
  }
}

export async function handleQuicknoteGetRelations(): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ relations: [], isGuest: true });
    }

    const { data, error } = await supabase
      .from("quicknote_note_relations")
      .select("note_id, related_note_id, created_at");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ relations: data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load note relations" },
      { status: 500 }
    );
  }
}

export async function handleQuicknoteCreateRelation(request: Request): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      note_id?: number;
      related_note_id?: number;
    };

    if (!body.note_id || !body.related_note_id || body.note_id === body.related_note_id) {
      return NextResponse.json({ error: "Two distinct note IDs are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("quicknote_note_relations")
      .upsert(
        { note_id: body.note_id, related_note_id: body.related_note_id },
        { onConflict: "note_id,related_note_id" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ relation: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to link notes" },
      { status: 500 }
    );
  }
}

export async function handleQuicknoteDeleteRelation(request: Request): Promise<Response> {
  try {
    const { supabase, user } = await resolveSupabaseSession();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const noteId = Number(searchParams.get("noteId"));
    const relatedNoteId = Number(searchParams.get("relatedNoteId"));
    if (!Number.isFinite(noteId) || !Number.isFinite(relatedNoteId)) {
      return NextResponse.json({ error: "noteId and relatedNoteId required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("quicknote_note_relations")
      .delete()
      .eq("note_id", noteId)
      .eq("related_note_id", relatedNoteId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to unlink notes" },
      { status: 500 }
    );
  }
}

function buildDeterministicDraft(
  topic: string,
  existingTitles: string[]
): {
  title: string;
  content: string;
  tags: string[];
} {
  const cleanTopic = topic.trim() || "Project Spec";
  const linkedNote = existingTitles[0] ? `[[${existingTitles[0]}]]` : "[[Architecture Hub]]";

  return {
    title: cleanTopic,
    tags: ["draft", "generated"],
    content: `# ${cleanTopic}

## Context & Objectives
Structured engineering outline for **${cleanTopic}**, connected to ${linkedNote}.

## Key Deliverables
- Define interfaces, acceptance criteria, and edge cases
- Implement automated unit & integration tests
- Link related research notes inside the knowledge graph

## Action Items
- [ ] Draft technical architecture section
- [ ] Review dependencies with team
- [ ] Verify production rollout metrics`,
  };
}

export async function handleQuicknoteGenerate(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      existingTitles?: string[];
    };
    const prompt = body.prompt?.trim();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const existingTitles = Array.isArray(body.existingTitles) ? body.existingTitles : [];
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ...buildDeterministicDraft(prompt, existingTitles),
        provider: "template",
      });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
    const systemInstruction = `Generate a concise Markdown note titled neatly for the user prompt. Link relevant existing notes using [[Exact Title]] syntax when appropriate from: ${existingTitles.join(", ")}. Respond strictly in JSON with keys: "title" (string), "tags" (string array of 2-4 lowercase tags), and "content" (markdown string).`;

    const res = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nUser prompt: ${prompt}` }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({
        ...buildDeterministicDraft(prompt, existingTitles),
        provider: "fallback",
      });
    }

    const payload = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const rawText = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json({
        ...buildDeterministicDraft(prompt, existingTitles),
        provider: "fallback",
      });
    }

    const parsed = JSON.parse(rawText) as {
      title?: string;
      tags?: string[];
      content?: string;
    };

    return NextResponse.json({
      title: parsed.title?.trim() || prompt,
      tags: Array.isArray(parsed.tags) ? parsed.tags : ["ai"],
      content: parsed.content || buildDeterministicDraft(prompt, existingTitles).content,
      provider: "gemini",
    });
  } catch {
    return NextResponse.json({
      title: "Generated Note",
      tags: ["draft"],
      content: "# Generated Note\n\n- [ ] Flesh out details",
      provider: "fallback",
    });
  }
}

export async function handleQuicknoteClickupMcp(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as { query?: string; folder?: string };
    const query = body.query?.trim() || "Sprint Tasks";

    return NextResponse.json({
      source: "clickup-bridge",
      tasks: [
        {
          id: "CU-101",
          name: `${query}: Ship graph backlink inspector`,
          status: "in progress",
        },
        {
          id: "CU-102",
          name: `${query}: Verify mobile split-view responsiveness`,
          status: "to do",
        },
      ],
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to query tasks" },
      { status: 500 }
    );
  }
}
