import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

import { products } from "../src/data/products";
import { reaisToCents } from "../src/domain/product";

type EnvMap = Record<string, string>;

const loadEnvFile = (fileName: string): EnvMap => {
  const filePath = path.join(process.cwd(), fileName);

  if (!existsSync(filePath)) {
    return {};
  }

  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .reduce<EnvMap>((env, line) => {
      const [key, ...valueParts] = line.split("=");
      env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
      return env;
    }, {});
};

const env = {
  ...loadEnvFile(".env"),
  ...loadEnvFile(".env.local"),
  ...process.env,
};

const supabaseUrl = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = env.SUPABASE_PRODUCT_IMAGES_BUCKET ?? "product-images";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Informe SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente ou em .env.local.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const toStoragePath = (productId: string, imageUrl: string, index: number) => {
  const sourcePath = imageUrl.replace(/^\//, "");
  const extension = path.extname(sourcePath).toLowerCase();
  const name = path.basename(sourcePath, extension).toLowerCase();
  return `${productId}/${String(index + 1).padStart(2, "0")}-${name}${extension}`;
};

for (const [sortOrder, product] of products.entries()) {
  const { error: productError } = await supabase.from("products").upsert(
    {
      id: product.id,
      name: product.name,
      description: product.description?.trim() || null,
      weight_grams: product.weight ?? null,
      price_cents: reaisToCents(product.price) ?? null,
      active: product.isActive,
      sort_order: product.sortOrder ?? sortOrder,
    },
    { onConflict: "id" },
  );

  if (productError) {
    throw new Error(`Erro ao salvar ${product.id}: ${productError.message}`);
  }

  for (const [index, imageUrl] of product.images.entries()) {
    const localPath = path.join(process.cwd(), "public", imageUrl);

    if (!existsSync(localPath)) {
      console.warn(`Imagem local não encontrada, ignorando: ${imageUrl}`);
      continue;
    }

    const storagePath = toStoragePath(product.id, imageUrl, index);
    const extension = path.extname(localPath).toLowerCase();
    const file = await readFile(localPath);
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, file, {
        contentType: contentTypes[extension] ?? "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(
        `Erro ao enviar imagem ${imageUrl}: ${uploadError.message}`,
      );
    }

    const { error: imageError } = await supabase.from("product_images").upsert(
      {
        product_id: product.id,
        storage_path: storagePath,
        alt_text: product.name,
        sort_order: index,
      },
      { onConflict: "storage_path" },
    );

    if (imageError) {
      throw new Error(
        `Erro ao registrar imagem ${imageUrl}: ${imageError.message}`,
      );
    }
  }

  console.log(`Produto migrado: ${product.name}`);
}

console.log("Seed concluído sem duplicar produtos ou posições de imagem.");
