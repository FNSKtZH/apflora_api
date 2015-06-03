/*
 * in tpopkontr gab es ca. 800 Datensätze ohne GUID
 * daher müssen sie nachgereicht werden
 * die übrigen Aktualisierungen sind nicht nötig, da keine GUIS fehlen
 */
UPDATE tpopkontr
SET ZeitGuid = UUID()
WHERE ZeitGuid IS NULL;

UPDATE tpopkontr
SET TPopKontrGuid = UUID()
WHERE TPopKontrGuid IS NULL;

UPDATE tpopmassn
SET TPopMassnGuid = UUID()
WHERE TPopMassnGuid IS NULL;

UPDATE tpop
SET TPopGuid = UUID()
WHERE TPopGuid IS NULL;

UPDATE pop
SET PopGuid = UUID()
WHERE PopGuid IS NULL;

UPDATE ap
SET ApGuid = UUID();