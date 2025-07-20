-- Performance-improving indexes for Theater Script Pro
-- This migration adds indexes to optimize database performance

-- =====================================================
-- 1. FOREIGN KEY INDEXES (Additional to existing ones)
-- =====================================================

-- Reviews table - Add index for reviewer_id (missing FK index)
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);

-- Transactions table - Add indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_transactions_script_id ON public.transactions(script_id);
CREATE INDEX IF NOT EXISTS idx_transactions_license_id ON public.transactions(license_id);

-- =====================================================
-- 2. COMMONLY QUERIED FIELDS
-- =====================================================

-- Profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified) WHERE is_verified = true;
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Scripts table
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON public.scripts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scripts_updated_at ON public.scripts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_scripts_is_featured ON public.scripts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_scripts_view_count ON public.scripts(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_scripts_download_count ON public.scripts(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_scripts_average_rating ON public.scripts(average_rating DESC);

-- Licenses table
CREATE INDEX IF NOT EXISTS idx_licenses_created_at ON public.licenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_licenses_expires_at ON public.licenses(expires_at);

-- Reviews table
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_is_verified_purchase ON public.reviews(is_verified_purchase) WHERE is_verified_purchase = true;

-- Transactions table
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_payment_intent_id ON public.transactions(stripe_payment_intent_id);

-- =====================================================
-- 3. SEARCH FIELDS (Text Search Optimization)
-- =====================================================

-- Scripts table - Title search
CREATE INDEX IF NOT EXISTS idx_scripts_title_trgm ON public.scripts USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_scripts_title_lower ON public.scripts(LOWER(title));

-- Scripts table - Description and synopsis search
CREATE INDEX IF NOT EXISTS idx_scripts_description_trgm ON public.scripts USING gin(description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_scripts_synopsis_trgm ON public.scripts USING gin(synopsis gin_trgm_ops);

-- Scripts table - Full text search
ALTER TABLE public.scripts ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION scripts_search_trigger() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.synopsis, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.genre, '')), 'B');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER scripts_search_update 
    BEFORE INSERT OR UPDATE ON public.scripts
    FOR EACH ROW EXECUTE FUNCTION scripts_search_trigger();

CREATE INDEX IF NOT EXISTS idx_scripts_search_vector ON public.scripts USING gin(search_vector);

-- Update existing rows
UPDATE public.scripts SET search_vector = 
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(synopsis, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(genre, '')), 'B');

-- Scripts table - Array fields
CREATE INDEX IF NOT EXISTS idx_scripts_themes ON public.scripts USING gin(themes);
CREATE INDEX IF NOT EXISTS idx_scripts_awards ON public.scripts USING gin(awards);

-- Scripts table - Numeric range queries
CREATE INDEX IF NOT EXISTS idx_scripts_cast_size_range ON public.scripts(cast_size_min, cast_size_max);
CREATE INDEX IF NOT EXISTS idx_scripts_duration_minutes ON public.scripts(duration_minutes);
CREATE INDEX IF NOT EXISTS idx_scripts_price_range ON public.scripts(standard_price, premium_price, educational_price);

-- Scripts table - Other search fields
CREATE INDEX IF NOT EXISTS idx_scripts_language ON public.scripts(language);
CREATE INDEX IF NOT EXISTS idx_scripts_age_rating ON public.scripts(age_rating);

-- Profiles table - Search fields
CREATE INDEX IF NOT EXISTS idx_profiles_first_name_lower ON public.profiles(LOWER(first_name));
CREATE INDEX IF NOT EXISTS idx_profiles_last_name_lower ON public.profiles(LOWER(last_name));
CREATE INDEX IF NOT EXISTS idx_profiles_company_name_lower ON public.profiles(LOWER(company_name)) WHERE company_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_specialties ON public.profiles USING gin(specialties);

-- =====================================================
-- 4. COMPOSITE INDEXES FOR COMPLEX QUERIES
-- =====================================================

-- Scripts listing page (published scripts ordered by creation date)
CREATE INDEX IF NOT EXISTS idx_scripts_status_created_at ON public.scripts(status, created_at DESC) 
    WHERE status = 'published';

-- Featured scripts query
CREATE INDEX IF NOT EXISTS idx_scripts_featured_status_created ON public.scripts(is_featured, status, created_at DESC) 
    WHERE is_featured = true AND status = 'published';

-- Popular scripts query
CREATE INDEX IF NOT EXISTS idx_scripts_status_rating_downloads ON public.scripts(status, average_rating DESC, download_count DESC) 
    WHERE status = 'published';

-- Genre-based browsing
CREATE INDEX IF NOT EXISTS idx_scripts_genre_status_created ON public.scripts(genre, status, created_at DESC) 
    WHERE status = 'published';

-- Playwright's scripts listing
CREATE INDEX IF NOT EXISTS idx_scripts_playwright_status_created ON public.scripts(playwright_id, status, created_at DESC);

-- License management queries
CREATE INDEX IF NOT EXISTS idx_licenses_licensee_status_created ON public.licenses(licensee_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_licenses_script_status_expires ON public.licenses(script_id, status, expires_at);

-- Active licenses for a script
CREATE INDEX IF NOT EXISTS idx_licenses_script_active ON public.licenses(script_id, status) 
    WHERE status = 'active';

-- User's transaction history
CREATE INDEX IF NOT EXISTS idx_transactions_user_status_created ON public.transactions(user_id, status, created_at DESC);

-- Reviews for script display
CREATE INDEX IF NOT EXISTS idx_reviews_script_created ON public.reviews(script_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_script_rating_created ON public.reviews(script_id, rating DESC, created_at DESC);

-- Theater company profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role_verified_created ON public.profiles(role, is_verified, created_at DESC) 
    WHERE role = 'theater_company';

-- Educational institutions
CREATE INDEX IF NOT EXISTS idx_profiles_educational_verified ON public.profiles(is_educational, is_verified) 
    WHERE is_educational = true AND is_verified = true;

-- =====================================================
-- 5. PARTIAL INDEXES FOR SPECIFIC QUERIES
-- =====================================================

-- Active premium licenses
CREATE INDEX IF NOT EXISTS idx_licenses_premium_active ON public.licenses(script_id, licensee_id) 
    WHERE license_type = 'premium' AND status = 'active';

-- Completed transactions
CREATE INDEX IF NOT EXISTS idx_transactions_completed ON public.transactions(user_id, created_at DESC) 
    WHERE status = 'completed';

-- Scripts with reviews
CREATE INDEX IF NOT EXISTS idx_scripts_reviewed ON public.scripts(id, average_rating DESC) 
    WHERE total_reviews > 0;

-- =====================================================
-- 6. ENABLE REQUIRED EXTENSIONS
-- =====================================================

-- Enable trigram extension for similarity searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =====================================================
-- 7. ANALYZE TABLES FOR QUERY PLANNER
-- =====================================================

-- Update table statistics for query planner optimization
ANALYZE public.profiles;
ANALYZE public.scripts;
ANALYZE public.licenses;
ANALYZE public.reviews;
ANALYZE public.transactions;