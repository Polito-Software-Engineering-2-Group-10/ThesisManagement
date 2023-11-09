
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
(10, 5, 'Group 2 - DIMEAS');


-- teacher
insert into public.teacher(id, surname, name, email, cod_group, cod_department) 
values
(1, 'Lettieri', 'Giovanni', 'g.lettieri@polito.it', 1, 1),
(2, 'Bianchi', 'Luca', 'luca.bianchi@polito.it', 2, 1),
(3, 'Rossi', 'Alessia', 'alessia.rossi@polito.it', 3, 2),
(4, 'Ferrari', 'Michele', 'michele.ferrari@polito.it', 4, 2),
(5, 'Ricci', 'Laura', 'laura.ricci@polito.it', 5, 3),
(6, 'Marini', 'Giorgio', 'giorgio.marini@polito.it', 6, 3),
(7, 'Esposito', 'Maria', 'maria.esposito@polito.it', 6, 3),
(8, 'Conti', 'Roberto', 'roberto.conti@polito.it', 1, 1),
(9, 'Galli', 'Francesca', 'francesca.galli@polito.it', 1, 1),
(10, 'Lombardi', 'Paolo', 'paolo.lombardi@polito.it', 10, 5),
(11, 'Verdi', 'Paolo', 'paolo.verdi@polito.it', 9, 5);


-- student
-- Inserimento di dati utente fittizi italiani nella tabella student con email "studenti.polito.it"
INSERT INTO public.student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year)
VALUES
(1, 'Rossi',    'Mario',    'M', 'Italian', 'mario.rossi@studenti.polito.it', 'L-08', '2022-09-10'),
(2, 'Bianchi',  'Laura',    'F', 'Italian', 'laura.bianchi@studenti.polito.it', 'L-08', '2022-09-19'),
(3, 'Verdi',    'Luigi',    'M', 'Italian', 'luigi.verdi@studenti.polito.it', 'LM-32', '2021-09-23'),
(4, 'Ferrari',  'Maria',    'F', 'Italian', 'maria.ferrari@studenti.polito.it', 'LM-31', '2021-10-01'),
(5, 'Russo',    'Giuseppe', 'M', 'Italian', 'giuseppe.russo@studenti.polito.it', 'L-09', '2020-11-18'),
(6, 'Smith',    'John',     'M', 'British', 'john.smith@studenti.polito.it', 'LM-32', '2022-11-10'),
(7, 'Müller',   'Anna',     'F', 'German',  'anna.muller@studenti.polito.it', 'LM-32', '2020-11-24'),
(8, 'López',    'Carlos',   'M', 'Spanish', 'carlos.lopez@studenti.polito.it', 'LM-20', '2021-03-14'),
(9, 'Dupont',   'Marie',    'F', 'French',  'marie.dupont@studenti.polito.it', 'LM-22', '2023-03-10'),
(10, 'García',  'Andrés',   'M', 'Spanish', 'andres.garcia@studenti.polito.it', 'LM-23', '2023-01-25');



-- career
insert into public.career(id, cod_course, title_course, CFU, grade, "date")
values 
(1, '01SQNOV',  'Software Engineering II', 6, 30, '2023-02-25'),
(1, '01PDWOV',  'Information systems',6, 28, '2023-06-11'),
(1, '01PFPOV',  'Mobile application development', 6, 29, '2023-07-05'),
(1, '02JEUOV',  'Formal languages and compilers', 6, 30, '2022-01-30'),
(1, '02JSKOV',  'Human Computer Interaction', 6, 30, '2022-02-04'),
(2, '01PDWOV',  'Information systems', 6, 27, '2023-09-18'),
(3, '01PDWOV',  'Information systems', 6, 22, '2023-02-10'),
(3, '01OTWOV',  'Computer network technologies and services', 6, 20, '2021-09-01'),
(3, '02JEUOV', 'Formal languages and compilers', 6, 30, '2020-01-20'),
(2, '01OTWOV', 'Computer network technologies and services', 6, 20, '2023-07-01'),
(4, '01OTWOV', 'Computer network technologies and services', 6, 20, '2023-01-21'),
(5, '01OTWOV', 'Computer network technologies and services', 6, 20, '2023-06-07'),
(5, '01PFPOV', 'Mobile application development', 6, 29, '2023-07-15'),
(5, '01SQNOV', 'Software Engineering II', 6, 27, '2023-01-15'),
(5, '01PDWOV', 'Information systems', 6, 26, '2023-01-20'),
(6, '02JEUOV', 'Formal languages and compilers', 6, 28, '2023-01-25'),
(7, '01PFPOV', 'Mobile application development', 6, 29, '2023-01-30'),
(7, '02JSKOV', 'Human Computer Interaction', 6, 30, '2023-01-31'),
(9, '01OTWOV', 'Computer network technologies and services', 6, 25, '2023-01-28'),
(9, '01SQNOV', 'Software Engineering II', 6, 28, '2023-02-10');


-- thesis_proposal
INSERT INTO public.thesis_proposal (title, teacher_id, supervisor, co_supervisor, keywords, type, groups, description, required_knowledge, notes, expiration, level, programmes)
VALUES
('Machine Learning in Image Processing', 1, 'Dr. Smith', ARRAY['Dr. Johnson'], ARRAY['Machine Learning', 'Image Processing'], 'Master Thesis', ARRAY['Computer Vision', 'Artificial Intelligence'], 'Explore the applications of machine learning in image processing to improve image recognition.', ARRAY['Machine Learning', 'Computer Vision'], 'Please contact for more details.', '2023-12-31', 1, ARRAY['Computer Science']),
('Cybersecurity in Internet of Things', 2, 'Prof. Brown', ARRAY['Dr. White'], ARRAY['Cybersecurity', 'IoT'], 'Bachelor Thesis', ARRAY['Network Security'], 'Investigate security challenges in IoT devices and propose solutions to enhance cybersecurity in IoT.', ARRAY['Cybersecurity', 'Network Protocols'], 'This topic requires strong understanding of network security.', '2023-10-15', 2, ARRAY['Computer Engineering']),
('Natural Language Processing for Chatbots', 3, 'Prof. Green', ARRAY['Dr. Lee'], ARRAY['NLP', 'Chatbots'], 'Bachelor Thesis', ARRAY['Natural Language Processing', 'Artificial Intelligence'], 'Develop a chatbot with advanced natural language processing capabilities for customer service.', ARRAY['NLP', 'Machine Learning'], 'Basic knowledge of NLP is required.', '2023-09-30', 2, ARRAY['Computer Science']),
('Big Data Analytics in Cloud Computing', 4, 'Dr. Robinson', ARRAY['Prof. Wilson'], ARRAY['Big Data', 'Cloud Computing'], 'Master Thesis', ARRAY['Distributed Systems', 'Data Science'], 'Explore big data analytics techniques in cloud environments for scalable data processing.', ARRAY['Big Data', 'Distributed Systems'], 'Strong programming skills are required.', '2023-11-30', 1, ARRAY['Information Technology']),
('Blockchain Technology for Secure Transactions', 5, 'Prof. Turner', ARRAY['Dr. Hall'], ARRAY['Blockchain', 'Security'], 'Bachelor Thesis', ARRAY['Blockchain', 'Cryptography'], 'Investigate the use of blockchain for secure financial transactions and develop a proof of concept.', ARRAY['Blockchain Technology', 'Cryptography'], 'This project requires understanding of blockchain fundamentals.', '2023-10-30', 2, ARRAY['Computer Engineering']);


-- application
INSERT INTO public.application (id, student_id, proposal_id, apply_date, status)
VALUES
(1, 1, 1, '2023-11-05', null),
(2, 2, 1, '2023-10-13', true),
(3, 3, 3, '2023-07-10', false),
(4, 6, 4, '2023-11-09', null),
(5, 7, 2, '2023-10-01', true),
(6, 3, 2, '2023-06-09', false);
