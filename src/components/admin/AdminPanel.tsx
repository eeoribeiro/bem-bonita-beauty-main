import {
  BarChart3,
  ExternalLink,
  FileImage,
  Images,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Moon,
  Pencil,
  Plus,
  Save,
  Scissors,
  Settings,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { AdminModal } from "./AdminModal";
import { ImageField } from "./ImageField";
import { Botao } from "@/components/site/Botao";
import { removerImagem, uploadImagem } from "@/lib/admin-data";
import {
  initialContentMarker,
  initialPortfolio,
  initialPortfolioCategories,
  initialServices,
} from "@/lib/initial-content";
import { getSupabaseClient } from "@/lib/supabase";
import type {
  CategoryData,
  PortfolioData,
  ServiceData,
  SiteImageData,
  SiteSettingsData,
} from "@/lib/site-data";

type Tab = "overview" | "photos" | "services" | "portfolio" | "settings";
type Modal = "services" | "portfolio" | null;

const tabs: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "photos", label: "Fotos do site", icon: FileImage },
  { id: "services", label: "Serviços", icon: Scissors },
  { id: "portfolio", label: "Galeria", icon: Images },
  { id: "settings", label: "Informações do site", icon: Settings },
];

const emptyService = (): Omit<ServiceData, "id"> => ({
  name: "",
  description: "",
  benefits: [],
  image_url: null,
  storage_path: null,
  cta_label: "Conversar sobre este serviço",
  sort_order: 1,
  published: true,
});

function firstAvailableOrder(items: Array<{ sort_order: number }>) {
  const usedOrders = new Set(items.map((item) => item.sort_order));
  let order = 1;
  while (usedOrders.has(order)) order += 1;
  return order;
}

const emptyPortfolio = (): Omit<PortfolioData, "id"> => ({
  title: "",
  description: null,
  category: "geral",
  category_id: null,
  image_url: "",
  storage_path: null,
  alt_text: "",
  sort_order: 1,
  published: true,
});

export function AdminPanel({
  email,
  onLogout,
}: {
  email: string;
  onLogout: () => Promise<unknown>;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [modal, setModal] = useState<Modal>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [images, setImages] = useState<SiteImageData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioData[]>([]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    const supabase = getSupabaseClient();
    const [config, photos, serviceRows, categoryRows, portfolioRows] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).single(),
      supabase.from("site_images").select("*").order("image_key"),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("portfolio_categories").select("*").order("sort_order"),
      supabase.from("portfolio_items").select("*").order("sort_order"),
    ]);
    const firstError = [config, photos, serviceRows, categoryRows, portfolioRows].find(
      (result) => result.error,
    )?.error;
    if (firstError)
      setError(
        "Não foi possível carregar o painel. Execute a versão mais recente do arquivo SQL no Supabase.",
      );
    else {
      try {
        let loadedServices = (serviceRows.data ?? []) as ServiceData[];
        let loadedCategories = (categoryRows.data ?? []) as CategoryData[];
        let loadedPortfolio = (portfolioRows.data ?? []) as PortfolioData[];

        // Corrige conteúdos antigos com ordem zero, repetida ou com lacunas.
        // Primeiro usa posições temporárias para não colidir com índices únicos.
        async function normalizeOrders<T extends { id: string; sort_order: number }>(
          table: "services" | "portfolio_items",
          rows: T[],
        ) {
          const ordered = [...rows].sort((a, b) => a.sort_order - b.sort_order);
          const needsNormalization = ordered.some((item, index) => item.sort_order !== index + 1);
          if (!needsNormalization) return ordered;

          const temporaryStart =
            ordered.reduce((highest, item) => Math.max(highest, item.sort_order), 0) + 1000;
          for (const [index, item] of ordered.entries()) {
            const { data, error: orderError } = await supabase
              .from(table)
              .update({ sort_order: temporaryStart + index })
              .eq("id", item.id)
              .select("id")
              .single();
            if (orderError || !data) throw orderError ?? new Error("Ordem não confirmada.");
          }
          for (const [index, item] of ordered.entries()) {
            const { data, error: orderError } = await supabase
              .from(table)
              .update({ sort_order: index + 1 })
              .eq("id", item.id)
              .select("id")
              .single();
            if (orderError || !data) throw orderError ?? new Error("Ordem não confirmada.");
          }
          return ordered.map((item, index) => ({ ...item, sort_order: index + 1 }));
        }

        loadedServices = await normalizeOrders("services", loadedServices);
        loadedPortfolio = await normalizeOrders("portfolio_items", loadedPortfolio);

        // Migra uma única vez as fotos que já eram exibidas pelo site antes do painel existir.
        const contentAlreadyMigrated = loadedCategories.some(
          (category) => category.slug === initialContentMarker,
        );
        if (!contentAlreadyMigrated && !loadedServices.length) {
          const inserted = await supabase.from("services").insert(initialServices).select("*");
          if (inserted.error) throw inserted.error;
          loadedServices = (inserted.data ?? []) as ServiceData[];
        }

        if (!contentAlreadyMigrated) {
          const insertedCategories = await supabase
            .from("portfolio_categories")
            .upsert(initialPortfolioCategories, { onConflict: "slug" })
            .select("*");
          if (insertedCategories.error) throw insertedCategories.error;
          loadedCategories = (insertedCategories.data ?? []) as CategoryData[];
        }
        if (!contentAlreadyMigrated && !loadedPortfolio.length) {
          const categoryIds = new Map(loadedCategories.map((item) => [item.slug, item.id]));
          const insertedPortfolio = await supabase
            .from("portfolio_items")
            .insert(
              initialPortfolio.map((item) => ({
                ...item,
                category_id: categoryIds.get(item.category) ?? null,
              })),
            )
            .select("*");
          if (insertedPortfolio.error) throw insertedPortfolio.error;
          loadedPortfolio = (insertedPortfolio.data ?? []) as PortfolioData[];
        }

        setSettings(config.data as SiteSettingsData);
        setImages((photos.data ?? []) as SiteImageData[]);
        setServices(loadedServices);
        setCategories(
          loadedCategories.filter((category) => category.slug !== initialContentMarker),
        );
        setPortfolio(loadedPortfolio);
      } catch (migrationError) {
        setError(
          migrationError instanceof Error
            ? `Não foi possível importar as fotos atuais: ${migrationError.message}`
            : "Não foi possível importar as fotos atuais para o painel.",
        );
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("bem-bonita-admin-theme");
    setLightTheme(savedTheme === "light");
  }, []);

  function toggleTheme() {
    setLightTheme((current) => {
      const next = !current;
      window.localStorage.setItem("bem-bonita-admin-theme", next ? "light" : "dark");
      return next;
    });
  }

  function showSuccess(message: string) {
    setError("");
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  function showError(message: string) {
    setNotice("");
    setError(message);
  }

  function navigate(next: Tab) {
    setTab(next);
    setMenuOpen(false);
  }

  return (
    <div
      className={`${lightTheme ? "admin-light-theme" : ""} min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[17rem_1fr]`}
    >
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[17rem] border-r border-border bg-card p-5 transition-transform lg:sticky lg:top-0 lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-magenta">
              <Scissors className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl">Bem Bonita</p>
              <p className="text-xs text-muted-foreground">Administração</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="p-2 lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-9 space-y-1" aria-label="Menu administrativo">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => navigate(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${tab === id ? "bg-secondary text-magenta" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <Icon className="h-4.5 w-4.5" /> {label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 border-t border-border pt-5">
          <p className="truncate text-xs text-muted-foreground">{email}</p>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-magenta"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      {menuOpen ? (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      ) : null}

      <main className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-5 py-4 backdrop-blur lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-magenta"
              aria-label={lightTheme ? "Ativar modo escuro" : "Ativar modo claro"}
              title={lightTheme ? "Modo escuro" : "Modo claro"}
            >
              {lightTheme ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-magenta hover:underline"
            >
              Ver site <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8 lg:py-10">
          {notice ? (
            <div
              role="status"
              className="mb-6 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-200"
            >
              {notice}
            </div>
          ) : null}
          {error ? (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
            >
              {error}
            </div>
          ) : null}
          {loading ? (
            <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Carregando painel...
            </div>
          ) : (
            <>
              {tab === "overview" ? (
                <Overview
                  services={services.length}
                  portfolio={portfolio.length}
                  onNavigate={navigate}
                />
              ) : null}
              {tab === "photos" ? (
                <PhotosTab
                  images={images}
                  onReload={loadAll}
                  onSuccess={showSuccess}
                  onError={showError}
                />
              ) : null}
              {tab === "services" ? (
                <ManagerCard
                  title="Serviços"
                  description={`${services.length} serviço(s) cadastrado(s).`}
                  button="Gerenciar serviços"
                  icon={Scissors}
                  onClick={() => setModal("services")}
                />
              ) : null}
              {tab === "portfolio" ? (
                <ManagerCard
                  title="Galeria"
                  description={`${portfolio.length} foto(s) cadastrada(s) em ${categories.length} categoria(s).`}
                  button="Gerenciar galeria"
                  icon={Images}
                  onClick={() => setModal("portfolio")}
                />
              ) : null}
              {tab === "settings" && settings ? (
                <SettingsTab
                  settings={settings}
                  onChange={setSettings}
                  onSuccess={showSuccess}
                  onError={showError}
                />
              ) : null}
            </>
          )}
        </div>
      </main>

      {modal === "services" ? (
        <AdminModal title="Gerenciar serviços" onClose={() => setModal(null)}>
          <ServicesManager
            services={services}
            onReload={loadAll}
            onSuccess={showSuccess}
            onError={showError}
          />
        </AdminModal>
      ) : null}
      {modal === "portfolio" ? (
        <AdminModal title="Gerenciar galeria" onClose={() => setModal(null)}>
          <PortfolioManager
            items={portfolio}
            categories={categories}
            onReload={loadAll}
            onSuccess={showSuccess}
            onError={showError}
          />
        </AdminModal>
      ) : null}
    </div>
  );
}

function Overview({
  services,
  portfolio,
  onNavigate,
}: {
  services: number;
  portfolio: number;
  onNavigate: (tab: Tab) => void;
}) {
  const cards = [
    { label: "Serviços", value: services, tab: "services" as Tab, icon: Scissors },
    { label: "Fotos da galeria", value: portfolio, tab: "portfolio" as Tab, icon: Images },
  ];
  return (
    <section>
      <p className="eyebrow">Painel</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Visão geral</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Gerencie o conteúdo exibido no site público.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map(({ label, value, tab, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onNavigate(tab)}
            className="rounded-2xl border border-border bg-card p-6 text-left shadow-card transition hover:-translate-y-0.5 hover:border-primary"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-magenta">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 font-display text-4xl">{value}</p>
            <span className="mt-4 block text-sm text-magenta">Gerenciar →</span>
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onNavigate("photos")}
          className="rounded-2xl border border-border bg-card p-5 text-left hover:border-primary"
        >
          <FileImage className="h-5 w-5 text-magenta" />
          <h2 className="mt-3 text-xl">Trocar fotos principais</h2>
          <p className="mt-2 text-sm text-muted-foreground">Hero, seção sobre e produtos.</p>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("settings")}
          className="rounded-2xl border border-border bg-card p-5 text-left hover:border-primary"
        >
          <Settings className="h-5 w-5 text-magenta" />
          <h2 className="mt-3 text-xl">Editar informações</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Textos, contato, endereço e horários.
          </p>
        </button>
      </div>
    </section>
  );
}

function ManagerCard({
  title,
  description,
  button,
  icon: Icon,
  onClick,
}: {
  title: string;
  description: string;
  button: string;
  icon: typeof Scissors;
  onClick: () => void;
}) {
  return (
    <section>
      <p className="eyebrow">Conteúdo</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{title}</h1>
      <div className="mt-8 max-w-2xl rounded-3xl border border-border bg-card p-7 shadow-card">
        <Icon className="h-8 w-8 text-magenta" />
        <p className="mt-5 text-muted-foreground">{description}</p>
        <Botao type="button" onClick={onClick} className="mt-6">
          {button}
        </Botao>
      </div>
    </section>
  );
}

function PhotosTab({
  images,
  onReload,
  onSuccess,
  onError,
}: {
  images: SiteImageData[];
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [uploading, setUploading] = useState<string | null>(null);
  const slots = [
    {
      key: "hero",
      title: "Foto principal",
      description: "Imagem de maior destaque, exibida logo no início do site.",
      fallback: "/media/francielly-profissional.jpg",
    },
    {
      key: "about",
      title: "Foto da seção Sobre",
      description: "Apresenta a profissional e reforça a identidade do salão.",
      fallback: "/media/francielly-produtos.jpg",
    },
    {
      key: "products",
      title: "Foto de produtos",
      description: "Imagem usada na área de cuidados e produtos para cachos.",
      fallback: "/media/francielly-produtos.jpg",
    },
  ] as const;
  async function save(key: (typeof slots)[number]["key"], file: File) {
    setUploading(key);
    try {
      const previous = images.find((image) => image.image_key === key);
      const uploaded = await uploadImagem(file, `site/${key}`);
      const { error } = await getSupabaseClient()
        .from("site_images")
        .upsert(
          {
            image_key: key,
            image_url: uploaded.url,
            storage_path: uploaded.path,
            alt_text: previous?.alt_text ?? `Imagem ${key} do salão Bem Bonita`,
          },
          { onConflict: "image_key" },
        );
      if (error) throw error;
      await removerImagem(previous?.storage_path);
      await onReload();
      onSuccess("Imagem atualizada no site.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(null);
    }
  }
  return (
    <section>
      <p className="eyebrow">Mídia</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Fotos do site</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        A prévia aparece antes do envio. Ao concluir, a imagem é atualizada automaticamente no site.
      </p>
      <div className="mt-8 grid max-w-6xl gap-6 md:grid-cols-2">
        {slots.map((slot, index) => {
          const item = images.find((image) => image.image_key === slot.key);
          return (
            <div
              key={slot.key}
              className={`group rounded-[2rem] border border-border bg-card p-5 shadow-card transition hover:border-primary/50 sm:p-6 ${index === 0 ? "md:col-span-2" : ""}`}
            >
              <div className="mb-5 flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary font-display text-lg text-magenta">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-xl">{slot.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {slot.description}
                  </p>
                </div>
              </div>
              <ImageField
                label="Clique na imagem para substituir"
                currentUrl={item?.image_url ?? slot.fallback}
                uploading={uploading === slot.key}
                onSelect={(file) => void save(slot.key, file)}
                wide={index === 0}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SettingsTab({
  settings,
  onChange,
  onSuccess,
  onError,
}: {
  settings: SiteSettingsData;
  onChange: (settings: SiteSettingsData) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const fields: Array<{
    key: keyof SiteSettingsData;
    label: string;
    multiline?: boolean;
    help?: string;
  }> = [
    { key: "headline", label: "Título principal" },
    { key: "hero_description", label: "Descrição principal", multiline: true },
    { key: "about_text", label: "Texto da seção Sobre", multiline: true },
    { key: "whatsapp", label: "WhatsApp", help: "Somente números, incluindo DDD." },
    { key: "instagram", label: "Instagram", help: "Usuário do Instagram com ou sem @." },
    { key: "address", label: "Endereço", multiline: true },
    { key: "landmark", label: "Ponto de referência", multiline: true },
    { key: "business_hours_text", label: "Horário de atendimento", multiline: true },
  ];
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    const { error } = await getSupabaseClient().from("site_settings").update(settings).eq("id", 1);
    if (error) onError("Não foi possível salvar as informações.");
    else onSuccess("Informações atualizadas com sucesso.");
    setSaving(false);
  }
  return (
    <section>
      <p className="eyebrow">Configurações</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Informações do site</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Edite somente as informações essenciais que clientes consultam no site.
      </p>
      <form
        onSubmit={submit}
        className="mt-8 grid max-w-4xl gap-5 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 sm:p-8"
      >
        {fields.map((field) => (
          <label key={field.key} className={field.multiline ? "sm:col-span-2" : ""}>
            <span className="text-sm font-medium">{field.label}</span>
            {field.multiline ? (
              <textarea
                rows={3}
                value={String(settings[field.key] ?? "")}
                onChange={(event) => onChange({ ...settings, [field.key]: event.target.value })}
                className="admin-input resize-y"
              />
            ) : (
              <input
                value={String(settings[field.key] ?? "")}
                onChange={(event) => onChange({ ...settings, [field.key]: event.target.value })}
                className="admin-input"
              />
            )}
            {field.help ? (
              <span className="mt-2 block text-xs text-muted-foreground">{field.help}</span>
            ) : null}
          </label>
        ))}
        <div className="sm:col-span-2">
          <Botao type="submit" disabled={saving}>
            {saving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Salvando..." : "Salvar alterações"}
          </Botao>
        </div>
      </form>
    </section>
  );
}

function ServicesManager({
  services,
  onReload,
  onSuccess,
  onError,
}: {
  services: ServiceData[];
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyService());
  const [benefits, setBenefits] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  function edit(item?: ServiceData) {
    setEditingId(item?.id ?? null);
    setForm(
      item
        ? {
            name: item.name,
            description: item.description,
            benefits: item.benefits ?? [],
            image_url: item.image_url,
            storage_path: item.storage_path,
            cta_label: item.cta_label,
            sort_order: item.sort_order,
            published: item.published,
          }
        : { ...emptyService(), sort_order: firstAvailableOrder(services) },
    );
    setBenefits(item?.benefits?.join("\n") ?? "");
  }
  async function selectImage(file: File) {
    setUploading(true);
    try {
      const uploaded = await uploadImagem(file, "services");
      setForm((current) => ({ ...current, image_url: uploaded.url, storage_path: uploaded.path }));
    } catch (error) {
      onError(error instanceof Error ? error.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    const order = Number(form.sort_order);
    if (!Number.isInteger(order) || order < 1) {
      onError("A ordem precisa ser um número inteiro a partir de 1.");
      return;
    }
    const serviceWithSameOrder = services.find(
      (item) => item.sort_order === order && item.id !== editingId,
    );
    if (serviceWithSameOrder) {
      onError(
        `A ordem ${order} já está sendo usada por “${serviceWithSameOrder.name}”. Escolha outra ordem.`,
      );
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      sort_order: order,
      benefits: benefits
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    const query = editingId
      ? getSupabaseClient().from("services").update(payload).eq("id", editingId)
      : getSupabaseClient().from("services").insert(payload);
    const { data: savedService, error } = await query.select("id, sort_order").single();
    if (error || !savedService) onError("Não foi possível confirmar a ordem do serviço.");
    else {
      onSuccess("Serviço salvo e site atualizado.");
      edit();
      await onReload();
    }
    setSaving(false);
  }
  async function remove(item: ServiceData) {
    if (!window.confirm(`Excluir o serviço “${item.name}”?`)) return;
    const { error } = await getSupabaseClient().from("services").delete().eq("id", item.id);
    if (error) onError("Não foi possível excluir o serviço.");
    else {
      await removerImagem(item.storage_path);
      onSuccess("Serviço excluído.");
      await onReload();
    }
  }
  return (
    <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl">Serviços cadastrados ({services.length})</h3>
          <button
            type="button"
            onClick={() => edit()}
            className="inline-flex items-center gap-2 text-sm text-magenta"
          >
            <Plus className="h-4 w-4" /> Novo
          </button>
        </div>
        <div className="mt-5 space-y-4">
          {services.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl border border-border bg-background shadow-card sm:grid sm:grid-cols-[11rem_1fr]"
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={`Imagem do serviço ${item.name}`}
                  className="aspect-[4/3] h-full min-h-44 w-full object-cover sm:aspect-auto"
                />
              ) : (
                <div className="flex aspect-[4/3] h-full min-h-44 w-full items-center justify-center bg-muted text-sm text-muted-foreground sm:aspect-auto">
                  Sem imagem
                </div>
              )}
              <div className="flex min-w-0 flex-col p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base font-medium leading-snug">{item.name}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${item.published ? "bg-emerald-500/15 text-emerald-300" : "bg-muted text-muted-foreground"}`}
                  >
                    {item.published ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Ordem {item.sort_order}</span>
                    <span className="mx-2">•</span>
                    {item.benefits?.length ?? 0} benefício(s)
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => edit(item)}
                      aria-label={`Editar ${item.name}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-magenta"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(item)}
                      aria-label={`Excluir ${item.name}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-red-950/40 text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-border bg-background p-5"
      >
        <h3 className="text-xl">{editingId ? "Editar serviço" : "Novo serviço"}</h3>
        <ImageField
          currentUrl={form.image_url}
          uploading={uploading}
          onSelect={(file) => void selectImage(file)}
        />
        <Field
          label="Nome"
          value={form.name}
          onChange={(value) => setForm({ ...form, name: value })}
          required
        />
        <Field
          label="Descrição"
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
          multiline
          required
        />
        <Field
          label="Benefícios (um por linha)"
          value={benefits}
          onChange={setBenefits}
          multiline
        />
        <Field
          label="Ordem de exibição"
          value={String(form.sort_order)}
          onChange={(value) => setForm({ ...form, sort_order: Number(value) })}
          type="number"
          min={1}
          required
        />
        <p className="-mt-2 text-xs leading-relaxed text-muted-foreground">
          Cada serviço deve ter uma ordem diferente. A ordem 1 aparece primeiro no site.
        </p>
        <Toggle
          label="Serviço ativo"
          checked={form.published}
          onChange={(published) => setForm({ ...form, published })}
        />
        <Botao type="submit" disabled={saving || uploading}>
          {saving ? "Salvando..." : "Salvar serviço"}
        </Botao>
      </form>
    </div>
  );
}

function PortfolioManager({
  items,
  categories,
  onReload,
  onSuccess,
  onError,
}: {
  items: PortfolioData[];
  categories: CategoryData[];
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPortfolio());
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  function edit(item?: PortfolioData) {
    setEditingId(item?.id ?? null);
    setForm(
      item
        ? {
            title: item.title,
            description: item.description,
            category: item.category,
            category_id: item.category_id,
            image_url: item.image_url,
            storage_path: item.storage_path,
            alt_text: item.alt_text,
            sort_order: item.sort_order,
            published: item.published,
          }
        : { ...emptyPortfolio(), sort_order: firstAvailableOrder(items) },
    );
  }
  async function selectImage(file: File) {
    setUploading(true);
    try {
      const uploaded = await uploadImagem(file, "portfolio");
      setForm((current) => ({ ...current, image_url: uploaded.url, storage_path: uploaded.path }));
    } catch (error) {
      onError(error instanceof Error ? error.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }
  async function addCategory() {
    const name = newCategory.trim();
    if (!name) return;
    const slug = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const { error } = await getSupabaseClient()
      .from("portfolio_categories")
      .insert({ name, slug, sort_order: categories.length, active: true });
    if (error) onError("Não foi possível criar a categoria.");
    else {
      setNewCategory("");
      onSuccess("Categoria criada.");
      await onReload();
    }
  }
  async function removeCategory(category: CategoryData) {
    if (!window.confirm(`Excluir a categoria “${category.name}”? As fotos ficarão sem categoria.`))
      return;
    const { error } = await getSupabaseClient()
      .from("portfolio_categories")
      .delete()
      .eq("id", category.id);
    if (error) onError("Não foi possível excluir a categoria.");
    else {
      onSuccess("Categoria excluída.");
      await onReload();
    }
  }
  async function renameCategory(category: CategoryData) {
    const name = window.prompt("Novo nome da categoria:", category.name)?.trim();
    if (!name || name === category.name) return;
    const slug = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const { error } = await getSupabaseClient()
      .from("portfolio_categories")
      .update({ name, slug })
      .eq("id", category.id);
    if (error) onError("Não foi possível renomear a categoria.");
    else {
      onSuccess("Categoria atualizada.");
      await onReload();
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.image_url) {
      onError("Escolha uma imagem para a galeria.");
      return;
    }
    const order = Number(form.sort_order);
    if (!Number.isInteger(order) || order < 1) {
      onError("A ordem precisa ser um número inteiro a partir de 1.");
      return;
    }
    const photoWithSameOrder = items.find(
      (item) => item.sort_order === order && item.id !== editingId,
    );
    if (photoWithSameOrder) {
      onError(
        `A ordem ${order} já está sendo usada por “${photoWithSameOrder.title}”. Escolha outra ordem.`,
      );
      return;
    }
    setSaving(true);
    const selected = categories.find((category) => category.id === form.category_id);
    const payload = {
      ...form,
      category: selected?.slug ?? form.category,
      sort_order: order,
    };
    const query = editingId
      ? getSupabaseClient().from("portfolio_items").update(payload).eq("id", editingId)
      : getSupabaseClient().from("portfolio_items").insert(payload);
    const { data: savedPhoto, error } = await query.select("id, sort_order").single();
    if (error || !savedPhoto) onError("Não foi possível confirmar a ordem da foto.");
    else {
      onSuccess("Galeria atualizada.");
      edit();
      await onReload();
    }
    setSaving(false);
  }
  async function remove(item: PortfolioData) {
    if (!window.confirm(`Excluir a foto “${item.title}”?`)) return;
    const { error } = await getSupabaseClient().from("portfolio_items").delete().eq("id", item.id);
    if (error) onError("Não foi possível excluir a foto.");
    else {
      await removerImagem(item.storage_path);
      onSuccess("Foto excluída.");
      await onReload();
    }
  }
  return (
    <div className="space-y-7">
      <section className="rounded-2xl border border-border bg-background p-5">
        <h3 className="text-xl">Categorias</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category.id}
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-xs text-magenta"
            >
              <button
                type="button"
                onClick={() => void renameCategory(category)}
                className="hover:underline"
              >
                {category.name}
              </button>
              <button
                type="button"
                onClick={() => void removeCategory(category)}
                aria-label={`Excluir categoria ${category.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            placeholder="Nova categoria"
            className="admin-input mt-0"
          />
          <button
            type="button"
            onClick={() => void addCategory()}
            className="rounded-xl bg-secondary px-4 text-sm text-magenta"
          >
            Adicionar
          </button>
        </div>
      </section>
      <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
        <div>
          <h3 className="text-xl">Fotos cadastradas ({items.length})</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-3xl border border-border bg-background shadow-card"
              >
                <img
                  src={item.image_url}
                  alt={item.alt_text}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="p-4 sm:p-5">
                  <p className="truncate text-base font-medium">{item.title}</p>
                  <div className="mt-2 text-xs font-medium text-muted-foreground">
                    Ordem {item.sort_order}
                  </div>
                  <div className="mt-4 flex justify-between border-t border-border pt-4">
                    <button
                      type="button"
                      onClick={() => edit(item)}
                      aria-label={`Editar ${item.title}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-magenta"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(item)}
                      aria-label={`Excluir ${item.title}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-red-950/40 text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-border bg-background p-5"
        >
          <h3 className="text-xl">{editingId ? "Editar foto" : "Nova foto"}</h3>
          <ImageField
            currentUrl={form.image_url}
            uploading={uploading}
            onSelect={(file) => void selectImage(file)}
          />
          <Field
            label="Título"
            value={form.title}
            onChange={(title) => setForm({ ...form, title })}
            required
          />
          <Field
            label="Texto alternativo"
            value={form.alt_text}
            onChange={(alt_text) => setForm({ ...form, alt_text })}
            required
          />
          <label className="block text-sm font-medium">
            Categoria
            <select
              value={form.category_id ?? ""}
              onChange={(event) => setForm({ ...form, category_id: event.target.value || null })}
              className="admin-input"
            >
              <option value="">Sem categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Ordem de exibição"
            value={String(form.sort_order)}
            onChange={(value) => setForm({ ...form, sort_order: Number(value) })}
            type="number"
            min={1}
            required
          />
          <p className="-mt-2 text-xs leading-relaxed text-muted-foreground">
            Cada foto deve ter uma ordem diferente. A ordem 1 aparece primeiro na galeria.
          </p>
          <Toggle
            label="Foto ativa"
            checked={form.published}
            onChange={(published) => setForm({ ...form, published })}
          />
          <Botao type="submit" disabled={saving || uploading}>
            {saving ? "Salvando..." : "Salvar foto"}
          </Botao>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
  type = "text",
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  required?: boolean;
  type?: string;
  min?: number;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {multiline ? (
        <textarea
          value={value}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className="admin-input resize-y"
        />
      ) : (
        <input
          type={type}
          value={value}
          required={required}
          min={min}
          onChange={(event) => onChange(event.target.value)}
          className="admin-input"
        />
      )}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 self-end rounded-xl border border-border px-3 py-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-pink-500"
      />
      {label}
    </label>
  );
}
