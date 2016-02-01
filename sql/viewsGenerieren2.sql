/*
 * diese Views hängen von anderen ab, die in viewsGenerieren.sql erstellt werden
 * daher muss diese Date NACH viewsGenerieren.sql ausgeführt werden
 */

CREATE OR REPLACE VIEW v_ap_massnjahre AS
SELECT
  apflora.ap.ApArtId,
  apflora_views.v_massn_jahre.TPopMassnJahr 
FROM
  apflora.ap,
  apflora_views.v_massn_jahre 
WHERE
  apflora.ap.ApArtId > 0
  AND apflora.ap.ApStatus < 4
ORDER BY
  apflora.ap.ApArtId,
  apflora_views.v_massn_jahre.TPopMassnJahr;

CREATE OR REPLACE VIEW v_ap_anzmassnprojahr AS 
SELECT
  apflora_views.v_ap_massnjahre.ApArtId,
  apflora_views.v_ap_massnjahre.TPopMassnJahr,
  IF(
    apflora_views.v_ap_anzmassnprojahr0.AnzahlvonTPopMassnId IS NOT NULL,
    apflora_views.v_ap_anzmassnprojahr0.AnzahlvonTPopMassnId,
    0
  ) AS "AnzahlMassnahmen" 
FROM
  apflora_views.v_ap_massnjahre
  LEFT JOIN
    apflora_views.v_ap_anzmassnprojahr0
    ON
      (apflora_views.v_ap_massnjahre.TPopMassnJahr = apflora_views.v_ap_anzmassnprojahr0.TPopMassnJahr)
      AND (apflora_views.v_ap_massnjahre.ApArtId = apflora_views.v_ap_anzmassnprojahr0.ApArtId) 
ORDER BY
  apflora_views.v_ap_massnjahre.ApArtId,
  apflora_views.v_ap_massnjahre.TPopMassnJahr;

CREATE OR REPLACE VIEW v_ap_anzmassnbisjahr AS
SELECT
  apflora_views.v_ap_massnjahre.ApArtId,
  apflora_views.v_ap_massnjahre.TPopMassnJahr,
  Sum(apflora_views.v_ap_anzmassnprojahr.AnzahlMassnahmen) AS "AnzahlMassnahmen" 
FROM
  apflora_views.v_ap_massnjahre
  INNER JOIN
    apflora_views.v_ap_anzmassnprojahr
    ON apflora_views.v_ap_massnjahre.ApArtId = apflora_views.v_ap_anzmassnprojahr.ApArtId 
WHERE
  apflora_views.v_ap_anzmassnprojahr.TPopMassnJahr <= apflora_views.v_ap_massnjahre.TPopMassnJahr
GROUP BY
  apflora_views.v_ap_massnjahre.ApArtId,
  apflora_views.v_ap_massnjahre.TPopMassnJahr 
ORDER BY
  apflora_views.v_ap_massnjahre.ApArtId,
  apflora_views.v_ap_massnjahre.TPopMassnJahr;

CREATE OR REPLACE VIEW v_ap_apberundmassn AS
SELECT
  apflora.ap.ApArtId,
  apflora_beob.adb_eigenschaften.Artname AS Art,
  apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
  apflora.ap.ApJahr AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
  apflora.adresse.AdrName AS "AP Verantwortlich",
  apflora.ap.ApArtwert AS Artwert,
  apflora_views.v_ap_anzmassnprojahr.TPopMassnJahr AS Jahr,
  apflora_views.v_ap_anzmassnprojahr.AnzahlMassnahmen AS "Anzahl Massnahmen",
  apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen AS "Anzahl Massnahmen bisher",
  IF(
    apflora.apber.JBerJahr > 0,
    "Ja",
    "Nein"
  ) AS "Bericht erstellt"
FROM
  apflora_beob.adb_eigenschaften
    INNER JOIN
      ((((apflora.ap
      LEFT JOIN
        apflora.ap_bearbstand_werte
        ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
      LEFT JOIN
        apflora.ap_umsetzung_werte
        ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
      LEFT JOIN
        apflora.adresse
        ON apflora.ap.ApBearb = apflora.adresse.AdrId)
      INNER JOIN
        (apflora_views.v_ap_anzmassnprojahr
        INNER JOIN
          (apflora_views.v_ap_anzmassnbisjahr
          LEFT JOIN
            apflora.apber
            ON
              (apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr = apflora.apber.JBerJahr)
              AND (apflora_views.v_ap_anzmassnbisjahr.ApArtId = apflora.apber.ApArtId))
          ON
            (apflora_views.v_ap_anzmassnprojahr.TPopMassnJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr)
            AND (apflora_views.v_ap_anzmassnprojahr.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId))
        ON apflora.ap.ApArtId = apflora_views.v_ap_anzmassnprojahr.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId
ORDER BY
  apflora_beob.adb_eigenschaften.Artname,
  apflora_views.v_ap_anzmassnprojahr.TPopMassnJahr;

CREATE OR REPLACE VIEW v_tpop_letztermassnber AS
SELECT
  apflora_views.v_tpop_letztermassnber0.ApArtId,
  apflora_views.v_tpop_letztermassnber0.TPopId,
  Max(apflora_views.v_tpop_letztermassnber0.TPopMassnBerJahr) AS MaxvonTPopMassnBerJahr
FROM
  apflora_views.v_tpop_letztermassnber0
GROUP BY
  apflora_views.v_tpop_letztermassnber0.ApArtId,
  apflora_views.v_tpop_letztermassnber0.TPopId;

CREATE OR REPLACE VIEW v_tpop_letztertpopber AS 
SELECT
  apflora_views.v_tpop_letztertpopber0.ApArtId,
  apflora_views.v_tpop_letztertpopber0.TPopId,
  Max(apflora_views.v_tpop_letztertpopber0.TPopBerJahr) AS MaxvonTPopBerJahr
FROM
  apflora_views.v_tpop_letztertpopber0
GROUP BY
  apflora_views.v_tpop_letztertpopber0.ApArtId,
  apflora_views.v_tpop_letztertpopber0.TPopId;

CREATE OR REPLACE VIEW v_pop_letztermassnber AS 
SELECT
  apflora_views.v_pop_letztermassnber0.ApArtId,
  apflora_views.v_pop_letztermassnber0.PopId,
  Max(apflora_views.v_pop_letztermassnber0.PopMassnBerJahr) AS MaxvonPopMassnBerJahr
FROM
  apflora_views.v_pop_letztermassnber0
GROUP BY
  apflora_views.v_pop_letztermassnber0.ApArtId,
  apflora_views.v_pop_letztermassnber0.PopId;

# dieser view ist für den Bericht gedacht - daher letzter popber vor jBerJahr
CREATE OR REPLACE VIEW v_pop_letzterpopber AS
SELECT
  apflora_views.v_pop_letzterpopber0.ApArtId,
  apflora_views.v_pop_letzterpopber0.PopId,
  Max(apflora_views.v_pop_letzterpopber0.PopBerJahr) AS MaxvonPopBerJahr
FROM
  apflora_views.v_pop_letzterpopber0
GROUP BY
  apflora_views.v_pop_letzterpopber0.ApArtId,
  apflora_views.v_pop_letzterpopber0.PopId;

# dieser view ist für die Qualitätskontrolle gedacht - daher letzter popber überhaupt
CREATE OR REPLACE VIEW v_pop_letzterpopber_overall AS
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId,
  apflora_views.v_pop_letzterpopber0_overall.PopBerJahr
FROM
  (apflora.pop
  INNER JOIN
    apflora_views.v_pop_letzterpopber0_overall
    ON apflora.pop.PopId = apflora_views.v_pop_letzterpopber0_overall.PopId)
  INNER JOIN
    apflora.tpop
    ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_uebe AS 
SELECT
  apflora.apber.*,
  apflora_beob.adb_eigenschaften.Artname,
  IF(
    apflora_beob.adb_eigenschaften.KefArt = -1,
    "Ja",
    ""
  ) AS FnsKefArt2,
  apflora_beob.adb_eigenschaften.KefKontrolljahr,
  IF(
    Round((apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4, 0) = (apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4,
    "Ja",
    ""
  ) AS FnsKefKontrJahr2,
  apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      (apflora._variable
      INNER JOIN
        (apflora.apber
        INNER JOIN
          apflora_views.v_ap_anzmassnbisjahr
          ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
        ON apflora._variable.JBerJahr = apflora.apber.JBerJahr)
      ON apflora.ap.ApArtId = apflora.apber.ApArtId)
    ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr 
WHERE
  apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.apber.JBerBeurteilung = 1
  AND apflora.ap.ApStatus BETWEEN 1 AND 3
ORDER BY
  apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebe_apid AS 
SELECT
  apflora.ap.ApArtId
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      (apflora._variable
      INNER JOIN
        (apflora.apber
        INNER JOIN
          apflora_views.v_ap_anzmassnbisjahr
          ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
        ON apflora._variable.JBerJahr = apflora.apber.JBerJahr)
      ON apflora.ap.ApArtId = apflora.apber.ApArtId)
    ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr 
WHERE
  apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.apber.JBerBeurteilung = 1
  AND apflora.ap.ApStatus BETWEEN 1 AND 3;

CREATE OR REPLACE VIEW v_apber_uebkm AS 
SELECT
  apflora_beob.adb_eigenschaften.Artname,
  IF(
    apflora_beob.adb_eigenschaften.KefArt = -1,
    "Ja",
    ""
  ) AS FnsKefArt2,
  IF(
    Round((apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4,0) = (apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4,
    "Ja",
    ""
  ) AS FnsKefKontrJahr2
FROM
  (apflora_beob.adb_eigenschaften
    INNER JOIN
      ((apflora_views.v_ap_anzmassnbisjahr AS vApAnzMassnBisJahr_1
      INNER JOIN
        apflora.ap
        ON vApAnzMassnBisJahr_1.ApArtId = apflora.ap.ApArtId)
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      (apflora.apber
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
      ON
        (apflora._variable.JBerJahr = vApAnzMassnBisJahr_1.TPopMassnJahr)
        AND (apflora.ap.ApArtId = apflora.apber.ApArtId)
WHERE
  apflora.ap.ApStatus BETWEEN 1 AND 3
  AND vApAnzMassnBisJahr_1.AnzahlMassnahmen = "0"
ORDER BY
  apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebma AS 
SELECT
  apflora_beob.adb_eigenschaften.Artname,
  apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen
FROM
  apflora._variable
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      apflora_views.v_ap_anzmassnbisjahr
      ON apflora.ap.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
    ON apflora._variable.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.ap.ApStatus BETWEEN 1 AND 3
ORDER BY
  apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebme AS

CREATE OR REPLACE VIEW v_apber_uebma_apid AS
SELECT
  apflora.ap.ApArtId
FROM
  apflora._variable
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      apflora_views.v_ap_anzmassnbisjahr
      ON apflora.ap.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
    ON apflora._variable.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.ap.ApStatus BETWEEN 1 AND 3;

CREATE OR REPLACE VIEW v_apber_uebme AS
SELECT
  apflora.apber.*,
  apflora_beob.adb_eigenschaften.Artname,
  IF(
    "KefArt" = -1,
    "Ja",
    ""
  ) AS FnsKefArt2,
  IF(
    Round((apflora._variable.JBerJahr - "KefKontrolljahr") / 4, 0) = (apflora._variable.JBerJahr - "KefKontrolljahr") / 4,
    "Ja",
    ""
  ) AS FnsKefKontrJahr2
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora_views.v_ap_anzmassnbisjahr
        ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
      ON apflora.ap.ApArtId = apflora.apber.ApArtId)
    ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora.apber.JBerBeurteilung = 5
  AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.ap.ApStatus BETWEEN 1 AND 3
ORDER BY
  apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebme_apid AS
SELECT
  apflora.ap.ApArtId
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora_views.v_ap_anzmassnbisjahr
        ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
      ON apflora.ap.ApArtId = apflora.apber.ApArtId)
    ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora.apber.JBerBeurteilung = 5
  AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.ap.ApStatus BETWEEN 1 AND 3;

CREATE OR REPLACE VIEW v_apber_uebne AS
SELECT
  apflora.apber.*,
  apflora_beob.adb_eigenschaften.Artname,
  IF(
    apflora_beob.adb_eigenschaften.KefArt = -1,
    "Ja",
    ""
  ) AS FnsKefArt2,
  IF(
    Round((apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4, 0) = (apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4,
    "Ja",
    ""
  ) AS FnsKefKontrJahr2
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora_views.v_ap_anzmassnbisjahr
        ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
      ON apflora.ap.ApArtId = apflora.apber.ApArtId)
    ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora.apber.JBerBeurteilung = 3
  AND apflora.ap.ApStatus BETWEEN 1 AND 3
  AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
ORDER BY
  apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebne_apid AS
SELECT
  apflora.ap.ApArtId
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora_views.v_ap_anzmassnbisjahr
        ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
      ON apflora.ap.ApArtId = apflora.apber.ApArtId)
    ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora.apber.JBerBeurteilung = 3
  AND apflora.ap.ApStatus BETWEEN 1 AND 3
  AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0;

CREATE OR REPLACE VIEW v_apber_uebse AS 
SELECT
  apflora.apber.*,
  apflora_beob.adb_eigenschaften.Artname,
  IF(
    apflora_beob.adb_eigenschaften.KefArt = -1,
    "Ja",
    ""
  ) AS FnsKefArt2,
  IF(
    Round((apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4, 0) = (apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4,
    "Ja",
    ""
  ) AS FnsKefKontrJahr2
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora_views.v_ap_anzmassnbisjahr
        ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
    ON apflora.ap.ApArtId = apflora.apber.ApArtId)
  ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora.apber.JBerBeurteilung = 4
  AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.ap.ApStatus BETWEEN 1 AND 3
ORDER BY
  apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebse_apid AS 
SELECT
  apflora.ap.ApArtId
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora_views.v_ap_anzmassnbisjahr
        ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
    ON apflora.ap.ApArtId = apflora.apber.ApArtId)
  ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora.apber.JBerBeurteilung = 4
  AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.ap.ApStatus BETWEEN 1 AND 3;

CREATE OR REPLACE VIEW v_apber_uebun AS
SELECT
  apflora.apber.*,
  apflora_beob.adb_eigenschaften.Artname,
  IF(
    apflora_beob.adb_eigenschaften.KefArt = -1,
    "Ja",
    ""
  ) AS FnsKefArt2,
  IF(
    Round((apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4, 0) = (apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4,
    "Ja",
    ""
  ) AS FnsKefKontrJahr2
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora_views.v_ap_anzmassnbisjahr
        ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
    ON apflora.ap.ApArtId = apflora.apber.ApArtId)
  ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora.apber.JBerBeurteilung = 1168274204
  AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.ap.ApStatus BETWEEN 1 AND 3
ORDER BY
  apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebun_apid AS
SELECT
  apflora.ap.ApArtId
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora_views.v_ap_anzmassnbisjahr
        ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
    ON apflora.ap.ApArtId = apflora.apber.ApArtId)
  ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora.apber.JBerBeurteilung = 1168274204
  AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.ap.ApStatus BETWEEN 1 AND 3;

CREATE OR REPLACE VIEW v_apber_uebwe AS 
SELECT
  apflora.apber.*,
  apflora_beob.adb_eigenschaften.Artname,
  IF(
    apflora_beob.adb_eigenschaften.KefArt = -1,
    "Ja",
    ""
  ) AS FnsKefArt2,
  IF(
    Round((apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4, 0) = (apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4,
    "Ja",
    ""
  ) AS FnsKefKontrJahr2
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora_views.v_ap_anzmassnbisjahr
        ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
      ON apflora.ap.ApArtId = apflora.apber.ApArtId)
    ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora.apber.JBerBeurteilung = 6
  AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.ap.ApStatus BETWEEN 1 AND 3
ORDER BY
  apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebwe_apid AS 
SELECT
  apflora.ap.ApArtId
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    ((apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        apflora_views.v_ap_apberrelevant
        ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        apflora_views.v_ap_anzmassnbisjahr
        ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
      ON apflora.ap.ApArtId = apflora.apber.ApArtId)
    ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora.apber.JBerBeurteilung = 6
  AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen > 0
  AND apflora.ap.ApStatus BETWEEN 1 AND 3;

CREATE OR REPLACE VIEW v_apber_uebnb000 AS
SELECT
  apflora.ap.ApArtId,
  apflora.apber.JBerJahr
FROM
  (((apflora.ap
  INNER JOIN
    apflora_views.v_ap_anzmassnbisjahr
    ON apflora.ap.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
  INNER JOIN
    apflora_views.v_ap_apberrelevant
    ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
  LEFT JOIN
    apflora.apber
    ON apflora.ap.ApArtId = apflora.apber.ApArtId)
  INNER JOIN
    apflora._variable
    ON apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr = apflora._variable.JBerJahr
WHERE
  apflora.apber.ApArtId IS NULL
  AND apflora.ap.ApStatus BETWEEN 1 AND 3;

CREATE OR REPLACE VIEW v_apber_uebnb00 AS 
SELECT
  apflora.ap.ApArtId,
  apflora.apber.JBerJahr
FROM
  apflora._variable AS tblKonstanten_1
  INNER JOIN
    (((apflora.ap
    INNER JOIN
      apflora_views.v_ap_anzmassnbisjahr
      ON apflora.ap.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
    INNER JOIN
      apflora_views.v_ap_apberrelevant
      ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
    INNER JOIN
      (apflora.apber
      INNER JOIN
        apflora._variable
        ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
      ON apflora.ap.ApArtId = apflora.apber.ApArtId)
    ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE
  apflora.ap.ApStatus BETWEEN 1 AND 3
  AND apflora.apber.JBerBeurteilung IS NULL;

CREATE OR REPLACE VIEW v_apber_uebnb0 AS 
SELECT
  ApArtId,
  JBerJahr
FROM
  apflora_views.v_apber_uebnb000
UNION SELECT
  ApArtId,
  JBerJahr
FROM
  apflora_views.v_apber_uebnb00;

CREATE OR REPLACE VIEW v_apber_uebnb AS 
SELECT
 apflora.ap.ApArtId,
  apflora_beob.adb_eigenschaften.Artname,
  apflora_views.v_fnskef.FnsKefArt2,
  apflora_views.v_fnskef.FnsKefKontrJahr2
FROM
    apflora_beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      LEFT JOIN
        apflora_views.v_fnskef
        ON apflora.ap.ApArtId = apflora_views.v_fnskef.TaxonomieId)
      ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId
WHERE
  apflora.ap.ApStatus BETWEEN 1 AND 3
  AND apflora.ap.ApArtId NOT IN (SELECT * FROM apflora_views.v_apber_uebse_apid)
  AND apflora.ap.ApArtId NOT IN (SELECT * FROM apflora_views.v_apber_uebe_apid)
  AND apflora.ap.ApArtId NOT IN (SELECT * FROM apflora_views.v_apber_uebme_apid)
  AND apflora.ap.ApArtId NOT IN (SELECT * FROM apflora_views.v_apber_uebwe_apid)
  AND apflora.ap.ApArtId NOT IN (SELECT * FROM apflora_views.v_apber_uebne_apid)
  AND apflora.ap.ApArtId NOT IN (SELECT * FROM apflora_views.v_apber_uebun_apid)
  AND apflora.ap.ApArtId IN (SELECT * FROM apflora_views.v_apber_uebma_apid)
ORDER BY
  apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uet01 AS
SELECT
  apflora.ap.ApArtId,
  apflora_beob.adb_eigenschaften.Artname,
  IF(
    apflora.ap.ApArtId NOT IN (SELECT * FROM apflora_views.v_apber_uebma_apid),
    "X",
    ""
  ) AS "keineMassnahmen",
  IF(
    apflora_beob.adb_eigenschaften.KefArt = -1,
    "X",
    ""
  ) AS FnsKefArt,
  IF(
    Round((apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4, 0) = (apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4,
    "X",
    ""
  ) AS FnsKefKontrJahr
FROM
  apflora_beob.adb_eigenschaften
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      (apflora_views.v_ap_anzmassnbisjahr
      INNER JOIN
        apflora._variable
        ON apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr = apflora._variable.JBerJahr)
      ON apflora.ap.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)
    INNER JOIN
      apflora_views.v_ap_apberrelevant
      ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId)
    ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId
WHERE
  apflora.ap.ApStatus BETWEEN 1 AND 3
ORDER BY
  apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uet_veraengegenvorjahr AS
SELECT
  apflora.ap.ApArtId,
  apflora.apber.JBerVeraenGegenVorjahr,
  apflora.apber.JBerJahr
FROM
  apflora.ap
  LEFT JOIN
    apflora.apber
    ON apflora.ap.ApArtId = apflora.apber.ApArtId
WHERE
  apflora.ap.ApStatus BETWEEN 1 AND 3
  AND (
    apflora.apber.JBerJahr In (SELECT apflora._variable.JBerJahr FROM apflora._variable)
    Or apflora.apber.JBerJahr Is Null
  );

CREATE OR REPLACE VIEW v_tpop_statuswidersprichtbericht AS 
SELECT
  apflora_beob.adb_eigenschaften.Artname AS Art,
  apflora.ap_bearbstand_werte.DomainTxt AS "Bearbeitungsstand AP",
  apflora.pop.PopNr,
  apflora.pop.PopName,
  apflora.tpop.TPopNr,
  apflora.tpop.TPopGemeinde,
  apflora.tpop.TPopFlurname,
  apflora.tpop.TPopHerkunft,
  apflora.tpopber.TPopBerEntwicklung,
  apflora.tpopber.TPopBerJahr
FROM
  ((apflora_beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          apflora_views.v_tpopber_letzterber
          ON
            (apflora.tpopber.TPopId = apflora_views.v_tpopber_letzterber.TPopId)
            AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpopber_letzterber.MaxvonTPopBerJahr))
        ON apflora.tpop.TPopId = apflora.tpopber.TPopId)
      ON apflora.pop.PopId = apflora.tpop.PopId)
    ON apflora.ap.ApArtId = apflora.pop.ApArtId)
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode
WHERE
  (
    apflora.ap.ApStatus < 4
    AND (
      apflora.tpop.TPopHerkunft = 101
      OR apflora.tpop.TPopHerkunft = 202
    )
    AND apflora.tpopber.TPopBerEntwicklung <> 8
  )
  OR (
    apflora.ap.ApStatus < 4
    AND apflora.tpop.TPopHerkunft NOT IN (101, 202)
    AND apflora.tpopber.TPopBerEntwicklung = 8
  )
ORDER BY
  apflora_beob.adb_eigenschaften.Artname,
  apflora.pop.PopNr,
  apflora.pop.PopName,
  apflora.tpop.TPopNr,
  apflora.tpop.TPopGemeinde,
  apflora.tpop.TPopFlurname;

#im Gebrauch (Access):
CREATE OR REPLACE VIEW v_apber_injahr AS 
SELECT
  apflora.ap.*,
  apflora_beob.adb_eigenschaften.Artname AS Art,
  apflora.apber.JBerId,
  apflora.apber.JBerJahr,
  apflora.apber.JBerSituation,
  apflora.apber.JBerVergleichVorjahrGesamtziel,
  apflora.apber.JBerBeurteilung,
  apflora.apber.JBerAnalyse,
  apflora.apber.JBerUmsetzung,
  apflora.apber.JBerErfko,
  apflora.apber.JBerATxt,
  apflora.apber.JBerBTxt,
  apflora.apber.JBerCTxt,
  apflora.apber.JBerDTxt,
  apflora.apber.JBerDatum,
  apflora.apber.JBerBearb,
  apflora.adresse.AdrName & ",
  " & apflora.adresse.AdrAdresse AS Bearbeiter,
  apflora.apberuebersicht.JbuJahr,
  apflora.apberuebersicht.JbuBemerkungen,
  apflora_views.v_erstemassnproap.MinvonTPopMassnJahr AS ErsteMassnahmeImJahr
FROM
  (apflora_beob.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    LEFT JOIN
      apflora_views.v_erstemassnproap
      ON apflora.ap.ApArtId = apflora_views.v_erstemassnproap.ApArtId)
    ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
  INNER JOIN
    (((apflora.apber
    LEFT JOIN
      apflora.adresse
      ON apflora.apber.JBerBearb = apflora.adresse.AdrId)
    LEFT JOIN
      apflora.apberuebersicht
      ON apflora.apber.JBerJahr = apflora.apberuebersicht.JbuJahr)
    INNER JOIN
      apflora._variable
      ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
    ON apflora.ap.ApArtId = apflora.apber.ApArtId
WHERE
  apflora.ap.ApStatus < 4
  AND apflora.ap.ApArtId > 150
ORDER BY
  apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_b2rpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId
FROM
  ((apflora_views.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora_views.v_pop_letzterpopber.ApArtId = apflora.pop.ApArtId)
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop.PopId = apflora.popber.PopId)
      AND (apflora_views.v_pop_letzterpopber.PopId = apflora.popber.PopId)
      AND (apflora_views.v_pop_letzterpopber.MaxvonPopBerJahr = apflora.popber.PopBerJahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  apflora.popber.PopBerEntwicklung = 3
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b3rpop AS
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId
FROM
  ((apflora_views.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora_views.v_pop_letzterpopber.ApArtId = apflora.pop.ApArtId)
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop.PopId = apflora.popber.PopId)
      AND (apflora_views.v_pop_letzterpopber.PopId = apflora.popber.PopId)
      AND (apflora_views.v_pop_letzterpopber.MaxvonPopBerJahr = apflora.popber.PopBerJahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  apflora.popber.PopBerEntwicklung = 2
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b4rpop AS
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId
FROM
  ((apflora_views.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora_views.v_pop_letzterpopber.ApArtId = apflora.pop.ApArtId)
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop.PopId = apflora.popber.PopId)
      AND (apflora_views.v_pop_letzterpopber.PopId = apflora.popber.PopId)
      AND (apflora_views.v_pop_letzterpopber.MaxvonPopBerJahr = apflora.popber.PopBerJahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  apflora.popber.PopBerEntwicklung = 1
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b5rpop AS
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId
FROM
  ((apflora_views.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora_views.v_pop_letzterpopber.ApArtId = apflora.pop.ApArtId)
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop.PopId = apflora.popber.PopId)
      AND (apflora_views.v_pop_letzterpopber.PopId = apflora.popber.PopId)
      AND (apflora_views.v_pop_letzterpopber.MaxvonPopBerJahr = apflora.popber.PopBerJahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  (
    apflora.popber.PopBerEntwicklung = 4
    OR apflora.popber.PopBerEntwicklung = 9
  )
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b6rpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId
FROM
  ((apflora_views.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON apflora_views.v_pop_letzterpopber.ApArtId = apflora.pop.ApArtId)
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop.PopId = apflora.popber.PopId)
      AND (apflora_views.v_pop_letzterpopber.PopId = apflora.popber.PopId)
      AND (apflora_views.v_pop_letzterpopber.MaxvonPopBerJahr = apflora.popber.PopBerJahr))
  INNER JOIN
    apflora.tpop
    ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  apflora.popber.PopBerEntwicklung = 8
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b2rtpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.tpop.TPopId
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora_views.v_tpop_letztertpopber
        ON apflora.pop.ApArtId = apflora_views.v_tpop_letztertpopber.ApArtId)
      ON
        (apflora.tpopber.TPopId = apflora_views.v_tpop_letztertpopber.TPopId)
        AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpop_letztertpopber.MaxvonTPopBerJahr))
    ON
      (apflora.tpop.PopId = apflora.pop.PopId)
      AND (apflora.tpop.TPopId = apflora.tpopber.TPopId)
WHERE
  apflora.tpopber.TPopBerEntwicklung = 3
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b3rtpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.tpop.TPopId
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora_views.v_tpop_letztertpopber
        ON apflora.pop.ApArtId = apflora_views.v_tpop_letztertpopber.ApArtId)
      ON
        (apflora.tpopber.TPopId = apflora_views.v_tpop_letztertpopber.TPopId)
        AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpop_letztertpopber.MaxvonTPopBerJahr))
    ON
      (apflora.tpop.PopId = apflora.pop.PopId)
      AND (apflora.tpop.TPopId = apflora.tpopber.TPopId)
WHERE
  apflora.tpopber.TPopBerEntwicklung = 2
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b4rtpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.tpop.TPopId
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora_views.v_tpop_letztertpopber
        ON apflora.pop.ApArtId = apflora_views.v_tpop_letztertpopber.ApArtId)
      ON
        (apflora.tpopber.TPopId = apflora_views.v_tpop_letztertpopber.TPopId)
        AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpop_letztertpopber.MaxvonTPopBerJahr))
    ON
      (apflora.tpop.PopId = apflora.pop.PopId)
      AND (apflora.tpop.TPopId = apflora.tpopber.TPopId)
WHERE
  apflora.tpopber.TPopBerEntwicklung = 1
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b5rtpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.tpop.TPopId
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora_views.v_tpop_letztertpopber
        ON apflora.pop.ApArtId = apflora_views.v_tpop_letztertpopber.ApArtId)
      ON
        (apflora.tpopber.TPopId = apflora_views.v_tpop_letztertpopber.TPopId)
        AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpop_letztertpopber.MaxvonTPopBerJahr))
    ON
      (apflora.tpop.PopId = apflora.pop.PopId)
      AND (apflora.tpop.TPopId = apflora.tpopber.TPopId)
WHERE
  apflora.tpopber.TPopBerEntwicklung = 4
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b6rtpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.tpop.TPopId
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora_views.v_tpop_letztertpopber
        ON apflora.pop.ApArtId = apflora_views.v_tpop_letztertpopber.ApArtId)
      ON
        (apflora.tpopber.TPopId = apflora_views.v_tpop_letztertpopber.TPopId)
        AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpop_letztertpopber.MaxvonTPopBerJahr))
    ON
      (apflora.tpop.PopId = apflora.pop.PopId)
      AND (apflora.tpop.TPopId = apflora.tpopber.TPopId)
WHERE
  apflora.tpopber.TPopBerEntwicklung = 8
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_c1rpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop.PopId = apflora.tpop.PopId)
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId
WHERE
  apflora.tpopmassn.TPopMassnJahr <= apflora._variable.JBerJahr
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.pop.PopHerkunft <> 300
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c3rpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId
FROM
  (apflora_views.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora_views.v_pop_letztermassnber.ApArtId = apflora.pop.ApArtId)
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop.PopId = apflora.popmassnber.PopId)
      AND (apflora_views.v_pop_letztermassnber.MaxvonPopMassnBerJahr = apflora.popmassnber.PopMassnBerJahr)
      AND (apflora_views.v_pop_letztermassnber.PopId = apflora.popmassnber.PopId)
WHERE
  apflora.popmassnber.PopMassnBerErfolgsbeurteilung = 1
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c4rpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId
FROM
  (apflora_views.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora_views.v_pop_letztermassnber.ApArtId = apflora.pop.ApArtId)
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop.PopId = apflora.popmassnber.PopId)
      AND (apflora_views.v_pop_letztermassnber.MaxvonPopMassnBerJahr = apflora.popmassnber.PopMassnBerJahr)
      AND (apflora_views.v_pop_letztermassnber.PopId = apflora.popmassnber.PopId)
WHERE
  apflora.popmassnber.PopMassnBerErfolgsbeurteilung = 2
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c5rpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId
FROM
  (apflora_views.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora_views.v_pop_letztermassnber.ApArtId = apflora.pop.ApArtId)
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop.PopId = apflora.popmassnber.PopId)
      AND (apflora_views.v_pop_letztermassnber.MaxvonPopMassnBerJahr = apflora.popmassnber.PopMassnBerJahr)
      AND (apflora_views.v_pop_letztermassnber.PopId = apflora.popmassnber.PopId)
WHERE
  apflora.popmassnber.PopMassnBerErfolgsbeurteilung = 3
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c6rpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId
FROM
  (apflora_views.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora_views.v_pop_letztermassnber.ApArtId = apflora.pop.ApArtId)
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop.PopId = apflora.popmassnber.PopId)
      AND (apflora_views.v_pop_letztermassnber.PopId = apflora.popmassnber.PopId)
      AND (apflora_views.v_pop_letztermassnber.MaxvonPopMassnBerJahr = apflora.popmassnber.PopMassnBerJahr)
WHERE
  apflora.popmassnber.PopMassnBerErfolgsbeurteilung = 4
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c7rpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.pop.PopId
FROM
  (apflora_views.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON apflora_views.v_pop_letztermassnber.ApArtId = apflora.pop.ApArtId)
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop.PopId = apflora.popmassnber.PopId)
      AND (apflora_views.v_pop_letztermassnber.PopId = apflora.popmassnber.PopId)
      AND (apflora_views.v_pop_letztermassnber.MaxvonPopMassnBerJahr = apflora.popmassnber.PopMassnBerJahr)
WHERE
  apflora.popmassnber.PopMassnBerErfolgsbeurteilung = 5
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c3rtpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.tpop.TPopId
FROM
  apflora.pop
  INNER JOIN
    ((apflora_views.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora_views.v_tpop_letztermassnber.TPopId = apflora.tpopmassnber.TPopId)
        AND (apflora_views.v_tpop_letztermassnber.MaxvonTPopMassnBerJahr = apflora.tpopmassnber.TPopMassnBerJahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.TPopId = apflora.tpop.TPopId)
    ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung = 1
GROUP BY
  apflora.pop.ApArtId,
  apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_c4rtpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.tpop.TPopId
FROM
  apflora.pop
  INNER JOIN
    ((apflora_views.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora_views.v_tpop_letztermassnber.TPopId = apflora.tpopmassnber.TPopId)
        AND (apflora_views.v_tpop_letztermassnber.MaxvonTPopMassnBerJahr = apflora.tpopmassnber.TPopMassnBerJahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.TPopId = apflora.tpop.TPopId)
    ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  (apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung = 2)
GROUP BY
  apflora.pop.ApArtId,
  apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_c5rtpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.tpop.TPopId
FROM
  apflora.pop
  INNER JOIN
    ((apflora_views.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora_views.v_tpop_letztermassnber.TPopId = apflora.tpopmassnber.TPopId)
        AND (apflora_views.v_tpop_letztermassnber.MaxvonTPopMassnBerJahr = apflora.tpopmassnber.TPopMassnBerJahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.TPopId = apflora.tpop.TPopId)
    ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung = 3
GROUP BY
  apflora.pop.ApArtId,
  apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_c6rtpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.tpop.TPopId
FROM
  apflora.pop
  INNER JOIN
    ((apflora_views.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora_views.v_tpop_letztermassnber.TPopId = apflora.tpopmassnber.TPopId)
        AND (apflora_views.v_tpop_letztermassnber.MaxvonTPopMassnBerJahr = apflora.tpopmassnber.TPopMassnBerJahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.TPopId = apflora.tpop.TPopId)
    ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung = 4
GROUP BY
  apflora.pop.ApArtId,
  apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_c7rtpop AS 
SELECT
  apflora.pop.ApArtId,
  apflora.tpop.TPopId
FROM
  apflora.pop
  INNER JOIN
    ((apflora_views.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (apflora_views.v_tpop_letztermassnber.TPopId = apflora.tpopmassnber.TPopId)
        AND (apflora_views.v_tpop_letztermassnber.MaxvonTPopMassnBerJahr = apflora.tpopmassnber.TPopMassnBerJahr))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber.TPopId = apflora.tpop.TPopId)
    ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung = 5
GROUP BY
  apflora.pop.ApArtId,
  apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_pop_popberundmassnber AS
SELECT
  apflora_beob.adb_eigenschaften.TaxonomieId AS "AP ApArtId",
  apflora_beob.adb_eigenschaften.Artname AS "AP Art",
  apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
  apflora.ap.ApJahr AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
  apflora.pop.PopGuid AS "Pop Guid",
  apflora.pop.PopNr AS "Pop Nr",
  apflora.pop.PopName AS "Pop Name",
  pop_status_werte.HerkunftTxt AS "Pop Status",
  apflora.pop.PopBekanntSeit AS "Pop bekannt seit",
  apflora.pop.PopHerkunftUnklar AS "Pop Status unklar",
  apflora.pop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status",
  apflora.pop.PopXKoord AS "Pop X-Koordinaten",
  apflora.pop.PopYKoord AS "Pop Y-Koordinaten",
  apflora.pop.MutWann AS "Datensatz zuletzt geaendert",
  apflora.pop.MutWer AS "Datensatz zuletzt geaendert von",
  apflora_views.v_pop_berundmassnjahre.Jahr,
  apflora.popber.PopBerId AS "PopBer Id",
  apflora.popber.PopBerJahr AS "PopBer Jahr",
  pop_entwicklung_werte.EntwicklungTxt AS "PopBer Entwicklung",
  apflora.popber.PopBerTxt AS "PopBer Bemerkungen",
  apflora.popber.MutWann AS "PopBer MutWann",
  apflora.popber.MutWer AS "PopBer MutWer",
  apflora.popmassnber.PopMassnBerId AS "PopMassnBer Id",
  apflora.popmassnber.PopMassnBerJahr AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.BeurteilTxt AS "PopMassnBer Entwicklung",
  apflora.popmassnber.PopMassnBerTxt AS "PopMassnBer Interpretation",
  apflora.popmassnber.MutWann AS "PopMassnBer MutWann",
  apflora.popmassnber.MutWer AS "PopMassnBer MutWer"
FROM
  (((((((apflora_beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
  INNER JOIN
    apflora.pop
    ON apflora.ap.ApArtId = apflora.pop.ApArtId)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
  LEFT JOIN
    apflora_views.v_pop_berundmassnjahre
    ON apflora.pop.PopId = apflora_views.v_pop_berundmassnjahre.PopId)
  LEFT JOIN
    (apflora.popmassnber
    LEFT JOIN
      apflora.tpopmassn_erfbeurt_werte
      ON apflora.popmassnber.PopMassnBerErfolgsbeurteilung = tpopmassn_erfbeurt_werte.BeurteilId)
    ON
      (apflora_views.v_pop_berundmassnjahre.Jahr = apflora.popmassnber.PopMassnBerJahr)
      AND (apflora_views.v_pop_berundmassnjahre.PopId = apflora.popmassnber.PopId))
  LEFT JOIN
    (apflora.popber
    LEFT JOIN
      apflora.pop_entwicklung_werte
      ON apflora.popber.PopBerEntwicklung = pop_entwicklung_werte.EntwicklungId)
    ON
      (apflora_views.v_pop_berundmassnjahre.Jahr = apflora.popber.PopBerJahr)
      AND (apflora_views.v_pop_berundmassnjahre.PopId = apflora.popber.PopId)
ORDER BY
  apflora_beob.adb_eigenschaften.Artname,
  apflora.pop.PopNr,
  apflora_views.v_pop_berundmassnjahre.Jahr;

CREATE OR REPLACE VIEW v_tpop_popberundmassnber AS
SELECT
  apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId,
  apflora_beob.adb_eigenschaften.Artname AS "AP Art",
  apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
  apflora.ap.ApJahr AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
  apflora.pop.PopGuid AS "Pop Guid",
  apflora.pop.PopNr AS "Pop Nr",
  apflora.pop.PopName AS "Pop Name",
  pop_status_werte.HerkunftTxt AS "Pop Status",
  apflora.pop.PopBekanntSeit AS "Pop bekannt seit",
  apflora.pop.PopHerkunftUnklar AS "Pop Status unklar",
  apflora.pop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status",
  apflora.pop.PopXKoord AS "Pop X-Koordinaten",
  apflora.pop.PopYKoord AS "Pop Y-Koordinaten",
  apflora.tpop.TPopId AS "TPop ID",
  apflora.tpop.TPopGuid AS "TPop Guid",
  apflora.tpop.TPopNr AS "TPop Nr",
  apflora.tpop.TPopGemeinde AS "TPop Gemeinde",
  apflora.tpop.TPopFlurname AS "TPop Flurname",
  domPopHerkunft_1.HerkunftTxt AS "TPop Status",
  apflora.tpop.TPopBekanntSeit AS "TPop bekannt seit",
  apflora.tpop.TPopHerkunftUnklar AS "TPop Status unklar",
  apflora.tpop.TPopHerkunftUnklarBegruendung AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop.TPopXKoord AS "TPop X-Koordinaten",
  apflora.tpop.TPopYKoord AS "TPop Y-Koordinaten",
  apflora.tpop.TPopRadius AS "TPop Radius (m)",
  apflora.tpop.TPopHoehe AS "TPop Hoehe",
  apflora.tpop.TPopExposition AS "TPop Exposition",
  apflora.tpop.TPopKlima AS "TPop Klima",
  apflora.tpop.TPopNeigung AS "TPop Hangneigung",
  apflora.tpop.TPopBeschr AS "TPop Beschreibung",
  apflora.tpop.TPopKatNr AS "TPop Kataster-Nr",
  apflora.tpop.TPopApBerichtRelevant AS "TPop fuer AP-Bericht relevant",
  apflora.tpop.TPopEigen AS "TPop EigentuemerIn",
  apflora.tpop.TPopKontakt AS "TPop Kontakt vor Ort",
  apflora.tpop.TPopNutzungszone AS "TPop Nutzungszone",
  apflora.tpop.TPopBewirtschafterIn AS "TPop BewirtschafterIn",
  apflora.tpop.TPopBewirtschaftung AS "TPop Bewirtschaftung",
  apflora_views.v_tpop_berjahrundmassnjahr.Jahr,
  apflora.tpopber.TPopBerId AS "TPopBer Id",
  apflora.tpopber.TPopBerJahr AS "TPopBer Jahr",
  pop_entwicklung_werte.EntwicklungTxt AS "TPopBer Entwicklung",
  apflora.tpopber.TPopBerTxt AS "TPopBer Bemerkungen",
  apflora.tpopber.MutWann AS "TPopBer MutWann",
  apflora.tpopber.MutWer AS "TPopBer MutWer",
  apflora.tpopmassnber.TPopMassnBerJahr AS "TPopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.BeurteilTxt AS "TPopMassnBer Entwicklung",
  apflora.tpopmassnber.TPopMassnBerTxt AS "TPopMassnBer Interpretation",
  apflora.tpopmassnber.MutWann AS "TPopMassnBer MutWann",
  apflora.tpopmassnber.MutWer AS "TPopMassnBer MutWer"
FROM
  ((((((((((apflora_beob.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
  RIGHT JOIN
    (apflora.pop
    RIGHT JOIN
      apflora.tpop
      ON apflora.pop.PopId = apflora.tpop.PopId)
    ON apflora.ap.ApArtId = apflora.pop.ApArtId)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
  LEFT JOIN
    apflora.pop_status_werte ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
  LEFT JOIN
    apflora.pop_status_werte AS domPopHerkunft_1
    ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId)
  LEFT JOIN
    apflora_views.v_tpop_berjahrundmassnjahr
    ON apflora.tpop.TPopId = apflora_views.v_tpop_berjahrundmassnjahr.TPopId)
  LEFT JOIN
    apflora.tpopmassnber
    ON
      (apflora_views.v_tpop_berjahrundmassnjahr.TPopId = apflora.tpopmassnber.TPopId)
      AND (apflora_views.v_tpop_berjahrundmassnjahr.Jahr = apflora.tpopmassnber.TPopMassnBerJahr))
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung = tpopmassn_erfbeurt_werte.BeurteilId)
  LEFT JOIN
    apflora.tpopber
    ON
      (apflora_views.v_tpop_berjahrundmassnjahr.Jahr = apflora.tpopber.TPopBerJahr)
      AND (apflora_views.v_tpop_berjahrundmassnjahr.TPopId = apflora.tpopber.TPopId))
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.tpopber.TPopBerEntwicklung = pop_entwicklung_werte.EntwicklungId
ORDER BY
  apflora_beob.adb_eigenschaften.Artname,
  apflora.pop.PopNr,
  apflora.tpop.TPopNr,
  apflora_views.v_tpop_berjahrundmassnjahr.Jahr;

CREATE OR REPLACE VIEW v_pop_berjahrundmassnjahrvontpop AS 
SELECT
  apflora.tpop.PopId,
  apflora_views.v_tpop_berjahrundmassnjahr.Jahr
FROM
  apflora_views.v_tpop_berjahrundmassnjahr
  INNER JOIN
    apflora.tpop
    ON apflora_views.v_tpop_berjahrundmassnjahr.TPopId = apflora.tpop.TPopId
GROUP BY
  apflora.tpop.PopId,
  apflora_views.v_tpop_berjahrundmassnjahr.Jahr;

CREATE OR REPLACE VIEW v_tpopber_mitletzterid AS
SELECT
  apflora.tpopber.TPopId,
  apflora_views.v_tpopber_letzteid.AnzTPopBer,
  apflora.tpopber.TPopBerId,
  apflora.tpopber.TPopBerJahr AS "TPopBer Jahr",
  apflora.pop_entwicklung_werte.EntwicklungTxt AS "TPopBer Entwicklung",
  apflora.tpopber.TPopBerTxt AS "TPopBer Bemerkungen",
  apflora.tpopber.MutWann AS "TPopBer  MutWann",
  apflora.tpopber.MutWer AS "TPopBer MutWer"
FROM
  apflora_views.v_tpopber_letzteid
  INNER JOIN
    apflora.tpopber
    ON
      (apflora_views.v_tpopber_letzteid.MaxTPopBerId = apflora.tpopber.TPopBerId)
      AND (apflora_views.v_tpopber_letzteid.TPopId = apflora.tpopber.TPopId)
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.tpopber.TPopBerEntwicklung = pop_entwicklung_werte.EntwicklungId;

#funktioniert nicht, wenn letzeKontrolle als Unterabfrage eingebunden wird. Grund: Unterabfragen in der FROM-Klausel duerfen keine korrellierten Unterabfragen sein
CREATE OR REPLACE VIEW v_tpop_anzkontrinklletzter AS
SELECT
  apflora_views.v_tpop_letzteKontrId.TPopId,
  apflora_views.v_tpop.ApArtId,
  apflora_views.v_tpop.Familie,
  apflora_views.v_tpop.`AP Art`,
  apflora_views.v_tpop.`AP Status`,
  apflora_views.v_tpop.`AP Start im Jahr`,
  apflora_views.v_tpop.`AP Stand Umsetzung`,
  apflora_views.v_tpop.`AP verantwortlich`,
  apflora_views.v_tpop.`Pop Guid`,
  apflora_views.v_tpop.`Pop Nr`,
  apflora_views.v_tpop.`Pop Name`,
  apflora_views.v_tpop.`Pop Status`,
  apflora_views.v_tpop.`Pop bekannt seit`,
  apflora_views.v_tpop.`Pop Status unklar`,
  apflora_views.v_tpop.`Pop Begruendung fuer unklaren Status`,
  apflora_views.v_tpop.`Pop X-Koordinaten`,
  apflora_views.v_tpop.`Pop Y-Koordinaten`,
  apflora_views.v_tpop.`TPop ID`,
  apflora_views.v_tpop.`TPop Guid`,
  apflora_views.v_tpop.`TPop Nr`,
  apflora_views.v_tpop.`TPop Gemeinde`,
  apflora_views.v_tpop.`TPop Flurname`,
  apflora_views.v_tpop.`TPop Status`,
  apflora_views.v_tpop.`TPop bekannt seit`,
  apflora_views.v_tpop.`TPop Status unklar`,
  apflora_views.v_tpop.`TPop Begruendung fuer unklaren Status`,
  apflora_views.v_tpop.`TPop X-Koordinaten`,
  apflora_views.v_tpop.`TPop Y-Koordinaten`,
  apflora_views.v_tpop.`TPop Radius (m)`,
  apflora_views.v_tpop.`TPop Hoehe`,
  apflora_views.v_tpop.`TPop Exposition`,
  apflora_views.v_tpop.`TPop Klima`,
  apflora_views.v_tpop.`TPop Hangneigung`,
  apflora_views.v_tpop.`TPop Beschreibung`,
  apflora_views.v_tpop.`TPop Kataster-Nr`,
  apflora_views.v_tpop.`TPop fuer AP-Bericht relevant`,
  apflora_views.v_tpop.`TPop EigentuemerIn`,
  apflora_views.v_tpop.`TPop Kontakt vor Ort`,
  apflora_views.v_tpop.`TPop Nutzungszone`,
  apflora_views.v_tpop.`TPop BewirtschafterIn`,
  apflora_views.v_tpop.`TPop Bewirtschaftung`,
  apflora_views.v_tpop.`Teilpopulation zuletzt geaendert`,
  apflora_views.v_tpop.`Teilpopulation zuletzt geaendert von`,
  apflora_views.v_tpop_letzteKontrId.AnzTPopKontr AS "TPop Anzahl Kontrollen",
  apflora_views.v_tpopkontr.TPopKontrId,
  apflora_views.v_tpopkontr.`Kontr Guid`,
  apflora_views.v_tpopkontr.`Kontr Jahr`,
  apflora_views.v_tpopkontr.`Kontr Datum`,
  apflora_views.v_tpopkontr.`Kontr Typ`,
  apflora_views.v_tpopkontr.`Kontr BearbeiterIn`,
  apflora_views.v_tpopkontr.`Kontr Ueberlebensrate`,
  apflora_views.v_tpopkontr.`Kontr Vitalitaet`,
  apflora_views.v_tpopkontr.`Kontr Entwicklung`,
  apflora_views.v_tpopkontr.`Kontr Ursachen`,
  apflora_views.v_tpopkontr.`Kontr Erfolgsbeurteilung`,
  apflora_views.v_tpopkontr.`Kontr Aenderungs-Vorschlaege Umsetzung`,
  apflora_views.v_tpopkontr.`Kontr Aenderungs-Vorschlaege Kontrolle`,
  apflora_views.v_tpopkontr.`Kontr X-Koord`,
  apflora_views.v_tpopkontr.`Kontr Y-Koord`,
  apflora_views.v_tpopkontr.`Kontr Bemerkungen`,
  apflora_views.v_tpopkontr.`Kontr Lebensraum Delarze`,
  apflora_views.v_tpopkontr.`Kontr angrenzender Lebensraum Delarze`,
  apflora_views.v_tpopkontr.`Kontr Vegetationstyp`,
  apflora_views.v_tpopkontr.`Kontr Konkurrenz`,
  apflora_views.v_tpopkontr.`Kontr Moosschicht`,
  apflora_views.v_tpopkontr.`Kontr Krautschicht`,
  apflora_views.v_tpopkontr.`Kontr Strauchschicht`,
  apflora_views.v_tpopkontr.`Kontr Baumschicht`,
  apflora_views.v_tpopkontr.`Kontr Bodentyp`,
  apflora_views.v_tpopkontr.`Kontr Boden Kalkgehalt`,
  apflora_views.v_tpopkontr.`Kontr Boden Durchlaessigkeit`,
  apflora_views.v_tpopkontr.`Kontr Boden Humusgehalt`,
  apflora_views.v_tpopkontr.`Kontr Boden Naehrstoffgehalt`,
  apflora_views.v_tpopkontr.`Kontr Oberbodenabtrag`,
  apflora_views.v_tpopkontr.`Kontr Wasserhaushalt`,
  apflora_views.v_tpopkontr.`Kontr Uebereinstimmung mit Idealbiotop`,
  apflora_views.v_tpopkontr.`Kontr Handlungsbedarf`,
  apflora_views.v_tpopkontr.`Kontr Ueberpruefte Flaeche`,
  apflora_views.v_tpopkontr.`Kontr Flaeche der Teilpopulation m2`,
  apflora_views.v_tpopkontr.`Kontr auf Plan eingezeichnet`,
  apflora_views.v_tpopkontr.`Kontr Deckung durch Vegetation`,
  apflora_views.v_tpopkontr.`Kontr Deckung nackter Boden`,
  apflora_views.v_tpopkontr.`Kontr Deckung durch ueberpruefte Art`,
  apflora_views.v_tpopkontr.`Kontr auch junge Pflanzen`,
  apflora_views.v_tpopkontr.`Kontr maximale Veg-hoehe cm`,
  apflora_views.v_tpopkontr.`Kontr mittlere Veg-hoehe cm`,
  apflora_views.v_tpopkontr.`Kontr Gefaehrdung`,
  apflora_views.v_tpopkontr.`Kontrolle zuletzt geaendert`,
  apflora_views.v_tpopkontr.`Kontrolle zuletzt geaendert von`,
  apflora_views.v_tpopkontr.Anzahlen,
  apflora_views.v_tpopkontr.Zaehleinheiten,
  apflora_views.v_tpopkontr.Methoden
FROM
  (apflora_views.v_tpop_letzteKontrId
  LEFT JOIN
    apflora_views.v_tpopkontr
    ON apflora_views.v_tpop_letzteKontrId.MaxTPopKontrId = apflora_views.v_tpopkontr.TPopKontrId)
  INNER JOIN
    apflora_views.v_tpop
    ON apflora_views.v_tpop_letzteKontrId.TPopId = apflora_views.v_tpop.TPopId;

CREATE OR REPLACE VIEW v_qk_tpop_mitstatusaktuellundtpopbererloschen AS 
SELECT DISTINCT
  apflora.pop.ApArtId,
  apflora.pop.PopId,
  apflora.tpop.TPopId AS 'tpop_tpopid',
  'Teilpopulation mit Status "aktuell",
  gemaess dem letzten Teilpopulationsbericht erloschen' AS hw,
  CONCAT(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop.ApArtId,
    '&pop=',
    apflora.pop.PopId,
    '&tpop=',
    apflora.tpop.TPopId,
    '" target="_blank">',
    IFNULL(CONCAT('Pop: ', apflora.pop.PopNr), CONCAT('Pop: id=', apflora.pop.PopId)),
    IFNULL(CONCAT(' > TPop: ', apflora.tpop.TPopNr), CONCAT(' > TPop: id=', apflora.tpop.TPopId)),
    '</a>'
    ) AS link
FROM
  apflora.pop INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
  apflora.tpop.TPopHerkunft IN (100, 200, 210)
  AND apflora.tpop.TPopId IN (
    SELECT DISTINCT
      apflora.tpopber.TPopId
    FROM
      apflora.tpopber
      INNER JOIN
        apflora_views.v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr
        ON
          apflora.tpopber.TPopId = apflora_views.v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr.TPopId
          AND apflora.tpopber.TPopBerJahr = apflora_views.v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr.MaxTPopBerJahr
    WHERE
      apflora.tpopber.TPopBerEntwicklung = 8
  )
ORDER BY
  apflora.pop.ApArtId,
  apflora.pop.PopNr,
  apflora.pop.PopId,
  apflora.tpop.TPopNr,
  apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_qk_tpop_erloschenundrelevantaberletztebeobvor1950 AS 
SELECT
  apflora.ap.ApArtId,
  'erloschene Teilpopulation "Fuer AP-Bericht relevant" aber letzte Beobachtung vor 1950:' AS hw,
  CONCAT(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap.ApArtId,
    '&pop=',
    apflora.pop.PopId,
    '&tpop=',
    apflora.tpop.TPopId,
    '" target="_blank">',
    IFNULL(CONCAT('Pop: ', apflora.pop.PopNr), CONCAT('Pop: id=', apflora.pop.PopId)),
    IFNULL(CONCAT(' > TPop: ', apflora.tpop.TPopNr), CONCAT(' > TPop: id=', apflora.tpop.TPopId)),
    '</a>'
  ) AS link
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.PopId = apflora.tpop.PopId)
    ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
  apflora.tpop.TPopHerkunft IN (101, 202, 211)
  AND apflora.tpop.TPopApBerichtRelevant = 1
  AND apflora.tpop.TPopId NOT IN (
    SELECT DISTINCT
      apflora.tpopkontr.TPopId
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId
    WHERE
      apflora.tpopkontr.TPopKontrTyp NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.Anzahl > 0
  )
  AND apflora.tpop.TPopId IN (
    SELECT apflora.beobzuordnung.TPopId
    FROM
      apflora.beobzuordnung
      INNER JOIN
        apflora_views.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr
        ON apflora.beobzuordnung.TPopId = apflora_views.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr.TPopId
    WHERE
      apflora_views.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr.MaxJahr < 1950
  )
ORDER BY
  apflora.ap.ApArtId,
  apflora.pop.PopNr,
  apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_qk_pop_statusaktuellletzterpopbererloschen AS 
SELECT DISTINCT
  apflora.pop.ApArtId,
  'Population: Status ist "aktuell", der letzte Populations-Bericht meldet aber "erloschen":' AS hw,
  CONCAT(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop.ApArtId,
    '&pop=',
    apflora.pop.PopId,
    '" target="_blank">',
    IFNULL(
      CONCAT('Pop: ', apflora.pop.PopNr),
      CONCAT('Pop: id=', apflora.pop.PopId)
    ),
    '</a>'
  ) AS link
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora_views.v_pop_letzterpopber0_overall
      ON
        (v_pop_letzterpopber0_overall.PopBerJahr = apflora.popber.PopBerJahr)
        AND (v_pop_letzterpopber0_overall.PopId = apflora.popber.PopId))
    ON apflora.popber.PopId = apflora.pop.PopId)
  INNER JOIN
    apflora.tpop
    ON apflora.tpop.PopId = apflora.pop.PopId
WHERE
  apflora.popber.PopBerEntwicklung = 8
  AND apflora.pop.PopHerkunft IN (100, 200, 210)
  AND apflora.tpop.TPopApBerichtRelevant = 1
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId
ORDER BY
  apflora.pop.ApArtId,
  apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_statuserloschenletzterpopberaktuell AS 
SELECT DISTINCT
  apflora.pop.ApArtId,
  'Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell":' AS hw,
  CONCAT(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop.ApArtId,
    '&pop=',
    apflora.pop.PopId,
    '" target="_blank">',
    IFNULL(
      CONCAT('Pop: ', apflora.pop.PopNr),
      CONCAT('Pop: id=', apflora.pop.PopId)
    ),
    '</a>'
  ) AS link
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora_views.v_pop_letzterpopber0_overall
      ON
        (v_pop_letzterpopber0_overall.PopBerJahr = apflora.popber.PopBerJahr)
        AND (v_pop_letzterpopber0_overall.PopId = apflora.popber.PopId))
    ON apflora.popber.PopId = apflora.pop.PopId)
  INNER JOIN
    apflora.tpop
    ON apflora.tpop.PopId = apflora.pop.PopId
WHERE
  apflora.popber.PopBerEntwicklung < 8
  AND apflora.pop.PopHerkunft IN (101, 202, 211)
  AND apflora.tpop.TPopApBerichtRelevant = 1
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId
ORDER BY
  apflora.pop.ApArtId,
  apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_tpop_statusaktuellletzterpopbererloschen AS 
SELECT DISTINCT
  apflora.pop.ApArtId,
  'Teilpopulation: Status ist "aktuell", der letzte Teilpopulations-Bericht meldet aber "erloschen":' AS hw,
  CONCAT(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop.ApArtId,
    '&pop=',
    apflora.pop.PopId,
    '&tpop=',
    apflora.tpop.TPopId,
    '" target="_blank">',
    IFNULL(
      CONCAT('Pop: ', apflora.pop.PopNr),
      CONCAT('Pop: id=', apflora.pop.PopId)
    ),
    IFNULL(
      CONCAT(' > TPop: ', apflora.tpop.TPopNr),
      CONCAT(' > TPop: id=', apflora.tpop.TPopId)
    ),
    '</a>'
  ) AS link
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora_views.v_tpop_letztertpopber0_overall
        ON
          (v_tpop_letztertpopber0_overall.TPopBerJahr = apflora.tpopber.TPopBerJahr)
          AND (v_tpop_letztertpopber0_overall.TPopId = apflora.tpopber.TPopId))
      ON apflora.tpopber.TPopId = apflora.tpop.TPopId)
    ON apflora.tpop.PopId = apflora.pop.PopId
WHERE
  apflora.tpopber.TPopBerEntwicklung = 8
  AND apflora.tpop.TPopHerkunft IN (100, 200, 210)
  AND apflora.tpop.TPopApBerichtRelevant = 1
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId
ORDER BY
  apflora.pop.ApArtId,
  apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_tpop_statuserloschenletzterpopberaktuell AS 
SELECT DISTINCT
  apflora.pop.ApArtId,
  'Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell":' AS hw,
  CONCAT(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop.ApArtId,
    '&pop=',
    apflora.pop.PopId,
    '&tpop=',
    apflora.tpop.TPopId,
    '" target="_blank">',
    IFNULL(
      CONCAT('Pop: ', apflora.pop.PopNr),
      CONCAT('Pop: id=', apflora.pop.PopId)
    ),
    IFNULL(
      CONCAT(' > TPop: ', apflora.tpop.TPopNr),
      CONCAT(' > TPop: id=', apflora.tpop.TPopId)
    ),
    '</a>'
  ) AS link
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora_views.v_tpop_letztertpopber0_overall
        ON
          (v_tpop_letztertpopber0_overall.TPopBerJahr = apflora.tpopber.TPopBerJahr)
          AND (v_tpop_letztertpopber0_overall.TPopId = apflora.tpopber.TPopId))
      ON apflora.tpopber.TPopId = apflora.tpop.TPopId)
    ON apflora.tpop.PopId = apflora.pop.PopId
WHERE
  apflora.tpopber.TPopBerEntwicklung < 8
  AND apflora.tpop.TPopHerkunft IN (101, 202, 211)
  AND apflora.tpop.TPopApBerichtRelevant = 1
GROUP BY
  apflora.pop.ApArtId,
  apflora.pop.PopId,
  apflora.tpop.TPopId
ORDER BY
  apflora.pop.ApArtId,
  apflora.pop.PopNr,
  apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_exportevab_beob AS
SELECT
  CONCAT('{', apflora.tpopkontr.ZeitGuid, '}') AS fkZeitpunkt,
  CONCAT('{', apflora.tpopkontr.TPopKontrGuid, '}') AS idBeobachtung,
  IF(
      apflora.adresse.EvabIdPerson IS NOT NULL,
      apflora.adresse.EvabIdPerson,
      '{A1146AE4-4E03-4032-8AA8-BC46BA02F468}'
    ) AS fkAutor,
  apflora.ap.ApArtId AS fkArt,
  18 AS fkArtgruppe,
  1 AS fkAA1,
  tpopHerkunft.ZdsfHerkunft AS fkAAINTRODUIT,
  IF(
      apflora_views.v_tpopkontr_maxanzahl.Anzahl = 0,
      2,
      1
    ) AS fkAAPRESENCE,
  apflora.tpopkontr.TPopKontrGefaehrdung AS MENACES,
  LEFT(apflora.tpopkontr.TPopKontrVitalitaet, 200) AS VITALITE_PLANTE,
  LEFT(apflora.tpop.TPopBeschr, 244) AS STATION,
  LEFT(
    CONCAT(
      'Anzahlen: ',
      GROUP_CONCAT(apflora.tpopkontrzaehl.Anzahl SEPARATOR ', '),
      ', Zaehleinheiten: ',
      GROUP_CONCAT(apflora.tpopkontrzaehl_einheit_werte.ZaehleinheitTxt SEPARATOR ', '),
      ', Methoden: ',
      GROUP_CONCAT(apflora.tpopkontrzaehl_methode_werte.BeurteilTxt SEPARATOR ', ')
      ), 160
    ) AS ABONDANCE,
  'C' AS EXPERTISE_INTRODUIT,
  IF(
    tblAdresse_2.EvabIdPerson IS NOT NULL,
    tblAdresse_2.AdrName,
    'topos Marti & Müller AG Zürich'
  ) AS EXPERTISE_INTRODUITE_NOM
FROM
  (apflora.ap
  LEFT JOIN
    apflora.adresse AS tblAdresse_2
    ON apflora.ap.ApBearb = tblAdresse_2.AdrId)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte AS tpopHerkunft
        ON apflora.tpop.TPopHerkunft = tpopHerkunft.HerkunftId)
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
        INNER JOIN
          apflora_views.v_tpopkontr_maxanzahl
          ON apflora_views.v_tpopkontr_maxanzahl.TPopKontrId = apflora.tpopkontr.TPopKontrId)
        LEFT JOIN
          ((apflora.tpopkontrzaehl
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.Zaehleinheit = apflora.tpopkontrzaehl_einheit_werte.ZaehleinheitCode)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.Methode = apflora.tpopkontrzaehl_methode_werte.BeurteilCode)
          ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId)
        ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
      ON apflora.pop.PopId = apflora.tpop.PopId)
    ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
  apflora.ap.ApArtId > 150
  AND apflora.tpop.TPopXKoord IS NOT NULL
  AND apflora.tpop.TPopYKoord IS NOT NULL
  AND apflora.tpopkontr.TPopKontrTyp IN ("Zwischenbeurteilung", "Freiwilligen-Erfolgskontrolle")
  AND apflora.tpop.TPopHerkunft <> 201
  AND apflora.tpopkontr.TPopKontrJahr IS NOT NULL
  AND apflora.tpop.TPopBekanntSeit IS NOT NULL
  AND (apflora.tpopkontr.TPopKontrJahr - apflora.tpop.TPopBekanntSeit) > 5
GROUP BY
  apflora.tpopkontr.TPopKontrId;