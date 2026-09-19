import { useQuery } from "@tanstack/react-query";

import { getSupabaseClient, supabaseConfigurado } from "./supabase";

export type SiteSettingsData = {
  id?: string | number;
  salon_name: string;
  professional_name: string;
  logo_url?: string | null;
  whatsapp: string;
  instagram: string;
  address: string;
  headline: string;
  description: string | null;
  hero_eyebrow: string;
  hero_description: string;
  services_title: string;
  services_description: string;
  services_card_style?: "photo" | "compact" | null;
  portfolio_title: string;
  portfolio_description: string;
  about_title: string;
  about_text: string;
  francielly_headline?: string | null;
  francielly_bio?: string | null;
  francielly_mission?: string | null;
  francielly_eyebrow?: string | null;
  francielly_methodology_eyebrow?: string | null;
  francielly_method_1_title?: string | null;
  francielly_method_1_description?: string | null;
  francielly_method_2_title?: string | null;
  francielly_method_2_description?: string | null;
  francielly_method_3_title?: string | null;
  francielly_method_3_description?: string | null;
  francielly_space_eyebrow?: string | null;
  francielly_cta_label?: string | null;
  francielly_space_cta_label?: string | null;
  francielly_photo_label?: string | null;
  francielly_extra_1_eyebrow?: string | null;
  francielly_extra_1_title?: string | null;
  francielly_extra_1_subtitle?: string | null;
  francielly_extra_2_eyebrow?: string | null;
  francielly_extra_2_title?: string | null;
  francielly_extra_2_subtitle?: string | null;
  francielly_extra_3_eyebrow?: string | null;
  francielly_extra_3_title?: string | null;
  francielly_extra_3_subtitle?: string | null;
  space_title?: string;
  space_description?: string;
  landmark: string | null;
  business_hours_text: string | null;
};

export type SiteImageData = {
  id: string;
  image_key: string;
  image_url: string;
  alt_text: string;
  storage_path: string | null;
  created_at?: string;
};

export type SpacePhotoData = {
  id: string;
  title: string;
  image_url: string;
  storage_path: string | null;
  alt_text: string;
  display_mode?: "contain" | "cover" | null;
  focus_x?: number | null;
  focus_y?: number | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
};

export type ProfessionalData = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string | null;
  storage_path: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  sort_order: number;
  active: boolean;
};

export type ServiceData = {
  id: string;
  name: string;
  description: string;
  price_text: string;
  featured?: boolean | null;
  benefits?: string[] | null;
  image_url?: string | null;
  storage_path?: string | null;
  cta_label?: string | null;
  sort_order: number;
  published: boolean;
};

export type ProductData = {
  id: string;
  name: string;
  subtitle: string;
  hair_type: string;
  description: string;
  benefits: string[];
  category?: string | null;
  product_options?: ProductOptionData[] | null;
  price_text?: string | null;
  promotional_price_text?: string | null;
  image_url: string | null;
  storage_path: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type ProductOptionData = {
  id: string;
  name: string;
  size?: string;
  price_text: string;
  stock?: number | null;
  image_url?: string | null;
  storage_path?: string | null;
  active?: boolean;
};

export type ProductOrderItemData = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_amount: number;
  quantity: number;
  total_amount: number;
  image_url?: string | null;
  created_at?: string;
};

export type ProductOrderData = {
  id: string;
  reference_id: string;
  pagbank_payment_url: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  fulfillment_method?: "pickup" | "motoboy" | "shipping" | "combine" | null;
  delivery_address?: string | null;
  delivery_neighborhood?: string | null;
  delivery_reference?: string | null;
  status:
    | "pending"
    | "paid"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "completed"
    | "cancelled"
    | "refunded"
    | "manual_review";
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at?: string;
  product_order_items?: ProductOrderItemData[];
};

export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  active: boolean;
};

export type PortfolioData = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  category_id: string | null;
  service_id?: string | null;
  service_name?: string | null;
  hair_type?: string | null;
  photo_label?: string | null;
  image_zoom?: number | null;
  image_position_x?: number | null;
  image_position_y?: number | null;
  image_url: string;
  storage_path: string | null;
  alt_text: string;
  sort_order: number;
  published: boolean;
};

export type TestimonialData = {
  id: string;
  client_name: string;
  testimonial: string;
  rating: number | null;
  service_name: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
};

export function usePublicSiteData() {
  return useQuery({
    queryKey: ["public-site-data"],
    enabled: supabaseConfigurado,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const [settings, images, services, categories, portfolio, testimonials, professionals, products, spacePhotos] = await Promise.all([
        supabase.from("site_settings").select("*").limit(1).maybeSingle(),
        supabase.from("site_images").select("*").order("image_key"),
        supabase.from("services").select("*").eq("published", true).order("sort_order"),
        supabase.from("portfolio_categories").select("*").eq("active", true).order("sort_order"),
        supabase.from("portfolio_items").select("*").eq("published", true).order("sort_order"),
        supabase
          .from("testimonials")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false }),
        supabase.from("professionals").select("*").eq("active", true).order("sort_order"),
        supabase.from("products").select("*").eq("published", true).order("sort_order"),
        supabase.from("space_photos").select("*").eq("published", true).order("sort_order"),
      ]);

      const firstError = [settings, images, services, categories, portfolio, testimonials, professionals, products].find(
        (result) => result.error,
      )?.error;

      if (firstError) {
        throw firstError;
      }

      return {
        settings: settings.data as SiteSettingsData | null,
        images: (images.data ?? []) as SiteImageData[],
        services: (services.data ?? []) as ServiceData[],
        categories: (categories.data ?? []) as CategoryData[],
        portfolio: (portfolio.data ?? []) as PortfolioData[],
        testimonials: (testimonials.data ?? []) as TestimonialData[],
        professionals: (professionals.data ?? []) as ProfessionalData[],
        products: (products.data ?? []) as ProductData[],
        spacePhotos: spacePhotos.error ? [] : ((spacePhotos.data ?? []) as SpacePhotoData[]),
      };
    },
  });
}
