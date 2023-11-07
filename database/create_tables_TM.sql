-- Create tables

-- degree
CREATE TABLE IF NOT EXISTS public.degree
(
    cod_degree text NOT NULL,
    title_degree text NOT NULL,
    CONSTRAINT degree_pk PRIMARY KEY (cod_degree)
);
ALTER TABLE IF EXISTS public.degree OWNER TO thesismanager;

-- department
CREATE TABLE IF NOT EXISTS public.department
(
    cod_department integer NOT NULL,
    nick_name text,
    full_name text NOT NULL,
    CONSTRAINT department_pk PRIMARY KEY (cod_department)
);
ALTER TABLE IF EXISTS public.department OWNER TO thesismanager;

-- group
CREATE TABLE IF NOT EXISTS public.group
(
    cod_group integer NOT NULL,
    cod_department integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT group_pk PRIMARY KEY (cod_group),
    CONSTRAINT group_cod_department_fkey FOREIGN KEY (cod_department)
        REFERENCES public.department (cod_department)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
ALTER TABLE IF EXISTS public.group OWNER TO thesismanager;

-- teacher
CREATE TABLE IF NOT EXISTS public.teacher
(
    id integer NOT NULL,
    surname text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    cod_group integer NOT NULL,
    cod_department integer NOT NULL,
    CONSTRAINT teacher_pk PRIMARY KEY (id),
    CONSTRAINT teacher_cod_group_fkey FOREIGN KEY (cod_group)
        REFERENCES public.group(cod_group)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT teacher_cod_department_fkey FOREIGN KEY (cod_department)
        REFERENCES public.department(cod_department)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
ALTER TABLE IF EXISTS public.teacher OWNER TO thesismanager;

-- thesis_proposal
CREATE TABLE IF NOT EXISTS public.thesis_proposal
(
    id serial NOT NULL,
    title text NOT NULL,
    teacher_id integer NOT NULL,
    supervisor text NOT NULL,
    co_supervisor text[],
    keywords text[] NOT NULL,
    type text NOT NULL,
    groups text[],
    description text NOT NULL,
    required_knowledge text[] NOT NULL,
    notes text,
    expiration date NOT NULL,
    level integer NOT NULL,
    programmes text[],
    CONSTRAINT thesis_proposal_pk PRIMARY KEY (id),
    CONSTRAINT thesis_proposal_teacher_id_fkey FOREIGN KEY (teacher_id)
        REFERENCES public.teacher (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
ALTER TABLE IF EXISTS public.thesis_proposal OWNER TO thesismanager;

-- student
CREATE TABLE IF NOT EXISTS public.student
(
    id integer NOT NULL,
    surname text NOT NULL,
    name text NOT NULL,
    gender text NOT NULL,
    nationality text NOT NULL,
    email text NOT NULL,
    cod_degree text NOT NULL,
    enrollment_year date NOT NULL,
    CONSTRAINT student_pk PRIMARY KEY (id),
    CONSTRAINT student_cod_degree_fkey FOREIGN KEY (cod_degree)
        REFERENCES public.degree (cod_degree)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
ALTER TABLE IF EXISTS public.student OWNER TO thesismanager;

-- career
CREATE TABLE IF NOT EXISTS public.career
(
    id integer NOT NULL,
    cod_course text NOT NULL,
    title_course text NOT NULL,
    CFU integer NOT NULL,
    grade float,
    exam_date date NOT NULL,
    CONSTRAINT career_pk PRIMARY KEY (id, cod_course)
);
ALTER TABLE IF EXISTS public.career OWNER TO thesismanager;

-- application
CREATE TABLE IF NOT EXISTS public.application
(
    id serial NOT NULL,
    student_id integer NOT NULL,
    proposal_id integer NOT NULL,
    apply_date date NOT NULL,
    status boolean,
    CONSTRAINT application_pk PRIMARY KEY (id),
    CONSTRAINT application_student_id_fkey FOREIGN KEY (student_id)
        REFERENCES public.student(id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT application_proposal_id_fkey FOREIGN KEY (proposal_id)
        REFERENCES public.thesis_proposal(id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
ALTER TABLE IF EXISTS public.application OWNER TO thesismanager;
