import type {
  AuthService,
  MediaStorage,
  ProductRepository,
} from "@/application/contracts";
import { StaticAuthService } from "@/infrastructure/staticAuthService";
import { StaticMediaStorage } from "@/infrastructure/staticMediaStorage";
import { StaticProductRepository } from "@/infrastructure/staticProductRepository";
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from "@/infrastructure/supabase/client";
import { SupabaseAuthService } from "@/infrastructure/supabase/authService";
import { SupabaseMediaStorage } from "@/infrastructure/supabase/mediaStorage";
import { SupabaseProductRepository } from "@/infrastructure/supabase/productRepository";

const dataProvider = import.meta.env.VITE_DATA_PROVIDER ?? "auto";
const shouldUseSupabase =
  dataProvider === "supabase" || (dataProvider === "auto" && isSupabaseConfigured);

const supabaseClient = shouldUseSupabase ? getSupabaseClient() : null;

export const mediaStorage: MediaStorage = supabaseClient
  ? new SupabaseMediaStorage(supabaseClient)
  : new StaticMediaStorage();

export const productRepository: ProductRepository = supabaseClient
  ? new SupabaseProductRepository(supabaseClient, mediaStorage)
  : new StaticProductRepository();

export const authService: AuthService = supabaseClient
  ? new SupabaseAuthService(supabaseClient)
  : new StaticAuthService();

export const runtimeBackend = shouldUseSupabase ? "supabase" : "static";
