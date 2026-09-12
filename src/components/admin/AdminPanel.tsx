import {
  ArrowDown,
  ArrowUp,
  Camera,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileImage,
  Globe,
  GripVertical,
  Image as ImageIcon,
  Images,
  Info,
  LayoutDashboard,
  Layers,
  Lightbulb,
  LoaderCircle,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquareQuote,
  Moon,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Scissors,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Tag,
  Trash2,
  Upload,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import { AdminModal } from "./AdminModal";
import { ConfirmModal } from "./ConfirmModal";
import { ImageField } from "./ImageField";
import { Botao } from "@/components/site/Botao";
import { SafeImage } from "@/components/site/SafeImage";
import { removerImagem, uploadImagem } from "@/lib/admin-data";
import {
  initialContentMarker,
  initialPortfolio,
  initialPortfolioCategories,
  initialProfessionals,
  initialServices,
} from "@/lib/initial-content";
import { getSupabaseClient, supabaseConfigurado } from "@/lib/supabase";
import { initialProducts } from "@/lib/initial-products";
import fotoFranciellyFallback from "@/assets/sobre-francielly.jpg";
import fotoEspacoFallback from "@/assets/instagram-salao.jpg";
import fotoHeroFallback from "@/assets/hero-cachos.jpg";
import fotoProdutosFallback from "@/assets/instagram-produtos.jpg";
import fotoCachosFallback from "@/assets/instagram-cachos.jpg";
import fotoMechasFallback from "@/assets/resultado-mechas.jpg";
import fotoDefinicaoFallback from "@/assets/servico-definicao.jpg";
import type {
  CategoryData,
  PortfolioData,
  ProfessionalData,
  ProductOrderData,
  ProductData,
  ServiceData,
  SiteImageData,
  SiteSettingsData,
  SpacePhotoData,
  TestimonialData,
} from "@/lib/site-data";

type Tab = "overview" | "photos" | "space" | "services" | "products" | "orders" | "team" | "portfolio" | "feedbacks" | "francielly" | "settings";
type Modal = "services" | "portfolio" | "team_editor" | "new_photo" | null;

const tabs: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "orders", label: "Pedidos", icon: ShoppingBag },
  { id: "photos", label: "Fotos gerais do site", icon: FileImage },
  { id: "space", label: "Nosso Espaço", icon: MapPin },
  { id: "services", label: "Serviços", icon: Scissors },
  { id: "products", label: "Produtos", icon: ShoppingBag },
  { id: "portfolio", label: "Galeria", icon: Images },
  { id: "feedbacks", label: "Feedbacks", icon: MessageSquareQuote },
  { id: "francielly", label: "Página da Francielly", icon: UserCheck },
  { id: "settings", label: "Informações do Site", icon: Settings },
];

const defaultDemoSettings: SiteSettingsData = {
  salon_name: "Bem Bonita",
  professional_name: "Francielly Soares",
  logo_url: null,
  whatsapp: "5531996792131",
  instagram: "@salaobembonita_cielly",
  address: "Av. Francisco Vieira Martins, 595 — Lanna Shopping, sala 118, primeiro andar — Ponte Nova/MG",
  headline: "Seus cachos são a nossa arte",
  description: "Salão especialista em cabelos crespos e cacheados em Ponte Nova/MG.",
  hero_eyebrow: "Especialista em cachos em Ponte Nova",
  hero_description: "Cortes, tratamentos, definição, mechas e penteados para valorizar a identidade dos seus cabelos.",
  services_title: "Técnica dedicada a cada tipo de cacho",
  services_description: "Atendimentos pensados para cabelos crespos e cacheados, com avaliação individual antes de cada procedimento.",
  services_card_style: "photo",
  portfolio_title: "Técnica que respeita cada textura",
  portfolio_description: "Trabalhos realizados no Bem Bonita, com foco em definição, movimento, mechas, cortes e penteados personalizados.",
  about_title: "Beleza que respeita a sua essência",
  about_text: "No Bem Bonita, cada cabelo é tratado de forma única. Sob os cuidados de Francielly Soares, o salão oferece técnicas, tratamentos e produtos pensados especialmente para cabelos crespos e cacheados.",
  francielly_headline: "Paixão, técnica e identidade",
  francielly_bio: "Especialista em cabelos crespos e cacheados, Francielly Soares criou o Bem Bonita com o propósito de transformar a relação das mulheres com seus fios naturais. Seu trabalho une técnica, escuta e cuidado para valorizar cada curvatura, preservar a saúde capilar e fortalecer a autoestima.",
  francielly_eyebrow: "Sobre a especialista",
  francielly_space_eyebrow: "Ambiente exclusivo",
  francielly_cta_label: "Agendar horário com Francielly",
  francielly_space_cta_label: "Agendar visita pelo WhatsApp",
  francielly_photo_label: "Cuidado autoral",
  francielly_extra_1_eyebrow: "Trajetória",
  francielly_extra_1_title: "",
  francielly_extra_1_subtitle: "",
  francielly_extra_2_eyebrow: "Atendimento",
  francielly_extra_2_title: "",
  francielly_extra_2_subtitle: "",
  francielly_extra_3_eyebrow: "Resultado",
  francielly_extra_3_title: "",
  francielly_extra_3_subtitle: "",
  space_title: "Um refúgio para você se cuidar",
  space_description: "Localizado no Lanna Shopping, em Ponte Nova, o Bem Bonita oferece um ambiente acolhedor e preparado para proporcionar uma experiência tranquila, personalizada e focada em você.",
  landmark: "Lanna Shopping — Sala 118, Ponte Nova/MG",
  business_hours_text: "Segunda a Sábado com horário agendado",
};

const emptyService = (): Omit<ServiceData, "id" | "sort_order"> => ({
  name: "",
  description: "",
  price_text: "",
  featured: false,
  benefits: [],
  image_url: null,
  storage_path: null,
  cta_label: "Conversar sobre este serviço",
  published: true,
});

const emptyProfessional = (): Omit<ProfessionalData, "id" | "sort_order"> => ({
  name: "",
  role: "",
  bio: "",
  image_url: null,
  storage_path: null,
  whatsapp: "5531996792131",
  instagram: "@salaobembonita_cielly",
  active: true,
});

const emptyPortfolio = (): Omit<PortfolioData, "id" | "sort_order"> => ({
  title: "",
  description: null,
  category: "cachos",
  category_id: null,
  service_id: null,
  service_name: null,
  hair_type: "Todos os tipos de cabelo",
  photo_label: "",
  image_zoom: 1,
  image_position_x: 50,
  image_position_y: 50,
  image_url: "",
  storage_path: null,
  alt_text: "",
  published: true,
});

const hairTypeOptions = [
  "Todos os tipos de cabelo",
  "Cabelos cacheados",
  "Cabelos crespos",
  "Cabelos ondulados",
  "Cabelos lisos",
  "Cabelos em transição",
  "Cabelos com mechas",
  "Cabelos coloridos",
] as const;

const franciellyExtraSlots = [
  {
    slot: 1,
    imageKey: "francielly_extra_1",
    eyebrowKey: "francielly_extra_1_eyebrow",
    titleKey: "francielly_extra_1_title",
    subtitleKey: "francielly_extra_1_subtitle",
  },
  {
    slot: 2,
    imageKey: "francielly_extra_2",
    eyebrowKey: "francielly_extra_2_eyebrow",
    titleKey: "francielly_extra_2_title",
    subtitleKey: "francielly_extra_2_subtitle",
  },
  {
    slot: 3,
    imageKey: "francielly_extra_3",
    eyebrowKey: "francielly_extra_3_eyebrow",
    titleKey: "francielly_extra_3_title",
    subtitleKey: "francielly_extra_3_subtitle",
  },
] as const;

export function AdminPanel({
  email,
  onLogout,
  isDemo = false,
}: {
  email: string;
  onLogout: () => Promise<unknown>;
  isDemo?: boolean;
}) {
  const [tab, setTab] = useState<Tab>(getInitialAdminTab);
  const [modal, setModal] = useState<Modal>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [images, setImages] = useState<SiteImageData[]>([]);
  const [spacePhotos, setSpacePhotos] = useState<SpacePhotoData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [orders, setOrders] = useState<ProductOrderData[]>([]);
  const [ordersError, setOrdersError] = useState("");
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioData[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);

  // Profissional em edição no modal
  const [editingProf, setEditingProf] = useState<ProfessionalData | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!supabaseConfigurado || isDemo) {
      setSettings(defaultDemoSettings);
      setServices(
        initialServices.map((s, idx) => ({
          ...s,
          id: `srv-${idx + 1}`,
          sort_order: idx + 1,
        }))
      );
      setProfessionals(
        (initialProfessionals as ProfessionalData[]).map((p, idx) => ({
          ...p,
          id: `prof-${idx + 1}`,
          sort_order: idx + 1,
        }))
      );
      setProducts(initialProducts);
      setOrders([]);
      setOrdersError("");
      setCategories(
        initialPortfolioCategories
          .filter((c) => c.slug !== initialContentMarker)
          .map((c, idx) => ({ ...c, id: `cat-${idx + 1}` }))
      );
      setPortfolio(
        initialPortfolio.map((p, idx) => ({
          ...p,
          id: `port-${idx + 1}`,
          sort_order: idx + 1,
          category_id: "cat-1",
        }))
      );
      setImages([
        { id: "1", image_key: "hero", image_url: "/media/francielly-profissional.jpg", alt_text: "Foto principal (Hero)", storage_path: null, created_at: "Hoje" },
        { id: "2", image_key: "about", image_url: "/media/francielly-produtos.jpg", alt_text: "Foto sobre a profissional", storage_path: null, created_at: "Hoje" },
        { id: "3", image_key: "products", image_url: "/media/francielly-produtos.jpg", alt_text: "Foto da vitrine de produtos", storage_path: null, created_at: "Hoje" },
        { id: "4", image_key: "francielly_bio", image_url: "/media/sobre-francielly.jpg", alt_text: "Foto da Francielly Soares", storage_path: null, created_at: "Hoje" },
        { id: "5", image_key: "space_1", image_url: "/media/instagram-salao.jpg", alt_text: "Ambiente do salão no Lanna Shopping", storage_path: null, created_at: "Ontem" },
        { id: "6", image_key: "space_2", image_url: "/media/instagram-produtos.jpg", alt_text: "Produtos no salão", storage_path: null, created_at: "Ontem" },
        { id: "7", image_key: "space_3", image_url: "/media/instagram-cachos.jpg", alt_text: "Atendimento no espaço", storage_path: null, created_at: "Ontem" },
      ]);
      setSpacePhotos([]);
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const [config, photos, serviceRows, categoryRows, portfolioRows, profRows, productRows, testimonialRows, spacePhotoRows] = await Promise.all([
        supabase.from("site_settings").select("*").limit(1).single(),
        supabase.from("site_images").select("*").order("image_key"),
        supabase.from("services").select("*").order("sort_order"),
        supabase.from("portfolio_categories").select("*").order("sort_order"),
        supabase.from("portfolio_items").select("*").order("sort_order"),
        supabase.from("professionals").select("*").order("sort_order"),
        supabase.from("products").select("*").order("sort_order"),
        supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
        supabase.from("space_photos").select("*").order("sort_order"),
      ]);

      const firstError = [config, photos, serviceRows, categoryRows, portfolioRows, profRows, productRows, testimonialRows].find(
        (result) => result.error,
      )?.error;

      if (firstError) {
        setError(
          "Não foi possível carregar o painel. Execute a versão mais recente do arquivo SQL no Supabase.",
        );
      } else {
        // Mantém os campos novos preenchidos mesmo antes de uma migração antiga
        // do Supabase ser atualizada. Os valores vindos do banco continuam tendo
        // prioridade e permanecem totalmente editáveis pelo painel.
        setSettings({ ...defaultDemoSettings, ...(config.data as SiteSettingsData) });
        setImages((photos.data ?? []) as SiteImageData[]);
        setServices((serviceRows.data ?? []) as ServiceData[]);
        const savedProfessionals = (profRows.data ?? []) as ProfessionalData[];
        setProfessionals(savedProfessionals.length > 0 ? savedProfessionals : initialProfessionals.map((professional, index) => ({
          ...professional,
          id: `pending-prof-${index + 1}`,
          image_url: [fotoFranciellyFallback, fotoMechasFallback, fotoDefinicaoFallback][index] ?? null,
        })));
        setProducts((productRows.data ?? []) as ProductData[]);
        const orderRows = await supabase
          .from("product_orders")
          .select("*, product_order_items(*)")
          .order("created_at", { ascending: false });
        if (orderRows.error) {
          setOrders([]);
          setOrdersError("Execute o SQL de pedidos no Supabase para liberar esta aba.");
        } else {
          setOrders((orderRows.data ?? []) as ProductOrderData[]);
          setOrdersError("");
        }
        setCategories(
          ((categoryRows.data ?? []) as CategoryData[]).filter(
            (c) => c.slug !== initialContentMarker
          )
        );
        setPortfolio((portfolioRows.data ?? []) as PortfolioData[]);
        setTestimonials((testimonialRows.data ?? []) as TestimonialData[]);
        setSpacePhotos(spacePhotoRows.error ? [] : ((spacePhotoRows.data ?? []) as SpacePhotoData[]));
      }
    } catch {
      setError("Erro ao carregar dados do painel.");
    }
    setLoading(false);
  }, [isDemo]);

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

  async function updateServicesCardStyle(style: NonNullable<SiteSettingsData["services_card_style"]>) {
    if (!settings) {
      showError("As configurações do site ainda não carregaram.");
      return;
    }

    const previous = settings;
    const updated = { ...settings, services_card_style: style };
    setSettings(updated);

    if (!supabaseConfigurado || isDemo) {
      showSuccess("Modelo dos cards de serviços atualizado no preview.");
      return;
    }

    try {
      const { error: updateError } = await getSupabaseClient()
        .from("site_settings")
        .update({ services_card_style: style })
        .eq("id", settings.id ?? 1);

      if (updateError) {
        setSettings(previous);
        showError(
          updateError.message.includes("services_card_style") || updateError.message.includes("column")
            ? "Falta atualizar o banco: execute o arquivo supabase/content-controls-update.sql no Supabase."
            : "Não foi possível salvar o modelo dos cards agora.",
        );
        return;
      }

      showSuccess(style === "photo" ? "Cards com foto ativados no site." : "Cards sem foto ativados no site.");
    } catch {
      setSettings(previous);
      showError("Erro ao salvar o modelo dos cards.");
    }
  }

  function navigate(next: Tab) {
    setTab(next);
    window.localStorage.setItem(adminTabStorageKey, next);
    setMenuOpen(false);
  }

  function handleOpenAddProf() {
    setEditingProf(null);
    setModal("team_editor");
  }

  function handleOpenEditProf(prof: ProfessionalData) {
    setEditingProf(prof);
    setModal("team_editor");
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
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${tab === id ? "bg-secondary text-magenta font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
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
              className="inline-flex items-center gap-2 text-sm text-magenta hover:underline font-medium"
            >
              Ver site <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8 lg:py-10">
          {!supabaseConfigurado || isDemo ? (
            <div className="mb-6 rounded-2xl border border-primary/40 bg-secondary/60 p-4 text-xs text-foreground/90 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-gold shrink-0" />
              <div>
                <strong>Modo de Demonstração Local Ativo:</strong> Você pode gerenciar fotos, serviços, produtos e feedbacks em tempo real.
              </div>
            </div>
          ) : null}

          {notice ? (
            <div
              role="status"
              className="mb-6 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-200 flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
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
                  professionals={professionals.length}
                  portfolio={portfolio.length}
                  categories={categories.length}
                  settings={settings}
                  onNavigate={navigate}
                  onOpenServices={() => setModal("services")}
                  onOpenPortfolio={() => setModal("portfolio")}
                  onOpenTeam={handleOpenAddProf}
                />
              ) : null}
              {tab === "photos" ? (
                <PhotosTab
                  mode="all"
                  images={images}
                  setImages={setImages}
                  isDemo={!supabaseConfigurado || isDemo}
                  onReload={loadAll}
                  onSuccess={showSuccess}
                  onError={showError}
                />
              ) : null}
              {tab === "services" ? (
                <ServicesOverviewTab
                  services={services}
                  settings={settings}
                  onOpenManager={() => setModal("services")}
                  onChangeCardStyle={(style) => void updateServicesCardStyle(style)}
                />
              ) : null}
              {tab === "team" ? (
                <TeamManagerTab
                  professionals={professionals}
                  setProfessionals={setProfessionals}
                  isDemo={!supabaseConfigurado || isDemo}
                  onReload={loadAll}
                  onSuccess={showSuccess}
                  onError={showError}
                  onOpenAdd={handleOpenAddProf}
                  onOpenEdit={handleOpenEditProf}
                />
              ) : null}
              {tab === "portfolio" ? (
                <PortfolioOverviewTab
                  items={portfolio}
                  categories={categories}
                  services={services}
                  onOpenManager={() => setModal("portfolio")}
                />
              ) : null}
              {tab === "settings" && settings ? (
                <SettingsTab
                  mode="general"
                  settings={settings}
                  images={images}
                  setImages={setImages}
                  isDemo={!supabaseConfigurado || isDemo}
                  onChange={setSettings}
                  onReload={loadAll}
                  onSuccess={showSuccess}
                  onError={showError}
                />
              ) : null}
              {tab === "products" ? (
                <ProductsManagerTab products={products} setProducts={setProducts} isDemo={!supabaseConfigurado || isDemo} onReload={loadAll} onSuccess={showSuccess} onError={showError} />
              ) : null}
              {tab === "orders" ? (
                <OrdersManagerTab orders={orders} ordersError={ordersError} isDemo={!supabaseConfigurado || isDemo} onReload={loadAll} onSuccess={showSuccess} onError={showError} />
              ) : null}
              {tab === "feedbacks" ? (
                <FeedbacksManagerTab testimonials={testimonials} setTestimonials={setTestimonials} isDemo={!supabaseConfigurado || isDemo} onReload={loadAll} onSuccess={showSuccess} onError={showError} />
              ) : null}
              {tab === "space" ? (
                <PhotosTab
                  mode="space"
                  images={images}
                  setImages={setImages}
                  spacePhotos={spacePhotos}
                  setSpacePhotos={setSpacePhotos}
                  isDemo={!supabaseConfigurado || isDemo}
                  onReload={loadAll}
                  onSuccess={showSuccess}
                  onError={showError}
                />
              ) : null}
              {tab === "francielly" && settings ? (
                <SettingsTab
                  mode="francielly"
                  settings={settings}
                  images={images}
                  setImages={setImages}
                  isDemo={!supabaseConfigurado || isDemo}
                  onChange={setSettings}
                  onReload={loadAll}
                  onSuccess={showSuccess}
                  onError={showError}
                />
              ) : null}
            </>
          )}
        </div>
      </main>

      {/* Modal de Serviços */}
      {modal === "services" ? (
        <AdminModal title="Gerenciar e Reordenar Serviços" onClose={() => setModal(null)}>
          <ServicesManager
            services={services}
            setServices={setServices}
            isDemo={!supabaseConfigurado || isDemo}
            onReload={loadAll}
            onSuccess={showSuccess}
            onError={showError}
          />
        </AdminModal>
      ) : null}

      {/* Modal da Galeria */}
      {modal === "portfolio" ? (
        <AdminModal title="Gerenciar e Reordenar Galeria" onClose={() => setModal(null)}>
                <PortfolioManager
                  items={portfolio}
                  setPortfolio={setPortfolio}
                  categories={categories}
                  setCategories={setCategories}
                  services={services}
                  isDemo={!supabaseConfigurado || isDemo}
            onReload={loadAll}
            onSuccess={showSuccess}
            onError={showError}
          />
        </AdminModal>
      ) : null}

      {/* NOVO MODAL DEDICADO: Adicionar / Editar Profissional */}
      {modal === "team_editor" ? (
        <AdminModal
          title={editingProf ? `Editar Profissional: ${editingProf.name}` : "Cadastrar Nova Profissional na Equipe"}
          onClose={() => setModal(null)}
        >
          <ProfessionalEditorModal
            initialData={editingProf}
            professionals={professionals}
            setProfessionals={setProfessionals}
            isDemo={!supabaseConfigurado || isDemo}
            onClose={() => setModal(null)}
            onReload={loadAll}
            onSuccess={(msg) => {
              showSuccess(msg);
              setModal(null);
            }}
            onError={showError}
          />
        </AdminModal>
      ) : null}
    </div>
  );
}

function Overview({
  services,
  professionals,
  portfolio,
  categories,
  settings,
  onNavigate,
  onOpenServices,
  onOpenPortfolio,
  onOpenTeam,
}: {
  services: number;
  professionals: number;
  portfolio: number;
  categories: number;
  settings: SiteSettingsData | null;
  onNavigate: (tab: Tab) => void;
  onOpenServices: () => void;
  onOpenPortfolio: () => void;
  onOpenTeam: () => void;
}) {
  return (
    <section className="space-y-8">
      {/* Banner de Boas-Vindas */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-secondary/80 via-card to-card p-6 sm:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Site Ativo &amp; Sincronizado
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-display">
              Painel de Gestão{" "}
              <span className="text-gradient-pink italic font-normal">
                {settings?.salon_name ?? "Bem Bonita"}
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl leading-relaxed">
              Gerencie as fotos, os serviços, a loja de produtos, os feedbacks e os contatos do salão.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-medium text-magenta hover:bg-secondary/80 transition"
            >
              <Globe className="h-4 w-4" /> Abrir site público
            </a>
          </div>
        </div>
      </div>

      {/* Grid de Métricas e Indicadores */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Métricas &amp; Conteúdos Ativos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            onClick={onOpenServices}
            className="group cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-magenta">
                <Scissors className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-magenta group-hover:underline">
                Reordenar →
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
              Serviços Cadastrados
            </p>
            <p className="mt-1 font-display text-3xl font-semibold">{services}</p>
            <p className="mt-2 text-xs text-muted-foreground">Todos com agendamento ativo</p>
          </div>

          <div
            onClick={() => onNavigate("photos")}
            className="group cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-magenta">
                <FileImage className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-magenta group-hover:underline">
                Gerenciar →
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
              Fotos do Espaço &amp; Site
            </p>
            <p className="mt-1 font-display text-3xl font-semibold">7+</p>
            <p className="mt-2 text-xs text-muted-foreground">Fotos do salão e Francielly</p>
          </div>

          <div
            onClick={() => onNavigate("francielly")}
            className="group cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-gold">
                <UserCheck className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-gold group-hover:underline">
                Editar Páginas →
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
              Página da Francielly
            </p>
            <p className="mt-1 font-display text-3xl font-semibold">Ativa</p>
            <p className="mt-2 text-xs text-muted-foreground">História, bio e valores</p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas em Destaque */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Ações Rápidas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={onOpenServices}
            className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary hover:bg-secondary/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-magenta">
              <Plus className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Novo Serviço</p>
              <p className="text-xs text-muted-foreground">Criar e inserir no final</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("photos")}
            className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary hover:bg-secondary/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-magenta">
              <FileImage className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Fotos do Espaço &amp; Site</p>
              <p className="text-xs text-muted-foreground">Salão, Hero e produtos</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("settings")}
            className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary hover:bg-secondary/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-gold">
              <Settings className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Logo e Contatos</p>
              <p className="text-xs text-muted-foreground">Marca, WhatsApp e endereço</p>
            </div>
          </button>
        </div>
      </div>

      {/* Resumo do Salão & Dicas de Conversão */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h3 className="text-lg font-display flex items-center gap-2">
              <Info className="h-4.5 w-4.5 text-magenta" /> Dados do Salão &amp; Profissional
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("settings")}
              className="text-xs text-magenta font-medium hover:underline"
            >
              Editar informações →
            </button>
          </div>
          <div className="mt-5 space-y-3.5 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <User className="h-4 w-4 text-magenta shrink-0" />
              <span>
                <strong className="text-foreground">Profissional Principal:</strong>{" "}
                {settings?.professional_name ?? "Francielly Soares"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="h-4 w-4 text-gold shrink-0" />
              <span>
                <strong className="text-foreground">WhatsApp:</strong> +
                {settings?.whatsapp ?? "5531996792131"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MessageCircle className="h-4 w-4 text-magenta shrink-0" />
              <span>
                <strong className="text-foreground">Instagram:</strong>{" "}
                {settings?.instagram ?? "@salaobembonita_cielly"}
              </span>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <span className="line-clamp-2">
                <strong className="text-foreground">Endereço:</strong>{" "}
                {settings?.address ?? "Lanna Shopping — Sala 118, Ponte Nova/MG"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-primary/30 bg-secondary/40 p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-display flex items-center gap-2 text-magenta">
              <Lightbulb className="h-4.5 w-4.5 text-gold" /> Dicas de Posicionamento
            </h3>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-foreground/80">
              <li className="flex gap-2">
                <span className="text-gold font-bold">•</span>
                <span>
                  Apresentar as <strong>3 profissionais da equipe</strong> aumenta a confiança das clientes e distribui a agenda de atendimentos.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold font-bold">•</span>
                <span>
                  Cada profissional tem seu link direto para agendamento no WhatsApp.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* ABA DE EQUIPE COM VISUAL EM GRID MODERNO E BOTÃO DE ABRIR MODAL */}
function TeamManagerTab({
  professionals,
  setProfessionals,
  isDemo,
  onReload,
  onSuccess,
  onError,
  onOpenAdd,
  onOpenEdit,
}: {
  professionals: ProfessionalData[];
  setProfessionals: React.Dispatch<React.SetStateAction<ProfessionalData[]>>;
  isDemo: boolean;
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onOpenAdd: () => void;
  onOpenEdit: (item: ProfessionalData) => void;
}) {
  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ProfessionalData | null>(null);
  const pendingProfessionals = professionals.filter((item) => item.id.startsWith("pending-prof-"));

  async function importProfessionals() {
    if (pendingProfessionals.length === 0) return;
    setImporting(true);
    try {
      const rows = pendingProfessionals.map(({ id: _id, ...professional }) => professional);
      const { error } = await getSupabaseClient().from("professionals").insert(rows);
      if (error) throw error;
      await onReload();
      onSuccess("As três profissionais foram salvas no Supabase e agora podem ser editadas normalmente.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível salvar a equipe no Supabase.");
    } finally {
      setImporting(false);
    }
  }

  async function applyNewOrder(reorderedList: ProfessionalData[]) {
    const withUpdatedOrder = reorderedList.map((p, idx) => ({ ...p, sort_order: idx + 1 }));
    setProfessionals(withUpdatedOrder);

    if (isDemo) {
      onSuccess("Ordem da equipe atualizada no site.");
      return;
    }
    if (pendingProfessionals.length > 0) {
      onError("Salve os profissionais no Supabase antes de alterar a ordem.");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      for (const [idx, item] of withUpdatedOrder.entries()) {
        await supabase.from("professionals").update({ sort_order: 10000 + idx }).eq("id", item.id);
      }
      for (const item of withUpdatedOrder) {
        await supabase.from("professionals").update({ sort_order: item.sort_order }).eq("id", item.id);
      }
      await onReload();
      onSuccess("Ordem da equipe atualizada no site.");
    } catch {
      onError("Não foi possível salvar a nova ordem.");
    }
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDrop(targetIndex: number) {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const itemsCopy = [...professionals];
    const movedItem = itemsCopy.splice(draggedIndex, 1)[0]!;
    itemsCopy.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    void applyNewOrder(itemsCopy);
  }

  async function moveProfessional(item: ProfessionalData, direction: "up" | "down") {
    const currentIndex = professionals.findIndex((p) => p.id === item.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= professionals.length) return;

    const itemsCopy = [...professionals];
    const movedItem = itemsCopy.splice(currentIndex, 1)[0]!;
    itemsCopy.splice(targetIndex, 0, movedItem);
    await applyNewOrder(itemsCopy);
  }

  function remove(item: ProfessionalData) {
    setPendingDelete(item);
  }

  async function confirmRemove() {
    if (!pendingDelete) return;
    const item = pendingDelete;
    setPendingDelete(null);

    if (isDemo) {
      const remaining = professionals.filter((p) => p.id !== item.id);
      setProfessionals(remaining.map((p, idx) => ({ ...p, sort_order: idx + 1 })));
      onSuccess("Profissional removida da equipe.");
      return;
    }

    try {
      const { error } = await getSupabaseClient().from("professionals").delete().eq("id", item.id);
      if (error) onError("Não foi possível excluir.");
      else {
        await removerImagem(item.storage_path);
        onSuccess("Profissional removida.");
        await onReload();
      }
    } catch {
      onError("Erro ao remover profissional.");
    }
  }

  return (
    <section className="space-y-8">
      {/* Topo da Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="eyebrow">Corpo Técnico</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-display">
            Equipe do Salão ({professionals.length} profissionais)
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Gerencie as profissionais do salão Bem Bonita (Fran e equipe). Você pode cadastrar novas integrantes, alterar fotos, especialidades e biografia com facilidade no modal.
          </p>
        </div>
        <Botao type="button" onClick={onOpenAdd} className="shadow-card shrink-0">
          <UserPlus className="h-4.5 w-4.5" /> Adicionar nova profissional
        </Botao>
      </div>

      {pendingProfessionals.length > 0 ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-gold/40 bg-gold/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Os 3 cards do site ainda não estão no Supabase</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Eles já aparecem abaixo para conferência. Salve-os uma única vez para liberar edição, exclusão e reordenação permanentes.</p>
          </div>
          <Botao type="button" disabled={importing} onClick={() => void importProfessionals()} className="shrink-0">
            {importing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {importing ? "Salvando equipe..." : "Salvar os 3 no Supabase"}
          </Botao>
        </div>
      ) : null}

      {/* Grid de Cards das Profissionais */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-magenta" /> Profissionais exibidas no site ({professionals.length})
          </h2>
          <span className="text-xs text-muted-foreground">✨ Arraste os cards para alterar a ordem de exibição</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {professionals.map((item, index) => {
            const isDragging = draggedIndex === index;
            const isOver = dragOverIndex === index;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                className={`group relative overflow-hidden rounded-3xl border bg-card p-5 shadow-card transition-all duration-300 cursor-grab active:cursor-grabbing flex flex-col justify-between ${
                  isDragging ? "opacity-40 scale-[0.98] border-dashed border-magenta" : ""
                } ${isOver ? "border-primary ring-2 ring-primary/40 -translate-y-1" : "border-border hover:border-primary/60 hover:shadow-soft"}`}
              >
                <div>
                  {/* Foto de Perfil & Badges */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-secondary/50 border border-border/80 mb-4">
                    <img
                      src={item.image_url ?? "/media/sobre-francielly.jpg"}
                      alt={`Foto de ${item.name}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur">
                      <GripVertical className="h-3.5 w-3.5" />
                      <span className="font-bold">#{index + 1}</span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 rounded-full bg-secondary/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-magenta backdrop-blur">
                      {index === 0 ? "Fundadora" : "Especialista"}
                    </div>
                  </div>

                  {/* Informações da Profissional */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold font-display group-hover:text-magenta transition">
                        {item.name}
                      </h3>
                      <p className="text-xs font-medium text-magenta uppercase tracking-wider mt-0.5">
                        {item.role}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        item.active ? "bg-emerald-500/15 text-emerald-300" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.active ? "Ativa" : "Inativa"}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {item.bio}
                  </p>

                  {item.whatsapp ? (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <MessageCircle className="h-3 w-3 text-emerald-400" />
                      <span>WhatsApp: +{item.whatsapp}</span>
                    </div>
                  ) : null}
                </div>

                {/* Barra de Ações: Reordenar, Editar no Modal e Excluir */}
                <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-3.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        void moveProfessional(item, "up");
                      }}
                      aria-label="Mover para a esquerda/cima"
                      title="Mover para cima"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-secondary/80 disabled:opacity-30"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === professionals.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        void moveProfessional(item, "down");
                      }}
                      aria-label="Mover para a direita/baixo"
                      title="Mover para baixo"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-secondary/80 disabled:opacity-30"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenEdit(item)}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-secondary px-4 py-2 text-xs font-semibold text-magenta hover:bg-secondary/80 transition"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(item)}
                      aria-label={`Excluir ${item.name}`}
                      title="Excluir profissional"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-red-950/40 text-red-300 hover:bg-red-950/70 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Card de Atalho para Adicionar Nova Profissional */}
          <button
            type="button"
            onClick={onOpenAdd}
            className="group w-full cursor-pointer rounded-3xl border-2 border-dashed border-border/80 bg-secondary/20 p-8 text-foreground shadow-card transition-all duration-300 hover:border-primary hover:bg-secondary/40 flex flex-col items-center justify-center text-center min-h-[320px]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-magenta group-hover:scale-110 transition duration-300 shadow-soft">
              <UserPlus className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-display font-semibold group-hover:text-magenta transition">
              Adicionar Nova Profissional
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Cadastre mais uma especialista com foto, biografia e botão direto de WhatsApp.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-magenta px-4 py-2 text-xs font-semibold text-white shadow-soft">
              <Plus className="h-3.5 w-3.5" /> Abrir formulário
            </span>
          </button>
        </div>
      </div>
      {pendingDelete ? (
        <ConfirmModal
          title="Remover profissional"
          message={`Deseja remover a profissional “${pendingDelete.name}” da equipe? Esta ação não pode ser desfeita.`}
          confirmLabel="Remover"
          onConfirm={() => void confirmRemove()}
          onClose={() => setPendingDelete(null)}
        />
      ) : null}
    </section>
  );
}

{/* NOVO COMPONENTE: Modal Intuitivo e Fácil de Adicionar / Editar Profissional */}
function ProfessionalEditorModal({
  initialData,
  professionals,
  setProfessionals,
  isDemo,
  onClose,
  onReload,
  onSuccess,
  onError,
}: {
  initialData: ProfessionalData | null;
  professionals: ProfessionalData[];
  setProfessionals: React.Dispatch<React.SetStateAction<ProfessionalData[]>>;
  isDemo: boolean;
  onClose: () => void;
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [form, setForm] = useState<Omit<ProfessionalData, "id" | "sort_order">>(
    initialData
      ? {
          name: initialData.name,
          role: initialData.role,
          bio: initialData.bio,
          image_url: initialData.image_url,
          storage_path: initialData.storage_path,
          whatsapp: initialData.whatsapp ?? "5531996792131",
          instagram: initialData.instagram ?? "@salaobembonita_cielly",
          active: initialData.active,
        }
      : emptyProfessional()
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sugestões de cargos dinâmicas (salvas no localStorage)
  const defaultRoleSuggestions = [
    "Dona, Criadora & Cabeleireira Especialista",
    "Colorista & Especialista em Mechas",
    "Terapeuta Capilar & Cronograma",
    "Especialista em Corte a Seco",
    "Definição, Fisiologia & Finalização",
    "Penteados & Noivas Cacheadas",
  ];

  const [roleSuggestions, setRoleSuggestions] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem("bem-bonita-role-suggestions");
      if (saved) return JSON.parse(saved);
    } catch {
      // O armazenamento local pode estar indisponível em navegação privada.
    }
    return defaultRoleSuggestions;
  });

  const [newRoleInput, setNewRoleInput] = useState("");
  const [showAddRoleInput, setShowAddRoleInput] = useState(false);

  function handleAddRoleSuggestion() {
    const trimmed = newRoleInput.trim();
    if (!trimmed) return;
    if (!roleSuggestions.includes(trimmed)) {
      const updated = [...roleSuggestions, trimmed];
      setRoleSuggestions(updated);
      try {
        window.localStorage.setItem("bem-bonita-role-suggestions", JSON.stringify(updated));
      } catch {
        // A sugestão continua válida durante a sessão mesmo sem persistência local.
      }
    }
    setForm((prev) => ({ ...prev, role: trimmed }));
    setNewRoleInput("");
    setShowAddRoleInput(false);
  }

  function handleRemoveRoleSuggestion(suggestionToRemove: string, e: React.MouseEvent) {
    e.stopPropagation();
    const updated = roleSuggestions.filter((s) => s !== suggestionToRemove);
    setRoleSuggestions(updated);
    try {
      window.localStorage.setItem("bem-bonita-role-suggestions", JSON.stringify(updated));
    } catch {
      // A remoção continua válida durante a sessão mesmo sem persistência local.
    }
  }

  async function handleSelectImage(file: File) {
    setUploading(true);
    try {
      if (isDemo) {
        const fakeUrl = URL.createObjectURL(file);
        setForm((prev) => ({ ...prev, image_url: fakeUrl, storage_path: null }));
        setUploading(false);
        return;
      }
      const uploaded = await uploadImagem(file, "team");
      setForm((prev) => ({ ...prev, image_url: uploaded.url, storage_path: uploaded.path }));
    } catch (error) {
      onError(error instanceof Error ? error.message : "Falha no upload da foto.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      onError("Por favor, preencha o nome da profissional.");
      return;
    }
    if (!form.role.trim()) {
      onError("Por favor, preencha o cargo ou especialidade.");
      return;
    }

    setSaving(true);

    const nextOrder = initialData
      ? initialData.sort_order
      : (professionals.length ? Math.max(...professionals.map((p) => p.sort_order), 0) + 1 : 1);

    const payload = {
      ...form,
      sort_order: nextOrder,
    };

    if (isDemo) {
      if (initialData) {
        setProfessionals((prev) =>
          prev.map((p) => (p.id === initialData.id ? { ...payload, id: initialData.id } : p))
        );
      } else {
        const newId = `prof-${Date.now()}`;
        setProfessionals((prev) => [...prev, { ...payload, id: newId }]);
      }
      onSuccess(initialData ? "Profissional atualizada com sucesso!" : "Nova profissional adicionada à equipe com sucesso!");
      setSaving(false);
      return;
    }

    try {
      const query = initialData && !initialData.id.startsWith("pending-prof-")
        ? getSupabaseClient().from("professionals").update(payload).eq("id", initialData.id)
        : getSupabaseClient().from("professionals").insert(payload);
      const { data: saved, error } = await query.select("id, sort_order").single();
      if (error || !saved) onError("Não foi possível salvar os dados da profissional.");
      else {
        onSuccess(initialData ? "Profissional atualizada com sucesso." : "Nova profissional cadastrada na equipe!");
        await onReload();
      }
    } catch {
      onError("Erro ao salvar profissional.");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Área de Upload de Foto com Preview de Destaque */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
          <Camera className="h-4 w-4 text-magenta" /> Foto de Perfil da Profissional
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary/50 shadow-inner">
            {form.image_url ? (
              <img
                src={form.image_url}
                alt="Foto da profissional"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground p-2 text-center">
                <User className="h-8 w-8 opacity-40 mb-1" />
                <span className="text-[10px] leading-tight">Sem foto</span>
              </div>
            )}
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/75 text-white text-xs font-semibold">
                <LoaderCircle className="h-4 w-4 animate-spin text-magenta" />
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Escolha uma foto nítida e profissional (vertical/retrato recomendada).
            </p>
            <label className="inline-flex items-center gap-2 rounded-xl bg-secondary hover:bg-secondary/80 px-4 py-2.5 text-xs font-semibold text-magenta cursor-pointer transition border border-primary/20 hover:border-primary shadow-xs">
              <Upload className="h-3.5 w-3.5" />
              <span>{uploading ? "Enviando foto..." : form.image_url ? "Trocar foto de perfil" : "Fazer upload de foto"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading}
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleSelectImage(file);
                    e.target.value = "";
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* 2. Nome & Especialidade com Chips Rápidos */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-foreground">Nome Completo</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Francielly Soares ou Nome da Especialista"
            className="admin-input"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-foreground">Especialidade / Cargo</span>
          <input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="Ex: Colorista & Terapeuta Capilar"
            className="admin-input"
            required
          />
        </label>
      </div>

      {/* Gerenciamento de Sugestões Rápidas de Especialidade (Adicionar / Remover) */}
      <div className="hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Sugestões rápidas de cargo (clique para preencher):
          </span>
          <button
            type="button"
            onClick={() => setShowAddRoleInput((v) => !v)}
            className="text-xs text-magenta font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            {showAddRoleInput ? "Fechar" : "+ Nova sugestão"}
          </button>
        </div>

        {showAddRoleInput ? (
          <div className="flex items-center gap-2 pt-1">
            <input
              value={newRoleInput}
              onChange={(e) => setNewRoleInput(e.target.value)}
              placeholder="Ex: Trancista & Especialista Afro"
              className="admin-input mt-0 py-2 text-xs flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddRoleSuggestion();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddRoleSuggestion}
              className="rounded-xl bg-magenta px-3.5 py-2 text-xs font-semibold text-white shadow-soft hover:bg-magenta/90 shrink-0"
            >
              Adicionar
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {roleSuggestions.map((suggestion) => {
            const isSelected = form.role === suggestion;
            return (
              <div
                key={suggestion}
                onClick={() => setForm({ ...form, role: suggestion })}
                className={`group inline-flex items-center gap-1.5 rounded-full pl-3 pr-1.5 py-1 text-[11px] font-medium cursor-pointer transition ${
                  isSelected
                    ? "bg-magenta text-white shadow-soft"
                    : "bg-card border border-border text-foreground hover:border-primary/50 hover:bg-secondary/70"
                }`}
              >
                <span>{suggestion}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveRoleSuggestion(suggestion, e)}
                  title={`Remover sugestão "${suggestion}"`}
                  aria-label={`Remover sugestão ${suggestion}`}
                  className={`flex h-4 w-4 items-center justify-center rounded-full transition ${
                    isSelected
                      ? "hover:bg-white/20 text-white"
                      : "text-muted-foreground hover:bg-red-500/20 hover:text-red-400"
                  }`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Biografia / Apresentação */}
      <label className="block">
        <span className="text-sm font-semibold text-foreground">Biografia / Apresentação da Profissional</span>
        <textarea
          rows={3}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Ex: Especialista em transição capilar, corte a seco e cronogramas personalizados com foco no bem-estar e autoestima das clientes."
          className="admin-input resize-y"
          required
        />
      </label>

      {/* 4. WhatsApp & Instagram */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp para Agendamentos
          </span>
          <input
            value={form.whatsapp ?? ""}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="5531996792131"
            className="admin-input"
          />
          <span className="text-[11px] text-muted-foreground mt-1 block">
            O botão "Agendar" no card direcionará para este número.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-foreground">Instagram (opcional)</span>
          <input
            value={form.instagram ?? ""}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            placeholder="@salaobembonita_cielly"
            className="admin-input"
          />
        </label>
      </div>

      {/* 5. Status Ativo */}
      <div className="rounded-2xl bg-secondary/40 p-4 border border-border">
        <Toggle
          label="Profissional ativa e visível no site (na Home e na página da equipe)"
          checked={form.active}
          onChange={(active) => setForm({ ...form, active })}
        />
      </div>

      {/* 6. Botões de Ação */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl border border-border px-5 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          Cancelar
        </button>
        <Botao type="submit" disabled={saving || uploading}>
          {saving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Salvando..." : initialData ? "Salvar alterações" : "Adicionar à equipe"}
        </Botao>
      </div>
    </form>
  );
}

{/* Aba de Prévia da Galeria com Categorias e Miniaturas */}
function PortfolioOverviewTab({
  items,
  categories,
  services,
  onOpenManager,
}: {
  items: PortfolioData[];
  categories: CategoryData[];
  services: ServiceData[];
  onOpenManager: () => void;
}) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  function normalizeFilter(value?: string | null) {
    return (value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }

  const serviceFilters = services
    .map((service) => ({
      id: `service:${service.id}`,
      label: service.name,
      count: items.filter(
        (item) => item.service_id === service.id || normalizeFilter(item.service_name) === normalizeFilter(service.name),
      ).length,
    }))
    .filter((filter) => filter.count > 0);

  const filteredItems =
    activeFilter === "all"
      ? items
      : activeFilter.startsWith("service:")
        ? items.filter((item) => {
            const serviceId = activeFilter.replace("service:", "");
            const service = services.find((entry) => entry.id === serviceId);
            return item.service_id === serviceId || normalizeFilter(item.service_name) === normalizeFilter(service?.name);
          })
        : items;

  return (
    <section className="space-y-8">
      {/* Topo da Galeria */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="eyebrow">Galeria do Salão</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-display">Nossa Galeria</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {items.length} foto(s) cadastradas. Os filtros do site usam somente os serviços reais cadastrados na aba “Serviços”.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Botao type="button" onClick={onOpenManager} className="shadow-card">
            <Images className="h-4 w-4" /> Gerenciar &amp; Reordenar Galeria
          </Botao>
        </div>
      </div>

      {/* Filtros Ativos */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-gold" /> Filtros ativos no site
          </h3>
          <button
            type="button"
            onClick={onOpenManager}
            className="text-xs text-magenta font-medium hover:underline"
          >
            Gerenciar fotos
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeFilter === "all"
                ? "bg-magenta text-white shadow-soft"
                : "bg-secondary text-foreground/80 hover:bg-secondary/80"
            }`}
          >
            Todas as Fotos ({items.length})
          </button>
        </div>
        {serviceFilters.length ? (
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-magenta">
              Serviços reais
            </p>
            <div className="flex flex-wrap gap-2.5">
              {serviceFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeFilter === filter.id
                      ? "bg-magenta text-white shadow-soft"
                      : "bg-secondary text-foreground/80 hover:bg-secondary/80"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {!serviceFilters.length ? (
          <div className="mt-4 rounded-2xl border border-dashed border-primary/30 bg-secondary/30 p-4 text-sm text-muted-foreground">
            Ainda não há filtro ativo. Clique em “Gerenciar fotos”, edite uma foto e escolha um serviço real para ela.
          </div>
        ) : null}
      </div>

      {/* Prévia da Grade de Fotos da Galeria */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display flex items-center gap-2">
            <Eye className="h-4.5 w-4.5 text-magenta" /> Prévia Visual das Fotos ({filteredItems.length})
          </h2>
          <span className="text-xs text-muted-foreground">
            Clique em "Gerenciar" para arrastar e reordenar
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={onOpenManager}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-soft flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-secondary/40">
                <img
                  src={item.image_url}
                  alt={item.alt_text}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur">
                  #{item.sort_order || index + 1}
                </div>
                <div className="absolute top-2.5 right-2.5 rounded-full bg-secondary/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-magenta backdrop-blur">
                  {item.service_name ?? item.category}
                </div>
              </div>
              <div className="p-2 pt-3">
                <p className="text-sm font-medium truncate group-hover:text-magenta transition">
                  {item.title}
                </p>
                <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Ativo no site
                  </span>
                  <span className="text-[11px] font-medium text-magenta group-hover:underline">
                    Editar →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesOverviewTab({
  services,
  settings,
  onOpenManager,
  onChangeCardStyle,
}: {
  services: ServiceData[];
  settings: SiteSettingsData | null;
  onOpenManager: () => void;
  onChangeCardStyle: (style: NonNullable<SiteSettingsData["services_card_style"]>) => void;
}) {
  const activeStyle = settings?.services_card_style === "compact" ? "compact" : "photo";

  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="eyebrow">Atendimentos</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-display">Tabela de Serviços</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {services.length} serviços cadastrados. Escolha abaixo se os cards aparecem com foto ou no modelo clássico sem foto.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Botao type="button" onClick={onOpenManager} className="shadow-card">
            <Scissors className="h-4 w-4" /> Gerenciar serviços
          </Botao>
        </div>
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-5 shadow-card">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow">Modelo dos cards no site</p>
            <h2 className="mt-2 font-display text-2xl">Escolha a aparência dos serviços</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Essa opção muda todos os cards de serviços de uma vez no site público. As fotos continuam salvas para quando você quiser usar o modelo com imagem.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[30rem]">
            <button
              type="button"
              onClick={() => onChangeCardStyle("photo")}
              aria-pressed={activeStyle === "photo"}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                activeStyle === "photo"
                  ? "border-primary bg-secondary text-foreground shadow-soft"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <ImageIcon className="h-4 w-4 text-magenta" />
                Com foto
              </span>
              <span className="mt-2 block text-xs leading-relaxed">
                Foto em cima, título e descrição embaixo.
              </span>
            </button>
            <button
              type="button"
              onClick={() => onChangeCardStyle("compact")}
              aria-pressed={activeStyle === "compact"}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                activeStyle === "compact"
                  ? "border-primary bg-secondary text-foreground shadow-soft"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Scissors className="h-4 w-4 text-magenta" />
                Sem foto
              </span>
              <span className="mt-2 block text-xs leading-relaxed">
                Modelo clássico com ícone, preço, título e descrição.
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {services.map((item, index) => (
          <div
            key={item.id}
            onClick={onOpenManager}
            className="group cursor-pointer rounded-3xl border border-border bg-card p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-magenta">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold group-hover:text-magenta transition">
                    {item.name}
                  </h3>
                </div>
                {item.description ? (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {item.description}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-magenta">
                  {item.price_text || "Sem preço"}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${item.published ? "bg-emerald-500/15 text-emerald-300" : "bg-secondary text-muted-foreground"}`}
                >
                  {item.published ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
              <span className="text-muted-foreground font-mono text-[11px]">
                Posição #{index + 1}
              </span>
              <span className="font-semibold text-magenta group-hover:underline">
                Reordenar ou Editar →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type FeedbackDraft = TestimonialData & { storage_path?: string | null };

function FeedbacksManagerTab({ testimonials, setTestimonials, isDemo, onReload, onSuccess, onError }: {
  testimonials: TestimonialData[];
  setTestimonials: React.Dispatch<React.SetStateAction<TestimonialData[]>>;
  isDemo: boolean;
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [editing, setEditing] = useState<FeedbackDraft | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<TestimonialData | null>(null);

  function openNew() {
    setEditing({ id: "", client_name: "", testimonial: "", rating: null, service_name: null, image_url: null, published: true, created_at: new Date().toISOString(), storage_path: null });
  }

  async function selectImage(file: File) {
    if (!editing) return;
    setUploading(true);
    try {
      if (isDemo) setEditing({ ...editing, image_url: URL.createObjectURL(file), storage_path: null });
      else {
        const uploaded = await uploadImagem(file, "feedbacks");
        setEditing({ ...editing, image_url: uploaded.url, storage_path: uploaded.path });
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível enviar o print.");
    } finally {
      setUploading(false);
    }
  }

  async function saveFeedback(event: FormEvent) {
    event.preventDefault();
    if (!editing?.client_name.trim()) { onError("Informe um título para identificar o feedback."); return; }
    if (!editing.image_url) { onError("Selecione o print do feedback."); return; }
    setSaving(true);
    const payload = {
      client_name: editing.client_name.trim(),
      testimonial: editing.client_name.trim(),
      rating: null,
      service_name: null,
      image_url: editing.image_url,
      published: editing.published,
    };
    try {
      if (isDemo) {
        const saved = { ...editing, ...payload, id: editing.id || `feedback-${Date.now()}` };
        setTestimonials((current) => editing.id ? current.map((item) => item.id === editing.id ? saved : item) : [saved, ...current]);
      } else {
        const query = editing.id
          ? getSupabaseClient().from("testimonials").update(payload).eq("id", editing.id)
          : getSupabaseClient().from("testimonials").insert(payload);
        const { error } = await query;
        if (error) throw error;
        await onReload();
      }
      setEditing(null);
      onSuccess("Feedback salvo e sincronizado com o site.");
    } catch {
      onError("Não foi possível salvar o feedback.");
    } finally {
      setSaving(false);
    }
  }

  function removeFeedback(feedback: TestimonialData) {
    setPendingDelete(feedback);
  }

  async function confirmRemoveFeedback() {
    if (!pendingDelete) return;
    const feedback = pendingDelete;
    setPendingDelete(null);
    if (isDemo) {
      setTestimonials((current) => current.filter((item) => item.id !== feedback.id));
      return;
    }
    const { error } = await getSupabaseClient().from("testimonials").delete().eq("id", feedback.id);
    if (error) onError("Não foi possível excluir o feedback.");
    else { await onReload(); onSuccess("Feedback excluído."); }
  }

  return <section className="space-y-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="eyebrow">Prova social</p><h1 className="mt-2 text-3xl font-display sm:text-4xl">Feedbacks em print ({testimonials.filter((item) => item.image_url).length})</h1><p className="mt-2 text-sm text-muted-foreground">Envie prints reais das mensagens das clientes. Os feedbacks ativos aparecem automaticamente na página inicial.</p></div>
      <Botao type="button" onClick={openNew}><Plus className="h-4 w-4" /> Adicionar print</Botao>
    </div>
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {testimonials.filter((item) => item.image_url).map((feedback) => <article key={feedback.id} className="rounded-3xl border border-border bg-card p-4 shadow-card">
        <div className="overflow-hidden rounded-2xl bg-secondary"><img src={feedback.image_url!} alt={`Print de ${feedback.client_name}`} className="aspect-[4/5] w-full object-contain" /></div>
        <div className="mt-4 flex items-start justify-between gap-3"><div><h2 className="font-display text-lg">{feedback.client_name}</h2><p className={`mt-1 text-xs ${feedback.published ? "text-emerald-400" : "text-muted-foreground"}`}>{feedback.published ? "Visível no site" : "Oculto"}</p></div><div className="flex gap-2"><button type="button" onClick={() => setEditing({ ...feedback })} className="min-h-11 rounded-xl bg-secondary px-3 text-xs font-semibold text-magenta">Editar</button><button type="button" onClick={() => void removeFeedback(feedback)} className="min-h-11 rounded-xl border border-red-500/30 px-3 text-xs text-red-300">Excluir</button></div></div>
      </article>)}
    </div>
    {!testimonials.some((item) => item.image_url) ? <div className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Nenhum print cadastrado. Use “Adicionar print” para publicar o primeiro feedback real.</div> : null}
    {editing ? <AdminModal title={editing.id ? "Editar feedback" : "Adicionar feedback em print"} onClose={() => setEditing(null)}><form onSubmit={saveFeedback} className="space-y-4">
      <ImageField label="Print da conversa ou avaliação" currentUrl={editing.image_url} uploading={uploading} onSelect={(file) => void selectImage(file)} />
      <label className="block"><span className="text-sm font-medium">Identificação do feedback</span><input className="admin-input" value={editing.client_name} onChange={(event) => setEditing({ ...editing, client_name: event.target.value })} placeholder="Ex.: Feedback recebido pelo WhatsApp" /><span className="mt-1 block text-xs text-muted-foreground">Use apenas uma identificação autorizada; não exponha telefone ou dados pessoais no título.</span></label>
      <label className="flex items-center gap-3 rounded-xl border border-border p-4 text-sm"><input type="checkbox" checked={editing.published} onChange={(event) => setEditing({ ...editing, published: event.target.checked })} /> Mostrar este feedback no site</label>
      <Botao type="submit" disabled={saving || uploading}>{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar feedback</Botao>
    </form></AdminModal> : null}
    {pendingDelete ? (
      <ConfirmModal
        title="Excluir feedback"
        message={`Deseja excluir o feedback “${pendingDelete.client_name}”? Esta ação não pode ser desfeita.`}
        onConfirm={() => void confirmRemoveFeedback()}
        onClose={() => setPendingDelete(null)}
      />
    ) : null}
  </section>;
}

function formatOrderCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((value || 0) / 100);
}

function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

const orderStatusLabels: Record<ProductOrderData["status"], string> = {
  pending: "Pedido recebido",
  paid: "Pagamento confirmado",
  preparing: "Preparando pedido",
  ready: "Pronto",
  out_for_delivery: "Pronto / saiu para entrega",
  completed: "Concluído",
  cancelled: "Cancelado",
  refunded: "Devolvido/Reembolsado",
  manual_review: "Conferir pedido",
};

const selectableOrderStatuses: Array<{ value: ProductOrderData["status"]; label: string }> = [
  { value: "pending", label: "Pedido recebido" },
  { value: "paid", label: "Pagamento confirmado" },
  { value: "out_for_delivery", label: "Pronto / saiu para entrega" },
  { value: "completed", label: "Concluído" },
  { value: "cancelled", label: "Cancelado" },
];

const adminTabStorageKey = "bem-bonita-admin-tab";

function getInitialAdminTab(): Tab {
  if (typeof window === "undefined") return "overview";
  const saved = window.localStorage.getItem(adminTabStorageKey);
  return tabs.some((item) => item.id === saved) ? (saved as Tab) : "overview";
}

const fulfillmentLabels: Record<string, string> = {
  pickup: "Retirar no salão",
  motoboy: "Receber em casa por motoboy",
  shipping: "Entrega combinada",
  combine: "Combinar pelo WhatsApp",
};

function OrdersManagerTab({
  orders,
  ordersError,
  isDemo,
  onReload,
  onSuccess,
  onError,
}: {
  orders: ProductOrderData[];
  ordersError: string;
  isDemo: boolean;
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [pendingDelete, setPendingDelete] = useState<ProductOrderData | null>(null);

  async function updateOrderStatus(order: ProductOrderData, status: ProductOrderData["status"]) {
    if (isDemo) {
      onSuccess("Status atualizado no preview.");
      return;
    }

    const { error } = await getSupabaseClient()
      .from("product_orders")
      .update({ status })
      .eq("id", order.id);

    if (error) {
      onError("Não foi possível atualizar o status do pedido.");
      return;
    }

    await onReload();
    onSuccess("Status do pedido atualizado.");
  }

  async function confirmDeleteOrder() {
    if (!pendingDelete) return;
    const order = pendingDelete;
    setPendingDelete(null);

    if (isDemo) {
      onSuccess("Pedido excluído no preview.");
      return;
    }

    const { error } = await getSupabaseClient().from("product_orders").delete().eq("id", order.id);
    if (error) {
      onError("Não foi possível excluir o pedido. Se aparecer erro de permissão, execute o SQL atualizado de pedidos.");
      return;
    }

    await onReload();
    onSuccess("Pedido excluído.");
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Loja online</p>
          <h1 className="mt-2 text-3xl font-display sm:text-4xl">Pedidos dos produtos</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Veja quem comprou, confira o pagamento no PagBank e acompanhe a separação, retirada ou entrega do pedido.
          </p>
        </div>
        <Botao type="button" onClick={() => void onReload()}>
          <RefreshCw className="h-4 w-4" /> Atualizar pedidos
        </Botao>
      </div>

      {ordersError ? (
        <div className="rounded-3xl border border-amber-400/30 bg-amber-500/10 p-5 text-sm text-amber-100">
          {ordersError}
        </div>
      ) : null}

      {orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl border border-border bg-card p-5 shadow-card">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-magenta">
                      {orderStatusLabels[order.status] ?? order.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatOrderDate(order.created_at)}</span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl">{order.customer_name}</h2>
                  <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
                    <span>WhatsApp: {order.customer_phone}</span>
                    {order.customer_email ? <span>E-mail: {order.customer_email}</span> : null}
                    <span>Código do pedido: {order.reference_id}</span>
                  </div>
                </div>

                <div className="min-w-[220px] rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total</p>
                  <p className="mt-1 text-xl font-bold text-magenta">{formatOrderCurrency(order.total_amount)}</p>
                  <label className="mt-3 block text-xs font-semibold text-muted-foreground">
                    Status
                    <select
                      className="admin-input mt-1"
                      value={order.status}
                      onChange={(event) => void updateOrderStatus(order, event.target.value as ProductOrderData["status"])}
                    >
                      {!selectableOrderStatuses.some((option) => option.value === order.status) ? (
                        <option value={order.status}>{orderStatusLabels[order.status] ?? order.status}</option>
                      ) : null}
                      {selectableOrderStatuses.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {order.pagbank_payment_url ? (
                    <a
                      href={order.pagbank_payment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
                    >
                      Abrir PagBank <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setPendingDelete(order)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/40 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Excluir pedido
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <MapPin className="h-4 w-4 text-magenta" />
                  <p className="text-sm font-semibold">
                    {fulfillmentLabels[order.fulfillment_method ?? "pickup"] ?? "Retirar no salão"}
                  </p>
                </div>
                {order.delivery_address || order.delivery_neighborhood || order.delivery_reference ? (
                  <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
                    {order.delivery_address ? <span>Endereço: {order.delivery_address}</span> : null}
                    {order.delivery_neighborhood ? <span>Bairro: {order.delivery_neighborhood}</span> : null}
                    {order.delivery_reference ? <span>Referência: {order.delivery_reference}</span> : null}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cliente escolheu retirada no salão.
                  </p>
                )}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {(order.product_order_items ?? []).map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-2xl border border-border bg-background/60 p-3">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.product_name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-secondary text-magenta">
                        <ShoppingBag className="h-5 w-5" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold">{item.product_name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.quantity}x {formatOrderCurrency(item.unit_amount)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-magenta">{formatOrderCurrency(item.total_amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-10 text-center">
          <ShoppingBag className="mx-auto h-9 w-9 text-magenta" />
          <h2 className="mt-3 font-display text-2xl">Nenhum pedido registrado ainda</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Quando alguém preencher os dados no carrinho e clicar para pagar pelo PagBank, o pedido aparece aqui.
          </p>
        </div>
      )}
      {pendingDelete ? (
        <ConfirmModal
          title="Excluir pedido"
          message={`Deseja excluir o pedido de “${pendingDelete.customer_name}”? Esta ação remove o pedido do admin.`}
          confirmLabel="Excluir pedido"
          onConfirm={() => void confirmDeleteOrder()}
          onClose={() => setPendingDelete(null)}
        />
      ) : null}
    </section>
  );
}

function ProductsManagerTab({ products, setProducts, isDemo, onReload, onSuccess, onError }: {
  products: ProductData[];
  setProducts: React.Dispatch<React.SetStateAction<ProductData[]>>;
  isDemo: boolean;
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const emptyProduct = (): ProductData => ({
    id: "",
    name: "",
    subtitle: "",
    hair_type: "",
    description: "",
    benefits: [],
    category: "",
    price_text: "",
    image_url: null,
    storage_path: null,
    featured: false,
    sort_order: products.length ? Math.max(...products.map((product) => product.sort_order), 0) + 1 : 1,
    published: true,
  });
  const [editing, setEditing] = useState<ProductData | null>(null);
  const [benefitsText, setBenefitsText] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingProduct, setUploadingProduct] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ProductData | null>(null);

  function openEditor(product?: ProductData) {
    const value = product ?? emptyProduct();
    setEditing({ ...value });
    setBenefitsText((value.benefits ?? []).join("\n"));
  }

  async function selectProductImage(file: File) {
    if (!editing) return;
    setUploadingProduct(true);
    try {
      if (isDemo) {
        const previewUrl = URL.createObjectURL(file);
        setEditing((current) => current ? { ...current, image_url: previewUrl, storage_path: null } : current);
      } else {
        const uploaded = await uploadImagem(file, "products");
        setEditing((current) => current ? { ...current, image_url: uploaded.url, storage_path: uploaded.path } : current);
        onSuccess("Foto enviada. Agora clique em salvar produto.");
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "Falha no upload da imagem.");
    } finally {
      setUploadingProduct(false);
    }
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    if (!editing?.name.trim()) {
      onError("Preencha o nome do produto.");
      return;
    }

    const payload = {
      name: editing.name.trim(),
      subtitle: editing.subtitle.trim(),
      hair_type: editing.hair_type.trim(),
      description: editing.description.trim(),
      benefits: benefitsText.split("\n").map((item) => item.trim()).filter(Boolean),
      category: editing.category?.trim() ?? "",
      price_text: editing.price_text?.trim() ?? "",
      image_url: editing.image_url,
      storage_path: editing.storage_path,
      featured: editing.featured,
      sort_order: editing.sort_order || (products.length ? Math.max(...products.map((product) => product.sort_order), 0) + 1 : 1),
      published: editing.published,
    };

    setSavingProduct(true);
    try {
      if (isDemo) {
        const saved = { ...payload, id: editing.id || `product-${Date.now()}` };
        setProducts((current) => editing.id ? current.map((item) => item.id === editing.id ? saved : item) : [...current, saved]);
      } else {
        const query = editing.id
          ? getSupabaseClient().from("products").update(payload).eq("id", editing.id)
          : getSupabaseClient().from("products").insert(payload);
        const { data: savedProduct, error } = await query.select("*").single();
        if (error || !savedProduct) throw error ?? new Error("O Supabase não retornou o produto salvo.");
        setProducts((current) =>
          editing.id
            ? current.map((item) => item.id === editing.id ? (savedProduct as ProductData) : item)
            : [...current, savedProduct as ProductData],
        );
        await onReload();
      }
      onSuccess("Produto salvo e atualizado no site.");
      setEditing(null);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível salvar o produto. Tente novamente.");
    } finally {
      setSavingProduct(false);
    }
  }

  function removeProduct(product: ProductData) {
    setPendingDelete(product);
  }

  async function confirmRemoveProduct() {
    if (!pendingDelete) return;
    const product = pendingDelete;
    setPendingDelete(null);
    if (isDemo || product.id.startsWith("pending-product-")) {
      setProducts((current) => current.filter((item) => item.id !== product.id));
      onSuccess("Produto excluído.");
      return;
    }
    const { error } = await getSupabaseClient().from("products").delete().eq("id", product.id);
    if (error) onError(error.message);
    else { await removerImagem(product.storage_path); await onReload(); onSuccess("Produto excluído."); }
  }

  return <section className="space-y-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="eyebrow">Catálogo</p><h1 className="mt-2 text-3xl font-display sm:text-4xl">Produtos ({products.length})</h1><p className="mt-2 text-sm text-muted-foreground">Cadastre a loja como catálogo editável. O ecommerce completo será definido depois.</p></div>
      <Botao type="button" onClick={() => openEditor()}><Plus className="h-4 w-4" /> Novo produto</Botao>
    </div>
    {products.length ? (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <div className="flex aspect-[3/4] items-center justify-center overflow-hidden">
              <SafeImage src={product.image_url ?? fotoProdutosFallback} fallbackSrc={fotoProdutosFallback} alt={product.name} className="h-full w-full object-contain" />
            </div>
            <div className="mt-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-lg">{product.name}</h2>
                <span className={`rounded-full px-2 py-1 text-[10px] ${product.published ? "bg-emerald-500/15 text-emerald-300" : "bg-secondary text-muted-foreground"}`}>{product.published ? "Ativo" : "Oculto"}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{product.subtitle || product.hair_type}</p>
              {product.price_text ? <p className="mt-2 text-sm font-semibold text-magenta">{product.price_text}</p> : null}
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => openEditor(product)} className="min-h-11 flex-1 rounded-xl bg-secondary px-3 py-2 text-xs font-semibold text-magenta">Editar</button>
                <button type="button" onClick={() => void removeProduct(product)} className="min-h-11 rounded-xl border border-red-500/30 px-4 py-2 text-xs text-red-300">Excluir</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    ) : (
      <div className="rounded-3xl border border-dashed border-border p-10 text-center">
        <ShoppingBag className="mx-auto h-9 w-9 text-magenta" />
        <h2 className="mt-3 font-display text-2xl">Nenhum produto cadastrado ainda</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Clique em “Novo produto” para cadastrar a primeira foto e deixar a loja pronta para a próxima etapa do ecommerce.</p>
        <Botao type="button" onClick={() => openEditor()} className="mt-5"><Plus className="h-4 w-4" /> Novo produto</Botao>
      </div>
    )}
    {editing ? <AdminModal title={editing.id ? "Editar produto" : "Novo produto"} onClose={() => setEditing(null)}><form onSubmit={saveProduct} className="space-y-4">
      <ImageField label="Foto do produto" currentUrl={editing.image_url} uploading={uploadingProduct} onSelect={(file) => void selectProductImage(file)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="text-sm font-medium">Nome</span><input className="admin-input" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required /></label>
        <label className="block"><span className="text-sm font-medium">Preço opcional</span><input className="admin-input" value={editing.price_text ?? ""} onChange={(event) => setEditing({ ...editing, price_text: event.target.value })} placeholder="Ex.: R$89,90" /></label>
      </div>
      <label className="block"><span className="text-sm font-medium">Subtítulo</span><input className="admin-input" value={editing.subtitle} onChange={(event) => setEditing({ ...editing, subtitle: event.target.value })} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Tipos de cabelo / curvaturas</span>
          <select
            className="admin-input"
            value={editing.hair_type || "Todos os tipos de cabelo"}
            onChange={(event) => setEditing({ ...editing, hair_type: event.target.value })}
          >
            {hairTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block"><span className="text-sm font-medium">Categoria / linha</span><input className="admin-input" value={editing.category ?? ""} onChange={(event) => setEditing({ ...editing, category: event.target.value })} placeholder="Ex.: Cachos, Força, Reviveme" /></label>
      </div>
      <label className="block"><span className="text-sm font-medium">Descrição</span><textarea rows={3} className="admin-input" value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} /></label>
      <label className="block"><span className="text-sm font-medium">Benefícios — um por linha</span><textarea rows={4} className="admin-input" value={benefitsText} onChange={(event) => setBenefitsText(event.target.value)} /></label>
      <label className="block"><span className="text-sm font-medium">Ordem</span><input type="number" min={1} className="admin-input" value={editing.sort_order} onChange={(event) => setEditing({ ...editing, sort_order: Number(event.target.value) || 1 })} /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm"><input type="checkbox" checked={editing.featured} onChange={(event) => setEditing({ ...editing, featured: event.target.checked })} /> Produto em destaque</label>
        <label className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm"><input type="checkbox" checked={editing.published} onChange={(event) => setEditing({ ...editing, published: event.target.checked })} /> Ativo no site</label>
      </div>
      <Botao type="submit" disabled={savingProduct || uploadingProduct}>{savingProduct ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar produto</Botao>
    </form></AdminModal> : null}
    {pendingDelete ? (
      <ConfirmModal
        title="Excluir produto"
        message={`Deseja excluir o produto “${pendingDelete.name}”? Esta ação não pode ser desfeita.`}
        onConfirm={() => void confirmRemoveProduct()}
        onClose={() => setPendingDelete(null)}
      />
    ) : null}
  </section>;
}

function PhotosTab({
  mode,
  images,
  setImages,
  spacePhotos = [],
  setSpacePhotos,
  isDemo,
  onReload,
  onSuccess,
  onError,
}: {
  mode: "all" | "space";
  images: SiteImageData[];
  setImages: React.Dispatch<React.SetStateAction<SiteImageData[]>>;
  spacePhotos?: SpacePhotoData[];
  setSpacePhotos?: React.Dispatch<React.SetStateAction<SpacePhotoData[]>>;
  isDemo: boolean;
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [uploading, setUploading] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("highlight");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; storage_path: string | null; title: string; source: "site" | "space" } | null>(null);
  const visibleHistory = mode === "space"
    ? spacePhotos.map((photo) => ({
        id: photo.id,
        image_url: photo.image_url,
        alt_text: photo.alt_text || photo.title || "Foto do espaço Bem Bonita",
        storage_path: photo.storage_path,
        created_at: photo.created_at ?? "Recente",
        label: photo.title || "Foto do portfólio",
        badge: "Portfólio",
        source: "space" as const,
      }))
    : images.map((image) => ({
        id: image.id,
        image_url: image.image_url,
        alt_text: image.alt_text,
        storage_path: image.storage_path,
        created_at: image.created_at ?? "Recente",
        label: image.alt_text || image.image_key,
        badge: image.image_key,
        source: "site" as const,
      }));

  const mainSlots = [
    {
      key: "hero",
      title: "Foto Principal (Hero)",
      badge: "Início do Site",
      description: "Imagem de maior impacto visual, exibida logo na abertura do site.",
      fallback: fotoHeroFallback,
    },
    {
      key: "about",
      title: "Foto Sobre a Profissional (Home)",
      badge: "Autoridade",
      description: "Francielly Soares com as ferramentas e produtos profissionais na Home.",
      fallback: fotoFranciellyFallback,
    },
    {
      key: "products",
      title: "Banner da Linha de Produtos",
      badge: "Produtos",
      description: "Imagem de destaque para a seção de cosméticos e tratamentos.",
      fallback: fotoProdutosFallback,
    },
  ];

  async function save(key: string, file: File, customTitle?: string) {
    setUploading(key);
    try {
      if (isDemo) {
        const fakeUrl = URL.createObjectURL(file);
        const exists = images.some((img) => img.image_key === key);
        if (exists) {
          setImages((prev) =>
            prev.map((img) =>
              img.image_key === key
                ? { ...img, image_url: fakeUrl, created_at: "Agora mesmo" }
                : img
            )
          );
        } else {
          setImages((prev) => [
            {
              id: `img-${Date.now()}`,
              image_key: key,
              image_url: fakeUrl,
              alt_text: customTitle ?? `Foto ${key}`,
              storage_path: null,
              created_at: "Agora mesmo",
            },
            ...prev,
          ]);
        }
        onSuccess("Foto atualizada com sucesso em tempo real!");
        setUploading(null);
        return;
      }

      const previous = images.find((image) => image.image_key === key);
      const uploaded = await uploadImagem(file, `site/${key}`);
      const { error } = await getSupabaseClient()
        .from("site_images")
        .upsert(
          {
            image_key: key,
            image_url: uploaded.url,
            storage_path: uploaded.path,
            alt_text: customTitle ?? previous?.alt_text ?? `Imagem ${key} do salão Bem Bonita`,
          },
          { onConflict: "image_key" },
        );
      if (error) throw error;
      await removerImagem(previous?.storage_path);
      await onReload();
      onSuccess("Imagem atualizada e salva no site.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(null);
    }
  }

  async function handleCreateNewPhoto(file: File) {
    const key = `custom_${newCategory}_${Date.now()}`;
    await save(key, file, newTitle || "Foto");
    setShowAddModal(false);
    setNewTitle("");
  }

  async function handleCreateSpacePortfolioPhoto(file: File) {
    setUploading("space_portfolio");
    try {
      const title = newTitle.trim() || "Foto do portfólio do Espaço Bem Bonita";
      if (isDemo) {
        const fakeUrl = URL.createObjectURL(file);
        setSpacePhotos?.((prev) => [
          {
            id: `space-${Date.now()}`,
            title,
            image_url: fakeUrl,
            storage_path: null,
            alt_text: title,
            sort_order: prev.length ? Math.max(...prev.map((photo) => photo.sort_order), 0) + 1 : 1,
            published: true,
            created_at: "Agora mesmo",
          },
          ...prev,
        ]);
        onSuccess("Foto adicionada ao portfólio em tempo real!");
        setNewTitle("");
        return;
      }

      const uploaded = await uploadImagem(file, "space", "space-photos");
      const sortOrder = spacePhotos.length ? Math.max(...spacePhotos.map((photo) => photo.sort_order), 0) + 1 : 1;
      const { error } = await getSupabaseClient()
        .from("space_photos")
        .insert({
          title,
          image_url: uploaded.url,
          storage_path: uploaded.path,
          alt_text: title,
          sort_order: sortOrder,
          published: true,
        });
      if (error) throw error;
      await onReload();
      onSuccess("Foto adicionada ao portfólio do Nosso Espaço.");
      setNewTitle("");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(null);
    }
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  }

  function handleDeleteCustom(img: { id: string; storage_path: string | null; title: string; source: "site" | "space" }) {
    setPendingDelete(img);
  }

  async function confirmDeleteCustom() {
    if (!pendingDelete) return;
    const img = pendingDelete;
    setPendingDelete(null);
    try {
      if (!isDemo) {
        const table = img.source === "space" ? "space_photos" : "site_images";
        const bucket = img.source === "space" ? "space-photos" : "site-images";
        const { error } = await getSupabaseClient().from(table).delete().eq("id", img.id);
        if (error) throw error;
        await removerImagem(img.storage_path, bucket);
      }
      if (img.source === "space") {
        setSpacePhotos?.((prev) => prev.filter((i) => i.id !== img.id));
      } else {
        setImages((prev) => prev.filter((i) => i.id !== img.id));
      }
      onSuccess("Foto removida do histórico e do armazenamento.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível remover a foto.");
      await onReload();
    }
  }

  return (
    <section className="space-y-12">
      {/* Topo da Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="eyebrow">{mode === "space" ? "Portfólio do espaço" : "Mídia & Ambientes"}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-display">
            {mode === "space" ? "Nosso Espaço" : "Fotos do Site e Francielly"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {mode === "space"
              ? "Essa aba é somente para montar o portfólio visual do espaço Bem Bonita. Adicione fotos reais do salão; elas aparecem na seção “Nosso Espaço” do site."
              : <>Substitua a imagem de qualquer área específica clicando diretamente no botão <strong>"Trocar foto desta área"</strong> presente em cada card.</>}
          </p>
        </div>
        {mode === "all" ? (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> Adicionar nova foto
          </button>
        ) : null}
      </div>

      {mode === "space" ? (
        <div className="rounded-[2rem] border border-dashed border-primary/40 bg-secondary/45 p-5 shadow-card sm:p-7">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <Images className="h-3.5 w-3.5 text-gold" />
                Portfólio do espaço
              </p>
              <h2 className="mt-2 font-display text-2xl">Adicionar foto ao portfólio</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Use esta área para publicar somente fotos reais do salão. Não existem cards fixos:
                cada imagem enviada aqui vira uma foto do portfólio no site.
              </p>
            </div>
            <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5">
              {uploading === "space_portfolio" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading === "space_portfolio" ? "Enviando..." : "Adicionar foto ao portfólio"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                disabled={Boolean(uploading)}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleCreateSpacePortfolioPhoto(file);
                  event.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      ) : null}

      {/* Seção 1: Fotos Principais de Destaque */}
      {mode === "all" ? <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-magenta">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-xl font-display">Fotos Principais &amp; Apresentação</h2>
            <p className="text-xs text-muted-foreground">Somente as imagens principais da página inicial e da linha de produtos</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mainSlots.map((slot, index) => {
            const item = images.find((image) => image.image_key === slot.key);
            const isCurrentlyUploading = uploading === slot.key;

            return (
              <div
                key={slot.key}
                className="group rounded-3xl border border-border bg-card p-5 shadow-card transition hover:border-primary/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-magenta bg-secondary px-2.5 py-0.5 rounded-full">
                      {slot.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-display">{slot.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground min-h-8">
                    {slot.description}
                  </p>
                </div>

                <div className="mt-4">
                  {/* Prévia da Imagem */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/80 bg-secondary/40 shadow-inner">
                    <SafeImage
                      src={item?.image_url ?? slot.fallback}
                      fallbackSrc={slot.fallback}
                      alt={slot.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    {isCurrentlyUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-xs text-white text-xs font-semibold gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin text-magenta" /> Enviando...
                      </div>
                    ) : null}
                  </div>

                  {/* Botão Dedicado e Explícito de Troca */}
                  <label className="mt-3.5 flex items-center justify-center gap-2 rounded-2xl bg-secondary/90 hover:bg-secondary px-4 py-2.5 text-xs font-semibold text-magenta cursor-pointer transition border border-primary/20 hover:border-primary shadow-xs">
                    <Camera className="h-3.5 w-3.5 shrink-0" />
                    <span>{isCurrentlyUploading ? "Atualizando..." : "Trocar foto"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={isCurrentlyUploading}
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          void save(slot.key, file);
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div> : null}

      {/* Galeria do Portfólio / Histórico de Imagens Enviadas */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-display flex items-center gap-2">
              {mode === "space" ? <Images className="h-5 w-5 text-magenta" /> : <Clock className="h-5 w-5 text-magenta" />}
              {mode === "space" ? "Fotos do portfólio" : "Histórico de Fotos Cadastradas"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {mode === "space" ? "Somente as fotos adicionadas aqui aparecem na aba “Nosso Espaço” do site." : "Registro de todas as fotos ativas no salão. Você pode copiar o link ou consultar as imagens."}
            </p>
          </div>
          <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full font-medium">
            {visibleHistory.length} foto(s)
          </span>
        </div>

        {!visibleHistory.length && mode === "space" ? (
          <div className="mt-6 rounded-[2rem] border border-dashed border-primary/35 bg-card p-8 text-center shadow-card">
            <p className="font-display text-2xl">Nenhuma foto no portfólio ainda</p>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Clique em “Adicionar foto ao portfólio” para começar a montar a galeria do espaço Bem Bonita.
            </p>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleHistory.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background p-3 shadow-card transition hover:border-primary/60"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-secondary/40">
                <img
                  src={img.image_url}
                  alt={img.alt_text}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium truncate text-foreground">{img.label}</p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{img.created_at ?? "Recente"}</span>
                  <span className="font-mono text-[10px] text-magenta uppercase">{img.badge}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
                <button
                  type="button"
                  onClick={() => handleCopy(img.image_url)}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-magenta transition font-medium"
                >
                  <Copy className="h-3 w-3" />
                  {copiedUrl === img.image_url ? "Copiado!" : "Copiar link"}
                </button>
                {mode === "space" || img.badge.startsWith("custom_") ? (
                  <button
                    type="button"
                    onClick={() => void handleDeleteCustom({
                      id: img.id,
                      storage_path: img.storage_path,
                      title: img.label,
                      source: img.source,
                    })}
                    className="text-red-300 hover:text-red-200 text-[11px]"
                  >
                    Excluir
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para Adicionar Nova Foto */}
      {showAddModal ? (
        <AdminModal title={mode === "space" ? "Adicionar foto ao Nosso Espaço" : "Adicionar nova foto de destaque"} onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Título / Identificação da Foto</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Poltrona de atendimento ou Café do salão"
                className="admin-input"
              />
            </div>
            {mode === "all" ? <div>
              <label className="block text-sm font-medium">Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="admin-input"
              >
                <option value="francielly">Francielly Soares</option>
                <option value="highlight">Foto de Destaque</option>
                <option value="treatment">Tratamento &amp; Cuidado</option>
              </select>
            </div> : null}
            <div>
              <label className="block text-sm font-medium mb-2">Selecione o arquivo de imagem</label>
              <ImageField
                label="Clique para escolher a imagem"
                uploading={uploading === "new"}
                onSelect={(file) => void handleCreateNewPhoto(file)}
              />
            </div>
          </div>
        </AdminModal>
      ) : null}
      {pendingDelete ? (
        <ConfirmModal
          title="Remover foto"
          message="Deseja remover esta foto do histórico e do armazenamento? Esta ação não pode ser desfeita."
          onConfirm={() => void confirmDeleteCustom()}
          onClose={() => setPendingDelete(null)}
        />
      ) : null}
    </section>
  );
}

function SettingsTab({
  mode,
  settings,
  images,
  setImages,
  isDemo,
  onChange,
  onReload,
  onSuccess,
  onError,
}: {
  mode: "general" | "francielly";
  settings: SiteSettingsData;
  images: SiteImageData[];
  setImages: React.Dispatch<React.SetStateAction<SiteImageData[]>>;
  isDemo: boolean;
  onChange: (settings: SiteSettingsData) => void;
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFranPhoto, setUploadingFranPhoto] = useState(false);
  const [uploadingFranExtra, setUploadingFranExtra] = useState<string | null>(null);

  const franImage =
    images.find((img) => img.image_key === "francielly_bio")?.image_url ??
    images.find((img) => img.image_key === "about")?.image_url ??
    fotoFranciellyFallback;

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true);
    try {
      if (isDemo) {
        const fakeUrl = URL.createObjectURL(file);
        onChange({ ...settings, logo_url: fakeUrl });
        onSuccess("Logotipo atualizado no preview!");
        setUploadingLogo(false);
        return;
      }
      const uploaded = await uploadImagem(file, "site/logo");
      const updated = { ...settings, logo_url: uploaded.url };
      onChange(updated);
      if (settings.id === undefined || settings.id === null) {
        throw new Error("Não foi possível identificar o registro das informações do site.");
      }
      await getSupabaseClient()
        .from("site_settings")
        .update({ logo_url: uploaded.url })
        .eq("id", settings.id);
      onSuccess("Logotipo atualizado e salvo no site!");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Falha no upload do logotipo.");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleFranPhotoUpload(file: File) {
    setUploadingFranPhoto(true);
    try {
      if (isDemo) {
        const fakeUrl = URL.createObjectURL(file);
        setImages((prev) => {
          const exists = prev.some((i) => i.image_key === "francielly_bio");
          if (exists) {
            return prev.map((i) =>
              i.image_key === "francielly_bio" ? { ...i, image_url: fakeUrl } : i
            );
          }
          return [
            {
              id: `img-${Date.now()}`,
              image_key: "francielly_bio",
              image_url: fakeUrl,
              alt_text: "Foto oficial de Francielly Soares",
              storage_path: null,
            },
            ...prev,
          ];
        });
        onSuccess("Foto da página Francielly atualizada!");
        setUploadingFranPhoto(false);
        return;
      }
      const uploaded = await uploadImagem(file, "site/francielly_bio");
      const { error } = await getSupabaseClient()
        .from("site_images")
        .upsert(
          {
            image_key: "francielly_bio",
            image_url: uploaded.url,
            storage_path: uploaded.path,
            alt_text: "Foto oficial de Francielly Soares",
          },
          { onConflict: "image_key" }
        );
      if (error) throw error;
      await onReload();
      onSuccess("Foto de Francielly atualizada com sucesso!");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Falha ao atualizar foto de Francielly.");
    } finally {
      setUploadingFranPhoto(false);
    }
  }

  function handleRemoveLogo() {
    onChange({ ...settings, logo_url: null });
    onSuccess("Logotipo personalizado removido. O site usará a logo tipográfica padrão.");
  }

  const generalFields: Array<{
    key: keyof SiteSettingsData;
    label: string;
    multiline?: boolean;
    help?: string;
  }> = [
    { key: "salon_name", label: "Nome do Salão (Marca)", help: "Texto usado caso não haja imagem de logo." },
    { key: "headline", label: "Título principal da Home (Hero)" },
    { key: "hero_description", label: "Descrição principal da Home", multiline: true },
    { key: "about_text", label: "Texto da seção Sobre na Home", multiline: true },
    { key: "services_title", label: "Título dos Serviços do Salão", help: "Esse título sincroniza com a seção de serviços do site." },
    { key: "services_description", label: "Texto abaixo dos Serviços do Salão", multiline: true, help: "Esse texto aparece abaixo do título na seção de serviços." },
    { key: "whatsapp", label: "WhatsApp", help: "Somente números com DDD (ex: 5531996792131)." },
    { key: "instagram", label: "Instagram", help: "Usuário do Instagram com ou sem @." },
    { key: "address", label: "Endereço completo", multiline: true },
    { key: "landmark", label: "Ponto de referência", multiline: true },
  ];

  async function saveSettings() {
    setSaving(true);
    if (isDemo) {
      setTimeout(() => {
        onSuccess("Todas as informações e textos foram salvos com sucesso!");
        setSaving(false);
      }, 300);
      return;
    }

    try {
      const { id, ...editableSettings } = settings;
      if (id === undefined || id === null) {
        onError("Não foi possível identificar o registro das informações do site.");
        setSaving(false);
        return;
      }
      const { error } = await getSupabaseClient()
        .from("site_settings")
        .update(editableSettings)
        .eq("id", id);
      if (error) {
        onError(error.message.includes("column")
          ? "O banco ainda não tem todos os campos novos. Execute supabase/gallery-categories-fran-fix.sql no Supabase."
          : `Não foi possível salvar as informações. Se o ponto de referência não salva, execute supabase/gallery-categories-fran-fix.sql. Detalhe: ${error.message}`);
      }
      else onSuccess("Informações atualizadas com sucesso.");
    } catch {
      onError("Erro ao salvar informações.");
    }
    setSaving(false);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void saveSettings();
  }

  return (
    <section className="space-y-8">
      <div>
        <p className="eyebrow">{mode === "francielly" ? "Página institucional" : "Configurações"}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-display">
          {mode === "francielly" ? "Editar página da Francielly" : "Informações e identidade do site"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {mode === "francielly"
            ? "Edite cada parte da página em blocos organizados. As alterações aparecem no site após salvar."
            : "Gerencie somente a marca, os contatos e as informações gerais exibidas no site."}
        </p>
      </div>

      {/* 1. Seção Compacta de Logotipo */}
      {mode === "general" ? <div className="max-w-4xl rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-24 shrink-0 flex items-center justify-center rounded-xl border border-dashed border-border bg-secondary/50 p-2 overflow-hidden">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt="Logotipo do Salão"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-5 w-5 text-muted-foreground/60" />
                  <span className="text-[9px] text-muted-foreground block">Sem logo</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <Sparkles className="h-4 w-4 text-gold" /> Logotipo Oficial da Marca
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                PNG com fundo transparente ou SVG recomendado.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="inline-flex items-center gap-2 rounded-xl bg-secondary hover:bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-magenta cursor-pointer transition border border-primary/20 hover:border-primary shadow-xs">
              <Camera className="h-3.5 w-3.5" />
              <span>{uploadingLogo ? "Enviando..." : settings.logo_url ? "Substituir logo" : "Fazer upload de logo"}</span>
              <input
                type="file"
                accept="image/png,image/svg+xml,image/jpeg,image/webp"
                disabled={uploadingLogo}
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleLogoUpload(file);
                    e.target.value = "";
                  }
                }}
              />
            </label>

            {settings.logo_url ? (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20 transition"
              >
                Remover
              </button>
            ) : null}
          </div>
        </div>
      </div> : null}

      {/* 2. Seção Exclusiva: Página da Francielly Soares */}
      {mode === "francielly" ? <div className="max-w-5xl rounded-3xl border border-primary/40 bg-secondary/30 p-5 sm:p-8 shadow-card space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/80">
          <div>
            <span className="eyebrow flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-magenta" /> Página Institucional
            </span>
            <h2 className="text-xl font-display mt-1">Página da Especialista (/francielly)</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Personalize a biografia, foto oficial e frases de autoridade de Francielly Soares.
            </p>
          </div>
          <a
            href="/francielly"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-magenta font-semibold hover:underline"
          >
            Abrir página /francielly <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Foto de Apresentação da Francielly */}
        <div className="grid gap-6 sm:grid-cols-[10rem_1fr] sm:items-center rounded-2xl bg-card p-4 border border-border">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary border border-border">
            <img
              src={franImage}
              alt="Foto oficial de Francielly Soares"
              className="h-full w-full object-cover"
            />
            {uploadingFranPhoto ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/75 text-white text-xs font-semibold gap-1">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-magenta" /> Enviando...
              </div>
            ) : null}
          </div>
          <div>
            <h3 className="text-sm font-semibold">Foto Principal da Francielly</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Foto de autoridade exibida no topo da página de biografia da especialista.
            </p>
            <label className="mt-3.5 inline-flex items-center gap-2 rounded-xl bg-secondary hover:bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-magenta cursor-pointer transition border border-primary/20 hover:border-primary shadow-xs">
              <Camera className="h-3.5 w-3.5" />
              <span>{uploadingFranPhoto ? "Enviando..." : "Trocar foto da Francielly"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploadingFranPhoto}
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleFranPhotoUpload(file);
                    e.target.value = "";
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Textos da Francielly */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium">Etiqueta do topo</span>
            <input value={String(settings.francielly_eyebrow ?? "")} onChange={(e) => onChange({ ...settings, francielly_eyebrow: e.target.value })} className="admin-input" />
          </label>
          <label className="sm:col-span-1">
            <span className="text-sm font-medium">Nome da Especialista</span>
            <input
              value={String(settings.professional_name ?? "")}
              onChange={(e) => onChange({ ...settings, professional_name: e.target.value })}
              className="admin-input"
            />
          </label>
          <label className="sm:col-span-1">
            <span className="text-sm font-medium">Frase / Subtítulo de Destaque</span>
            <input
              value={String(settings.francielly_headline ?? "")}
              onChange={(e) => onChange({ ...settings, francielly_headline: e.target.value })}
              placeholder="Ex: Paixão, técnica e identidade"
              className="admin-input"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium">Biografia / História de Francielly</span>
            <textarea
              rows={3}
              value={String(settings.francielly_bio ?? "")}
              onChange={(e) => onChange({ ...settings, francielly_bio: e.target.value })}
              placeholder="Descreva a trajetória, formação e valores da especialista..."
              className="admin-input resize-y"
            />
          </label>
          <label>
            <span className="text-sm font-medium">Texto do botão principal</span>
            <input value={String(settings.francielly_cta_label ?? "")} onChange={(e) => onChange({ ...settings, francielly_cta_label: e.target.value })} className="admin-input" />
          </label>
          <label>
            <span className="text-sm font-medium">Etiqueta da foto principal</span>
            <input value={String(settings.francielly_photo_label ?? "")} onChange={(e) => onChange({ ...settings, francielly_photo_label: e.target.value })} className="admin-input" />
          </label>
        </div>

        <div className="sticky bottom-4 z-10 flex justify-end rounded-2xl border border-border bg-card/95 p-4 shadow-card backdrop-blur">
          <Botao type="button" disabled={saving} onClick={() => void saveSettings()}>
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Salvando página..." : "Salvar página da Francielly"}
          </Botao>
        </div>
      </div> : null}

      {/* 3. Formulário Geral de Informações do Salão e Contatos */}
      {mode === "general" ? <form
        onSubmit={submit}
        className="grid max-w-4xl gap-5 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 sm:p-8 shadow-card"
      >
        <div className="sm:col-span-2 pb-2 border-b border-border">
          <h2 className="text-xl font-display font-semibold">Textos principais, contato e localização</h2>
        </div>

        {generalFields.map((field) => (
          <label key={field.key} className={field.multiline ? "sm:col-span-2" : ""}>
            <span className="text-sm font-bold text-foreground">{field.label}</span>
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
        <div className="sm:col-span-2 mt-2">
          <Botao type="submit" disabled={saving}>
            {saving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Salvando..." : "Salvar todas as alterações"}
          </Botao>
        </div>
      </form> : null}
    </section>
  );
}

function ServicesManager({
  services,
  setServices,
  isDemo,
  onReload,
  onSuccess,
  onError,
}: {
  services: ServiceData[];
  setServices: React.Dispatch<React.SetStateAction<ServiceData[]>>;
  isDemo: boolean;
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyService());
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ServiceData | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  function serviceAreaError(message?: string) {
    const detail = message ? ` Detalhe: ${message}` : "";
    return `A área de serviços precisa do ajuste no Supabase. Execute supabase/services-admin-definitive-fix.sql no SQL Editor e tente novamente.${detail}`;
  }

  function edit(item?: ServiceData) {
    setEditingId(item?.id ?? null);
    setForm(
      item
        ? {
            name: item.name,
            description: item.description,
            price_text: item.price_text ?? "",
            featured: Boolean(item.featured),
            benefits: [],
            image_url: item.image_url ?? null,
            storage_path: item.storage_path ?? null,
            cta_label: "Conversar sobre este serviço",
            published: item.published,
          }
        : emptyService(),
    );
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  async function handleFranciellyExtraUpload(slot: 1 | 2 | 3, file: File) {
    const imageKey = `francielly_extra_${slot}`;
    setUploadingFranExtra(imageKey);
    try {
      if (isDemo) {
        const fakeUrl = URL.createObjectURL(file);
        setImages((prev) => {
          const exists = prev.some((i) => i.image_key === imageKey);
          if (exists) {
            return prev.map((i) => i.image_key === imageKey ? { ...i, image_url: fakeUrl } : i);
          }
          return [
            {
              id: `img-${Date.now()}-${slot}`,
              image_key: imageKey,
              image_url: fakeUrl,
              alt_text: `Foto extra ${slot} da página Francielly`,
              storage_path: null,
            },
            ...prev,
          ];
        });
        onSuccess("Foto extra da página Francielly atualizada.");
        return;
      }

      const uploaded = await uploadImagem(file, `site/${imageKey}`);
      const { error } = await getSupabaseClient()
        .from("site_images")
        .upsert(
          {
            image_key: imageKey,
            image_url: uploaded.url,
            storage_path: uploaded.path,
            alt_text: `Foto extra ${slot} da página Francielly`,
          },
          { onConflict: "image_key" }
        );
      if (error) throw error;
      await onReload();
      onSuccess("Foto extra da página Francielly atualizada.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Falha ao atualizar foto extra da Francielly.");
    } finally {
      setUploadingFranExtra(null);
    }
  }

  async function selectServiceImage(file: File) {
    setUploadingServiceImage(true);
    try {
      if (isDemo) {
        const previewUrl = URL.createObjectURL(file);
        setForm((current) => ({ ...current, image_url: previewUrl, storage_path: null }));
        return;
      }

      const uploaded = await uploadImagem(file, "services");
      setForm((current) => ({ ...current, image_url: uploaded.url, storage_path: uploaded.path }));
    } catch (error) {
      onError(serviceAreaError(error instanceof Error ? error.message : "Não foi possível enviar a foto do serviço."));
    } finally {
      setUploadingServiceImage(false);
    }
  }

  async function applyNewOrder(reorderedList: ServiceData[]) {
    const withUpdatedOrder = reorderedList.map((s, idx) => ({ ...s, sort_order: idx + 1 }));
    setServices(withUpdatedOrder);

    if (isDemo) {
      onSuccess("Ordem dos serviços atualizada.");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      for (const [idx, item] of withUpdatedOrder.entries()) {
        await supabase.from("services").update({ sort_order: 10000 + idx }).eq("id", item.id);
      }
      for (const item of withUpdatedOrder) {
        await supabase.from("services").update({ sort_order: item.sort_order }).eq("id", item.id);
      }
      await onReload();
      onSuccess("Ordem dos serviços atualizada.");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível salvar a nova ordem.");
    }
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDrop(targetIndex: number) {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const itemsCopy = [...services];
    const movedItem = itemsCopy.splice(draggedIndex, 1)[0]!;
    itemsCopy.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    void applyNewOrder(itemsCopy);
  }

  async function moveService(item: ServiceData, direction: "up" | "down") {
    const currentIndex = services.findIndex((s) => s.id === item.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const itemsCopy = [...services];
    const movedItem = itemsCopy.splice(currentIndex, 1)[0]!;
    itemsCopy.splice(targetIndex, 0, movedItem);
    await applyNewOrder(itemsCopy);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      onError("Informe o nome do serviço.");
      return;
    }
    if (!form.price_text.trim()) {
      onError("Informe o preço do serviço.");
      return;
    }
    setSaving(true);

    const nextOrder = editingId
      ? (services.find((s) => s.id === editingId)?.sort_order ?? services.length + 1)
      : (services.length ? Math.max(...services.map((s) => s.sort_order), 0) + 1 : 1);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price_text: form.price_text.trim(),
      featured: Boolean(form.featured),
      sort_order: nextOrder,
      benefits: [],
      image_url: form.image_url,
      storage_path: form.storage_path,
      cta_label: "Conversar sobre este serviço",
      published: form.published,
    };

    if (isDemo) {
      if (editingId) {
        setServices((prev) =>
          prev.map((s) => (s.id === editingId ? { ...payload, id: editingId } : s))
        );
      } else {
        const newId = `srv-${Date.now()}`;
        setServices((prev) => [...prev, { ...payload, id: newId }]);
      }
      onSuccess(editingId ? "Serviço atualizado com sucesso." : "Novo serviço criado e adicionado ao final da lista!");
      edit();
      setSaving(false);
      return;
    }

    try {
      const query = editingId
        ? getSupabaseClient().from("services").update(payload).eq("id", editingId)
        : getSupabaseClient().from("services").insert(payload);
      const { data: savedService, error } = await query.select("*").single();
      if (error || !savedService) onError(serviceAreaError(error?.message ?? "Não foi possível salvar o serviço."));
      else {
        onSuccess(editingId ? "Serviço atualizado." : "Novo serviço adicionado no final da lista.");
        edit();
        await onReload();
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "Erro ao salvar serviço.");
    }
    setSaving(false);
  }

  function remove(item: ServiceData) {
    setPendingDelete(item);
  }

  async function confirmRemove() {
    if (!pendingDelete) return;
    const item = pendingDelete;
    setPendingDelete(null);

    if (isDemo) {
      const remaining = services.filter((s) => s.id !== item.id);
      setServices(remaining.map((s, idx) => ({ ...s, sort_order: idx + 1 })));
      onSuccess("Serviço excluído com sucesso.");
      return;
    }

    try {
      const { error } = await getSupabaseClient().from("services").delete().eq("id", item.id);
      if (error) onError("Não foi possível excluir o serviço.");
      else {
        onSuccess("Serviço excluído.");
        await onReload();
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "Erro ao excluir serviço.");
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-display">Serviços cadastrados ({services.length})</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Arraste os itens para reorganizar a ordem da tabela no site.
            </p>
          </div>
          <button
            type="button"
            onClick={() => edit()}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-magenta font-medium hover:bg-secondary shrink-0"
          >
            <Plus className="h-4 w-4" /> Novo serviço
          </button>
        </div>
        <div className="mt-5 space-y-3.5">
          {!services.length ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Nenhum serviço cadastrado. Use “Novo serviço” para montar a tabela de preços.
            </div>
          ) : null}
          {services.map((item, index) => {
            const isDragging = draggedIndex === index;
            const isOver = dragOverIndex === index;

            return (
              <article
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                className={`group relative overflow-hidden rounded-3xl border bg-background shadow-card transition-all duration-200 cursor-grab active:cursor-grabbing sm:grid sm:grid-cols-[2.5rem_1fr] ${
                  isDragging ? "opacity-40 scale-[0.98] border-dashed border-magenta" : ""
                } ${isOver ? "border-primary ring-2 ring-primary/40 -translate-y-1" : "border-border"}`}
              >
                <div className="hidden sm:flex items-center justify-center border-r border-border bg-secondary/30 text-muted-foreground group-hover:text-foreground">
                  <GripVertical className="h-5 w-5 opacity-60 group-hover:opacity-100 transition" />
                </div>

                <div className="grid min-w-0 gap-4 p-4 sm:grid-cols-[7rem_1fr] sm:p-5">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary/60">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={`Foto do serviço ${item.name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-center text-[11px] font-medium text-muted-foreground">
                        Sem foto
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-magenta">
                        {index + 1}
                      </span>
                      <p className="text-base font-medium leading-snug">{item.name}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-magenta">
                        {item.price_text || "Sem preço"}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${item.published ? "bg-emerald-500/15 text-emerald-300" : "bg-muted text-muted-foreground"}`}
                      >
                        {item.published ? "Ativo" : "Inativo"}
                      </span>
                      {item.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground">
                          <Star className="h-3 w-3 fill-current" />
                          Destaque
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {item.description ? (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-[11px] text-muted-foreground">
                      Posição #{index + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          void moveService(item, "up");
                        }}
                        aria-label="Mover para cima"
                        title="Mover para cima"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/80 text-foreground transition hover:bg-secondary disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === services.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          void moveService(item, "down");
                        }}
                        aria-label="Mover para baixo"
                        title="Mover para baixo"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/80 text-foreground transition hover:bg-secondary disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          edit(item);
                        }}
                        aria-label={`Editar ${item.name}`}
                        title="Editar serviço"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-magenta"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void remove(item);
                        }}
                        aria-label={`Excluir ${item.name}`}
                        title="Excluir serviço"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-red-950/40 text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-border bg-background p-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display">{editingId ? "Editar serviço" : "Novo serviço"}</h3>
          {editingId ? (
            <button
              type="button"
              onClick={() => edit()}
              className="text-xs text-muted-foreground hover:text-magenta"
            >
              Cancelar edição
            </button>
          ) : (
            <span className="text-[11px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
              Será inserido como último
            </span>
          )}
        </div>
        <ImageField
          label="Foto do serviço"
          currentUrl={form.image_url}
          uploading={uploadingServiceImage}
          onSelect={(file) => void selectServiceImage(file)}
        />
        <Field
          label="Nome do serviço"
          value={form.name}
          onChange={(value) => setForm({ ...form, name: value })}
          placeholder="Ex: Terapia de Nutrição Lipídica"
          required
        />
        <Field
          label="Preço"
          value={form.price_text}
          onChange={(value) => setForm({ ...form, price_text: value })}
          placeholder="Ex: R$120,00"
          required
        />
        <Field
          label="Descrição"
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
          placeholder="Descreva o procedimento e o resultado esperado..."
          multiline
        />
        <Toggle
          label="Serviço ativo e visível no site"
          checked={form.published}
          onChange={(published) => setForm({ ...form, published })}
        />
        <Toggle
          label="Marcar como serviço em destaque"
          checked={Boolean(form.featured)}
          onChange={(featured) => setForm({ ...form, featured })}
        />
        <Botao type="submit" disabled={saving || uploadingServiceImage} className="w-full">
          {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Criar serviço (adicionar ao final)"}
        </Botao>
      </form>
      {pendingDelete ? (
        <ConfirmModal
          title="Excluir serviço"
          message={`Deseja excluir o serviço “${pendingDelete.name}”? Esta ação não pode ser desfeita.`}
          onConfirm={() => void confirmRemove()}
          onClose={() => setPendingDelete(null)}
        />
      ) : null}
    </div>
  );
}

function PortfolioManager({
  items,
  setPortfolio,
  categories,
  setCategories,
  services,
  isDemo,
  onReload,
  onSuccess,
  onError,
}: {
  items: PortfolioData[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioData[]>>;
  categories: CategoryData[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[]>>;
  services: ServiceData[];
  isDemo: boolean;
  onReload: () => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPortfolio());
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editingCategoryActive, setEditingCategoryActive] = useState(true);
  const [pendingDeleteCategory, setPendingDeleteCategory] = useState<CategoryData | null>(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<PortfolioData | null>(null);

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function edit(item?: PortfolioData) {
    setEditingId(item?.id ?? null);
    setForm(
      item
        ? {
            title: item.title,
            description: item.description,
            category: item.category,
            category_id: item.category_id,
            service_id: item.service_id ?? null,
            service_name: item.service_name ?? null,
            hair_type: item.hair_type ?? "Todos os tipos de cabelo",
            photo_label: item.photo_label ?? "",
            image_zoom: item.image_zoom ?? 1,
            image_position_x: item.image_position_x ?? 50,
            image_position_y: item.image_position_y ?? 50,
            image_url: item.image_url,
            storage_path: item.storage_path,
            alt_text: item.alt_text,
            published: item.published,
          }
        : emptyPortfolio(),
    );
  }

  function makeCategorySlug(name: string) {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function startEditCategory(category: CategoryData) {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setEditingCategoryActive(category.active);
    setNewCategory(category.name);
  }

  function clearCategoryForm() {
    setEditingCategoryId(null);
    setEditingCategoryName("");
    setEditingCategoryActive(true);
    setNewCategory("");
  }

  async function selectImage(file: File) {
    setUploading(true);
    try {
      if (isDemo) {
        const fakeUrl = URL.createObjectURL(file);
        setForm((current) => ({ ...current, image_url: fakeUrl, storage_path: null }));
        setUploading(false);
        return;
      }
      const uploaded = await uploadImagem(file, "portfolio");
      setForm((current) => ({ ...current, image_url: uploaded.url, storage_path: uploaded.path }));
    } catch (error) {
      onError(error instanceof Error ? error.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function saveCategory() {
    const name = (editingCategoryId ? editingCategoryName : newCategory).trim();
    if (!name) return;
    const slug = makeCategorySlug(name);

    if (isDemo) {
      if (editingCategoryId) {
        setCategories((prev) =>
          prev.map((category) =>
            category.id === editingCategoryId
              ? { ...category, name, slug, active: editingCategoryActive }
              : category,
          ),
        );
      } else {
        const newCat: CategoryData = {
          id: `cat-${Date.now()}`,
          name,
          slug,
          sort_order: categories.length + 1,
          active: true,
        };
        setCategories((prev) => [...prev, newCat]);
      }
      clearCategoryForm();
      onSuccess(editingCategoryId ? "Categoria atualizada com sucesso." : "Categoria criada com sucesso.");
      return;
    }

    try {
      const query = editingCategoryId
        ? getSupabaseClient()
            .from("portfolio_categories")
            .update({ name, slug, active: editingCategoryActive })
            .eq("id", editingCategoryId)
        : getSupabaseClient()
            .from("portfolio_categories")
            .insert({ name, slug, sort_order: categories.length + 1, active: true });
      const { error } = await query;
      if (error) onError(`Não foi possível salvar a categoria. Detalhe: ${error.message}`);
      else {
        clearCategoryForm();
        onSuccess(editingCategoryId ? "Categoria atualizada." : "Categoria criada.");
        await onReload();
      }
    } catch {
      onError("Erro ao salvar categoria.");
    }
  }

  async function toggleCategory(category: CategoryData) {
    if (isDemo) {
      setCategories((prev) =>
        prev.map((item) => (item.id === category.id ? { ...item, active: !category.active } : item)),
      );
      onSuccess(category.active ? "Categoria ocultada do site." : "Categoria ativada no site.");
      return;
    }

    try {
      const { error } = await getSupabaseClient()
        .from("portfolio_categories")
        .update({ active: !category.active })
        .eq("id", category.id);
      if (error) onError(`Não foi possível mudar a categoria. Detalhe: ${error.message}`);
      else {
        onSuccess(category.active ? "Categoria ocultada do site." : "Categoria ativada no site.");
        await onReload();
      }
    } catch {
      onError("Erro ao mudar categoria.");
    }
  }

  function removeCategory(category: CategoryData) {
    setPendingDeleteCategory(category);
  }

  async function confirmRemoveCategory() {
    if (!pendingDeleteCategory) return;
    const category = pendingDeleteCategory;
    setPendingDeleteCategory(null);

    if (isDemo) {
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      onSuccess("Categoria excluída com sucesso.");
      return;
    }

    try {
      const { error } = await getSupabaseClient()
        .from("portfolio_categories")
        .delete()
        .eq("id", category.id);
      if (error) onError("Não foi possível excluir a categoria.");
      else {
        onSuccess("Categoria excluída.");
        await onReload();
      }
    } catch {
      onError("Erro ao excluir categoria.");
    }
  }

  async function applyNewOrder(reorderedList: PortfolioData[]) {
    const withUpdatedOrder = reorderedList.map((p, idx) => ({ ...p, sort_order: idx + 1 }));
    setPortfolio(withUpdatedOrder);

    if (isDemo) {
      onSuccess("Ordem da galeria atualizada.");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      for (const [idx, item] of withUpdatedOrder.entries()) {
        await supabase.from("portfolio_items").update({ sort_order: 10000 + idx }).eq("id", item.id);
      }
      for (const item of withUpdatedOrder) {
        await supabase.from("portfolio_items").update({ sort_order: item.sort_order }).eq("id", item.id);
      }
      await onReload();
      onSuccess("Ordem da galeria atualizada.");
    } catch {
      onError("Não foi possível salvar a nova ordem.");
    }
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDrop(targetIndex: number) {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const itemsCopy = [...items];
    const movedItem = itemsCopy.splice(draggedIndex, 1)[0]!;
    itemsCopy.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    void applyNewOrder(itemsCopy);
  }

  async function movePortfolio(item: PortfolioData, direction: "up" | "down") {
    const currentIndex = items.findIndex((p) => p.id === item.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const itemsCopy = [...items];
    const movedItem = itemsCopy.splice(currentIndex, 1)[0]!;
    itemsCopy.splice(targetIndex, 0, movedItem);
    await applyNewOrder(itemsCopy);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.image_url) {
      onError("Escolha uma imagem para a galeria.");
      return;
    }
    if (services.length && !form.service_id && !form.service_name?.trim()) {
      onError("Escolha o serviço real relacionado para essa foto. É isso que faz os filtros da galeria funcionarem.");
      return;
    }

    setSaving(true);
    const nextOrder = editingId
      ? (items.find((p) => p.id === editingId)?.sort_order ?? items.length + 1)
      : (items.length ? Math.max(...items.map((p) => p.sort_order), 0) + 1 : 1);

    const selectedService = services.find((service) => service.id === form.service_id);
    const payload = {
      ...form,
      category: selectedService?.name ?? form.service_name ?? "",
      category_id: null,
      service_name: selectedService?.name ?? form.service_name ?? null,
      image_zoom: Math.min(1.8, Math.max(1, Number(form.image_zoom ?? 1))),
      image_position_x: Math.min(100, Math.max(0, Number(form.image_position_x ?? 50))),
      image_position_y: Math.min(100, Math.max(0, Number(form.image_position_y ?? 50))),
      sort_order: nextOrder,
    };

    if (isDemo) {
      if (editingId) {
        setPortfolio((prev) =>
          prev.map((p) => (p.id === editingId ? { ...payload, id: editingId } : p))
        );
      } else {
        const newId = `port-${Date.now()}`;
        setPortfolio((prev) => [...prev, { ...payload, id: newId }]);
      }
      onSuccess(editingId ? "Foto atualizada com sucesso." : "Nova foto adicionada ao final da galeria!");
      edit();
      setSaving(false);
      return;
    }

    try {
      const query = editingId
        ? getSupabaseClient().from("portfolio_items").update(payload).eq("id", editingId)
        : getSupabaseClient().from("portfolio_items").insert(payload);
      const { data: savedPhoto, error } = await query.select("id, sort_order").single();
      if (error || !savedPhoto) onError("Não foi possível salvar a foto.");
      else {
        onSuccess(editingId ? "Foto atualizada." : "Nova foto adicionada ao final da galeria.");
        edit();
        await onReload();
      }
    } catch {
      onError("Erro ao salvar foto.");
    }
    setSaving(false);
  }

  function remove(item: PortfolioData) {
    setPendingDeleteItem(item);
  }

  async function confirmRemoveItem() {
    if (!pendingDeleteItem) return;
    const item = pendingDeleteItem;
    setPendingDeleteItem(null);

    if (isDemo) {
      const remaining = items.filter((p) => p.id !== item.id);
      setPortfolio(remaining.map((p, idx) => ({ ...p, sort_order: idx + 1 })));
      onSuccess("Foto excluída com sucesso.");
      return;
    }

    try {
      const { error } = await getSupabaseClient().from("portfolio_items").delete().eq("id", item.id);
      if (error) onError("Não foi possível excluir a foto.");
      else {
        await removerImagem(item.storage_path);
        onSuccess("Foto excluída.");
        await onReload();
      }
    } catch {
      onError("Erro ao excluir foto.");
    }
  }

  return (
    <div className="space-y-7">
      <div className="grid gap-8 2xl:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-display">Fotos cadastradas ({items.length})</h3>
              <p className="text-xs text-muted-foreground mt-1">
                ✨ Arraste os cards para reorganizar a vitrine da galeria.
              </p>
            </div>
            <button
              type="button"
              onClick={() => edit()}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-magenta font-medium hover:bg-secondary shrink-0"
            >
              <Plus className="h-4 w-4" /> Nova foto
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {items.map((item, index) => {
              const isDragging = draggedIndex === index;
              const isOver = dragOverIndex === index;

              return (
                <article
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => {
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                  }}
                  className={`group relative overflow-hidden rounded-3xl border bg-background shadow-card transition-all duration-200 cursor-grab active:cursor-grabbing ${
                    isDragging ? "opacity-40 scale-[0.98] border-dashed border-magenta" : ""
                  } ${isOver ? "border-primary ring-2 ring-primary/40 -translate-y-1" : "border-border"}`}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.alt_text}
                      className="h-full w-full object-cover"
                      style={{
                        transform: `scale(${item.image_zoom ?? 1})`,
                        transformOrigin: `${item.image_position_x ?? 50}% ${item.image_position_y ?? 50}%`,
                      }}
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur">
                      <GripVertical className="h-3.5 w-3.5" />
                      <span className="font-bold">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="truncate text-base font-medium">{item.title}</p>
                    <div className="mt-2 text-xs font-medium text-muted-foreground flex items-center justify-between">
                      <span>Posição #{index + 1}</span>
                      <span className="text-[11px] uppercase tracking-wider text-magenta bg-secondary/80 px-2 py-0.5 rounded-full font-medium">
                        {item.service_name ?? "Sem serviço vinculado"}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            void movePortfolio(item, "up");
                          }}
                          aria-label="Mover para cima"
                          title="Mover para cima"
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/80 text-foreground transition hover:bg-secondary disabled:opacity-30"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === items.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            void movePortfolio(item, "down");
                          }}
                          aria-label="Mover para baixo"
                          title="Mover para baixo"
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/80 text-foreground transition hover:bg-secondary disabled:opacity-30"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            edit(item);
                          }}
                          aria-label={`Editar ${item.title}`}
                          title="Editar foto"
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-magenta"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void remove(item);
                          }}
                          aria-label={`Excluir ${item.title}`}
                          title="Excluir foto"
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-red-950/40 text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-border bg-background p-4 sm:p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display">{editingId ? "Editar foto" : "Adicionar foto"}</h3>
            {editingId ? (
              <button
                type="button"
                onClick={() => edit()}
                className="text-xs text-muted-foreground hover:text-magenta"
              >
                Cancelar edição
              </button>
            ) : (
              <span className="text-[11px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                Será inserida como última
              </span>
            )}
          </div>
          <ImageField
            currentUrl={form.image_url}
            uploading={uploading}
            onSelect={(file) => void selectImage(file)}
          />
          <Field
            label="Título do trabalho"
            value={form.title}
            onChange={(value) => setForm({ ...form, title: value })}
            placeholder="Ex: Morena Iluminada em Cachos 3B"
            required
          />
          <Field
            label="Subtítulo / descrição curta"
            value={form.description ?? ""}
            onChange={(value) => setForm({ ...form, description: value })}
            placeholder="Ex: Definição, brilho e movimento natural."
            multiline
          />
          <label className="block text-sm font-medium">
            Filtro da galeria
            <select
              value={form.service_id ?? ""}
              onChange={(event) => {
                const selectedService = services.find((service) => service.id === event.target.value);
                setForm({
                  ...form,
                  service_id: event.target.value || null,
                  service_name: selectedService?.name ?? null,
                });
              }}
              className="admin-input"
            >
              <option value="">Escolha o serviço desta foto</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-muted-foreground">
              Esse serviço vira o filtro que o cliente vê no site.
            </span>
          </label>
          <label className="block text-sm font-medium">
            Tipo de cabelo
            <select
              value={form.hair_type ?? "Todos os tipos de cabelo"}
              onChange={(event) => setForm({ ...form, hair_type: event.target.value })}
              className="admin-input"
            >
              {hairTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Texto alternativo (acessibilidade / SEO)"
            value={form.alt_text}
            onChange={(value) => setForm({ ...form, alt_text: value })}
            placeholder="Ex: Cachos definidos com mechas iluminadas"
            required
          />
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-semibold">Ajuste da foto na galeria</p>
            <div className="mt-4 space-y-4">
              <label className="block text-xs font-medium text-muted-foreground">
                Zoom: {Number(form.image_zoom ?? 1).toFixed(2)}x
                <input
                  type="range"
                  min="1"
                  max="1.8"
                  step="0.05"
                  value={form.image_zoom ?? 1}
                  onChange={(event) => setForm({ ...form, image_zoom: Number(event.target.value) })}
                  className="mt-2 w-full accent-pink-500"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-muted-foreground">
                  Posição horizontal
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={form.image_position_x ?? 50}
                    onChange={(event) => setForm({ ...form, image_position_x: Number(event.target.value) })}
                    className="mt-2 w-full accent-pink-500"
                  />
                </label>
                <label className="block text-xs font-medium text-muted-foreground">
                  Posição vertical
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={form.image_position_y ?? 50}
                    onChange={(event) => setForm({ ...form, image_position_y: Number(event.target.value) })}
                    className="mt-2 w-full accent-pink-500"
                  />
                </label>
              </div>
            </div>
          </div>
          <Toggle
            label="Exibir foto na galeria do site"
            checked={form.published}
            onChange={(published) => setForm({ ...form, published })}
          />
          <Botao type="submit" disabled={saving || uploading} className="w-full">
            {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar à galeria (como última)"}
          </Botao>
        </form>
      </div>
      {pendingDeleteCategory ? (
        <ConfirmModal
          title="Excluir categoria"
          message={`Deseja excluir a categoria “${pendingDeleteCategory.name}”? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir categoria"
          onConfirm={() => void confirmRemoveCategory()}
          onClose={() => setPendingDeleteCategory(null)}
        />
      ) : null}
      {pendingDeleteItem ? (
        <ConfirmModal
          title="Excluir foto"
          message={`Deseja excluir a foto “${pendingDeleteItem.title}”? Esta ação não pode ser desfeita.`}
          onConfirm={() => void confirmRemoveItem()}
          onClose={() => setPendingDeleteItem(null)}
        />
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  min,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  multiline?: boolean;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className="admin-input resize-y"
        />
      ) : (
        <input
          type={type}
          value={value}
          min={min}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          required={required}
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
    <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-border text-magenta focus:ring-magenta"
      />
      {label}
    </label>
  );
}
