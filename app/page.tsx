import { supabase } from "@/lib/supabase";
import Portfolio from "./_components/portfolio";

export default async function Home() {
  const { data: photos } = await supabase
    .from("photos")
    .select("id, title, file_name, url")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return <Portfolio photos={photos ?? []} />;
}
