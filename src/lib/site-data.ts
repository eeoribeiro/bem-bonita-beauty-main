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
  price_text?: string | null;
  image_url: string | null;
  storage_path: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
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
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const [settings, images, services, categories, portfolio, testimonials, professionals, products] = await Promise.all([
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
      };
    },
  });
}
