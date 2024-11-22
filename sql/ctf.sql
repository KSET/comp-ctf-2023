--
-- PostgreSQL database dump
--

-- Dumped from database version 13.17
-- Dumped by pg_dump version 13.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: TaskDifficulty; Type: TYPE; Schema: public; Owner: comp_ctf_2023
--

CREATE TYPE public."TaskDifficulty" AS ENUM (
    'easy',
    'medium',
    'hard'
);


ALTER TYPE public."TaskDifficulty" OWNER TO comp_ctf_2023;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: comp_ctf_2023
--

CREATE TABLE public.account (
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    refresh_token_expires_in integer,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.account OWNER TO comp_ctf_2023;

--
-- Name: session; Type: TABLE; Schema: public; Owner: comp_ctf_2023
--

CREATE TABLE public.session (
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.session OWNER TO comp_ctf_2023;

--
-- Name: task; Type: TABLE; Schema: public; Owner: comp_ctf_2023
--

CREATE TABLE public.task (
    id integer NOT NULL,
    slug text NOT NULL,
    "flagBase" text NOT NULL,
    "flagUserSpecific" boolean DEFAULT true NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    text text NOT NULL,
    handler text,
    difficulty public."TaskDifficulty" NOT NULL,
    "position" integer NOT NULL,
    hidden boolean DEFAULT false NOT NULL
);


ALTER TABLE public.task OWNER TO comp_ctf_2023;

--
-- Name: taskSolves; Type: TABLE; Schema: public; Owner: comp_ctf_2023
--

CREATE TABLE public."taskSolves" (
    "taskId" integer NOT NULL,
    "userId" text NOT NULL,
    "startedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "finishedAt" timestamp without time zone,
    flag text NOT NULL,
    metadata json DEFAULT '{}'::json NOT NULL
);


ALTER TABLE public."taskSolves" OWNER TO comp_ctf_2023;

--
-- Name: task_id_seq; Type: SEQUENCE; Schema: public; Owner: comp_ctf_2023
--

CREATE SEQUENCE public.task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_id_seq OWNER TO comp_ctf_2023;

--
-- Name: task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: comp_ctf_2023
--

ALTER SEQUENCE public.task_id_seq OWNED BY public.task.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: comp_ctf_2023
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    "emailVerified" timestamp without time zone,
    image text,
    role character varying(50)
);


ALTER TABLE public."user" OWNER TO comp_ctf_2023;

--
-- Name: verificationToken; Type: TABLE; Schema: public; Owner: comp_ctf_2023
--

CREATE TABLE public."verificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp without time zone NOT NULL
);


ALTER TABLE public."verificationToken" OWNER TO comp_ctf_2023;

--
-- Name: task id; Type: DEFAULT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public.task ALTER COLUMN id SET DEFAULT nextval('public.task_id_seq'::regclass);

--
-- Data for Name: task; Type: TABLE DATA; Schema: public; Owner: comp_ctf_2023
--

COPY public.task (id, slug, "flagBase", "flagUserSpecific", title, description, text, handler, difficulty, "position", hidden) FROM stdin;
1	kopija-pasta	owo_je_zastawica_	t	kopija/pašta	Primjer zadatak za Comp CTF.	Ovo je primjer zadatak za Comp CTF.\nSvaki zadatak ima "zastavicu" koju moraš naći i upisati u odgovarajuće polje. Zastavice nisu osjetljiva na velika i mala slova te sadrze iskljucivo slova.\nAko rješenje zadatka nije zastavica, to će biti naznačeno u tekstu zadatka.\n\nRješenje za ovaj zadatak je %%FLAG%%.\n\nZadatci neće uvijek biti ovako lagani, tako da nije sramota rješavati uz kolegu ili pitati na COMP pultu za savjet.\nJedino nemojte dijeliti rješenja s ostalima ili ih postati na razne kanale da ne umanjite zabavu drugima.		easy	1	f
2	kset-kafica	prijatna_kafica	f	KSET kafica	Skeniraj QR kod u KSET-u (i možda ostani na kavici s kolegama)	Skeniraj QR kod u KSET-u (i možda ostani na kavici s kolegama)		easy	2	t
3	jpeg-zip	zip_zap_kompres_	t	jpeg.zip	Kolega je rekao da će mi poslati zip, ali sam dobio samo jpeg...	Kolega je rekao da će mi poslati zip, ali sam dobio samo neki potrgani jpeg. Mozes li mi pomoći?	jpeg-with-zip	medium	3	f
4	igra-skrivaca	inspect_element_vs_view_source_	t	Igra skrivača	Unutar sadržaja ove stranice ugrađena je zastavica - pronađi je.	Unutar sadržaja ove stranice ugrađena je zastavica - pronađi je.	add-flag-to-page-in-link-tag-url	easy	4	f
5	kolektor-kolacica	cookie_clicker_	t	Kolektor kolačića	Bok ja sam cookie s komadićima čokolade. MOOOOLIM te nemoj me pojesti!!!!! UwU	Bok ja sam cookie s komadićima čokolade. MOOOOLIM te nemoj me pojesti!!!!! UwU	add-cookie-with-flag	easy	5	f
6	mozdano-opcenje	up_up_down_down_left_right_left_right_b_a_	t	Moždano općenje	...	%%BRAINFUCK%%	add-%%BRAINFUCK%%-variable-to-text	easy	6	f
7	3310	ne_zaboravite_uzet_mlijeko_kad_budete_se_vracali_doma_	t	3310	Mama je napokon kupila smartphone jučer. Pazi kaj mi je poslala na wapp.	Note: razmak predstavlja pauzu.\nLegenda:\n? je {\n! je }\n- je _\n\n\nMama je napokon kupila smartphone jucer. Pazi kaj mi je poslala na wapp.\n%%TEXT_CODE%%	add-%%TEXT_CODE%%-variable-to-text	medium	7	f
8	htt-postar	get_with_the_post_	t	HTTPoštar	Bok! Ja sam poštar. Pošalji mi ime tvoje omiljene životinje!	Bok! Ja sam poštar, moja adresa je %%ENDPOINT_URL%%. Pošalji mi ime tvoje omiljene životinje.\n\nBitno! U zaglavlju me naslovi s To: KSET i From: %%SESSION_ID%%	http-postar	medium	8	f
9	4-x-16-x-4	hexed_	t	4x16x4	24 znaka, 2 boje, 4 reda, tekst čudaka	24 znaka, 2 boje, 4 reda, tekst čudaka\n\n%%MESSAGE%%	poruka-u-hex-bojama	medium	9	f
10	bazirano-na-istintoj-prici	ne_mora_biti_samo_baza_sestnaest_ili_sezdeset_cetiri_	t	Bazirano na istintoj priči	...	Baze brojeva mogu biti raznolike. Jedan od načina za enkodiranje binarnih podataka je npr. base64...\n\n...ali to je pre mainstream za nas! Mi koristimo samo bazu 36! To je baza koja sadrži brojeve pa sve znakove engleske abecede.\n\nPitam se što se krije iza ovih slova...\n\n%%ENCODED_FLAG%%	ascii-base-36	medium	10	f
\.


--
-- Name: task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: comp_ctf_2023
--

SELECT pg_catalog.setval('public.task_id_seq', 10, true);


--
-- Name: account account_provider_provideraccountid; Type: CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_provider_provideraccountid PRIMARY KEY (provider, "providerAccountId");


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY ("sessionToken");


--
-- Name: task task_pkey; Type: CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_pkey PRIMARY KEY (id);


--
-- Name: task task_position_unique; Type: CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_position_unique UNIQUE ("position");


--
-- Name: task task_slug_unique; Type: CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_slug_unique UNIQUE (slug);


--
-- Name: taskSolves tasksolves_taskid_userid; Type: CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public."taskSolves"
    ADD CONSTRAINT tasksolves_taskid_userid PRIMARY KEY ("taskId", "userId");


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verificationToken verificationtoken_identifier_token; Type: CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public."verificationToken"
    ADD CONSTRAINT verificationtoken_identifier_token PRIMARY KEY (identifier, token);


--
-- Name: position_idx; Type: INDEX; Schema: public; Owner: comp_ctf_2023
--

CREATE INDEX position_idx ON public.task USING btree ("position");


--
-- Name: account account_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: session session_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: taskSolves taskSolves_taskId_task_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public."taskSolves"
    ADD CONSTRAINT "taskSolves_taskId_task_id_fk" FOREIGN KEY ("taskId") REFERENCES public.task(id) ON DELETE CASCADE;


--
-- Name: taskSolves taskSolves_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: comp_ctf_2023
--

ALTER TABLE ONLY public."taskSolves"
    ADD CONSTRAINT "taskSolves_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

