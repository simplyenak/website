--
-- PostgreSQL database dump
--

\restrict 6vVrD2z7fBxWiUejW48ah659x7EXyknDO2S1bBNhfKnglHU0UXG7NqoT99RTNt6

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public._home_page_v DROP CONSTRAINT IF EXISTS _home_page_v_parent_fkey;
DROP INDEX IF EXISTS public._home_page_v_parent_idx;
DROP INDEX IF EXISTS public._home_page_v_latest_idx;
ALTER TABLE IF EXISTS ONLY public.home_page DROP CONSTRAINT IF EXISTS home_page_pkey;
ALTER TABLE IF EXISTS ONLY public._home_page_v DROP CONSTRAINT IF EXISTS _home_page_v_pkey;
ALTER TABLE IF EXISTS public.home_page ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._home_page_v ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.home_page_id_seq;
DROP TABLE IF EXISTS public.home_page;
DROP SEQUENCE IF EXISTS public._home_page_v_id_seq;
DROP TABLE IF EXISTS public._home_page_v;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _home_page_v; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public._home_page_v (
    id integer NOT NULL,
    parent_id integer,
    version jsonb NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now(),
    updated_at timestamp(3) with time zone DEFAULT now(),
    latest boolean DEFAULT false,
    autosave boolean DEFAULT false,
    _status character varying(50) DEFAULT 'draft'::character varying
);


ALTER TABLE public._home_page_v OWNER TO directus;

--
-- Name: _home_page_v_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public._home_page_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._home_page_v_id_seq OWNER TO directus;

--
-- Name: _home_page_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public._home_page_v_id_seq OWNED BY public._home_page_v.id;


--
-- Name: home_page; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.home_page (
    id integer NOT NULL,
    hero_title text,
    hero_highlight text,
    hero_title_end text,
    hero_subtitle text,
    hero_description text,
    hero_price_info text,
    hero_vendors text,
    hero_since text,
    hero_rated text,
    hero_max_per_tour text,
    hero_low_waste text,
    hero_guides text,
    hero_stalls text,
    hero_values text,
    hero_guests_hosted text,
    hero_cities text,
    hero_bg_image text,
    manifesto_eyebrow text,
    manifesto_headline text,
    manifesto_tagline text,
    manifesto_body text,
    manifesto_attribution_role text,
    pillars_intro text,
    pillar_people_label text,
    pillar_people_heading text,
    pillar_people_body text,
    pillar_food_label text,
    pillar_food_heading text,
    pillar_food_body text,
    pillar_place_label text,
    pillar_place_heading text,
    pillar_place_body text,
    vendors_eyebrow text,
    vendors_title text,
    vendors_subtitle text,
    vendors_meet_on_tour text,
    vendors_footer text,
    vendors_read_stories text,
    segment_heading text,
    segment_subheading text,
    segment_view_all text,
    about_eyebrow text,
    about_title text,
    about_subtitle text,
    about_description text,
    about_heritage text,
    about_image text,
    expect_title text,
    expect_subtitle text,
    expect_stat1_number text,
    expect_stat1_heading text,
    expect_stat1_body text,
    expect_stat2_number text,
    expect_stat2_heading text,
    expect_stat2_body text,
    expect_stat3_number text,
    expect_stat3_heading text,
    expect_stat3_body text,
    expect_stat4_number text,
    expect_stat4_heading text,
    expect_stat4_body text,
    cta_eyebrow text,
    cta_title text,
    cta_subtitle text,
    cta_free_cancellation text,
    cta_reply_time text,
    cta_max_people text,
    cta_book_experience text,
    cta_chat_whatsapp text,
    faqs jsonb,
    meta_title text,
    meta_description text,
    created_at timestamp(3) with time zone DEFAULT now(),
    updated_at timestamp(3) with time zone DEFAULT now(),
    _status character varying(50) DEFAULT 'draft'::character varying,
    _locales jsonb,
    _latestversion integer,
    _autosave boolean DEFAULT false
);


ALTER TABLE public.home_page OWNER TO directus;

--
-- Name: home_page_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.home_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_page_id_seq OWNER TO directus;

--
-- Name: home_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.home_page_id_seq OWNED BY public.home_page.id;


--
-- Name: _home_page_v id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._home_page_v ALTER COLUMN id SET DEFAULT nextval('public._home_page_v_id_seq'::regclass);


--
-- Name: home_page id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page ALTER COLUMN id SET DEFAULT nextval('public.home_page_id_seq'::regclass);


--
-- Data for Name: _home_page_v; Type: TABLE DATA; Schema: public; Owner: directus
--



--
-- Data for Name: home_page; Type: TABLE DATA; Schema: public; Owner: directus
--

INSERT INTO public.home_page VALUES (6, 'Malaysia''s Culture and Heritage', 'As Only Locals Know It', '', 'Walk with a local. Taste real stories. See the side of Malaysia most visitors never reach.', 'Our walking food tours are rooted in heritage and guided with heart.', 'From RM 285 - 4-5 hours - Max 9 people', '40+ Heritage Vendors', 'Since 2011', '4.9-Star Rated', 'Max 9 Per Tour', 'Low-Waste Tours', 'Licensed Local Guides', 'Family-Run Stalls', 'Slow Travel Values', '5,000+ Guests Hosted', '3 Cities, 1 Passion', NULL, 'Our Belief', 'In Malaysia, food is how stories get told.', 'The best ones stay with you.', 'We believe you cannot tell a story without the people, the food, and the place. Fourteen years in, we are still learning all three.', 'Co-founder, Simply Enak', 'Everything we do comes back to three things.', 'The People', 'Behind every dish is someone who has spent a lifetime perfecting it.', 'We introduce you to them: the hawkers, the families, the vendors who have fed their neighbourhoods for generations.', 'The Food', 'Malaysian food is one of the most layered cuisines in the world.', 'Chinese, Malay, Indian, Peranakan - each culture cooking side by side for 200 years. Every dish has a history. We help you taste it.', 'The Place', 'The stalls, the markets, the narrow lanes, the kampung that refused to be demolished.', 'Malaysias food culture lives in specific places. Many of them are disappearing. Coming here is how they survive.', 'The people', 'Meet the Vendors', 'The people who make Malaysian food culture what it is', NULL, NULL, NULL, 'There is a tour for your kind of curious', 'Tell us what matters - we will show you the right one.', 'View all tours', NULL, NULL, NULL, NULL, NULL, NULL, 'What to Expect on Tour', 'How our food tours actually work', '9', 'People, maximum.', 'You are never lost in a crowd. Everyone can ask questions, wander, and actually connect.', '40+', 'Heritage vendors, all real.', 'Every stop is a vendor we have eaten with for years. No commissions. No tourist traps.', '0', 'Commission from vendors.', 'We do not take money from the people we visit. Their food speaks for itself.', '14', 'Years in the same neighbourhoods.', 'We know who opened, who closed, and who has been cooking the same recipe since 1978.', 'Ready when you are', 'Let us Eat Together', 'Join us for your next Malaysian adventure. Small groups, real neighborhoods, unforgettable stories.', 'Free cancellation up to 24 hours', 'We reply within 3 hours', 'Max 8 people per tour', 'Book Your Experience', 'Chat on WhatsApp', NULL, 'Simply Enak | Your Neighborhood Friends in Malaysia', 'Come as a guest, leave as family. Join locals for Malaysian food tours in KL, Penang, and Ipoh.', '2026-04-03 11:49:42.704+08', '2026-04-03 11:49:42.704+08', 'draft', NULL, NULL, false);


--
-- Name: _home_page_v_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public._home_page_v_id_seq', 1, false);


--
-- Name: home_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.home_page_id_seq', 6, true);


--
-- Name: _home_page_v _home_page_v_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._home_page_v
    ADD CONSTRAINT _home_page_v_pkey PRIMARY KEY (id);


--
-- Name: home_page home_page_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.home_page
    ADD CONSTRAINT home_page_pkey PRIMARY KEY (id);


--
-- Name: _home_page_v_latest_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _home_page_v_latest_idx ON public._home_page_v USING btree (latest);


--
-- Name: _home_page_v_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX _home_page_v_parent_idx ON public._home_page_v USING btree (parent_id);


--
-- Name: _home_page_v _home_page_v_parent_fkey; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public._home_page_v
    ADD CONSTRAINT _home_page_v_parent_fkey FOREIGN KEY (parent_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 6vVrD2z7fBxWiUejW48ah659x7EXyknDO2S1bBNhfKnglHU0UXG7NqoT99RTNt6

