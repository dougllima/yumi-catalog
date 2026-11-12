/**
 * Gera, após o build, um HTML por produto publicado em dist/produto/<id>/index.html
 * com meta tags Open Graph. A SPA continua carregando normalmente; as tags servem
 * para a pré-visualização de links (WhatsApp, Instagram, etc.), que não executam JS.
 *
 * Usa apenas a chave pública (publishable/anon). Se o Supabase não estiver
 * configurado ou a consulta falhar, apenas avisa e não quebra o build.
 */
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const siteUrl = "https://www.yumistudio3d.com.br";
const distDir = "dist";

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number | null;
  product_images: { storage_path: string; sort_order: number }[] | null;
};

const loadEnvFile = (path: string) => {
  if (!existsSync(path)) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/))
      .filter((match): match is RegExpMatchArray => match !== null)
      .map((match) => [match[1], match[2].replace(/^['"]|['"]$/g, "")]),
  );
};

const env = {
  ...loadEnvFile(".env"),
  ...loadEnvFile(".env.local"),
  ...process.env,
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const truncate = (value: string, max: number) =>
  value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;

const formatPrice = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    cents / 100,
  );

async function main() {
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY;
  const bucket = env.SUPABASE_PRODUCT_IMAGES_BUCKET || "product-images";

  if (env.VITE_DATA_PROVIDER === "static" || !supabaseUrl || !key) {
    console.warn(
      "[share-pages] Supabase não configurado; páginas de compartilhamento ignoradas.",
    );
    return;
  }

  const template = await readFile(join(distDir, "index.html"), "utf8");
  const query =
    "products?select=id,name,description,price_cents,product_images(storage_path,sort_order)&active=eq.true";
  const response = await fetch(`${supabaseUrl}/rest/v1/${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });

  if (!response.ok) {
    throw new Error(`Supabase respondeu ${response.status}`);
  }

  const products = (await response.json()) as ProductRow[];

  for (const product of products) {
    const firstImage = [...(product.product_images ?? [])].sort(
      (left, right) => left.sort_order - right.sort_order,
    )[0];
    const imageUrl = firstImage
      ? `${supabaseUrl}/storage/v1/object/public/${bucket}/${firstImage.storage_path
          .split("/")
          .map(encodeURIComponent)
          .join("/")}`
      : `${siteUrl}/brand/yumi-logo.png`;
    const price =
      product.price_cents && product.price_cents > 0
        ? formatPrice(product.price_cents)
        : "Sob encomenda";
    const description = truncate(
      [product.description?.trim(), price].filter(Boolean).join(" · "),
      200,
    );
    const title = `${product.name} - Yumi Studio`;
    const url = `${siteUrl}/produto/${encodeURIComponent(product.id)}`;

    const meta = [
      `<meta property="og:type" content="product" />`,
      `<meta property="og:site_name" content="Yumi Studio" />`,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
      `<meta property="og:url" content="${escapeHtml(url)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
    ].join("\n    ");

    const html = template
      .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
      .replace(
        /<meta\s+name="description"[^>]*>/s,
        `<meta name="description" content="${escapeHtml(description)}" />`,
      )
      .replace("</head>", `    ${meta}\n  </head>`);

    const directory = join(distDir, "produto", product.id);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, "index.html"), html);
  }

  console.log(`[share-pages] ${products.length} páginas geradas.`);
}

main().catch((error: unknown) => {
  console.warn("[share-pages] Falhou; build segue sem elas:", error);
});
