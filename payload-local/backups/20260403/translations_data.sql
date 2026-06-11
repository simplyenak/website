--
-- PostgreSQL database dump
--

\restrict gz5XY7yHnoasgJBfno0UCMhMLaf4jxQkudBBkKBT1mUesO9TQJmefLm25ZbqPe4

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

ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_travel_type_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_tours_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_testimonials_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_stories_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_specialty_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_parent_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_media_coverage_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_location_landing_pages_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_legal_pages_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_home_page_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_faqs_fk;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_dietary_landing_pages_fk;
DROP INDEX IF EXISTS public.translations_updated_at_idx;
DROP INDEX IF EXISTS public.translations_rels_travel_type_landing_pages_id_idx;
DROP INDEX IF EXISTS public.translations_rels_tours_id_idx;
DROP INDEX IF EXISTS public.translations_rels_testimonials_id_idx;
DROP INDEX IF EXISTS public.translations_rels_stories_id_idx;
DROP INDEX IF EXISTS public.translations_rels_specialty_landing_pages_id_idx;
DROP INDEX IF EXISTS public.translations_rels_path_idx;
DROP INDEX IF EXISTS public.translations_rels_parent_idx;
DROP INDEX IF EXISTS public.translations_rels_order_idx;
DROP INDEX IF EXISTS public.translations_rels_media_coverage_id_idx;
DROP INDEX IF EXISTS public.translations_rels_location_landing_pages_id_idx;
DROP INDEX IF EXISTS public.translations_rels_legal_pages_id_idx;
DROP INDEX IF EXISTS public.translations_rels_home_page_id_idx;
DROP INDEX IF EXISTS public.translations_rels_faqs_id_idx;
DROP INDEX IF EXISTS public.translations_rels_dietary_landing_pages_id_idx;
DROP INDEX IF EXISTS public.translations_created_at_idx;
ALTER TABLE IF EXISTS ONLY public.translations_rels DROP CONSTRAINT IF EXISTS translations_rels_pkey;
ALTER TABLE IF EXISTS ONLY public.translations DROP CONSTRAINT IF EXISTS translations_pkey;
ALTER TABLE IF EXISTS public.translations_rels ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.translations ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.translations_rels_id_seq;
DROP TABLE IF EXISTS public.translations_rels;
DROP SEQUENCE IF EXISTS public.translations_id_seq;
DROP TABLE IF EXISTS public.translations;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: translations; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.translations (
    id integer NOT NULL,
    label character varying NOT NULL,
    locale public.enum_translations_locale NOT NULL,
    collection public.enum_translations_collection NOT NULL,
    status public.enum_translations_status DEFAULT 'draft'::public.enum_translations_status,
    translator character varying,
    translated_at timestamp(3) with time zone,
    fields_name character varying,
    fields_tagline character varying,
    fields_short_description character varying,
    fields_full_description character varying,
    fields_content character varying,
    fields_excerpt character varying,
    fields_question character varying,
    fields_answer character varying,
    fields_review_text character varying,
    fields_review_title character varying,
    fields_hero_title character varying,
    fields_hero_subtitle character varying,
    fields_hero_description character varying,
    seo_meta_title character varying,
    seo_meta_description character varying,
    notes character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.translations OWNER TO directus;

--
-- Name: translations_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.translations_id_seq OWNER TO directus;

--
-- Name: translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.translations_id_seq OWNED BY public.translations.id;


--
-- Name: translations_rels; Type: TABLE; Schema: public; Owner: directus
--

CREATE TABLE public.translations_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    tours_id integer,
    stories_id integer,
    testimonials_id integer,
    faqs_id integer,
    media_coverage_id integer,
    dietary_landing_pages_id integer,
    specialty_landing_pages_id integer,
    travel_type_landing_pages_id integer,
    location_landing_pages_id integer,
    home_page_id integer,
    legal_pages_id integer
);


ALTER TABLE public.translations_rels OWNER TO directus;

--
-- Name: translations_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: directus
--

CREATE SEQUENCE public.translations_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.translations_rels_id_seq OWNER TO directus;

--
-- Name: translations_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: directus
--

ALTER SEQUENCE public.translations_rels_id_seq OWNED BY public.translations_rels.id;


--
-- Name: translations id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations ALTER COLUMN id SET DEFAULT nextval('public.translations_id_seq'::regclass);


--
-- Name: translations_rels id; Type: DEFAULT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels ALTER COLUMN id SET DEFAULT nextval('public.translations_rels_id_seq'::regclass);


--
-- Data for Name: translations; Type: TABLE DATA; Schema: public; Owner: directus
--

INSERT INTO public.translations VALUES (32, 'Home Page - DE', 'de', 'home_page', 'published', NULL, NULL, 'Malaysias Kultur und Erbe', 'Geh mit einem Einheimischen. Schmecke echte Geschichten. Erlebe die Seite Malaysias, die die meisten Besucher nie erreichen.', 'Unsere Walking-Food-Touren sind im Erbe verwurzelt und mit Herz geführt.', 'Wir glauben, dass man eine Geschichte nicht ohne die Menschen, das Essen und den Ort erzählen kann. Vierzehn Jahre später lernen wir immer noch alle drei kennen.', 'Wir glauben, dass man eine Geschichte nicht ohne die Menschen, das Essen und den Ort erzählen kann. Vierzehn Jahre später lernen wir immer noch alle drei kennen.', NULL, NULL, NULL, NULL, NULL, 'Malaysias Kultur und Erbe', 'Geh mit einem Einheimischen. Schmecke echte Geschichten. Erlebe die Seite Malaysias, die die meisten Besucher nie erreichen.', 'Unsere Walking-Food-Touren sind im Erbe verwurzelt und mit Herz geführt.', 'Simply Enak | Deine Nachbarschaftsfreunde in Malaysia', 'Komm als Gast, geh als Familie. Iss mit Einheimischen bei Malaysian Food Tours in KL, Penang und Ipoh.', NULL, '2026-04-03 11:50:49.033+08', '2026-04-03 11:50:49.033+08');
INSERT INTO public.translations VALUES (33, 'Home Page - EN', 'en', 'home_page', 'published', NULL, NULL, 'Food Tours that Reveal the', 'Walk with a local. Taste real stories. See the Malaysia most tourists miss.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Food Tours that Reveal the', 'Walk with a local. Taste real stories. See the Malaysia most tourists miss.', NULL, 'Simply Enak | Your Neighborhood Friends in Malaysia', NULL, NULL, '2026-04-03 11:50:49.033+08', '2026-04-03 11:50:49.033+08');
INSERT INTO public.translations VALUES (34, 'Home Page - ES', 'es', 'home_page', 'published', NULL, NULL, 'La cultura y el patrimonio de Malasia', 'Camina con un local. Prueba historias reales. Descubre el lado de Malasia que la mayoría de visitantes nunca alcanza.', 'Nuestros tours gastronómicos a pie están arraigados en el patrimonio y guiados con el corazón.', 'Creemos que no puedes contar una historia sin las personas, la comida y el lugar. Catorce años después, seguimos aprendiendo los tres.', 'Creemos que no puedes contar una historia sin las personas, la comida y el lugar. Catorce años después, seguimos aprendiendo los tres.', NULL, NULL, NULL, NULL, NULL, 'La cultura y el patrimonio de Malasia', 'Camina con un local. Prueba historias reales. Descubre el lado de Malasia que la mayoría de visitantes nunca alcanza.', 'Nuestros tours gastronómicos a pie están arraigados en el patrimonio y guiados con el corazón.', 'Simply Enak | Tus amigos del barrio en Malasia', 'Ven como invitado, sal como familia. Únete a locales para tours gastronómicos malayos en KL, Penang e Ipoh.', NULL, '2026-04-03 11:50:49.033+08', '2026-04-03 11:50:49.033+08');
INSERT INTO public.translations VALUES (35, 'Home Page - FR', 'fr', 'home_page', 'published', NULL, NULL, 'La culture et le patrimoine de la Malaisie', 'Marchez avec un local. Goûtez de vraies histoires. Découvrez la Malaisie que la plupart des visiteurs ne voient jamais.', 'Nos visites gastronomiques à pied sont enracinées dans le patrimoine et guidées avec cœur.', 'Nous croyons qu''on ne peut pas raconter une histoire sans les gens, la nourriture et le lieu. Quatorze ans plus tard, nous apprenons encore ces trois éléments.', 'Nous croyons qu''on ne peut pas raconter une histoire sans les gens, la nourriture et le lieu. Quatorze ans plus tard, nous apprenons encore ces trois éléments.', NULL, NULL, NULL, NULL, NULL, 'La culture et le patrimoine de la Malaisie', 'Marchez avec un local. Goûtez de vraies histoires. Découvrez la Malaisie que la plupart des visiteurs ne voient jamais.', 'Nos visites gastronomiques à pied sont enracinées dans le patrimoine et guidées avec cœur.', 'Simply Enak | Vos amis de quartier en Malaisie', 'Venez en invité, repartez en famille. Rejoignez les locaux pour des visites gastronomiques en Malaisie à KL, Penang et Ipoh.', NULL, '2026-04-03 11:50:49.033+08', '2026-04-03 11:50:49.033+08');
INSERT INTO public.translations VALUES (36, 'Home Page - JA', 'ja', 'home_page', 'published', NULL, NULL, 'マレーシアの文化と遺産', 'ローカルと一緒に歩いて、本物の物語を味わおう。ほとんどの観光客が決して辿り着けないマレーシアの側面を。', '私たちのウォーキングフードツアーは、遺産に根ざし、心を込めてガイドします。', '私たちは、物語を語るには人々と食物、そして場所の三つが必要だと信じています。14 年間、私たちはこの三つを学び続けています。', '私たちは、物語を語るには人々と食物、そして場所の三つが必要だと信じています。14 年間、私たちはこの三つを学び続けています。', NULL, NULL, NULL, NULL, NULL, 'マレーシアの文化と遺産', 'ローカルと一緒に歩いて、本物の物語を味わおう。ほとんどの観光客が決して辿り着けないマレーシアの側面を。', '私たちのウォーキングフードツアーは、遺産に根ざし、心を込めてガイドします。', 'Simply Enak | マレーシアの地域の友達', '客人として来て、家族として去る。KL、ペナン、イポでローカルと一緒にマレーシアのフードツアーを楽しもう。', NULL, '2026-04-03 11:50:49.033+08', '2026-04-03 11:50:49.033+08');
INSERT INTO public.translations VALUES (37, 'Home Page - MS', 'ms', 'home_page', 'published', NULL, NULL, 'Budaya dan Warisan Malaysia', 'Berjalan dengan penduduk tempatan. Rasai cerita sebenar. Lihat sisi Malaysia yang kebanyakan pelawat tidak pernah capai.', 'Tour makanan berjalan kami berakar dalam warisan dan dipandu dengan hati.', 'Kami percaya anda tidak boleh menceritakan kisah tanpa manusia, makanan, dan tempatnya. Empat belas tahun berlalu, kami masih mempelajari ketiga-tiganya.', 'Kami percaya anda tidak boleh menceritakan kisah tanpa manusia, makanan, dan tempatnya. Empat belas tahun berlalu, kami masih mempelajari ketiga-tiganya.', NULL, NULL, NULL, NULL, NULL, 'Budaya dan Warisan Malaysia', 'Berjalan dengan penduduk tempatan. Rasai cerita sebenar. Lihat sisi Malaysia yang kebanyakan pelawat tidak pernah capai.', 'Tour makanan berjalan kami berakar dalam warisan dan dipandu dengan hati.', 'Simply Enak | Rakan Kejiranan Anda di Malaysia', 'Datang sebagai tetamu, pergi sebagai keluarga. Sertai penduduk tempatan untuk tour makanan Malaysia di KL, Penang, dan Ipoh.', NULL, '2026-04-03 11:50:49.033+08', '2026-04-03 11:50:49.033+08');
INSERT INTO public.translations VALUES (38, 'Home Page - NL', 'nl', 'home_page', 'published', NULL, NULL, 'Maleisië''s Cultuur en Erfgoed', 'Loop met een local. Proef echte verhalen. Ervaar de kant van Maleisië die de meeste bezoekers nooit zien.', 'Onze wandel-voedseltours zijn geworteld in erfgoed en worden met hart begeleid.', 'Wij geloven dat je geen verhaal kunt vertellen zonder de mensen, het eten en de plek. Veertien jaar later leren we nog steeds alle drie.', 'Wij geloven dat je geen verhaal kunt vertellen zonder de mensen, het eten en de plek. Veertien jaar later leren we nog steeds alle drie.', NULL, NULL, NULL, NULL, NULL, 'Maleisië''s Cultuur en Erfgoed', 'Loop met een local. Proef echte verhalen. Ervaar de kant van Maleisië die de meeste bezoekers nooit zien.', 'Onze wandel-voedseltours zijn geworteld in erfgoed en worden met hart begeleid.', 'Simply Enak | Jouw Buurtvrienden in Maleisië', 'Kom als gast, vertrek als familie. Sluit je aan bij locals voor Maleisische voedseltours in KL, Penang en Ipoh.', NULL, '2026-04-03 11:50:49.033+08', '2026-04-03 11:50:49.033+08');
INSERT INTO public.translations VALUES (39, 'Home Page - PT', 'pt', 'home_page', 'published', NULL, NULL, 'Cultura e Património da Malásia', 'Caminha com um local. Saboreia histórias reais. Descobre o lado da Malásia que a maioria dos visitantes nunca alcança.', 'Os nossos passeios gastronómicos a pé têm raízes no património e são guiados com coração.', 'Acreditamos que não se pode contar uma história sem as pessoas, a comida e o lugar. Há catorze anos, continuamos a aprender os três.', 'Acreditamos que não se pode contar uma história sem as pessoas, a comida e o lugar. Há catorze anos, continuamos a aprender os três.', NULL, NULL, NULL, NULL, NULL, 'Cultura e Património da Malásia', 'Caminha com um local. Saboreia histórias reais. Descobre o lado da Malásia que a maioria dos visitantes nunca alcança.', 'Os nossos passeios gastronómicos a pé têm raízes no património e são guiados com coração.', 'Simply Enak | Os Teus Amigos de Bairro na Malásia', 'Vem como convidado, sai como família. Junta-te aos locais para passeios gastronómicos malaios em KL, Penang e Ipoh.', NULL, '2026-04-03 11:50:49.033+08', '2026-04-03 11:50:49.033+08');
INSERT INTO public.translations VALUES (40, 'Home Page - RU', 'ru', 'home_page', 'published', NULL, NULL, 'Культура и наследие Малайзии', 'Гуляйте с местным. Пробуйте настоящие истории. Увидьте ту сторону Малайзии, которую большинство туристов никогда не увидит.', 'Наши пешеходные гастрономические туры укоренены в наследии и проводятся с душой.', 'Мы верим, что нельзя рассказать историю без людей, еды и места. Четырнадцать лет спустя мы всё ещё изучаем все три составляющие.', 'Мы верим, что нельзя рассказать историю без людей, еды и места. Четырнадцать лет спустя мы всё ещё изучаем все три составляющие.', NULL, NULL, NULL, NULL, NULL, 'Культура и наследие Малайзии', 'Гуляйте с местным. Пробуйте настоящие истории. Увидьте ту сторону Малайзии, которую большинство туристов никогда не увидит.', 'Наши пешеходные гастрономические туры укоренены в наследии и проводятся с душой.', 'Simply Enak | Ваши районные друзья в Малайзии', 'Приходите гостем, уходите семьёй. Присоединяйтесь к местным для малайзийских гастрономических туров в KL, Penang и Ipoh.', NULL, '2026-04-03 11:50:49.033+08', '2026-04-03 11:50:49.033+08');
INSERT INTO public.translations VALUES (41, 'Home Page - ZH', 'zh', 'home_page', 'published', NULL, NULL, '马来西亚的文化遗产', '与本地人一起漫步。品味真实的故事。看见大多数游客从未触及的马来西亚。', '我们的步行美食导览根植于传统，用心引领。', '我们相信，没有人、食物和地方，就无法讲述故事。十四年过去了，我们仍在学习这三者。', '我们相信，没有人、食物和地方，就无法讲述故事。十四年过去了，我们仍在学习这三者。', NULL, NULL, NULL, NULL, NULL, '马来西亚的文化遗产', '与本地人一起漫步。品味真实的故事。看见大多数游客从未触及的马来西亚。', '我们的步行美食导览根植于传统，用心引领。', 'Simply Enak | 你在马来西亚的邻居朋友', '以客人的身份来，以家人的身份离开。与本地人一起参加 KL、Penang 和 Ipoh 的马来西亚美食导览。', NULL, '2026-04-03 11:50:49.033+08', '2026-04-03 11:50:49.033+08');


--
-- Data for Name: translations_rels; Type: TABLE DATA; Schema: public; Owner: directus
--

INSERT INTO public.translations_rels VALUES (22, NULL, 32, 'parent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL);
INSERT INTO public.translations_rels VALUES (23, NULL, 33, 'parent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL);
INSERT INTO public.translations_rels VALUES (24, NULL, 34, 'parent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL);
INSERT INTO public.translations_rels VALUES (25, NULL, 35, 'parent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL);
INSERT INTO public.translations_rels VALUES (26, NULL, 36, 'parent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL);
INSERT INTO public.translations_rels VALUES (27, NULL, 37, 'parent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL);
INSERT INTO public.translations_rels VALUES (28, NULL, 38, 'parent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL);
INSERT INTO public.translations_rels VALUES (29, NULL, 39, 'parent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL);
INSERT INTO public.translations_rels VALUES (30, NULL, 40, 'parent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL);
INSERT INTO public.translations_rels VALUES (31, NULL, 41, 'parent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL);


--
-- Name: translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.translations_id_seq', 41, true);


--
-- Name: translations_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: directus
--

SELECT pg_catalog.setval('public.translations_rels_id_seq', 31, true);


--
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- Name: translations_rels translations_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_pkey PRIMARY KEY (id);


--
-- Name: translations_created_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_created_at_idx ON public.translations USING btree (created_at);


--
-- Name: translations_rels_dietary_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_dietary_landing_pages_id_idx ON public.translations_rels USING btree (dietary_landing_pages_id);


--
-- Name: translations_rels_faqs_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_faqs_id_idx ON public.translations_rels USING btree (faqs_id);


--
-- Name: translations_rels_home_page_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_home_page_id_idx ON public.translations_rels USING btree (home_page_id);


--
-- Name: translations_rels_legal_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_legal_pages_id_idx ON public.translations_rels USING btree (legal_pages_id);


--
-- Name: translations_rels_location_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_location_landing_pages_id_idx ON public.translations_rels USING btree (location_landing_pages_id);


--
-- Name: translations_rels_media_coverage_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_media_coverage_id_idx ON public.translations_rels USING btree (media_coverage_id);


--
-- Name: translations_rels_order_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_order_idx ON public.translations_rels USING btree ("order");


--
-- Name: translations_rels_parent_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_parent_idx ON public.translations_rels USING btree (parent_id);


--
-- Name: translations_rels_path_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_path_idx ON public.translations_rels USING btree (path);


--
-- Name: translations_rels_specialty_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_specialty_landing_pages_id_idx ON public.translations_rels USING btree (specialty_landing_pages_id);


--
-- Name: translations_rels_stories_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_stories_id_idx ON public.translations_rels USING btree (stories_id);


--
-- Name: translations_rels_testimonials_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_testimonials_id_idx ON public.translations_rels USING btree (testimonials_id);


--
-- Name: translations_rels_tours_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_tours_id_idx ON public.translations_rels USING btree (tours_id);


--
-- Name: translations_rels_travel_type_landing_pages_id_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_rels_travel_type_landing_pages_id_idx ON public.translations_rels USING btree (travel_type_landing_pages_id);


--
-- Name: translations_updated_at_idx; Type: INDEX; Schema: public; Owner: directus
--

CREATE INDEX translations_updated_at_idx ON public.translations USING btree (updated_at);


--
-- Name: translations_rels translations_rels_dietary_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_dietary_landing_pages_fk FOREIGN KEY (dietary_landing_pages_id) REFERENCES public.dietary_landing_pages(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_faqs_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_faqs_fk FOREIGN KEY (faqs_id) REFERENCES public.faqs(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_home_page_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_home_page_fk FOREIGN KEY (home_page_id) REFERENCES public.home_page(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_legal_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_legal_pages_fk FOREIGN KEY (legal_pages_id) REFERENCES public.legal_pages(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_location_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_location_landing_pages_fk FOREIGN KEY (location_landing_pages_id) REFERENCES public.location_landing_pages(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_media_coverage_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_media_coverage_fk FOREIGN KEY (media_coverage_id) REFERENCES public.media_coverage(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.translations(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_specialty_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_specialty_landing_pages_fk FOREIGN KEY (specialty_landing_pages_id) REFERENCES public.specialty_landing_pages(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_stories_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_stories_fk FOREIGN KEY (stories_id) REFERENCES public.stories(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_testimonials_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_testimonials_fk FOREIGN KEY (testimonials_id) REFERENCES public.testimonials(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_tours_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_tours_fk FOREIGN KEY (tours_id) REFERENCES public.tours(id) ON DELETE CASCADE;


--
-- Name: translations_rels translations_rels_travel_type_landing_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: directus
--

ALTER TABLE ONLY public.translations_rels
    ADD CONSTRAINT translations_rels_travel_type_landing_pages_fk FOREIGN KEY (travel_type_landing_pages_id) REFERENCES public.travel_type_landing_pages(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict gz5XY7yHnoasgJBfno0UCMhMLaf4jxQkudBBkKBT1mUesO9TQJmefLm25ZbqPe4

