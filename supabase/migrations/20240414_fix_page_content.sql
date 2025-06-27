-- Drop the page_content table and all its dependencies
DROP TABLE IF EXISTS page_content CASCADE;

-- Drop the update_updated_at_column function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- First, delete existing content
DELETE FROM page_content;

-- Drop and recreate the table to ensure clean state
DROP TABLE IF EXISTS page_content;

CREATE TABLE public.page_content (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    page_id text NOT NULL,
    section_id text NOT NULL,
    title text,
    content text NOT NULL,
    UNIQUE(page_id, section_id)
);

-- Enable RLS
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to page_content" ON page_content;
DROP POLICY IF EXISTS "Allow admins to update page_content" ON page_content;

-- Create policies
CREATE POLICY "Allow public read access to page_content"
    ON public.page_content
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow admins to update page_content"
    ON public.page_content
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_page_content_updated_at
    BEFORE UPDATE ON public.page_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial content
INSERT INTO public.page_content (page_id, section_id, title, content)
VALUES 
    ('about', 'main', 'Om Oss', 
    'Hovden Musikklubb er en ideell organisasjon som ble stiftet i 2023. Vi er dedikert til å skape et levende musikkmiljø i Hovden og omegn.

Vår visjon er å bringe kvalitetsmusikk til fjells, og skape unike musikkopplevelser for både fastboende og besøkende.

Vi arrangerer konserter og musikalske events gjennom hele året, med fokus på variert musikk av høy kvalitet.

Bli medlem i dag og bli en del av vårt musikalske fellesskap!'),
    
    ('membership', 'main', 'Medlemskap',
    'Som medlem i Hovden Musikklubb får du eksklusive fordeler og blir en viktig del av vårt musikalske fellesskap.\n\nMedlemsfordeler:\n- Rabatterte billetter til alle våre arrangementer\n- Førsterett på billetter til utvalgte konserter\n- Eksklusive medlemsarrangementer\n- Mulighet til å påvirke klubbens program og utvikling\n\nMedlemskapet koster kun kr 200,- per år.\n\nMeld deg inn i dag og bli en del av Hovdens mest spennende musikkmiljø!'),

    ('contact', 'main', 'Kontakt Oss',
    'Ta gjerne kontakt med oss om du har spørsmål eller ønsker å bli medlem.'),

    ('events', 'main', 'Arrangementer',
    'Opplev musikk i verdensklasse i hjertet av Hovden.'),

    ('gallery', 'main', 'Galleri',
    'Utforsk høydepunkter fra våre arrangementer og konserter. Her finner du videoer og bilder som fanger den unike stemningen i Hovden Musikklubb.'); 