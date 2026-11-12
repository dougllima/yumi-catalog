import { ArrowLeft, ImagePlus, LogOut, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  authService,
  mediaStorage,
  productRepository,
} from "@/application/dependencies";
import { PageContainer } from "@/components/PageContainer";
import { Panel } from "@/components/Panel";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import type { ProductCategory } from "@/domain/product";
import { publicAssetUrl } from "@/utils/publicAssetUrl";

type CategoryRowProps = {
  category: ProductCategory;
  onSaved: () => void;
};

type Feedback = { kind: "ok" | "error"; text: string };

function CategoryRow({ category, onSaved }: CategoryRowProps) {
  const [name, setName] = useState(category.name);
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    if (!previewUrl) {
      return;
    }

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const currentImageUrl = removeImage
    ? undefined
    : (previewUrl ?? category.imageUrl);
  const dirty = name.trim() !== category.name || Boolean(file) || removeImage;

  const save = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      let imagePath = removeImage ? null : (category.imagePath ?? null);

      if (file) {
        imagePath = (await mediaStorage.uploadCategoryImage(category.id, file))
          .storagePath;
      }

      const updated = await productRepository.updateCategory(category.id, {
        name,
        imagePath,
      });

      if (category.imagePath && category.imagePath !== imagePath) {
        await mediaStorage.remove(category.imagePath).catch(() => undefined);
      }

      setFile(null);
      setRemoveImage(false);
      setName(updated.name);
      setFeedback({ kind: "ok", text: "Categoria salva." });
      onSaved();
    } catch (unknownError) {
      setFeedback({
        kind: "error",
        text:
          unknownError instanceof Error
            ? unknownError.message
            : "Não foi possível salvar a categoria.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel
      as="li"
      variant="item"
      data-testid={`admin-category-${category.slug}`}
      className="grid gap-3 p-3 sm:grid-cols-[96px_1fr_auto] sm:items-center"
    >
      <div className="grid size-24 place-items-center overflow-hidden rounded-2xl border bg-muted text-xs font-bold text-muted-foreground">
        {currentImageUrl ? (
          <img
            src={publicAssetUrl(currentImageUrl)}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          "Sem imagem"
        )}
      </div>

      <div className="grid gap-2">
        <label className="grid gap-1 text-sm font-extrabold">
          Nome
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-10 rounded-full border bg-background/70 px-4 font-semibold outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-label={`Imagem da categoria ${category.name}`}
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setRemoveImage(false);
              event.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => fileInput.current?.click()}
          >
            <ImagePlus aria-hidden="true" />
            {currentImageUrl ? "Trocar imagem" : "Adicionar imagem"}
          </Button>
          {currentImageUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full text-muted-foreground"
              onClick={() => {
                setFile(null);
                setRemoveImage(Boolean(category.imageUrl));
              }}
            >
              <Trash2 aria-hidden="true" />
              Remover imagem
            </Button>
          )}
        </div>
        {!currentImageUrl && (
          <p className="text-xs text-muted-foreground">
            Sem imagem própria, a home usa a foto de um produto da categoria.
          </p>
        )}
        {feedback && (
          <p
            role={feedback.kind === "error" ? "alert" : "status"}
            className={`text-sm font-semibold ${
              feedback.kind === "error"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {feedback.text}
          </p>
        )}
      </div>

      <Button
        type="button"
        className="rounded-full"
        disabled={!dirty || saving || !name.trim()}
        onClick={save}
      >
        <Save aria-hidden="true" />
        {saving ? "Salvando..." : "Salvar"}
      </Button>
    </Panel>
  );
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setCategories(await productRepository.listCategories());
      setError(null);
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Não foi possível carregar as categorias.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  return (
    <PageContainer>
      <section className="grid gap-5" aria-labelledby="admin-categories-title">
        <Panel className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SectionHeader
            as="h1"
            titleId="admin-categories-title"
            eyebrow="Administração"
            title="Categorias"
            description="Renomeie categorias e escolha a imagem exibida na home."
          />
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" className="rounded-full">
              <Link to="/admin">
                <ArrowLeft aria-hidden="true" />
                Produtos
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void authService.signOut()}
            >
              <LogOut aria-hidden="true" />
              Sair
            </Button>
          </div>
        </Panel>

        {error && (
          <p role="alert" className="text-sm font-semibold text-destructive">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm font-semibold text-muted-foreground">
            Carregando categorias...
          </p>
        ) : (
          <ul className="grid gap-3">
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onSaved={() => void load()}
              />
            ))}
          </ul>
        )}
      </section>
    </PageContainer>
  );
}
