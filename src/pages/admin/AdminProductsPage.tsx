import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Save,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  authService,
  mediaStorage,
  productRepository,
  runtimeBackend,
} from "@/application/dependencies";
import { Button } from "@/components/ui/button";
import type { Product, ProductImage } from "@/domain/product";
import {
  categorySlug,
  createProductCategory,
  dedupeCategoryNames,
  normalizeCategoryName,
  normalizeSearch,
  reaisToCents,
} from "@/domain/product";

type ProductFormState = {
  id: string;
  name: string;
  description: string;
  weight: string;
  price: string;
  categoryNames: string[];
  isActive: boolean;
};

const emptyForm: ProductFormState = {
  id: "",
  name: "",
  description: "",
  weight: "",
  price: "",
  categoryNames: [],
  isActive: true,
};

const slugify = (value: string) =>
  normalizeSearch(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const formatNumberInput = (value?: number) =>
  typeof value === "number" ? String(value).replace(".", ",") : "";

const parseNumberInput = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const toFormState = (product: Product): ProductFormState => ({
  id: product.id,
  name: product.name,
  description: product.description ?? "",
  weight: formatNumberInput(product.weight),
  price: formatNumberInput(product.price),
  categoryNames: product.categories.map((category) => category.name),
  isActive: product.isActive,
});

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Product["categories"]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [categoryDraft, setCategoryDraft] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = products.find((product) => product.id === selectedId);
  const isCreating = !selectedProduct;

  const filteredProducts = useMemo(() => {
    const normalized = normalizeSearch(searchTerm);

    if (!normalized) {
      return products;
    }

    return products.filter((product) => {
      const searchable = [
        product.name,
        product.description,
        ...product.categories.map((category) => category.name),
      ]
        .filter(Boolean)
        .join(" ");

      return normalizeSearch(searchable).includes(normalized);
    });
  }, [products, searchTerm]);

  const selectedCategorySlugs = useMemo(
    () => new Set(form.categoryNames.map(categorySlug).filter(Boolean)),
    [form.categoryNames],
  );

  const categorySuggestions = useMemo(() => {
    const normalizedDraft = normalizeSearch(categoryDraft);
    const draftSlug = categorySlug(categoryDraft);

    return allCategories
      .filter((category) => !selectedCategorySlugs.has(category.slug))
      .filter((category) => {
        if (!normalizedDraft && !draftSlug) {
          return true;
        }

        return (
          normalizeSearch(category.name).includes(normalizedDraft) ||
          category.slug.includes(draftSlug)
        );
      })
      .slice(0, 6);
  }, [allCategories, categoryDraft, selectedCategorySlugs]);

  const categoryDraftValue = normalizeCategoryName(categoryDraft);
  const categoryDraftSlug = categorySlug(categoryDraftValue);
  const existingCategoryForDraft = allCategories.find(
    (category) => category.slug === categoryDraftSlug,
  );
  const canCreateCategory =
    Boolean(categoryDraftSlug) &&
    !existingCategoryForDraft &&
    !selectedCategorySlugs.has(categoryDraftSlug);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const [loadedProducts, loadedCategories] = await Promise.all([
        productRepository.listAll(),
        productRepository.listCategories(),
      ]);
      setProducts(loadedProducts);
      setAllCategories(loadedCategories);
      return loadedProducts;
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Não foi possível carregar os produtos.",
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProducts();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const startNewProduct = () => {
    setSelectedId(null);
    setForm(emptyForm);
    setCategoryDraft("");
    setFiles([]);
    setMessage(null);
    setError(null);
  };

  const updateForm = (
    field: keyof ProductFormState,
    value: string | boolean,
  ) => {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (
        field === "name" &&
        isCreating &&
        (!current.id.trim() || current.id === slugify(current.name))
      ) {
        next.id = slugify(String(value));
      }

      return next;
    });
  };

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files ?? []));
  };

  const addCategory = (name: string) => {
    const category = createProductCategory(name);

    if (!category || selectedCategorySlugs.has(category.slug)) {
      setCategoryDraft("");
      return;
    }

    const existingCategory =
      allCategories.find((item) => item.slug === category.slug) ?? category;

    setForm((current) => ({
      ...current,
      categoryNames: dedupeCategoryNames([
        ...current.categoryNames,
        existingCategory.name,
      ]),
    }));
    setCategoryDraft("");
  };

  const removeCategory = (slug: string) => {
    setForm((current) => ({
      ...current,
      categoryNames: current.categoryNames.filter(
        (categoryName) => categorySlug(categoryName) !== slug,
      ),
    }));
  };

  const handleCategoryKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const categoryToAdd =
      categorySuggestions[0]?.name ??
      existingCategoryForDraft?.name ??
      categoryDraftValue;

    addCategory(categoryToAdd);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const weight = parseNumberInput(form.weight);
      const price = parseNumberInput(form.price);

      if (!form.name.trim()) {
        throw new Error("Informe o nome do produto.");
      }

      if (isCreating && !form.id.trim()) {
        throw new Error("Informe o identificador do produto.");
      }

      if (Number.isNaN(weight) || Number.isNaN(price)) {
        throw new Error("Peso e preço precisam ser números válidos.");
      }

      const categoryNames = dedupeCategoryNames([
        ...form.categoryNames,
        existingCategoryForDraft?.name ?? categoryDraftValue,
      ]);

      const savedProduct = selectedProduct
        ? await productRepository.update(selectedProduct.id, {
            name: form.name,
            description: form.description,
            weight,
            priceInCents: reaisToCents(price),
            isActive: form.isActive,
            sortOrder: selectedProduct.sortOrder,
          })
        : await productRepository.create({
            id: slugify(form.id),
            name: form.name,
            description: form.description,
            weight,
            priceInCents: reaisToCents(price),
            isActive: form.isActive,
          });

      const savedCategories = await productRepository.replaceProductCategories(
        savedProduct.id,
        categoryNames,
      );

      if (files.length > 0) {
        const initialSortOrder =
          savedProduct.imageRecords?.length ?? savedProduct.images.length;

        for (const [index, file] of files.entries()) {
          const uploaded = await mediaStorage.uploadProductImage(
            savedProduct.id,
            file,
          );

          await productRepository.addImage(savedProduct.id, {
            storagePath: uploaded.storagePath,
            altText: savedProduct.name,
            sortOrder: initialSortOrder + index,
          });
        }
      }

      const reloadedProducts = await loadProducts();
      setSelectedId(savedProduct.id);
      setCategoryDraft("");
      setFiles([]);
      setMessage("Produto salvo com sucesso.");

      const reloadedProduct = reloadedProducts.find(
        (product) => product.id === savedProduct.id,
      );

      setForm(
        toFormState(
          reloadedProduct
            ? reloadedProduct
            : {
                ...savedProduct,
                categories: savedCategories,
              },
        ),
      );
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Não foi possível salvar o produto.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) {
      return;
    }

    const shouldDelete = window.confirm(
      `Excluir "${selectedProduct.name}"? Esta ação remove o cadastro do produto.`,
    );

    if (!shouldDelete) {
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const storagePaths =
        selectedProduct.imageRecords
          ?.map((image) => image.storagePath)
          .filter((storagePath): storagePath is string =>
            Boolean(storagePath),
          ) ?? [];

      await productRepository.delete(selectedProduct.id);
      const failedStorageRemovals: string[] = [];

      for (const storagePath of storagePaths) {
        try {
          await mediaStorage.remove(storagePath);
        } catch {
          failedStorageRemovals.push(storagePath);
        }
      }

      await loadProducts();
      startNewProduct();

      if (failedStorageRemovals.length > 0) {
        setMessage(
          "Produto excluído, mas algumas imagens podem precisar de limpeza manual no storage.",
        );
      } else {
        setMessage("Produto excluído.");
      }
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Não foi possível excluir o produto.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeImage = async (image: ProductImage) => {
    if (!selectedProduct || !image.storagePath) {
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await productRepository.removeImage(image.id);
      await mediaStorage.remove(image.storagePath);
      await loadProducts();
      setMessage("Imagem removida.");
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Não foi possível remover a imagem.",
      );
    } finally {
      setSaving(false);
    }
  };

  const moveImage = async (imageIndex: number, direction: -1 | 1) => {
    if (!selectedProduct?.imageRecords) {
      return;
    }

    const nextIndex = imageIndex + direction;
    const nextImages = [...selectedProduct.imageRecords];

    if (nextIndex < 0 || nextIndex >= nextImages.length) {
      return;
    }

    const currentImage = nextImages[imageIndex];
    const targetImage = nextImages[nextIndex];

    if (!currentImage || !targetImage) {
      return;
    }

    nextImages[imageIndex] = targetImage;
    nextImages[nextIndex] = currentImage;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await productRepository.updateImageOrder(
        selectedProduct.id,
        nextImages.map((image) => image.id),
      );
      await loadProducts();
      setMessage("Ordem das imagens atualizada.");
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Não foi possível reorganizar as imagens.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
  };

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 pb-8 pt-6 sm:px-7">
      <section className="grid gap-5" aria-labelledby="admin-title">
        <div className="flex flex-col gap-4 rounded-[1.75rem] border bg-card/64 p-4 shadow-xl shadow-primary/8 backdrop-blur sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-1.5">
            <p className="text-sm font-extrabold text-primary">Administração</p>
            <h1
              id="admin-title"
              className="font-display text-3xl font-semibold tracking-normal sm:text-4xl"
            >
              Produtos da Yumi Studio
            </h1>
            <p className="text-sm text-muted-foreground">
              Fonte ativa:{" "}
              {runtimeBackend === "supabase" ? "Supabase" : "fallback estático"}
              .
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full"
              onClick={startNewProduct}
            >
              <Plus aria-hidden="true" />
              Novo produto
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={handleLogout}
            >
              <LogOut aria-hidden="true" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
          <aside className="grid h-fit gap-3 rounded-[1.5rem] border bg-card/58 p-4 shadow-lg shadow-primary/5 backdrop-blur">
            <label className="grid gap-2 text-sm font-extrabold">
              Buscar produto
              <input
                data-testid="admin-products-search-input"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Nome do produto..."
                className="h-10 rounded-full border bg-background/70 px-4 font-semibold outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </label>

            <div className="grid max-h-[62vh] gap-2 overflow-auto pr-1">
              {loading ? (
                <p className="rounded-2xl bg-muted/70 px-4 py-3 text-sm font-semibold text-muted-foreground">
                  Carregando produtos...
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="grid rounded-2xl border bg-background/45 px-3 py-2 text-left transition hover:border-primary/50 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[active=true]:border-primary data-[active=true]:bg-accent"
                    data-active={product.id === selectedId}
                    onClick={() => {
                      setSelectedId(product.id);
                      setForm(toFormState(product));
                      setCategoryDraft("");
                      setFiles([]);
                      setMessage(null);
                      setError(null);
                    }}
                  >
                    <span className="font-extrabold">{product.name}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      {product.isActive ? (
                        <Eye className="size-3.5" aria-hidden="true" />
                      ) : (
                        <EyeOff className="size-3.5" aria-hidden="true" />
                      )}
                      {product.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </button>
                ))
              )}
            </div>
          </aside>

          <form
            className="grid gap-5 rounded-[1.5rem] border bg-card/62 p-4 shadow-xl shadow-primary/8 backdrop-blur sm:p-6"
            onSubmit={handleSave}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-extrabold">
                Identificador
                <input
                  data-testid="admin-product-id-input"
                  value={form.id}
                  onChange={(event) =>
                    updateForm("id", slugify(event.target.value))
                  }
                  disabled={!isCreating}
                  required={isCreating}
                  className="h-10 rounded-full border bg-background/70 px-4 font-semibold outline-none transition disabled:opacity-60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </label>

              <label className="grid gap-2 text-sm font-extrabold">
                Nome
                <input
                  data-testid="admin-product-name-input"
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  required
                  className="h-10 rounded-full border bg-background/70 px-4 font-semibold outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-extrabold">
              Descrição
              <textarea
                data-testid="admin-product-description-input"
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                rows={4}
                className="resize-y rounded-2xl border bg-background/70 px-4 py-3 font-semibold outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-extrabold">
                Peso (g)
                <input
                  data-testid="admin-product-weight-input"
                  inputMode="decimal"
                  value={form.weight}
                  onChange={(event) => updateForm("weight", event.target.value)}
                  className="h-10 rounded-full border bg-background/70 px-4 font-semibold outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </label>

              <label className="grid gap-2 text-sm font-extrabold">
                Preço (R$)
                <input
                  data-testid="admin-product-price-input"
                  inputMode="decimal"
                  value={form.price}
                  onChange={(event) => updateForm("price", event.target.value)}
                  className="h-10 rounded-full border bg-background/70 px-4 font-semibold outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </label>

              <label className="flex items-center gap-3 rounded-2xl border bg-background/55 px-4 py-3 text-sm font-extrabold">
                <input
                  data-testid="admin-product-active-input"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateForm("isActive", event.target.checked)
                  }
                  className="size-4 accent-primary"
                />
                Visível no catálogo
              </label>
            </div>

            <section className="grid gap-3 rounded-2xl border bg-background/45 p-4">
              <div className="flex items-center gap-2">
                <Tag className="size-4 text-primary" aria-hidden="true" />
                <h2 className="font-display text-2xl font-semibold">
                  Categorias
                </h2>
              </div>

              {form.categoryNames.length > 0 && (
                <div
                  className="flex flex-wrap gap-2"
                  aria-label="Categorias selecionadas"
                >
                  {form.categoryNames.map((categoryName) => {
                    const slug = categorySlug(categoryName);

                    return (
                      <span
                        key={slug}
                        className="inline-flex min-h-8 items-center gap-1 rounded-full border bg-card px-3 py-1 text-sm font-extrabold"
                      >
                        {categoryName}
                        <button
                          type="button"
                          className="grid size-5 place-items-center rounded-full text-muted-foreground transition hover:bg-destructive/12 hover:text-destructive focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          onClick={() => removeCategory(slug)}
                          aria-label={`Remover categoria ${categoryName}`}
                        >
                          <X className="size-3.5" aria-hidden="true" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <label className="grid gap-2 text-sm font-extrabold">
                Adicionar categoria
                <input
                  data-testid="admin-product-category-input"
                  value={categoryDraft}
                  onChange={(event) => setCategoryDraft(event.target.value)}
                  onKeyDown={handleCategoryKeyDown}
                  placeholder="Digite e pressione Enter..."
                  className="h-10 rounded-full border bg-background/70 px-4 font-semibold outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </label>

              {(categorySuggestions.length > 0 || canCreateCategory) && (
                <div className="flex flex-wrap gap-2">
                  {categorySuggestions.map((category) => (
                    <Button
                      key={category.id}
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="rounded-full"
                      onClick={() => addCategory(category.name)}
                    >
                      <Tag aria-hidden="true" />
                      {category.name}
                    </Button>
                  ))}
                  {canCreateCategory && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => addCategory(categoryDraftValue)}
                    >
                      <Plus aria-hidden="true" />
                      Criar "{categoryDraftValue}"
                    </Button>
                  )}
                </div>
              )}
            </section>

            <section className="grid gap-3 rounded-2xl border bg-background/45 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Imagens
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    JPEG, PNG ou WebP, até 5 MB por arquivo.
                  </p>
                </div>
                <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-secondary px-4 text-sm font-extrabold text-secondary-foreground shadow-sm transition hover:bg-secondary/80">
                  <Upload className="size-4" aria-hidden="true" />
                  Adicionar imagens
                  <input
                    data-testid="admin-product-images-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    onChange={handleFilesChange}
                  />
                </label>
              </div>

              {files.length > 0 && (
                <p className="text-sm font-semibold text-muted-foreground">
                  {files.length} imagem(ns) selecionada(s). Elas serão enviadas
                  ao salvar.
                </p>
              )}

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {(selectedProduct?.imageRecords ?? []).map(
                  (image, index, list) => (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-2xl border bg-card shadow-sm"
                    >
                      <img
                        src={image.url}
                        alt={
                          image.altText ?? selectedProduct?.name ?? "Produto"
                        }
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <div className="flex items-center justify-between gap-2 p-2">
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full"
                            disabled={index === 0 || saving}
                            onClick={() => void moveImage(index, -1)}
                            aria-label="Mover imagem para cima"
                          >
                            <ArrowUp aria-hidden="true" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full"
                            disabled={index === list.length - 1 || saving}
                            onClick={() => void moveImage(index, 1)}
                            aria-label="Mover imagem para baixo"
                          >
                            <ArrowDown aria-hidden="true" />
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full text-destructive"
                          disabled={!image.storagePath || saving}
                          onClick={() => void removeImage(image)}
                          aria-label="Remover imagem"
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>

            {message && (
              <p className="rounded-2xl border bg-accent/55 px-4 py-3 text-sm font-semibold text-foreground">
                {message}
              </p>
            )}

            {error && (
              <p className="rounded-2xl border bg-card/70 px-4 py-3 text-sm font-semibold text-destructive shadow-sm">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button
                type="button"
                data-testid="admin-product-delete-button"
                variant="outline"
                className="rounded-full text-destructive"
                disabled={!selectedProduct || saving}
                onClick={() => void handleDelete()}
              >
                <Trash2 aria-hidden="true" />
                Excluir produto
              </Button>
              <Button type="submit" className="rounded-full" disabled={saving}>
                <Save aria-hidden="true" />
                {saving ? "Salvando..." : "Salvar produto"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
