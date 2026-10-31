import { EnquiryRecord, EnquirySubmission } from "@music-label/shared";
import { getSupabase } from "../config/supabase.js";
import { AppError, NotFoundError } from "../errors/app-error.js";

export async function createEnquiry(submission: EnquirySubmission): Promise<EnquiryRecord> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      first_name: submission.firstName,
      email: submission.email,
      phone: submission.phone,
      message: submission.message,
    })
    .select()
    .single();

  if (error || !data) {
    throw new AppError(error?.message || "Failed to submit enquiry", 500);
  }

  return {
    id: data.id,
    firstName: data.first_name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    createdAt: data.created_at,
    readAt: data.read_at,
  };
}

export async function getEnquiries(): Promise<EnquiryRecord[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    throw new AppError(error?.message || "Failed to load enquiries", 500);
  }

  return data.map((r) => ({
    id: r.id,
    firstName: r.first_name,
    email: r.email,
    phone: r.phone,
    message: r.message,
    createdAt: r.created_at,
    readAt: r.read_at,
  }));
}

export async function markEnquiryRead(id: string, read = true): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("enquiries")
    .update({ read_at: read ? new Date().toISOString() : null })
    .eq("id", id);

  if (error) {
    throw new AppError(error.message, 500);
  }
}

export async function deleteEnquiry(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  if (error) {
    throw new AppError(error.message, 500);
  }
}
