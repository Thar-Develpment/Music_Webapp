import { TeamMember } from "@music-label/shared";
import { getSupabase } from "../config/supabase.js";
import { invalidateCache } from "../middleware/cache.middleware.js";
import { AppError } from "../errors/app-error.js";

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("order_num", { ascending: true });

  if (error || !data) {
    throw new AppError(error?.message || "Failed to load team members", 500);
  }

  return data.map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    bio: r.bio,
    photoUrl: r.photo_url,
    order: r.order_num,
  }));
}

export async function upsertTeamMember(member: TeamMember): Promise<TeamMember> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("team_members")
    .upsert({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      photo_url: member.photoUrl,
      order_num: member.order,
    })
    .select()
    .single();

  if (error || !data) {
    throw new AppError(error?.message || "Failed to save team member", 500);
  }

  invalidateCache("team");
  return {
    id: data.id,
    name: data.name,
    role: data.role,
    bio: data.bio,
    photoUrl: data.photo_url,
    order: data.order_num,
  };
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) {
    throw new AppError(error.message, 500);
  }
  invalidateCache("team");
}
