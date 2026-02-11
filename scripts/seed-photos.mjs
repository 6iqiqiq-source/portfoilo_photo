import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://njaodroabjbtcyyoohvs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYW9kcm9hYmpidGN5eW9vaHZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc4MDQxNCwiZXhwIjoyMDg2MzU2NDE0fQ.BRi1PE8qBuDj2qgNZUToixo7r8l-hjXlNTzR9bqiMcE"
);

const photos = [
  { id: "1506744038136-46273834b3fb", title: "Mountain Lake" },
  { id: "1469474968028-56623f02e42e", title: "Ocean Sunset" },
  { id: "1441974231531-c6227db76b6e", title: "Forest Path" },
  { id: "1470071459604-3b5ec3a7fe05", title: "Green Valley" },
  { id: "1472214103451-9374bd1c798e", title: "Autumn Road" },
  { id: "1433086966358-54859d0ed716", title: "Waterfall" },
  { id: "1465056836041-7f43ac27dcb5", title: "Tropical Beach" },
  { id: "1464822759023-fed622ff2c3b", title: "Volcanic Landscape" },
  { id: "1501785888108-ce5085e066d8", title: "Snowy Mountains" },
  { id: "1507525428034-b723cf961d3e", title: "Desert Dunes" },
];

for (const photo of photos) {
  const url = `https://images.unsplash.com/photo-${photo.id}?w=1920&q=80`;
  console.log(`Downloading: ${photo.title}...`);

  const res = await fetch(url);
  if (!res.ok) {
    console.log(`  Failed to download: ${res.status}`);
    continue;
  }

  const blob = await res.blob();
  const fileName = `${Date.now()}_${photo.title.toLowerCase().replace(/\s+/g, "-")}.jpg`;
  const storagePath = `photos/${fileName}`;

  console.log(`  Uploading to storage...`);
  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(storagePath, blob, { contentType: "image/jpeg" });

  if (uploadError) {
    console.log(`  Upload error: ${uploadError.message}`);
    continue;
  }

  const { data: { publicUrl } } = supabase.storage
    .from("photos")
    .getPublicUrl(storagePath);

  const { error: dbError } = await supabase.from("photos").insert({
    title: photo.title,
    description: `Photo from Unsplash`,
    file_name: `${photo.title}.jpg`,
    storage_path: storagePath,
    url: publicUrl,
  });

  if (dbError) {
    console.log(`  DB error: ${dbError.message}`);
    continue;
  }

  console.log(`  Done!`);
}

console.log("\nAll photos seeded!");
