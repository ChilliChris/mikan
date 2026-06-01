import { supabase } from "./supabase.js";

export async function addTime(category, date, website, time) {
  if (typeof time !== "number") {
    console.error("Invalid time:", time);
    return;
  }

  const {data: {user} } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated");
    return;
  }

  // First check if row exists
  const { data: existing, error: fetchError } = await supabase
    .from("immersion_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("category", category)
    .eq("website", website)
    .eq("immersion_date", date)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error(fetchError);
    return;
  }

  // Row exists → update seconds
  if (existing) {

    const { error } = await supabase
      .from("immersion_logs")
      .update({
        seconds: existing.seconds + time
      })
      .eq("id", existing.id);

    if (error) {
      console.error(error);
      return;
    }

    console.log("Updated existing row");
  }
  // Row does not exist → create row
  else {

    const { error } = await supabase
      .from("immersion_logs")
      .insert({
        user_id: user.id,
        category,
        website,
        seconds: time,
        immersion_date: date
      });

    if (error) {
      console.error(error);
      return;
    }

    console.log("Inserted new row");
}
}

export async function getDayTotal(date) {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("immersion_logs")
    .select("seconds")
    .eq("user_id", user.id)
    .eq("immersion_date", date);

  if (error) {
    console.error(error);
    return 0;
  }

  let total = 0;

  for (const row of data) {
    total += row.seconds;
  }

  return total;
}

export async function getAllData() {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("immersion_logs")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}