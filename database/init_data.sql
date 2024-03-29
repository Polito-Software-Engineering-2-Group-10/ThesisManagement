--degree
insert into public.degree(cod_degree, title_degree)
values
    ('L-01', 'Cultural Heritage'),
    ('L-02', 'Biotechnology'),
    ('L-03', 'Visual Arts, Music, Performing Arts, and Fashion'),
    ('L-04', 'Industrial Design'),
    ('L-05', 'Philosophy'),
    ('L-06', 'Geography'),
    ('L-07', 'Civil and Environmental Engineering'),
    ('L-08', 'Computer Engineering'),
    ('L-09', 'Industrial Engineering'),
    ('L-10', 'Letters'),
    ('L-11', 'Modern Languages and Cultures'),
    ('L-12', 'Language Mediation'),
    ('L-13', 'Biological Sciences'),
    ('L-14', 'Legal Services Sciences'),
    ('L-15', 'Tourism Sciences'),
    ('L-16', 'Administration and Organization Sciences'),
    ('L-17', 'Architectural Sciences'),
    ('L-18', 'Economics and Business Management Sciences'),
    ('L-19', 'Education and Training Sciences'),
    ('L-20', 'Communication Sciences'),
    ('L-21', 'Territorial, Urban, Landscape, and Environmental Planning'),
    ('L-22', 'Motor and Sports Activities Sciences'),
    ('L-23', 'Construction Sciences and Techniques'),
    ('L-24', 'Psychological Sciences and Techniques'),
    ('L-25', 'Agricultural and Forestry Sciences and Technologies'),
    ('L-26', 'Agri-Food Sciences and Technologies'),
    ('L-27', 'Chemical Sciences and Technologies'),
    ('L-28', 'Navigation Sciences and Technologies'),
    ('L-29', 'Pharmaceutical Sciences and Technologies'),
    ('L-30', 'Physical Sciences and Technologies'),
    ('L-31', 'Computer Science and Technologies'),
    ('L-32', 'Environmental and Nature Sciences and Technologies'),
    ('L-33', 'Economic Sciences'),
    ('L-34', 'Geological Sciences'),
    ('L-35', 'Mathematical Sciences'),
    ('L-36', 'Political Sciences and International Relations'),
    ('L-37', 'Social Sciences for Cooperation, Development, and Peace'),
    ('L-38', 'Zootechnical Sciences and Animal Production Technologies'),
    ('L-39', 'Social Work'),
    ('L-40', 'Sociology'),
    ('L-41', 'Statistics'),
    ('L-42', 'History'),
    ('L-43', 'Technologies for Cultural Heritage Conservation and Restoration'),

    ('LM-01', 'Master Degree in Cultural Anthropology and Ethnology'),
    ('LM-02', 'Master Degree in Archaeology'),
    ('LM-03', 'Master Degree in Landscape Architecture'),
    ('LM-04', 'Master Degree in Architectural and Building Engineering-Architecture'),
    ('LM-05', 'Master Degree in Archival Studies and Library Science'),
    ('LM-06', 'Master Degree in Biology'),
    ('LM-07', 'Master Degree in Agricultural Biotechnology'),
    ('LM-08', 'Master Degree in Industrial Biotechnology'),
    ('LM-09', 'Master Degree in Medical, Veterinary, and Pharmaceutical Biotechnology'),
    ('LM-10', 'Master Degree in Conservation of Architectural and Environmental Heritage'),
    ('LM-11', 'Master Degree in Conservation and Restoration of Cultural Heritage'),
    ('LM-12', 'Master Degree in Design'),
    ('LM-13', 'Master Degree in Pharmacy and Industrial Pharmacy'),
    ('LM-14', 'Master Degree in Modern Philology'),
    ('LM-15', 'Master Degree in Philology, Literature, and Ancient History'),
    ('LM-16', 'Master Degree in Finance'),
    ('LM-17', 'Master Degree in Physics'),
    ('LM-18', 'Master Degree in Computer Science'),
    ('LM-19', 'Master Degree in Information and Editorial Systems'),
    ('LM-20', 'Master Degree in Aerospace and Astronautical Engineering'),
    ('LM-21', 'Master Degree in Biomedical Engineering'),
    ('LM-22', 'Master Degree in Chemical Engineering'),
    ('LM-23', 'Master Degree in Civil Engineering'),
    ('LM-24', 'Master Degree in Building Systems Engineering'),
    ('LM-25', 'Master Degree in Automation Engineering'),
    ('LM-26', 'Master Degree in Safety Engineering'),
    ('LM-27', 'Master Degree in Telecommunications Engineering'),
    ('LM-28', 'Master Degree in Electrical Engineering'),
    ('LM-29', 'Master Degree in Electronic Engineering'),
    ('LM-30', 'Master Degree in Energy and Nuclear Engineering'),
    ('LM-31', 'Master Degree in Management Engineering'),
    ('LM-32', 'Master Degree in Computer Engineering');

--department
insert into public.department(cod_department, nick_name, full_name)
VALUES
    (1,  'DAD',    'Dipartimento di Architettura e Design'),
    (2,  'DAUIN',  'Dipartimento di Automatica e Informatica'),
    (3,  'DET',    'Dipartimento di Elettronica e Telecomunicazioni'),
    (4,  'DIATI',  'Dipartimento di Ingegneria dell''Ambiente, del territorio e delle Infrastrutture'),
    (5,  'DIGEP',  'Dipartimento di Ingegneria Gestionale e della Produzione'),
    (6,  'DIMEAS', 'Dipartimento di Ingegneria Meccanica e Aerospaziale'),
    (7,  'DISEG',  'Dipartimento di Ingegneria Strutturale, Edile, e Geotecnica'),
    (8,  'DISMA',  'Dipartimento di Scienze Matematiche "G. L. Lagrange"'),
    (9,  'DENERG', 'Dipartimento Energia'),
    (10, 'DIST',   'Dipartimento Interateneo di Scienze, progetto e politiche del Territorio'),
    (11, 'DISAT',  'Dipartimento Scienza Applicata e Tecnologia');

-- group
INSERT INTO public.group (cod_group, cod_department, name)
VALUES
(1, 1, 'Group 1 - DAD'),
(2, 1, 'Group 2 - DAD'),
(3, 2, 'Group 1 - DAUIN'),
(4, 2, 'Group 2 - DAUIN'),
(5, 3, 'Group 1 - DET'),
(6, 3, 'Group 2 - DET'),
(7, 4, 'Group 1 - DIATI'),
(8, 4, 'Group 2 - DIATI'),
(9, 5, 'Group 1 - DIMEAS'),
(10, 5, 'Group 2 - DIMEAS'),
(11, 11, 'Group 1 - DISAT');

-- degree-department bridge
INSERT INTO public.degree_department_bridge (cod_degree, cod_department)
VALUES
('L-01', 7),
('L-02', 2),
('L-03', 1),
('L-04', 1),
('L-05', 10),
('L-06', 7),
('L-07', 4),
('L-08', 2),
('L-09', 5),
('L-10', 10),
('L-11', 10),
('L-12', 10),
('L-13', 7),
('L-14', 10),
('L-15', 5),
('L-16', 5),
('L-17', 1),
('L-18', 5),
('L-19', 10),
('L-20', 3),
('L-21', 4),
('L-22', 6),
('L-23', 7),
('L-24', 2),
('L-25', 7),
('L-26', 7),
('L-27', 11),
('L-28', 6),
('L-29', 11),
('L-30', 11),
('L-31', 2),
('L-32', 4),
('L-33', 5),
('L-34', 7),
('L-35', 8),
('L-36', 10),
('L-37', 11),
('L-38', 11),
('L-39', 9),
('L-40', 10),
('L-41', 5),
('L-42', 10),
('L-43', 7),

('LM-01', 10),
('LM-02', 10),
('LM-03', 1),
('LM-04', 1),
('LM-05', 11),
('LM-06', 11),
('LM-07', 4),
('LM-08', 2),
('LM-09', 11),
('LM-10', 1),
('LM-11', 1),
('LM-12', 1),
('LM-13', 11),
('LM-14', 10),
('LM-15', 10),
('LM-16', 5),
('LM-17', 11),
('LM-18', 2),
('LM-19', 2),
('LM-20', 6),
('LM-21', 2),
('LM-22', 11),
('LM-23', 4),
('LM-24', 5),
('LM-25', 2),
('LM-26', 7),
('LM-27', 3),
('LM-28', 3),
('LM-29', 3),
('LM-30', 3),
('LM-31', 9),
('LM-32', 11);
-- prcedure to notify professors about expiring thesis proposals
CREATE PROCEDURE public.notify_professors_about_expiring_thesis_proposals()
LANGUAGE plpgsql
AS $$
DECLARE
current_clock timestamp with time zone := now();
future_clock timestamp with time zone;
thesis_entry record;
expiring_thesis_ids text := '';
BEGIN
    IF EXISTS(SELECT FROM public.virtual_clock) THEN
        SELECT virtual_time INTO current_clock FROM public.virtual_clock;
    END IF;
    future_clock := current_clock + INTERVAL '7 days';
    FOR thesis_entry IN
        UPDATE public.thesis_proposal SET professor_notified = true
        WHERE expiration > current_clock AND expiration < future_clock AND archived = 0 AND professor_notified = false
        RETURNING id
    LOOP
        expiring_thesis_ids := expiring_thesis_ids || thesis_entry.id || ',';
    END LOOP;
    PERFORM pg_notify('notify_professors', expiring_thesis_ids);
END
$$;

-- procedure to archive thesis proposals
CREATE PROCEDURE public.archive_thesis_proposals()
LANGUAGE plpgsql
AS $$
DECLARE
current_clock timestamp with time zone := now();
updated_app_ids text := '';
updated_app record;
BEGIN
    IF EXISTS(SELECT FROM public.virtual_clock) THEN
        SELECT virtual_time INTO current_clock FROM public.virtual_clock;
    END IF;
    -- after archiving the expired thesis proposals, we need to reject all applications
    FOR updated_app IN
        UPDATE public.application SET status = false 
        WHERE status IS NULL AND public.application.proposal_id IN (
            SELECT id FROM public.thesis_proposal
            WHERE expiration < current_clock AND archived = 0
        )
        RETURNING id
    LOOP
        updated_app_ids := updated_app_ids || updated_app.id || ',';
    END LOOP;
    
    UPDATE public.thesis_proposal
    SET archived = 1
    WHERE expiration < current_clock AND archived = 0;
    
    PERFORM pg_notify('application_status', updated_app_ids);

    UPDATE public.thesis_proposal
    SET archived = 0
    WHERE expiration > current_clock AND archived = 1;
END
$$;

CREATE FUNCTION public.virtual_clock_update_func()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    CALL public.archive_thesis_proposals();
    UPDATE public.thesis_proposal SET professor_notified = false WHERE archived = 0;
    CALL public.notify_professors_about_expiring_thesis_proposals();
    RETURN NULL;
END;
$$;


CREATE TRIGGER virtual_clock_update_trigger
AFTER UPDATE OF "virtual_time" ON public.virtual_clock
FOR EACH ROW WHEN (OLD IS DISTINCT FROM NEW)
EXECUTE FUNCTION public.virtual_clock_update_func();

CREATE TRIGGER virtual_clock_insert_delete_trigger
AFTER INSERT OR DELETE ON public.virtual_clock
FOR EACH ROW
EXECUTE FUNCTION public.virtual_clock_update_func();

-- cron job to archive thesis proposals
SELECT cron.schedule('Auto-archive thesis proposals', '*/1 * * * *', 'CALL public.archive_thesis_proposals()');

-- cron job to notify professors about expiring thesis proposals
-- CURRENTLY RUNS EVERY MINUTE FOR TESTING PURPOSES
SELECT cron.schedule('Notify professors about expiring thesis proposals', '*/1 * * * *', 'CALL public.notify_professors_about_expiring_thesis_proposals()');