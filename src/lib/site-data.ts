import { useQuery } from "@tanstack/react-query";

import { getSupabaseClient, supabaseConfigurado } from "./supabase";

export type SiteSettingsData = {
  salon_name: string;
  professional_name: string;
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
  landmark: string | null;
  business_hours_text: string | null;
};

export type SiteImageData = {
  id: string;
  image_key: "hero" | "about" | "products";
  image_url: string;
  alt_text: string;
  storage_path: string | null;
};

export type ServiceData = {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  image_url: string | null;
  storage_path: string | null;
  cta_label: string;
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
      const [settings, images, services, categories, portfolio, testimonials] = await Promise.all([
        supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
        supabase.from("site_images").select("*").order("image_key"),
        supabase.from("services").select("*").eq("published", true).order("sort_order"),
        supabase.from("portfolio_categories").select("*").eq("active", true).order("sort_order"),
        supabase.from("portfolio_items").select("*").eq("published", true).order("sort_order"),
        supabase
          .from("testimonials")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false }),
      ]);

      return {
        settings: settings.data as SiteSettingsData | null,
        images: (images.data ?? []) as SiteImageData[],
        services: (services.data ?? []) as ServiceData[],
        categories: (categories.data ?? []) as CategoryData[],
        portfolio: (portfolio.data ?? []) as PortfolioData[],
        testimonials: (testimonials.data ?? []) as TestimonialData[],
      };
    },
  });
}
