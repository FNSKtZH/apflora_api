SET @n = 0; 
UPDATE `tpopkontr` SET `TPopKontrId_neu` = @n := @n + 1 ORDER BY `TPopKontrJahr`, `TPopKontrDatum`;

SELECT * FROM `tpopkontr` ORDER BY TPopKontrId_neu

/* zuerst ehmalige ID löschen. Dann neu erstellen, aber ohne Autowert */
/* jetzt die neuen Werte einsetzen */
UPDATE `tpopkontr` SET `TPopKontrId` = `TPopKontrId_neu`;

/* jetzt autowert setzen */