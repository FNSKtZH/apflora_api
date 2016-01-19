Bereitgestellte Beobachtungen löschen:
DELETE FROM beob_bereitgestellt

Beobachtungen von Info Spezies bereitstellen:
INSERT INTO beob_bereitgestellt (NO_NOTE, NO_ISFS, Datum, Autor) SELECT NO_NOTE, NO_ISFS, IF(M_NOTE IS NULL, A_NOTE, IF(J_NOTE IS NULL, CONCAT(A_NOTE, ".", IF(LENGTH(M_NOTE) = 2, M_NOTE, CONCAT("0", M_NOTE))), CONCAT(A_NOTE, ".", IF(LENGTH(M_NOTE) = 2, M_NOTE, CONCAT("0", M_NOTE)), ".", IF(LENGTH(J_NOTE) = 2, J_NOTE, CONCAT("0", J_NOTE))))), IF(PRENOM_PERSONNE_OBS IS NULL, NOM_PERSONNE_OBS, CONCAT(PRENOM_PERSONNE_OBS, " ", NOM_PERSONNE_OBS)) FROM beob_infospezies WHERE ZH_GUID IS NULL;

Dabei wurden ersetzt:
M_NOTE mit: IF(LENGTH(M_NOTE) = 2, M_NOTE, CONCAT("0", M_NOTE))
J_NOTE mit: IF(LENGTH(J_NOTE) = 2, J_NOTE, CONCAT("0", J_NOTE))

Beobachtungen von EvAB bereitstellen:
INSERT INTO beob_bereitgestellt (NO_NOTE_PROJET, NO_ISFS, Datum, Autor) SELECT NO_NOTE_PROJET, NO_ISFS, IF(M_NOTE IS NULL, A_NOTE, IF(J_NOTE IS NULL, CONCAT(A_NOTE, ".", IF(M_NOTE>0, IF(LENGTH(M_NOTE) = 2, M_NOTE, CONCAT("0", M_NOTE)), NULL)), CONCAT(A_NOTE, ".", IF(M_NOTE>0, IF(LENGTH(M_NOTE) = 2, M_NOTE, CONCAT("0", M_NOTE)), NULL), ".", IF(J_NOTE>0, IF(LENGTH(J_NOTE) = 2, J_NOTE, CONCAT("0", J_NOTE)), NULL)))), IF(PRENOM_PERSONNE_OBS IS NULL, NOM_PERSONNE_OBS, CONCAT(PRENOM_PERSONNE_OBS, " ", NOM_PERSONNE_OBS)) FROM beob_evab;

Dabei wurden ersetzt:
M_NOTE mit: IF(M_NOTE>0, IF(LENGTH(M_NOTE) = 2, M_NOTE, CONCAT("0", M_NOTE)), NULL)
J_NOTE mit: IF(J_NOTE>0, IF(LENGTH(J_NOTE) = 2, J_NOTE, CONCAT("0", J_NOTE)), NULL)
weil die Felder statt Nullwerten eine 0 enthalten!

Beispielsabfrage:
SELECT Datum, Autor FROM beob_bereitgestellt WHERE NO_ISFS=100 ORDER BY Datum