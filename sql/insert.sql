INSERT INTO events (id, name, slug, description) VALUES (1, 'Forritarahittingur í febrúar', 'forritarahittingur-i-februar', 'Forritarar hittast í febrúar og forrita saman eitthvað frábært.');
INSERT INTO events (id, name, slug, description) VALUES (2, 'Hönnuðahittingur í mars', 'honnudahittingur-i-mars', 'Spennandi hittingur hönnuða í Hönnunarmars.');
INSERT INTO events (id, name, slug, description) VALUES (3, 'Verkefnastjórahittingur í apríl', 'verkefnastjorahittingur-i-april', 'Virkilega vel verkefnastýrður hittingur.');

INSERT INTO users (name, username, password, admin) VALUES ('Jón Jónsson', 'admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', TRUE);
INSERT INTO users (name, username, password, admin) VALUES ('Forvitinn forritari', 'forritari', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii',FALSE);
INSERT INTO users (name, username, password, admin) VALUES ('Guðrún Guðrúnar', 'gunna', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii',FALSE);


INSERT INTO registrations (userid, comment, event) VALUES (1, 'Hlakka til að forrita með ykkur', 1);
INSERT INTO registrations (userid, comment, event) VALUES (2, null, 1);
INSERT INTO registrations (userid, comment, event) VALUES (3, 'verður vefforritað?', 1);

