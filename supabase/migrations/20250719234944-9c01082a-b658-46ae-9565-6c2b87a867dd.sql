-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE public.user_role AS ENUM ('playwright', 'theater_company', 'admin');
CREATE TYPE public.script_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.license_type AS ENUM ('standard', 'premium', 'educational');
CREATE TYPE public.license_status AS ENUM ('active', 'expired', 'cancelled');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'playwright',
    is_verified BOOLEAN DEFAULT FALSE,
    bio TEXT,
    website TEXT,
    location JSONB DEFAULT '{}',
    social_media JSONB DEFAULT '{}',
    specialties TEXT[] DEFAULT '{}',
    awards TEXT[] DEFAULT '{}',
    company_name TEXT,
    year_founded INTEGER,
    venue_capacity INTEGER,
    is_educational BOOLEAN DEFAULT FALSE,
    permissions TEXT[] DEFAULT '{}',
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create scripts table
CREATE TABLE public.scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playwright_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    synopsis TEXT,
    genre TEXT NOT NULL,
    cast_size_min INTEGER DEFAULT 1,
    cast_size_max INTEGER DEFAULT 50,
    duration_minutes INTEGER,
    language TEXT DEFAULT 'English',
    age_rating TEXT,
    themes TEXT[] DEFAULT '{}',
    technical_requirements JSONB DEFAULT '{}',
    awards TEXT[] DEFAULT '{}',
    premiere_date DATE,
    premiere_venue TEXT,
    file_url TEXT,
    perusal_url TEXT,
    cover_image_url TEXT,
    sample_pages_url TEXT,
    standard_price DECIMAL(10,2) DEFAULT 0,
    premium_price DECIMAL(10,2) DEFAULT 0,
    educational_price DECIMAL(10,2) DEFAULT 0,
    status script_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create licenses table
CREATE TABLE public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID REFERENCES public.scripts(id) ON DELETE CASCADE NOT NULL,
    licensee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    license_type license_type NOT NULL,
    status license_status DEFAULT 'active',
    purchase_price DECIMAL(10,2) NOT NULL,
    performance_dates JSONB DEFAULT '[]',
    venue_name TEXT,
    venue_capacity INTEGER,
    special_terms TEXT,
    signed_contract_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID REFERENCES public.scripts(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(script_id, reviewer_id)
);

-- Create transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    script_id UUID REFERENCES public.scripts(id) ON DELETE CASCADE,
    license_id UUID REFERENCES public.licenses(id) ON DELETE SET NULL,
    stripe_payment_intent_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status transaction_status DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('scripts', 'scripts', false),
    ('covers', 'covers', true),
    ('samples', 'samples', true),
    ('avatars', 'avatars', true),
    ('contracts', 'contracts', false);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = user_uuid AND role = 'admin'
    );
$$;

-- RLS Policies for profiles table
CREATE POLICY "Users can view all public profiles" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles" 
    ON public.profiles FOR ALL 
    USING (public.is_admin(auth.uid()));

-- RLS Policies for scripts table
CREATE POLICY "Anyone can view published scripts" 
    ON public.scripts FOR SELECT 
    USING (status = 'published' OR playwright_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
    ) OR public.is_admin(auth.uid()));

CREATE POLICY "Playwrights can manage their own scripts" 
    ON public.scripts FOR ALL 
    USING (playwright_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage all scripts" 
    ON public.scripts FOR ALL 
    USING (public.is_admin(auth.uid()));

-- RLS Policies for licenses table
CREATE POLICY "Users can view their own licenses" 
    ON public.licenses FOR SELECT 
    USING (licensee_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
    ) OR script_id IN (
        SELECT id FROM public.scripts s 
        JOIN public.profiles p ON s.playwright_id = p.id 
        WHERE p.user_id = auth.uid()
    ) OR public.is_admin(auth.uid()));

CREATE POLICY "Theater companies can create licenses" 
    ON public.licenses FOR INSERT 
    WITH CHECK (licensee_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
    ));

CREATE POLICY "License parties can update licenses" 
    ON public.licenses FOR UPDATE 
    USING (licensee_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
    ) OR script_id IN (
        SELECT id FROM public.scripts s 
        JOIN public.profiles p ON s.playwright_id = p.id 
        WHERE p.user_id = auth.uid()
    ));

-- RLS Policies for reviews table
CREATE POLICY "Anyone can view published reviews" 
    ON public.reviews FOR SELECT 
    USING (script_id IN (
        SELECT id FROM public.scripts WHERE status = 'published'
    ));

CREATE POLICY "Users can manage their own reviews" 
    ON public.reviews FOR ALL 
    USING (reviewer_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage all reviews" 
    ON public.reviews FOR ALL 
    USING (public.is_admin(auth.uid()));

-- RLS Policies for transactions table
CREATE POLICY "Users can view their own transactions" 
    ON public.transactions FOR SELECT 
    USING (user_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
    ) OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create their own transactions" 
    ON public.transactions FOR INSERT 
    WITH CHECK (user_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
    ));

-- Storage RLS Policies
CREATE POLICY "Scripts: Users can view their own and purchased scripts" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'scripts' AND (
        auth.uid()::text = (storage.foldername(name))[1] OR
        EXISTS (
            SELECT 1 FROM public.licenses l
            JOIN public.profiles p ON l.licensee_id = p.id
            WHERE p.user_id = auth.uid() AND l.status = 'active'
            AND name LIKE '%' || l.script_id::text || '%'
        )
    ));

CREATE POLICY "Scripts: Playwrights can upload their scripts" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'scripts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Covers: Public read access" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'covers');

CREATE POLICY "Covers: Playwrights can upload covers" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Samples: Public read access" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'samples');

CREATE POLICY "Samples: Playwrights can upload samples" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'samples' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatars: Public read access" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'avatars');

CREATE POLICY "Avatars: Users can upload their own avatar" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Contracts: Users can view their own contracts" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'contracts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Contracts: Users can upload contracts" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'contracts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER scripts_updated_at BEFORE UPDATE ON public.scripts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER licenses_updated_at BEFORE UPDATE ON public.licenses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'playwright')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_scripts_playwright_id ON public.scripts(playwright_id);
CREATE INDEX idx_scripts_status ON public.scripts(status);
CREATE INDEX idx_scripts_genre ON public.scripts(genre);
CREATE INDEX idx_licenses_script_id ON public.licenses(script_id);
CREATE INDEX idx_licenses_licensee_id ON public.licenses(licensee_id);
CREATE INDEX idx_licenses_status ON public.licenses(status);
CREATE INDEX idx_reviews_script_id ON public.reviews(script_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);