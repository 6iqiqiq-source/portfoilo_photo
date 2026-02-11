import { supabaseAdmin } from "@/lib/supabase-admin";
import UploadForm from "./upload-form";
import PhotoCard from "./photo-card";

export default async function AdminPage() {
  const { data: photos } = await supabaseAdmin
    .from("photos")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-lg font-medium">사진 업로드</h2>
        <UploadForm />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium">
          업로드된 사진 ({photos?.length ?? 0})
        </h2>
        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">아직 업로드된 사진이 없습니다.</p>
        )}
      </section>
    </div>
  );
}
