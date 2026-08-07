import { createServerFn } from "@tanstack/react-start";

type BriefingRow = {
  id: string;
  created_at: string;
  status: string;
  full_name: string;
  brand_name: string | null;
  instagram_handle: string | null;
  website: string | null;
  niche: string | null;
  contact: string | null;
  main_need: string | null;
  needs_details: string | null;
  post_frequency: string | null;
  team_structure: string | null;
  reference_links: string | null;
  budget_range: string | null;
  currency: string | null;
  timeline: string | null;
  files: { name: string; path: string; type: string }[];
  audio_url: string | null;
};

export type AdminLead = BriefingRow & {
  signedFiles: { name: string; type: string; url: string | null }[];
  signedAudio: string | null;
};

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("./admin-auth.server");
    assertAdmin(data.password);
    return { ok: true as const };
  });

export const listLeads = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }): Promise<AdminLead[]> => {
    const { assertAdmin } = await import("./admin-auth.server");
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await supabaseAdmin
      .from("briefings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const leads: AdminLead[] = [];
    for (const row of (rows ?? []) as unknown as BriefingRow[]) {
      const files = Array.isArray(row.files) ? row.files : [];
      const signedFiles = await Promise.all(
        files.map(async (f) => {
          const { data: signed } = await supabaseAdmin.storage
            .from("briefing-media")
            .createSignedUrl(f.path, 60 * 60);
          return { name: f.name, type: f.type, url: signed?.signedUrl ?? null };
        }),
      );
      let signedAudio: string | null = null;
      if (row.audio_url) {
        const { data: signed } = await supabaseAdmin.storage
          .from("briefing-media")
          .createSignedUrl(row.audio_url, 60 * 60);
        signedAudio = signed?.signedUrl ?? null;
      }
      leads.push({ ...row, files, signedFiles, signedAudio });
    }
    return leads;
  });

export const updateLeadStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; id: string; status: string }) => d)
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("./admin-auth.server");
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("briefings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const saveContract = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      password: string;
      client_name: string;
      tax_id: string;
      monthly_investment: string;
      currency: string;
      deliverables: string;
      duration_months: number;
      start_date: string;
      notes: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    const { assertAdmin } = await import("./admin-auth.server");
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { password: _pw, ...payload } = data;
    const { data: row, error } = await supabaseAdmin
      .from("contracts")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });
