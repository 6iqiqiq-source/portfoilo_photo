"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string;

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }

  const token = await createToken(password);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function uploadPhoto(formData: FormData) {
  const file = formData.get("file") as File;
  const title = (formData.get("title") as string) || "";
  const description = (formData.get("description") as string) || "";

  if (!file || file.size === 0) {
    return { error: "파일을 선택해주세요." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "이미지 파일만 업로드할 수 있습니다." };
  }

  const fileName = `${Date.now()}_${file.name}`;
  const storagePath = `photos/${fileName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("photos")
    .upload(storagePath, file);

  if (uploadError) {
    return { error: `업로드 실패: ${uploadError.message}` };
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("photos").getPublicUrl(storagePath);

  const { error: dbError } = await supabaseAdmin.from("photos").insert({
    title,
    description,
    file_name: file.name,
    storage_path: storagePath,
    url: publicUrl,
  });

  if (dbError) {
    return { error: `DB 저장 실패: ${dbError.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deletePhoto(photoId: string) {
  await supabaseAdmin
    .from("photos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", photoId);

  revalidatePath("/admin");
  revalidatePath("/");
}
