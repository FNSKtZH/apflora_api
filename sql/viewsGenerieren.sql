CREATE OR REPLACE VIEW v_pop_berundmassnjahre AS
SELECT
  apflora.pop.PopId,
	apflora.popber.PopBerJahr as "Jahr"
FROM
	apflora.pop
	INNER JOIN
		apflora.popber
		ON apflora.pop.PopId = apflora.popber.PopId
UNION
DISTINCT SELECT
  apflora.pop.PopId,
	apflora.popmassnber.PopMassnBerJahr as "Jahr"
FROM
	apflora.pop
	INNER JOIN
		apflora.popmassnber
		ON apflora.pop.PopId = apflora.popmassnber.PopId
ORDER BY
	Jahr;

CREATE OR REPLACE VIEW v_popmassnber_anzmassn0 AS
SELECT
  apflora.popmassnber.PopId,
	apflora.popmassnber.PopMassnBerJahr,
	Count(apflora.tpopmassn.TPopMassnId) AS AnzahlvonTPopMassnId
FROM
	apflora.popmassnber
	INNER JOIN
		(apflora.tpop
		LEFT JOIN
			apflora.tpopmassn
			ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
		ON apflora.popmassnber.PopId = apflora.tpop.PopId
WHERE
	apflora.tpopmassn.TPopMassnJahr = apflora.popmassnber.PopMassnBerJahr
	Or apflora.tpopmassn.TPopMassnJahr Is Null
GROUP BY
  apflora.popmassnber.PopId,
	apflora.popmassnber.PopMassnBerJahr
ORDER BY
  apflora.popmassnber.PopId,
	apflora.popmassnber.PopMassnBerJahr;

CREATE OR REPLACE VIEW v_massn_jahre AS
SELECT
	apflora.tpopmassn.TPopMassnJahr 
FROM
	apflora.tpopmassn 
GROUP BY
	apflora.tpopmassn.TPopMassnJahr 
HAVING
	apflora.tpopmassn.TPopMassnJahr BETWEEN 1900 AND 2100
ORDER BY
	apflora.tpopmassn.TPopMassnJahr;

CREATE OR REPLACE VIEW v_ap_anzmassnprojahr0 AS 
SELECT
	apflora.ap.ApArtId,
	apflora.tpopmassn.TPopMassnJahr,
	Count(apflora.tpopmassn.TPopMassnId) AS AnzahlvonTPopMassnId
FROM
	apflora.ap
	INNER JOIN
		((apflora.pop
		INNER JOIN
			apflora.tpop
			ON apflora.pop.PopId = apflora.tpop.PopId)
		INNER JOIN
			apflora.tpopmassn
			ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.ap.ApStatus Between 1 And 3
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
GROUP BY
	apflora.ap.ApArtId,
	apflora.tpopmassn.TPopMassnJahr
HAVING
	apflora.tpopmassn.TPopMassnJahr Is Not Null
ORDER BY
	apflora.ap.ApArtId,
	apflora.tpopmassn.TPopMassnJahr;

CREATE OR REPLACE VIEW v_ap_apberrelevant AS
SELECT
	apflora.ap.ApArtId
FROM
	apflora.ap
	INNER JOIN
		(apflora.pop
		INNER JOIN
			apflora.tpop
			ON apflora.pop.PopId = apflora.tpop.PopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
GROUP BY
	apflora.ap.ApArtId;

#wird von v_apber_injahr benutzt. Dieses Wiederum in Access:
CREATE OR REPLACE VIEW v_erstemassnproap AS 
SELECT
	apflora.ap.ApArtId,
	Min(apflora.tpopmassn.TPopMassnJahr) AS MinvonTPopMassnJahr
FROM
	((apflora.ap
	INNER JOIN
		apflora.pop
		ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN
		apflora.tpop
		ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN
		apflora.tpopmassn
		ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId
GROUP BY
	apflora.ap.ApArtId;

CREATE OR REPLACE VIEW v_tpop_verwaist AS
SELECT
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
	apflora.tpop.TPopHoehe AS "TPop Hoehe ueM",
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
	apflora.tpop.MutWann AS "Datensatz zuletzt geaendert",
	apflora.tpop.MutWann AS "Datensatz zuletzt geaendert von"
FROM
	(apflora.pop
	RIGHT JOIN
		apflora.tpop
		ON apflora.pop.PopId = apflora.tpop.PopId)
	LEFT JOIN
		apflora.pop_status_werte AS domPopHerkunft_1
		ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId
WHERE
	apflora.pop.PopId Is Null
ORDER BY
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_massn AS
SELECT
	apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId,
	apflora_beob.adb_eigenschaften.Familie,
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
	apflora.tpopmassn.TPopMassnGuid AS "Massn Guid",
	apflora.tpopmassn.TPopMassnJahr AS "Massn Jahr",
	apflora.tpopmassn.TPopMassnDatum AS "Massn Datum",
	tpopmassn_typ_werte.MassnTypTxt AS "Massn Typ",
	apflora.tpopmassn.TPopMassnTxt AS "Massn Massnahme",
	apflora.adresse.AdrName AS "Massn BearbeiterIn",
	CAST(apflora.tpopmassn.TPopMassnBemTxt AS CHAR) AS "Massn Bemerkungen",
	apflora.tpopmassn.TPopMassnPlan AS "Massn Plan vorhanden",
	apflora.tpopmassn.TPopMassnPlanBez AS "Massn Plan Bezeichnung",
	apflora.tpopmassn.TPopMassnFlaeche AS "Massn Flaeche m2",
	apflora.tpopmassn.TPopMassnAnsiedForm AS "Massn Form der Ansiedlung",
	apflora.tpopmassn.TPopMassnAnsiedPflanzanordnung AS "Massn Pflanzanordnung",
	apflora.tpopmassn.TPopMassnMarkierung AS "Massn Markierung",
	apflora.tpopmassn.TPopMassnAnsiedAnzTriebe AS "Massn Anz Triebe",
	apflora.tpopmassn.TPopMassnAnsiedAnzPfl AS "Massn Pflanzen",
	apflora.tpopmassn.TPopMassnAnzPflanzstellen AS "Massn Anz Pflanzstellen",
	apflora.tpopmassn.TPopMassnAnsiedWirtspfl AS "Massn Wirtspflanze",
	apflora.tpopmassn.TPopMassnAnsiedHerkunftPop AS "Massn Herkunftspopulation",
	apflora.tpopmassn.TPopMassnAnsiedDatSamm AS "Massn Sammeldatum",
	apflora.tpopmassn.MutWann AS "Datensatz zuletzt geaendert",
	apflora.tpopmassn.MutWer AS "Datensatz zuletzt geaendert von"
FROM
	((((((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
		INNER JOIN
			((apflora.pop
			INNER JOIN
				apflora.tpop
				ON apflora.pop.PopId = apflora.tpop.PopId)
			INNER JOIN
				(apflora.tpopmassn
				LEFT JOIN
					apflora.tpopmassn_typ_werte
					ON apflora.tpopmassn.TPopMassnTyp = tpopmassn_typ_werte.MassnTypCode)
				ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
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
		apflora.pop_status_werte AS domPopHerkunft_1
		ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId)
	LEFT JOIN
		apflora.adresse
		ON apflora.tpopmassn.TPopMassnBearb = apflora.adresse.AdrId
WHERE
	apflora_beob.adb_eigenschaften.TaxonomieId > 150
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopmassn.TPopMassnJahr,
	apflora.tpopmassn.TPopMassnDatum,
	tpopmassn_typ_werte.MassnTypTxt;

CREATE OR REPLACE VIEW v_massn_fuergis AS
SELECT
	apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS "ApArt",
	apflora.ap_bearbstand_werte.DomainTxt AS "ApStatus",
	apflora.ap.ApJahr AS "ApStartImJahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "ApStandUmsetzung",
	apflora.pop.PopGuid AS "PopGuid",
	apflora.pop.PopNr AS "PopNr",
	apflora.pop.PopName AS "PopName",
	pop_status_werte.HerkunftTxt AS "PopStatus",
	apflora.pop.PopBekanntSeit AS "PopBekanntSeit",
	apflora.pop.PopXKoord AS "PopXKoordinaten",
	apflora.pop.PopYKoord AS "PopYKoordinaten",
	apflora.tpop.TPopGuid AS "TPopGuid",
	apflora.tpop.TPopNr AS "TPopNr",
	apflora.tpop.TPopGemeinde AS "TPopGemeinde",
	apflora.tpop.TPopFlurname AS "TPopFlurname",
	domPopHerkunft_1.HerkunftTxt AS "TPopStatus",
	apflora.tpop.TPopHerkunftUnklar AS "TPopStatusUnklar",
	apflora.tpop.TPopHerkunftUnklarBegruendung AS "TPopBegruendungFuerUnklarenStatus",
	apflora.tpop.TPopXKoord AS "TPopXKoordinaten",
	apflora.tpop.TPopYKoord AS "TPopYKoordinaten",
	apflora.tpop.TPopRadius AS "TPopRadius",
	apflora.tpop.TPopHoehe AS "TPopHoehe",
	apflora.tpop.TPopExposition AS "TPopExposition",
	apflora.tpop.TPopKlima AS "TPopKlima",
	apflora.tpop.TPopNeigung AS "TPopHangneigung",
	apflora.tpop.TPopBeschr AS "TPopBeschreibung",
	apflora.tpop.TPopKatNr AS "TPopKatasterNr",
	apflora.adresse.AdrName AS "TPopVerantwortlich",
	apflora.tpop.TPopApBerichtRelevant AS "TPopFuerApBerichtRelevant",
	apflora.tpop.TPopBekanntSeit AS "TPopBekanntSeit",
	apflora.tpop.TPopEigen AS "TPopEigentuemerIn",
	apflora.tpop.TPopKontakt AS "TPopKontaktVorOrt",
	apflora.tpop.TPopNutzungszone AS "TPopNutzungszone",
	apflora.tpop.TPopBewirtschafterIn AS "TPopBewirtschafterIn",
	apflora.tpop.TPopBewirtschaftung AS "TPopBewirtschaftung",
	apflora.tpopmassn.TPopMassnGuid AS "MassnGuid",
	apflora.tpopmassn.TPopMassnJahr AS "MassnJahr",
	apflora.tpopmassn.TPopMassnDatum AS "MassnDatum",
	tpopmassn_typ_werte.MassnTypTxt AS "MassnTyp",
	apflora.tpopmassn.TPopMassnTxt AS "MassnMassnahme",
	apflora.adresse.AdrName AS "MassnBearbeiterIn",
	apflora.tpopmassn.TPopMassnPlan AS "MassnPlanVorhanden",
	apflora.tpopmassn.TPopMassnPlanBez AS "MassnPlanBezeichnung",
	apflora.tpopmassn.TPopMassnFlaeche AS "MassnFlaeche",
	apflora.tpopmassn.TPopMassnAnsiedForm AS "MassnFormDerAnsiedlung",
	apflora.tpopmassn.TPopMassnAnsiedPflanzanordnung AS "MassnPflanzanordnung",
	apflora.tpopmassn.TPopMassnMarkierung AS "MassnMarkierung",
	 apflora.tpopmassn.TPopMassnAnsiedAnzTriebe AS "MassnAnzTriebe",
	apflora.tpopmassn.TPopMassnAnsiedAnzPfl AS "MassnPflanzen",
	apflora.tpopmassn.TPopMassnAnzPflanzstellen AS "MassnAnzPflanzstellen",
	apflora.tpopmassn.TPopMassnAnsiedWirtspfl AS "MassnWirtspflanze",
	apflora.tpopmassn.TPopMassnAnsiedHerkunftPop AS "MassnHerkunftspopulation",
	apflora.tpopmassn.TPopMassnAnsiedDatSamm AS "MassnSammeldatum",
	apflora.tpopmassn.MutWann AS "MassnMutWann",
	apflora.tpopmassn.MutWer AS "MassnMutWer"
FROM
	((((((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
		INNER JOIN
			((apflora.pop
			INNER JOIN
				apflora.tpop
				ON apflora.pop.PopId = apflora.tpop.PopId)
			INNER JOIN
				(apflora.tpopmassn
				LEFT JOIN
					apflora.tpopmassn_typ_werte
					ON apflora.tpopmassn.TPopMassnTyp = tpopmassn_typ_werte.MassnTypCode)
				ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
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
		apflora.pop_status_werte AS domPopHerkunft_1
		ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId)
	LEFT JOIN
		apflora.adresse
		ON apflora.tpopmassn.TPopMassnBearb = apflora.adresse.AdrId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopmassn.TPopMassnJahr,
	apflora.tpopmassn.TPopMassnDatum,
	tpopmassn_typ_werte.MassnTypTxt;

CREATE OR REPLACE VIEW v_tpop_anzmassn AS
SELECT
  apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId,
  apflora_beob.adb_eigenschaften.Familie,
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
  Count(apflora.tpopmassn.TPopMassnId) AS "Anzahl Massnahmen"
FROM
  apflora_beob.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.tpopmassn
          ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
        LEFT JOIN
          apflora.pop_status_werte AS domPopHerkunft_1
          ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId)
        ON apflora.pop.PopId = apflora.tpop.PopId)
      ON apflora.ap.ApArtId = apflora.pop.ApArtId)
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
  ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId
GROUP BY
  apflora.tpop.TPopGuid
ORDER BY
  apflora_beob.adb_eigenschaften.Artname,
  apflora.pop.PopNr,
  apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_pop_anzmassn AS
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
	Count(apflora.tpopmassn.TPopMassnId) AS "Anzahl Massnahmen"
FROM
	((((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN
		((apflora.pop
		LEFT JOIN
			apflora.tpop
			ON apflora.pop.PopId = apflora.tpop.PopId)
		LEFT JOIN
			apflora.tpopmassn
			ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	LEFT JOIN
		apflora.ap_bearbstand_werte
		ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN
		apflora.ap_umsetzung_werte
		ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN
		apflora.pop_status_werte
		ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId
GROUP BY
	apflora_beob.adb_eigenschaften.TaxonomieId,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.ap_bearbstand_werte.DomainTxt,
	apflora.ap.ApJahr,
	apflora.ap_umsetzung_werte.DomainTxt,
	apflora.pop.PopGuid,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	pop_status_werte.HerkunftTxt,
	apflora.pop.PopHerkunftUnklar,
	apflora.pop.PopHerkunftUnklarBegruendung,
	apflora.pop.PopBekanntSeit,
	apflora.pop.PopXKoord,
	apflora.pop.PopYKoord
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_pop_anzkontr AS
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
	Count(apflora.tpopkontr.TPopKontrId) AS "Anzahl Kontrollen"
FROM
	((((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN
		((apflora.pop
		LEFT JOIN
			apflora.tpop
			ON apflora.pop.PopId = apflora.tpop.PopId)
		LEFT JOIN
			apflora.tpopkontr
			ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	LEFT JOIN
		apflora.ap_bearbstand_werte
		ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN
		apflora.ap_umsetzung_werte
		ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN
		apflora.pop_status_werte
		ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId
GROUP BY
	apflora_beob.adb_eigenschaften.TaxonomieId,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.ap_bearbstand_werte.DomainTxt,
	apflora.ap.ApJahr,
	apflora.ap_umsetzung_werte.DomainTxt,
	apflora.pop.PopGuid,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	pop_status_werte.HerkunftTxt,
	apflora.pop.PopHerkunftUnklar,
	apflora.pop.PopHerkunftUnklarBegruendung,
	apflora.pop.PopBekanntSeit,
	apflora.pop.PopXKoord,
	apflora.pop.PopYKoord
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_ap_anzmassn AS
SELECT
	apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	Count(apflora.tpopmassn.TPopMassnId) AS "Anzahl Massnahmen"
FROM
	(((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN
		((apflora.pop
		LEFT JOIN
			apflora.tpop
			ON apflora.pop.PopId = apflora.tpop.PopId)
		LEFT JOIN
			apflora.tpopmassn
			ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	LEFT JOIN
		apflora.ap_bearbstand_werte
		ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN
		apflora.ap_umsetzung_werte
		ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode
GROUP BY
	apflora_beob.adb_eigenschaften.TaxonomieId,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.ap_bearbstand_werte.DomainTxt,
	apflora.ap.ApJahr,
	apflora.ap_umsetzung_werte.DomainTxt
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_ap_anzkontr AS
SELECT
	apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	Count(apflora.tpopkontr.TPopKontrId) AS "Anzahl Kontrollen"
FROM
	(((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN
		((apflora.pop
		LEFT JOIN
			apflora.tpop
			ON apflora.pop.PopId = apflora.tpop.PopId)
		LEFT JOIN
			apflora.tpopkontr
			ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	LEFT JOIN
		apflora.ap_bearbstand_werte
		ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN
		apflora.ap_umsetzung_werte
		ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode
GROUP BY
	apflora_beob.adb_eigenschaften.TaxonomieId,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.ap_bearbstand_werte.DomainTxt,
	apflora.ap.ApJahr,
	apflora.ap_umsetzung_werte.DomainTxt
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_pop AS
SELECT
	apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	apflora.pop.PopId,
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
	apflora.pop.MutWer AS "Datensatz zuletzt geaendert von"
FROM
	((((apflora_beob.adb_eigenschaften
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
		ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_pop_ohnekoord AS
SELECT
	apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	apflora.pop.PopId,
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
	apflora.pop.MutWer AS "Datensatz zuletzt geaendert von"
FROM
	((((apflora_beob.adb_eigenschaften
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
		ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId
WHERE
	apflora.pop.PopXKoord IS NULL
	OR apflora.pop.PopYKoord IS NULL 
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_pop_fuergis AS
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
	apflora.pop.PopXKoord AS "XKoordinaten",
	apflora.pop.PopYKoord AS "YKoordinaten",
	apflora.pop.MutWann AS "Datensatz zuletzt geaendert",
	apflora.pop.MutWer AS "Datensatz zuletzt geaendert von"
FROM
	((((apflora_beob.adb_eigenschaften
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
		ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId
WHERE
	apflora.pop.PopXKoord > 0
	AND apflora.pop.PopYKoord > 0
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr;

#im Gebrauch (Access):
CREATE OR REPLACE VIEW v_pop_verwaist AS
SELECT
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
	apflora.ap.ApArtId
FROM
	(apflora.ap
	RIGHT JOIN
		apflora.pop
		ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	LEFT JOIN
		apflora.pop_status_werte
		ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId
WHERE
	apflora.ap.ApArtId Is Null
ORDER BY
	apflora.pop.PopName,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_pop_ohnetpop AS
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
	apflora.pop.MutWann AS "Datensatz zuletzt geaendert",
	apflora.pop.MutWer AS "Datensatz zuletzt geaendert von"
FROM
	(((((apflora_beob.adb_eigenschaften
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
		apflora.tpop
		ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopId Is Null
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_popber AS
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
	apflora.popber.PopBerId AS "PopBer Id",
	apflora.popber.PopBerJahr AS "PopBer Jahr",
	pop_entwicklung_werte.EntwicklungTxt AS "PopBer Entwicklung",
	apflora.popber.PopBerTxt AS "PopBer Bemerkungen",
	apflora.popber.MutWann AS "PopBer MutWann",
	apflora.popber.MutWer AS "PopBer MutWer"
FROM
	((((((apflora_beob.adb_eigenschaften
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
	INNER JOIN
		apflora.popber
		ON apflora.pop.PopId = apflora.popber.PopId)
	LEFT JOIN
		apflora.pop_entwicklung_werte
		ON apflora.popber.PopBerEntwicklung = pop_entwicklung_werte.EntwicklungId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.popber.PopBerJahr,
	pop_entwicklung_werte.EntwicklungTxt;

#im Gebrauch (Access):
CREATE OR REPLACE VIEW v_popber_verwaist AS
SELECT
	apflora.popber.PopBerId AS "PopBer Id",
	apflora.popber.PopId AS "PopBer PopId",
	apflora.popber.PopBerJahr AS "PopBer Jahr",
	pop_entwicklung_werte.EntwicklungTxt AS "PopBer Entwicklung",
	apflora.popber.PopBerTxt AS "PopBer Bemerkungen",
	apflora.popber.MutWann AS "PopBer MutWann",
	apflora.popber.MutWer AS "PopBer MutWer"
FROM
	(apflora.pop
	RIGHT JOIN
		apflora.popber
		ON apflora.pop.PopId = apflora.popber.PopId)
	LEFT JOIN
		apflora.pop_entwicklung_werte
		ON apflora.popber.PopBerEntwicklung = pop_entwicklung_werte.EntwicklungId
WHERE
	apflora.pop.PopId Is Null
ORDER BY
	apflora.popber.PopBerJahr,
	pop_entwicklung_werte.EntwicklungTxt;

CREATE OR REPLACE VIEW v_popmassnber AS
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
	apflora.popmassnber.PopMassnBerId AS "PopMassnBer Id",
	apflora.popmassnber.PopMassnBerJahr AS "PopMassnBer Jahr",
	tpopmassn_erfbeurt_werte.BeurteilTxt AS "PopMassnBer Entwicklung",
	apflora.popmassnber.PopMassnBerTxt AS "PopMassnBer Interpretation",
	apflora.popmassnber.MutWann AS "PopMassnBer MutWann",
	apflora.popmassnber.MutWer AS "PopMassnBer MutWer"
FROM
	((((((apflora_beob.adb_eigenschaften
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
	INNER JOIN
		apflora.popmassnber
		ON apflora.pop.PopId = apflora.popmassnber.PopId)
	LEFT JOIN
		apflora.tpopmassn_erfbeurt_werte
		ON apflora.popmassnber.PopMassnBerErfolgsbeurteilung = tpopmassn_erfbeurt_werte.BeurteilId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr;

#im Gebrauch (Access):
CREATE OR REPLACE VIEW v_popmassnber_verwaist AS
SELECT
	apflora.popmassnber.PopMassnBerId AS "PopMassnBer Id",
	apflora.popmassnber.PopId AS "PopMassnBer PopId",
	apflora.popmassnber.PopMassnBerJahr AS "PopMassnBer Jahr",
	tpopmassn_erfbeurt_werte.BeurteilTxt AS "PopMassnBer Entwicklung",
	apflora.popmassnber.PopMassnBerTxt AS "PopMassnBer Interpretation",
	apflora.popmassnber.MutWann AS "PopMassnBer MutWann",
	apflora.popmassnber.MutWer AS "PopMassnBer MutWer"
FROM
	(apflora.pop
	RIGHT JOIN
		apflora.popmassnber
		ON apflora.pop.PopId = apflora.popmassnber.PopId)
	LEFT JOIN
		apflora.tpopmassn_erfbeurt_werte
		ON apflora.popmassnber.PopMassnBerErfolgsbeurteilung = tpopmassn_erfbeurt_werte.BeurteilId
WHERE
	apflora.pop.PopId Is Null
ORDER BY
	apflora.popmassnber.PopMassnBerJahr,
	tpopmassn_erfbeurt_werte.BeurteilTxt;

CREATE OR REPLACE VIEW v_tpop AS
SELECT
	apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId,
	apflora_beob.adb_eigenschaften.Familie,
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	apflora.adresse.AdrName AS "AP verantwortlich",
	apflora.pop.PopGuid AS "Pop Guid",
	apflora.pop.PopNr AS "Pop Nr",
	apflora.pop.PopName AS "Pop Name",
	pop_status_werte.HerkunftTxt AS "Pop Status",
	apflora.pop.PopBekanntSeit AS "Pop bekannt seit",
	apflora.pop.PopHerkunftUnklar AS "Pop Status unklar",
	apflora.pop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status",
	apflora.pop.PopXKoord AS "Pop X-Koordinaten",
	apflora.pop.PopYKoord AS "Pop Y-Koordinaten",
	apflora.tpop.TPopId,
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
	apflora.tpop.MutWann AS "Teilpopulation zuletzt geaendert",
	apflora.tpop.MutWer AS "Teilpopulation zuletzt geaendert von"
FROM
	((((((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN
		(apflora.pop
		INNER JOIN
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
		apflora.pop_status_werte
		ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
	LEFT JOIN
		apflora.pop_status_werte AS domPopHerkunft_1
		ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId)
	LEFT JOIN
		apflora.adresse
		ON apflora.ap.ApBearb = apflora.adresse.AdrId
WHERE
	apflora_beob.adb_eigenschaften.TaxonomieId > 150
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_tpop_fuergis AS
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
	apflora.tpop.TPopGuid AS "TPop Guid",
	apflora.tpop.TPopNr AS "TPop Nr",
	apflora.tpop.TPopGemeinde AS "TPop Gemeinde",
	apflora.tpop.TPopFlurname AS "TPop Flurname",
	domPopHerkunft_1.HerkunftTxt AS "TPop Status",
	apflora.tpop.TPopBekanntSeit AS "TPop bekannt seit",
	apflora.tpop.TPopHerkunftUnklar AS "TPop Status unklar",
	apflora.tpop.TPopHerkunftUnklarBegruendung AS "TPop Begruendung fuer unklaren Status",
	apflora.tpop.TPopXKoord AS "TPopXKoordinaten",
	apflora.tpop.TPopYKoord AS "TPopYKoordinaten",
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
	apflora.tpop.MutWann AS "Datensatz zuletzt geaendert",
	apflora.tpop.MutWann AS "Datensatz zuletzt geaendert von"
FROM
	(((((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN
		(apflora.pop
		INNER JOIN
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
		apflora.pop_status_werte
		ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
	LEFT JOIN
		apflora.pop_status_werte AS domPopHerkunft_1
		ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId
WHERE
	apflora.tpop.TPopYKoord > 0
	AND apflora.tpop.TPopXKoord > 0
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

#im Gebrauch durch exportPopVonApOhneStatus.php:
CREATE OR REPLACE VIEW v_pop_vonapohnestatus AS 
SELECT
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.ap.ApStatus AS "Bearbeitungsstand AP",
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.pop.PopHerkunft AS Status
FROM
	apflora_beob.adb_eigenschaften
	INNER JOIN
		(apflora.ap
		INNER JOIN
			apflora.pop
			ON apflora.ap.ApArtId = apflora.pop.ApArtId)
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId
WHERE
	apflora.ap.ApStatus = 3
	AND apflora.pop.PopHerkunft Is Null
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_apber_zielber AS 
SELECT
	apflora.zielber.*
FROM
	apflora.zielber
	INNER JOIN
		apflora._variable
		ON apflora.zielber.ZielBerJahr = apflora._variable.JBerJahr;

CREATE OR REPLACE VIEW v_abper_ziel AS
SELECT
  apflora.ziel.*,
  ziel_typ_werte.ZieltypTxt
FROM
  apflora._variable
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.ziel_typ_werte
      ON apflora.ziel.ZielTyp = ziel_typ_werte.ZieltypId)
    ON apflora._variable.JBerJahr = apflora.ziel.ZielJahr
WHERE
  apflora.ziel.ZielTyp IN(1, 2, 1170775556)
ORDER BY
  apflora.ziel.ZielTyp,
  apflora.ziel.ZielBezeichnung;

CREATE OR REPLACE VIEW v_apber_verwaist AS
SELECT
	apflora.apber.JBerId AS "JBer Id",
	apflora.apber.ApArtId AS "JBer ApArtId",
	apflora.apber.JBerJahr AS "JBer Jahr",
	apflora.apber.JBerSituation AS "JBer Situation",
	apflora.apber.JBerVergleichVorjahrGesamtziel AS "JBer Vergleich Vorjahr-Gesamtziel",
	ap_erfkrit_werte.BeurteilTxt AS "JBer Beurteilung",
	apflora.apber.JBerVeraenGegenVorjahr AS "JBer Veraend zum Vorjahr",
	apflora.apber.JBerAnalyse AS "JBer Analyse",
	apflora.apber.JBerUmsetzung AS "JBer Konsequenzen Umsetzung",
	apflora.apber.JBerErfko AS "JBer Konsequenzen Erfolgskontrolle",
	apflora.apber.JBerATxt AS "JBer Bemerkungen zu A",
	apflora.apber.JBerBTxt AS "JBer Bemerkungen zu B",
	apflora.apber.JBerCTxt AS "JBer Bemerkungen zu C",
	apflora.apber.JBerDTxt AS "JBer Bemerkungen zu D",
	apflora.apber.JBerDatum AS "JBer Datum",
	apflora.adresse.AdrName AS "JBer BearbeiterIn",
	apflora.apber.MutWann AS "JBer MutWann",
	apflora.apber.MutWer AS "JBer MutWer"
FROM
	((apflora.ap
	RIGHT JOIN
		apflora.apber
		ON apflora.ap.ApArtId = apflora.apber.ApArtId)
	LEFT JOIN
		apflora.adresse
		ON apflora.apber.JBerBearb = apflora.adresse.AdrId)
	LEFT JOIN
		apflora.ap_erfkrit_werte
		ON apflora.apber.JBerBeurteilung = ap_erfkrit_werte.BeurteilId
WHERE
	apflora.ap.ApArtId Is Null
ORDER BY
	apflora.apber.ApArtId,
	apflora.apber.JBerJahr,
	apflora.apber.JBerDatum;

CREATE OR REPLACE VIEW v_apber_artd AS 
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
	apflora.adresse.AdrName AS Bearbeiter,
	ap_erfkrit_werte.BeurteilTxt
FROM
	(apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN
		(((apflora.apber
		LEFT JOIN
			apflora.adresse
			ON apflora.apber.JBerBearb = apflora.adresse.AdrId)
		LEFT JOIN
			apflora.ap_erfkrit_werte
			ON apflora.apber.JBerBeurteilung = apflora.ap_erfkrit_werte.BeurteilId)
		INNER JOIN
			apflora._variable
			ON apflora.apber.JBerJahr = apflora._variable.JBerJahr)
		ON apflora.ap.ApArtId = apflora.apber.ApArtId;

CREATE OR REPLACE VIEW v_fnskef AS 
SELECT
	apflora_beob.adb_eigenschaften.TaxonomieId,
	IF(
		apflora_beob.adb_eigenschaften.KefArt = "-1",
		"Ja",
		""
	) AS FnsKefArt2,
	IF(
		Round((apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4, 0) = (apflora._variable.JBerJahr - apflora_beob.adb_eigenschaften.KefKontrolljahr) / 4,
		"Ja",
		""
	) AS FnsKefKontrJahr2
FROM
	apflora_beob.adb_eigenschaften,
	apflora._variable
ORDER BY
	 apflora_beob.adb_eigenschaften.TaxonomieId;

CREATE OR REPLACE VIEW v_pop_massnseitbeginnap AS 
SELECT
	apflora.tpopmassn.TPopId
FROM
	apflora.ap
	INNER JOIN
		((apflora.pop
		INNER JOIN
			apflora.tpop
			ON apflora.pop.PopId = apflora.tpop.PopId)
		INNER JOIN
			apflora.tpopmassn
			ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpopmassn.TPopMassnJahr >= apflora.ap.ApJahr
GROUP BY
	apflora.tpopmassn.TPopId;

CREATE OR REPLACE VIEW v_apber AS 
SELECT
  apflora.ap.ApArtId AS ApArtId,
	apflora.apber.JBerId AS JBerId,
	apflora_beob.adb_eigenschaften.Artname AS Name,
	apflora.apber.JBerJahr AS JBerJahr,
	apflora.apber.JBerSituation AS JBerSituation,
	apflora.apber.JBerVergleichVorjahrGesamtziel AS JBerVergleichVorjahrGesamtziel,
	ap_erfkrit_werte.BeurteilTxt AS JBerBeurteilung,
	apflora.apber.JBerVeraenGegenVorjahr AS JBerVeraenGegenVorjahr,
	apflora.apber.JBerAnalyse AS JBerAnalyse,
	apflora.apber.JBerUmsetzung AS JBerUmsetzung,
	apflora.apber.JBerErfko AS JBerErfko,
	apflora.apber.JBerATxt AS JBerATxt,
	apflora.apber.JBerBTxt AS JBerBTxt,
	apflora.apber.JBerCTxt AS JBerCTxt,
	apflora.apber.JBerDTxt AS JBerDTxt,
	apflora.apber.JBerDatum AS JBerDatum,apflora.adresse.AdrName AS JBerBearb 
FROM
	apflora.ap
	INNER JOIN
		apflora_beob.adb_eigenschaften
		ON (apflora.ap.ApArtId = apflora_beob.adb_eigenschaften.TaxonomieId)
	INNER JOIN
		((apflora.apber
		LEFT JOIN
			apflora.ap_erfkrit_werte
			ON (apflora.apber.JBerBeurteilung = ap_erfkrit_werte.BeurteilId))
		LEFT JOIN
			apflora.adresse
			ON (apflora.apber.JBerBearb = apflora.adresse.AdrId))
		ON apflora.ap.ApArtId = apflora.apber.ApArtId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_tpop_letztermassnber0 AS 
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId,
	apflora.tpopmassnber.TPopMassnBerJahr
FROM
	apflora._variable,
	((apflora.pop
	INNER JOIN
		apflora.tpop
		ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN
		apflora.tpopmassnber
		ON apflora.tpop.TPopId = apflora.tpopmassnber.TPopId)
	INNER JOIN
		apflora.tpopmassn
		ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId
WHERE
	apflora.tpopmassnber.TPopMassnBerJahr <= apflora._variable.JBerJahr
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.tpopmassn.TPopMassnJahr <= apflora._variable.JBerJahr
	AND apflora.pop.PopHerkunft <> 300
	AND (apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung BETWEEN 1 AND 5);

CREATE OR REPLACE VIEW v_tpop_letztertpopber0 AS
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId,
	apflora.tpopber.TPopBerJahr
FROM
	apflora._variable,
	apflora.ap
	INNER JOIN
		(apflora.pop
		INNER JOIN (apflora.tpop
			INNER JOIN
				apflora.tpopber
				ON apflora.tpop.TPopId = apflora.tpopber.TPopId)
			ON apflora.pop.PopId = apflora.tpop.PopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpopber.TPopBerJahr <= apflora._variable.JBerJahr
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300;

CREATE OR REPLACE VIEW v_pop_letztermassnber0 AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId,
	apflora.popmassnber.PopMassnBerJahr
FROM
  apflora._variable,
	((apflora.pop
	INNER JOIN
		apflora.popmassnber
		ON apflora.pop.PopId = apflora.popmassnber.PopId)
	INNER JOIN
		apflora.tpop
		ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN
		apflora.tpopmassn
		ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId
WHERE
	apflora.popmassnber.PopMassnBerJahr <= apflora._variable.JBerJahr
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.tpopmassn.TPopMassnJahr <= apflora._variable.JBerJahr
	AND apflora.pop.PopHerkunft <> 300;

CREATE OR REPLACE VIEW v_pop_letzterpopber0 AS
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId,
	apflora.popber.PopBerJahr
FROM
  apflora._variable,
	(apflora.pop
	INNER JOIN
		apflora.popber
		ON apflora.pop.PopId = apflora.popber.PopId)
	INNER JOIN
		apflora.tpop
		ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.popber.PopBerJahr <= apflora._variable.JBerJahr
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300;

CREATE OR REPLACE VIEW v_tpop_mitapaberohnestatus AS 
SELECT
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.ap_bearbstand_werte.DomainTxt AS "Bearbeitungsstand AP",
	apflora.pop.PopNr,
	apflora.pop.PopName,
	pop_status_werte.HerkunftTxt AS "Status Population",
	apflora.tpop.TPopNr,
	apflora.tpop.TPopFlurname,
	apflora.tpop.TPopHerkunft AS "Status Teilpopulation"
FROM
	(apflora.ap_bearbstand_werte
	INNER JOIN
		(apflora_beob.adb_eigenschaften
		INNER JOIN
			apflora.ap
			ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
		ON apflora.ap_bearbstand_werte.DomainCode = apflora.ap.ApStatus)
	INNER JOIN
		((apflora.pop
		INNER JOIN
			apflora.pop_status_werte
			ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
		INNER JOIN
			apflora.tpop
			ON apflora.pop.PopId = apflora.tpop.PopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopHerkunft Is Null
	AND apflora.ap.ApStatus = 3
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_tpop_ohnebekanntseit AS 
SELECT
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.ap_bearbstand_werte.DomainTxt AS ApStatus_,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname,
	apflora.tpop.TPopBekanntSeit
FROM
	((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN
		apflora.ap_bearbstand_werte
		ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	INNER JOIN
		(apflora.pop
		INNER JOIN
			apflora.tpop
			ON apflora.pop.PopId = apflora.tpop.PopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopBekanntSeit Is Null
	AND apflora.ap.ApStatus Between 1 And 3
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname;

CREATE OR REPLACE VIEW v_tpop_ohnekoord AS 
SELECT
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.ap_bearbstand_werte.DomainTxt AS ApStatus_,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname,
	apflora.tpop.TPopXKoord,
	apflora.tpop.TPopYKoord
FROM
	((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN
		apflora.ap_bearbstand_werte
		ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	INNER JOIN
		(apflora.pop
		INNER JOIN
			apflora.tpop
			ON apflora.pop.PopId = apflora.tpop.PopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	(apflora.tpop.TPopXKoord Is Null
	AND apflora.ap.ApStatus Between 1 And 3)
	OR (
		apflora.tpop.TPopYKoord Is Null
		AND apflora.ap.ApStatus Between 1 And 3
	)
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname;

CREATE OR REPLACE VIEW v_tpopber_letzterber AS 
SELECT
	apflora.tpopber.TPopId,
	Max(apflora.tpopber.TPopBerJahr) AS MaxvonTPopBerJahr
FROM
	apflora.tpopber
GROUP BY
	apflora.tpopber.TPopId;

CREATE OR REPLACE VIEW v_ap_ausw AS 
SELECT
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.ap_bearbstand_werte.DomainTxt AS "Bearbeitungsstand AP",
	apflora.ap.ApJahr AS "Start AP im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "Stand Umsetzung AP",
	apflora.adresse.AdrName AS "Verantwortlich",
	apflora.ap.MutWann AS "Letzte Aenderung",
	apflora.ap.MutWer AS "Letzte(r) Bearbeiter(in)"
FROM
	(((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN
		apflora.ap_bearbstand_werte
		ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN
		apflora.ap_umsetzung_werte
		ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN
		apflora.adresse
		ON apflora.ap.ApBearb = apflora.adresse.AdrId
WHERE
	apflora.ap.ApStatus Between 1 And 3
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_ap AS 
SELECT
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Bearbeitungsstand",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	apflora.adresse.AdrName AS "AP verantwortlich",
	apflora.ap.MutWann AS "AP Letzte Aenderung",
	apflora.ap.MutWer AS "AP Letzte(r) Bearbeiter(in)"
FROM
	(((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN
		apflora.ap_bearbstand_werte
		ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN
		apflora.ap_umsetzung_werte
		ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN
		apflora.adresse
		ON apflora.ap.ApBearb = apflora.adresse.AdrId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_idealbiotop AS 
SELECT
	apflora.ap.ApArtId AS "AP ApArtId",
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Bearbeitungsstand",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	apflora.adresse.AdrName AS "AP verantwortlich",
	apflora.ap.MutWann AS "AP Letzte Aenderung",
	apflora.ap.MutWer AS "AP Letzte(r) Bearbeiter(in)",
	apflora.idealbiotop.IbApArtId AS "Ib ApArtId",
	apflora.idealbiotop.IbErstelldatum AS "Ib Erstelldatum",
	apflora.idealbiotop.IbHoehenlage AS "Ib Hoehenlage",
	apflora.idealbiotop.IbRegion AS "Ib Region",
	apflora.idealbiotop.IbExposition AS "Ib Exposition",
	apflora.idealbiotop.IbBesonnung AS "Ib Besonnung",
	apflora.idealbiotop.IbHangneigung AS "Ib Hangneigung",
	apflora.idealbiotop.IbBodenTyp AS "Ib Bodentyp",
	apflora.idealbiotop.IbBodenKalkgehalt AS "Ib Boden Kalkgehalt",
	apflora.idealbiotop.IbBodenDurchlaessigkeit AS "Ib Boden Durchlaessigkeit",
	apflora.idealbiotop.IbBodenHumus AS "Ib Boden Humus",
	apflora.idealbiotop.IbBodenNaehrstoffgehalt AS "Ib Boden Naehrstoffgehalt",
	apflora.idealbiotop.IbWasserhaushalt AS "Ib Wasserhaushalt",
	apflora.idealbiotop.IbKonkurrenz AS "Ib Konkurrenz",
	apflora.idealbiotop.IbMoosschicht AS "Ib Moosschicht",
	apflora.idealbiotop.IbKrautschicht AS "Ib Krautschicht",
	apflora.idealbiotop.IbStrauchschicht AS "Ib Strauchschicht",
	apflora.idealbiotop.IbBaumschicht AS "Ib Baumschicht",
	apflora.idealbiotop.IbBemerkungen AS "Ib Bemerkungen",
	apflora.idealbiotop.MutWann AS "Ib MutWann",
	apflora.idealbiotop.MutWer AS "Ib MutWer"
FROM
	apflora.idealbiotop
	LEFT JOIN
		((((apflora_beob.adb_eigenschaften
		RIGHT JOIN
			apflora.ap
			ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
		LEFT JOIN
			apflora.ap_bearbstand_werte
			ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
		LEFT JOIN
			apflora.ap_umsetzung_werte
			ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
		LEFT JOIN
			apflora.adresse
			ON apflora.ap.ApBearb = apflora.adresse.AdrId)
		ON apflora.idealbiotop.IbApArtId = apflora.ap.ApArtId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.idealbiotop.IbErstelldatum;

CREATE OR REPLACE VIEW v_idealbiotop_verwaist AS 
SELECT
	apflora.ap.ApArtId AS "AP ApArtId",
	apflora.idealbiotop.IbApArtId AS "Ib ApArtId",
	apflora.idealbiotop.IbErstelldatum AS "Ib Erstelldatum",
	apflora.idealbiotop.IbHoehenlage AS "Ib Hoehenlage",
	apflora.idealbiotop.IbRegion AS "Ib Region",
	apflora.idealbiotop.IbExposition AS "Ib Exposition",
	apflora.idealbiotop.IbBesonnung AS "Ib Besonnung",
	apflora.idealbiotop.IbHangneigung AS "Ib Hangneigung",
	apflora.idealbiotop.IbBodenTyp AS "Ib Bodentyp",
	apflora.idealbiotop.IbBodenKalkgehalt AS "Ib Boden Kalkgehalt",
	apflora.idealbiotop.IbBodenDurchlaessigkeit AS "Ib Boden Durchlaessigkeit",
	apflora.idealbiotop.IbBodenHumus AS "Ib Boden Humus",
	apflora.idealbiotop.IbBodenNaehrstoffgehalt AS "Ib Boden Naehrstoffgehalt",
	apflora.idealbiotop.IbWasserhaushalt AS "Ib Wasserhaushalt",
	apflora.idealbiotop.IbKonkurrenz AS "Ib Konkurrenz",
	apflora.idealbiotop.IbMoosschicht AS "Ib Moosschicht",
	apflora.idealbiotop.IbKrautschicht AS "Ib Krautschicht",
	apflora.idealbiotop.IbStrauchschicht AS "Ib Strauchschicht",
	apflora.idealbiotop.IbBaumschicht AS "Ib Baumschicht",
	apflora.idealbiotop.IbBemerkungen AS "Ib Bemerkungen",
	apflora.idealbiotop.MutWann AS "Ib MutWann",
	apflora.idealbiotop.MutWer AS "Ib MutWer"
FROM
	apflora.idealbiotop
	LEFT JOIN
		((((apflora_beob.adb_eigenschaften
		RIGHT JOIN
			apflora.ap
			ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
		LEFT JOIN
			apflora.ap_bearbstand_werte
			ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
		LEFT JOIN
			apflora.ap_umsetzung_werte
			ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
		LEFT JOIN
			apflora.adresse
			ON apflora.ap.ApBearb = apflora.adresse.AdrId)
		ON apflora.idealbiotop.IbApArtId = apflora.ap.ApArtId
WHERE
	apflora.ap.ApArtId is Null
ORDER BY
	apflora.idealbiotop.IbErstelldatum;

CREATE OR REPLACE VIEW v_ber AS
SELECT
	apflora.ap.ApArtId AS "AP Id",
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Bearbeitungsstand",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	apflora.adresse.AdrName AS "AP verantwortlich",
	apflora.ber.BerId AS "Ber Id",
	apflora.ber.ApArtId AS "Ber ApId",
	apflora.ber.BerAutor AS "Ber Autor",
	apflora.ber.BerJahr AS "Ber Jahr",
	apflora.ber.BerTitel AS "Ber Titel",
	apflora.ber.BerURL AS "Ber URL",
	apflora.ber.MutWann AS "Ber MutWann",
	apflora.ber.MutWer AS "Ber MutWer"
FROM
	((((apflora_beob.adb_eigenschaften
	RIGHT JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN
		apflora.ap_bearbstand_werte
		ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN
		apflora.ap_umsetzung_werte
		ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN
		apflora.adresse
		ON apflora.ap.ApBearb = apflora.adresse.AdrId)
	RIGHT JOIN
		apflora.ber
		ON apflora.ap.ApArtId = apflora.ber.ApArtId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_ber_verwaist AS
SELECT
	apflora.ap.ApArtId AS "AP Id",
	apflora.ber.BerId AS "Ber Id",
	apflora.ber.ApArtId AS "Ber ApId",
	apflora.ber.BerAutor AS "Ber Autor",
	apflora.ber.BerJahr AS "Ber Jahr",
	apflora.ber.BerTitel AS "Ber Titel",
	apflora.ber.BerURL AS "Ber URL",
	apflora.ber.MutWann AS "Ber MutWann",
	apflora.ber.MutWer AS "Ber MutWer"
FROM
	((((apflora_beob.adb_eigenschaften
	RIGHT JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN
		apflora.ap_bearbstand_werte
		ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN
		apflora.ap_umsetzung_werte
		ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN
		apflora.adresse
		ON apflora.ap.ApBearb = apflora.adresse.AdrId)
	RIGHT JOIN
		apflora.ber
		ON apflora.ap.ApArtId = apflora.ber.ApArtId
WHERE
	apflora.ap.ApArtId is Null
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_assozart AS
SELECT
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Bearbeitungsstand",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	apflora.adresse.AdrName AS "AP verantwortlich",
	apflora.assozart.AaId AS "AA Id",
	ArtenDb_Arteigenschaften_1.Artname AS "AA Art",
	apflora.assozart.AaBem AS "AA Bemerkungen",
	apflora.assozart.MutWann AS "AA MutWann",
	apflora.assozart.MutWer AS "AA MutWer"
FROM
	apflora_beob.adb_eigenschaften AS ArtenDb_Arteigenschaften_1
	RIGHT JOIN
		(((((apflora_beob.adb_eigenschaften
		RIGHT JOIN
			apflora.ap
			ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
		LEFT JOIN
			apflora.ap_bearbstand_werte
			ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
		LEFT JOIN
			apflora.ap_umsetzung_werte
			ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
		LEFT JOIN
			apflora.adresse
			ON apflora.ap.ApBearb = apflora.adresse.AdrId)
		RIGHT JOIN
			apflora.assozart
			ON apflora.ap.ApArtId = apflora.assozart.AaApArtId)
		ON ArtenDb_Arteigenschaften_1.TaxonomieId = apflora.assozart.AaSisfNr
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_assozart_verwaist AS
SELECT
	apflora.ap.ApArtId AS "AP ApArtId",
	apflora.assozart.AaId AS "AA Id",
	apflora.assozart.AaApArtId AS "AA ApArtId",
	ArtenDb_Arteigenschaften_1.Artname AS "AA Art",
	apflora.assozart.AaBem AS "AA Bemerkungen",
	apflora.assozart.MutWann AS "AA MutWann",
	apflora.assozart.MutWer AS "AA MutWer"
FROM
	apflora_beob.adb_eigenschaften AS ArtenDb_Arteigenschaften_1
	RIGHT JOIN
		(((((apflora_beob.adb_eigenschaften
		RIGHT JOIN
			apflora.ap
			ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
		LEFT JOIN
			apflora.ap_bearbstand_werte
			ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
		LEFT JOIN
			apflora.ap_umsetzung_werte
			ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
		LEFT JOIN
			apflora.adresse
			ON apflora.ap.ApBearb = apflora.adresse.AdrId)
		RIGHT JOIN
			apflora.assozart
			ON apflora.ap.ApArtId = apflora.assozart.AaApArtId)
		ON ArtenDb_Arteigenschaften_1.TaxonomieId = apflora.assozart.AaSisfNr
WHERE
	apflora.ap.ApArtId is Null
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_ap_ohnepop AS 
SELECT
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.ap_bearbstand_werte.DomainTxt AS "Bearbeitungsstand AP",
	apflora.ap.ApJahr AS "Start AP im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "Stand Umsetzung AP",
	apflora.adresse.AdrName AS "Verantwortlich",
	apflora.pop.ApArtId AS "Population"
FROM
	((((apflora_beob.adb_eigenschaften
	INNER JOIN
		apflora.ap
		ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN apflora.adresse ON apflora.ap.ApBearb = apflora.adresse.AdrId)
	LEFT JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.pop.ApArtId Is Null
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_ap_anzkontrinjahr AS
SELECT
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.tpopkontr.TPopKontrId,
	apflora.tpopkontr.TPopKontrJahr
FROM
	(apflora.ap
	INNER JOIN apflora_beob.adb_eigenschaften ON apflora.ap.ApArtId = apflora_beob.adb_eigenschaften.TaxonomieId)
	INNER JOIN (apflora.pop
		INNER JOIN (apflora.tpop
			INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
		ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.ap.ApStatus Between 1 And 3
GROUP BY
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.tpopkontr.TPopKontrId,
	apflora.tpopkontr.TPopKontrJahr;

CREATE OR REPLACE VIEW v_erfkrit AS
SELECT
	apflora.ap.ApArtId AS "AP Id",
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	apflora.adresse.AdrName AS "AP verantwortlich",
	apflora.erfkrit.ErfkritId AS "ErfKrit Id",
	apflora.erfkrit.ApArtId AS "ErfKrit ApId",
	ap_erfkrit_werte.BeurteilTxt AS "ErfKrit Beurteilung",
	apflora.erfkrit.ErfkritTxt AS "ErfKrit Kriterien",
	apflora.erfkrit.MutWann AS "ErfKrit MutWann",
	apflora.erfkrit.MutWer AS "ErfKrit MutWer"
FROM
	(((((apflora_beob.adb_eigenschaften
	RIGHT JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN apflora.adresse ON apflora.ap.ApBearb = apflora.adresse.AdrId)
	RIGHT JOIN apflora.erfkrit ON apflora.ap.ApArtId = apflora.erfkrit.ApArtId)
	LEFT JOIN apflora.ap_erfkrit_werte ON apflora.erfkrit.ErfkritErreichungsgrad = ap_erfkrit_werte.BeurteilId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_erfktit_verwaist AS
SELECT
	apflora.ap.ApArtId AS "AP Id",
	apflora.erfkrit.ErfkritId AS "ErfKrit Id",
	apflora.erfkrit.ApArtId AS "ErfKrit ApId",
	ap_erfkrit_werte.BeurteilTxt AS "ErfKrit Beurteilung",
	apflora.erfkrit.ErfkritTxt AS "ErfKrit Kriterien",
	apflora.erfkrit.MutWann AS "ErfKrit MutWann",
	apflora.erfkrit.MutWer AS "ErfKrit MutWer"
FROM
	(((((apflora_beob.adb_eigenschaften
	RIGHT JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN apflora.adresse ON apflora.ap.ApBearb = apflora.adresse.AdrId)
	RIGHT JOIN apflora.erfkrit ON apflora.ap.ApArtId = apflora.erfkrit.ApArtId)
	LEFT JOIN apflora.ap_erfkrit_werte ON apflora.erfkrit.ErfkritErreichungsgrad = ap_erfkrit_werte.BeurteilId
WHERE
	apflora.ap.ApArtId is Null
ORDER BY
	apflora.ap_erfkrit_werte.BeurteilTxt,
	apflora.erfkrit.ErfkritTxt;

CREATE OR REPLACE VIEW v_ap_tpopmassnjahr0 AS
SELECT
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.tpopmassn.TPopMassnId,
	apflora.tpopmassn.TPopMassnJahr
FROM
	(apflora.ap
	INNER JOIN apflora_beob.adb_eigenschaften ON apflora.ap.ApArtId = apflora_beob.adb_eigenschaften.TaxonomieId)
	INNER JOIN ((apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
		INNER JOIN apflora.tpopmassn ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.ap.ApStatus Between 1 And 3
GROUP BY
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.tpopmassn.TPopMassnId,
	apflora.tpopmassn.TPopMassnJahr;

CREATE OR REPLACE VIEW v_auswapbearbmassninjahr0 AS 
SELECT
	apflora.adresse.AdrName,
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname,
	apflora.tpopmassn.TPopMassnJahr,
	tpopmassn_typ_werte.MassnTypTxt AS TPopMassnTyp,
	apflora.tpopmassn.TPopMassnTxt,
	apflora.tpopmassn.TPopMassnDatum,
	apflora.tpopmassn.TPopMassnBemTxt,
	apflora.tpopmassn.TPopMassnPlan,
	apflora.tpopmassn.TPopMassnPlanBez,
	apflora.tpopmassn.TPopMassnFlaeche,
	apflora.tpopmassn.TPopMassnMarkierung,
	apflora.tpopmassn.TPopMassnAnsiedAnzTriebe,
	apflora.tpopmassn.TPopMassnAnsiedAnzPfl,
	apflora.tpopmassn.TPopMassnAnzPflanzstellen,
	apflora.tpopmassn.TPopMassnAnsiedWirtspfl,
	apflora.tpopmassn.TPopMassnAnsiedHerkunftPop,
	apflora.tpopmassn.TPopMassnAnsiedDatSamm,
	apflora.tpopmassn.TPopMassnAnsiedForm,
	apflora.tpopmassn.TPopMassnAnsiedPflanzanordnung
FROM
	(apflora_beob.adb_eigenschaften
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN ((apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
		INNER JOIN ((apflora.tpopmassn
			LEFT JOIN apflora.adresse ON apflora.tpopmassn.TPopMassnBearb = apflora.adresse.AdrId)
			INNER JOIN apflora.tpopmassn_typ_werte ON apflora.tpopmassn.TPopMassnTyp = tpopmassn_typ_werte.MassnTypCode)
		ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.ap.ApStatus Between 1 And 3
ORDER BY
	apflora.adresse.AdrName,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname;

CREATE OR REPLACE VIEW v_ap_mitmassninjahr0 AS 
SELECT
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname,
	apflora.tpopmassn.TPopMassnJahr,
	tpopmassn_typ_werte.MassnTypTxt AS TPopMassnTyp,
	apflora.tpopmassn.TPopMassnTxt,
	apflora.tpopmassn.TPopMassnDatum,
	apflora.adresse.AdrName AS TPopMassnBearb,
	apflora.tpopmassn.TPopMassnBemTxt,
	apflora.tpopmassn.TPopMassnPlan,
	apflora.tpopmassn.TPopMassnPlanBez,
	apflora.tpopmassn.TPopMassnFlaeche,
	apflora.tpopmassn.TPopMassnMarkierung,
	apflora.tpopmassn.TPopMassnAnsiedAnzTriebe,
	apflora.tpopmassn.TPopMassnAnsiedAnzPfl,
	apflora.tpopmassn.TPopMassnAnzPflanzstellen,
	apflora.tpopmassn.TPopMassnAnsiedWirtspfl,
	apflora.tpopmassn.TPopMassnAnsiedHerkunftPop,
	apflora.tpopmassn.TPopMassnAnsiedDatSamm,
	apflora.tpopmassn.TPopMassnAnsiedForm,
	apflora.tpopmassn.TPopMassnAnsiedPflanzanordnung
FROM
	(apflora_beob.adb_eigenschaften
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN ((apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
		INNER JOIN ((apflora.tpopmassn
			INNER JOIN apflora.tpopmassn_typ_werte ON apflora.tpopmassn.TPopMassnTyp = tpopmassn_typ_werte.MassnTypCode)
			LEFT JOIN apflora.adresse ON apflora.tpopmassn.TPopMassnBearb = apflora.adresse.AdrId)
		ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.ap.ApStatus Between 1 And 3
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname;

CREATE OR REPLACE VIEW v_tpopmassnber_fueraktap0 AS
SELECT
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.ap_bearbstand_werte.DomainTxt AS "Aktionsplan-Status",
	apflora.ap.ApJahr AS "Aktionsplan-Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "Aktionsplan-Umsetzung",
	apflora.pop.PopNr AS "Population-Nr",
	apflora.pop.PopName AS "Population-Name",
	pop_status_werte.HerkunftTxt AS "Population-Herkunft",
	apflora.pop.PopBekanntSeit AS "Population - bekannt seit",
	apflora.tpop.TPopNr AS "Teilpopulation-Nr",
	apflora.tpop.TPopGemeinde AS "Teilpopulation-Gemeinde",
	apflora.tpop.TPopFlurname AS "Teilpopulation-Flurname",
	apflora.tpop.TPopXKoord AS "Teilpopulation-X-Koodinate",
	apflora.tpop.TPopYKoord AS "Teilpopulation-Y-Koordinate",
	apflora.tpop.TPopRadius AS "Teilpopulation-Radius",
	apflora.tpop.TPopHoehe AS "Teilpopulation-Hoehe",
	apflora.tpop.TPopBeschr AS "Teilpopulation-Beschreibung",
	apflora.tpop.TPopKatNr AS "Teilpopulation-Kataster-Nr",
	domPopHerkunft_1.HerkunftTxt AS "Teilpopulation-Herkunft",
	apflora.tpop.TPopHerkunftUnklar AS "Teilpopulation - Herkunft unklar",
	apflora.tpop.TPopHerkunftUnklarBegruendung AS "Teilpopulation - Herkunft unklar Begruendung",apflora.tpop_apberrelevant_werte.DomainTxt AS "Teilpopulation - Fuer Bericht relevant",
	apflora.tpop.TPopBekanntSeit AS "Teilpopulation - bekannt seit",
	apflora.tpop.TPopEigen AS "Teilpopulation-Eigentuemer",
	apflora.tpop.TPopKontakt AS "Teilpopulation-Kontakt",
	apflora.tpop.TPopNutzungszone AS "Teilpopulation-Nutzungszone",
	apflora.tpop.TPopBewirtschafterIn AS "Teilpopulation-Bewirtschafter",
	apflora.tpop.TPopBewirtschaftung AS "Teilpopulation-Bewirtschaftung",
	apflora.tpop.TPopTxt AS "Teilpopulation-Bemerkungen",
	apflora.tpopmassnber.TPopMassnBerJahr AS "Massnahmenbericht-Jahr",
	tpopmassn_erfbeurt_werte.BeurteilTxt AS "Massnahmenbericht-Erfolgsberuteilung",
	apflora.tpopmassnber.TPopMassnBerTxt AS "Massnahmenbericht-Interpretation"
FROM
	(((apflora_beob.adb_eigenschaften
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	INNER JOIN (((apflora.pop
		LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
		INNER JOIN ((apflora.tpop
			LEFT JOIN apflora.pop_status_werte AS domPopHerkunft_1 ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId)
			LEFT JOIN apflora.tpop_apberrelevant_werte ON apflora.tpop.TPopApBerichtRelevant  = apflora.tpop_apberrelevant_werte.DomainCode)
		ON apflora.pop.PopId = apflora.tpop.PopId)
		INNER JOIN (apflora.tpopmassnber
			INNER JOIN apflora.tpopmassn_erfbeurt_werte ON apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung = tpopmassn_erfbeurt_werte.BeurteilId)
		ON apflora.tpop.TPopId = apflora.tpopmassnber.TPopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopmassnber.TPopMassnBerJahr;

CREATE OR REPLACE VIEW v_tpopmassn_0 AS 
SELECT
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.ap_bearbstand_werte.DomainTxt AS "Aktionsplan Bearbeitungsstand",
	apflora.pop.PopId,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopId,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopFlurname,
	apflora.tpopmassn.TPopMassnId,
	apflora.tpopmassn.TPopMassnJahr AS Jahr,
	tpopmassn_typ_werte.MassnTypTxt AS Massnahme,
	apflora.tpopmassn.TPopMassnTxt,
	apflora.tpopmassn.TPopMassnDatum,
	apflora.adresse.AdrName AS TPopMassnBearb,
	apflora.tpopmassn.TPopMassnBemTxt,
	apflora.tpopmassn.TPopMassnPlan,
	apflora.tpopmassn.TPopMassnPlanBez,
	apflora.tpopmassn.TPopMassnFlaeche,
	apflora.tpopmassn.TPopMassnMarkierung,
	apflora.tpopmassn.TPopMassnAnsiedAnzTriebe,
	apflora.tpopmassn.TPopMassnAnsiedAnzPfl,
	apflora.tpopmassn.TPopMassnAnzPflanzstellen,
	apflora.tpopmassn.TPopMassnAnsiedWirtspfl,
	apflora.tpopmassn.TPopMassnAnsiedHerkunftPop,
	apflora.tpopmassn.TPopMassnAnsiedDatSamm,
	apflora.tpopmassn.TPopMassnAnsiedForm,
	apflora.tpopmassn.TPopMassnAnsiedPflanzanordnung
FROM
	((apflora_beob.adb_eigenschaften
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	INNER JOIN ((apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
		INNER JOIN ((apflora.tpopmassn
			LEFT JOIN apflora.tpopmassn_typ_werte ON apflora.tpopmassn.TPopMassnTyp = tpopmassn_typ_werte.MassnTypCode)
			LEFT JOIN apflora.adresse ON apflora.tpopmassn.TPopMassnBearb = apflora.adresse.AdrId)
		ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopmassn.TPopMassnJahr,
	tpopmassn_typ_werte.MassnTypTxt;

CREATE OR REPLACE VIEW v_tpopmassn_fueraktap0 AS 
SELECT
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.ap_bearbstand_werte.DomainTxt AS "Aktionsplan-Status",
	apflora.ap.ApJahr AS "Aktionsplan-Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "Aktionsplan-Umsetzung",
	apflora.pop.PopId,
	apflora.pop.PopNr AS "Population-Nr",
	apflora.pop.PopName AS "Population-Name",
	pop_status_werte.HerkunftTxt AS "Population-Herkunft",
	apflora.pop.PopBekanntSeit AS "Population - bekannt seit",
	apflora.tpop.TPopId,
	apflora.tpop.TPopNr AS "Teilpopulation-Nr",
	apflora.tpop.TPopGemeinde AS "Teilpopulation-Gemeinde",
	apflora.tpop.TPopFlurname AS "Teilpopulation-Flurname",
	apflora.tpop.TPopXKoord AS "Teilpopulation-X-Koodinate",
	apflora.tpop.TPopYKoord AS "Teilpopulation-Y-Koordinate",
	apflora.tpop.TPopRadius AS "Teilpopulation-Radius",
	apflora.tpop.TPopHoehe AS "Teilpopulation-Höhe",
	apflora.tpop.TPopBeschr AS "Teilpopulation-Beschreibung",
	apflora.tpop.TPopKatNr AS "Teilpopulation-Kataster-Nr",
	domPopHerkunft_1.HerkunftTxt AS "Teilpopulation-Herkunft",
	apflora.tpop.TPopHerkunftUnklar AS "Teilpopulation - Herkunft unklar",
	apflora.tpop.TPopHerkunftUnklarBegruendung AS "Teilpopulation - Herkunft unklar Begruendung",
  apflora.tpop_apberrelevant_werte.DomainTxt AS "Teilpopulation - Fuer Bericht relevant",
	apflora.tpop.TPopBekanntSeit AS "Teilpopulation - bekannt seit",
	apflora.tpop.TPopEigen AS "Teilpopulation-Eigentuemer",
	apflora.tpop.TPopKontakt AS "Teilpopulation-Kontakt",
	apflora.tpop.TPopNutzungszone AS "Teilpopulation-Nutzungszone",
	apflora.tpop.TPopBewirtschafterIn AS "Teilpopulation-Bewirtschafter",
	apflora.tpop.TPopBewirtschaftung AS "Teilpopulation-Bewirtschaftung",
	apflora.tpop.TPopTxt AS "Teilpopulation-Bemerkungen",
	apflora.tpopmassn.TPopMassnId,
	tpopmassn_typ_werte.MassnTypTxt AS "Massnahme-Typ",
	apflora.tpopmassn.TPopMassnTxt AS "Massnahme-Beschreibung",
	apflora.tpopmassn.TPopMassnDatum AS "Massnahme-Datum",
	apflora.adresse.AdrName AS "Massnahme-BearbeiterIn",
	apflora.tpopmassn.TPopMassnBemTxt AS "Massnahme-Bemerkungen",
	apflora.tpopmassn.TPopMassnPlan AS "Massnahme-Plan",
	apflora.tpopmassn.TPopMassnPlanBez AS "Massnahme-Planbezeichnung",
	apflora.tpopmassn.TPopMassnFlaeche AS "Massnahme-Flaeche",
	apflora.tpopmassn.TPopMassnMarkierung AS "Massnahme-Markierung",
	apflora.tpopmassn.TPopMassnAnsiedAnzTriebe AS "Massnahme - Ansiedlung Anzahl Triebe",
	apflora.tpopmassn.TPopMassnAnsiedAnzPfl AS "Massnahme - Ansiedlung Anzahl Pflanzen",
	apflora.tpopmassn.TPopMassnAnzPflanzstellen AS "Massnahme - Ansiedlung Anzahl Pflanzstellen",
	apflora.tpopmassn.TPopMassnAnsiedWirtspfl AS "Massnahme - Ansiedlung Wirtspflanzen",
	apflora.tpopmassn.TPopMassnAnsiedHerkunftPop AS "Massnahme - Ansiedlung Herkunftspopulation",
	apflora.tpopmassn.TPopMassnAnsiedDatSamm AS "Massnahme - Ansiedlung Sammeldatum",
	apflora.tpopmassn.TPopMassnAnsiedForm AS "Massnahme - Ansiedlung Form",
	apflora.tpopmassn.TPopMassnAnsiedPflanzanordnung AS "Massnahme - Ansiedlung Pflanzordnung"
FROM
	(apflora_beob.adb_eigenschaften
	INNER JOIN ((apflora.ap
		LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
		LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN (((apflora.pop
		LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
		INNER JOIN ((apflora.tpop
			LEFT JOIN apflora.pop_status_werte AS domPopHerkunft_1 ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId)
			LEFT JOIN apflora.tpop_apberrelevant_werte ON apflora.tpop.TPopApBerichtRelevant  = apflora.tpop_apberrelevant_werte.DomainCode)
		ON apflora.pop.PopId = apflora.tpop.PopId)
		INNER JOIN ((apflora.tpopmassn
			LEFT JOIN apflora.tpopmassn_typ_werte ON apflora.tpopmassn.TPopMassnTyp = tpopmassn_typ_werte.MassnTypCode)
			LEFT JOIN apflora.adresse ON apflora.tpopmassn.TPopMassnBearb = apflora.adresse.AdrId)
		ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	tpopmassn_typ_werte.MassnTypTxt;

CREATE OR REPLACE VIEW v_tpopkontr_nachflurname AS
SELECT
	apflora.ap.ApArtId,
	apflora.pop.PopId,
	apflora.tpop.TPopId,
	apflora.tpop.TPopGemeinde AS Gemeinde,
	apflora.tpop.TPopFlurname AS "Flurname aus Teilpopulation",
	apflora.ap_bearbstand_werte.DomainTxt AS "Bearbeitungsstand AP",
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr AS Jahr,
	apflora.tpopkontr.TPopKontrTyp AS Kontrolltyp,
	apflora.tpopkontr.TPopKontrDatum,
	apflora.adresse.AdrName AS TPopKontrBearb,
	apflora.tpopkontr.TPopKontrJungpfl,
	apflora.tpopkontr.TPopKontrVitalitaet,
	apflora.tpopkontr.TPopKontrUeberleb,
	apflora.tpopkontr.TPopKontrEntwicklung,
	apflora.tpopkontr.TPopKontrUrsach,
	apflora.tpopkontr.TPopKontrUrteil,
	apflora.tpopkontr.TPopKontrAendUms,
	apflora.tpopkontr.TPopKontrAendKontr,
	apflora.tpopkontr.TPopKontrTxt,
	apflora.tpopkontr.TPopKontrLeb,
	apflora.tpopkontr.TPopKontrFlaeche,
	apflora.tpopkontr.TPopKontrLebUmg,
	apflora.tpopkontr.TPopKontrStrauchschicht,
	apflora.tpopkontr.TPopKontrBodenTyp,
	apflora.tpopkontr.TPopKontrBodenAbtrag,
	apflora.tpopkontr.TPopKontrWasserhaushalt,
	apflora.tpopkontr.TPopKontrHandlungsbedarf,
	apflora.tpopkontr.TPopKontrUebFlaeche,
	apflora.tpopkontr.TPopKontrPlan,
	apflora.tpopkontr.TPopKontrVeg,
	apflora.tpopkontr.TPopKontrNaBo,
	apflora.tpopkontr.TPopKontrUebPfl,
	apflora.tpopkontr.TPopKontrJungPflJN,
	apflora.tpopkontr.TPopKontrVegHoeMax,
	apflora.tpopkontr.TPopKontrVegHoeMit,
	apflora.tpopkontr.TPopKontrGefaehrdung,
	apflora.tpopkontrzaehl.TPopKontrZaehlId,
	apflora.tpopkontrzaehl.TPopKontrId,
	apflora.tpopkontrzaehl.Anzahl,
	apflora.tpopkontrzaehl_einheit_werte.ZaehleinheitTxt AS Zaehleinheit,
	apflora.tpopkontrzaehl_methode_werte.BeurteilTxt AS Methode
FROM
	((((((apflora_beob.adb_eigenschaften
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN (apflora.pop
		INNER JOIN (apflora.tpop
			INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
		ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.adresse ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
	LEFT JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId)
	LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl.Zaehleinheit = apflora.tpopkontrzaehl_einheit_werte.ZaehleinheitCode)
	LEFT JOIN apflora.tpopkontrzaehl_methode_werte ON apflora.tpopkontrzaehl.Methode = apflora.tpopkontrzaehl_methode_werte.BeurteilCode
WHERE
	apflora.tpopkontr.TPopKontrTyp Not in ("Ziel", "Zwischenziel") 
ORDER BY
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrTyp;

CREATE OR REPLACE VIEW v_apber_b1rpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	apflora._variable,
	(apflora.pop
	INNER JOIN apflora.popber ON apflora.pop.PopId = apflora.popber.PopId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
	AND apflora.popber.PopBerJahr <= apflora._variable.JBerJahr
	AND apflora.popber.PopBerEntwicklung in (1, 2, 3, 4, 8)
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b1rtpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.tpopber.TPopId
FROM
	apflora._variable,
	apflora.pop
	INNER JOIN (apflora.tpop
		INNER JOIN apflora.tpopber ON apflora.tpop.TPopId = apflora.tpopber.TPopId)
	ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
	AND apflora.tpop.TPopHerkunft <> 300
	AND apflora.tpopber.TPopBerJahr <= apflora._variable.JBerJahr
	AND apflora.tpopber.TPopBerEntwicklung in (1, 2, 3, 4, 8)
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpopber.TPopId;

CREATE OR REPLACE VIEW v_apber_c1rtpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora._variable,
	(apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopmassn ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId
WHERE
	apflora.tpopmassn.TPopMassnJahr <= apflora._variable.JBerJahr
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
	AND apflora.tpop.TPopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_a3lpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	(apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId
WHERE
	apflora.pop.PopHerkunft In (200, 210)
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND (
		apflora.pop.PopBekanntSeit < apflora.ap.ApJahr
		OR apflora.pop.PopBekanntSeit Is Null
		OR apflora.ap.ApJahr Is Null
	)
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_a4lpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	(apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId
WHERE
	apflora.pop.PopHerkunft In (200, 210)
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopBekanntSeit >= apflora.ap.ApJahr
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_a5lpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.pop.PopHerkunft = 201
	AND apflora.tpop.TPopApBerichtRelevant = 1
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_a10lpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.pop.PopHerkunft = 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_a8lpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	(apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId
WHERE
	(
		apflora.pop.PopHerkunft = 101
		OR (
			apflora.pop.PopHerkunft = 211
			AND (
				apflora.pop.PopBekanntSeit < apflora.ap.ApJahr
				OR apflora.pop.PopBekanntSeit Is Null
				OR apflora.ap.ApJahr Is Null
			)
		)
	)
	AND apflora.tpop.TPopApBerichtRelevant = 1
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_a9lpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	(apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId
WHERE
	apflora.pop.PopHerkunft In (202, 211)
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopBekanntSeit >= apflora.ap.ApJahr
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apbera1ltpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft IS NOT NULL
	AND apflora.pop.PopHerkunft NOT IN (300, 201)
	AND apflora.tpop.TPopHerkunft NOT IN (300, 201)
	AND apflora.tpop.TPopHerkunft IS NOT NULL
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_a2ltpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.pop.PopHerkunft NOT IN (300, 201)
	AND apflora.tpop.TPopHerkunft = 100
	AND apflora.tpop.TPopApBerichtRelevant = 1
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_a3ltpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	(apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId
WHERE
	apflora.pop.PopHerkunft NOT IN (300, 201)
	AND apflora.tpop.TPopHerkunft In (200, 210)
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND (
		apflora.tpop.TPopBekanntSeit < apflora.ap.ApJahr
		OR apflora.tpop.TPopBekanntSeit Is Null
		OR apflora.ap.ApJahr Is Null
	)
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_a4ltpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	(apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId
WHERE
	apflora.pop.PopHerkunft NOT IN (300, 201)
	AND apflora.tpop.TPopHerkunft In (200, 210)
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.tpop.TPopBekanntSeit >= apflora.ap.ApJahr
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_a5ltpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopHerkunft = 201
	AND apflora.tpop.TPopApBerichtRelevant = 1
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_a10ltpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopHerkunft = 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_a8ltpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	(apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId
WHERE
	apflora.pop.PopHerkunft NOT IN (300, 201)
	AND (
		apflora.tpop.TPopHerkunft = 101
		OR (
			apflora.tpop.TPopHerkunft = 211
			AND (
				apflora.tpop.TPopBekanntSeit < apflora.ap.ApJahr
				OR apflora.tpop.TPopBekanntSeit Is Null
				OR apflora.ap.ApJahr Is Null
			)
		)
	)
	AND apflora.tpop.TPopApBerichtRelevant = 1
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_a9ltpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	(apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId
WHERE
	apflora.pop.PopHerkunft NOT IN (300, 201)
	AND apflora.tpop.TPopHerkunft In (202, 211)
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.tpop.TPopBekanntSeit >= apflora.ap.ApJahr
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b1lpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	(apflora.pop
	INNER JOIN (apflora.popber
		INNER JOIN apflora._variable ON apflora.popber.PopBerJahr = apflora._variable.JBerJahr)
	ON apflora.pop.PopId = apflora.popber.PopId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b2lpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	(apflora.pop
	INNER JOIN (apflora.popber
		INNER JOIN apflora._variable ON apflora.popber.PopBerJahr = apflora._variable.JBerJahr)
	ON apflora.pop.PopId = apflora.popber.PopId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.popber.PopBerEntwicklung = 3
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b3lpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	(apflora.pop
	INNER JOIN (apflora.popber
		INNER JOIN apflora._variable ON apflora.popber.PopBerJahr = apflora._variable.JBerJahr)
	ON apflora.pop.PopId = apflora.popber.PopId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.popber.PopBerEntwicklung = 2
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b4lpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	(apflora.pop
	INNER JOIN (apflora.popber
		INNER JOIN apflora._variable ON apflora.popber.PopBerJahr = apflora._variable.JBerJahr)
	ON apflora.pop.PopId = apflora.popber.PopId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.popber.PopBerEntwicklung = 1
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b5lpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	(apflora.pop
	INNER JOIN (apflora.popber
		INNER JOIN apflora._variable ON apflora.popber.PopBerJahr = apflora._variable.JBerJahr)
	ON apflora.pop.PopId = apflora.popber.PopId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.popber.PopBerEntwicklung = 4
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b6lpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	(apflora.pop
	INNER JOIN (apflora.popber
		INNER JOIN apflora._variable ON apflora.popber.PopBerJahr = apflora._variable.JBerJahr)
	ON apflora.pop.PopId = apflora.popber.PopId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.popber.PopBerEntwicklung = 8
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b7lpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b1ltpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora.pop
	INNER JOIN (apflora.tpop
		INNER JOIN (apflora.tpopber
			INNER JOIN apflora._variable ON apflora.tpopber.TPopBerJahr = apflora._variable.JBerJahr)
		ON apflora.tpop.TPopId = apflora.tpopber.TPopId)
	ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
	AND apflora.tpop.TPopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b2ltpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora.pop
	INNER JOIN (apflora.tpop
		INNER JOIN (apflora.tpopber
			INNER JOIN apflora._variable ON apflora.tpopber.TPopBerJahr = apflora._variable.JBerJahr)
		ON apflora.tpop.TPopId = apflora.tpopber.TPopId)
	ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpopber.TPopBerEntwicklung = 3
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
	AND apflora.tpop.TPopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b3ltpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora.pop
	INNER JOIN (apflora.tpop
		INNER JOIN (apflora.tpopber
			INNER JOIN apflora._variable ON apflora.tpopber.TPopBerJahr = apflora._variable.JBerJahr)
		ON apflora.tpop.TPopId = apflora.tpopber.TPopId)
	ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpopber.TPopBerEntwicklung = 2
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
	AND apflora.tpop.TPopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b4ltpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora.pop
	INNER JOIN (apflora.tpop
		INNER JOIN (apflora.tpopber
			INNER JOIN apflora._variable ON apflora.tpopber.TPopBerJahr = apflora._variable.JBerJahr)
		ON apflora.tpop.TPopId = apflora.tpopber.TPopId)
	ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpopber.TPopBerEntwicklung = 1
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
	AND apflora.tpop.TPopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b5ltpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora.pop
	INNER JOIN (apflora.tpop
		INNER JOIN (apflora.tpopber
			INNER JOIN apflora._variable ON apflora.tpopber.TPopBerJahr = apflora._variable.JBerJahr)
		ON apflora.tpop.TPopId = apflora.tpopber.TPopId)
	ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpopber.TPopBerEntwicklung = 4
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
	AND apflora.tpop.TPopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b6ltpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora.pop
	INNER JOIN (apflora.tpop
		INNER JOIN (apflora.tpopber
			INNER JOIN apflora._variable ON apflora.tpopber.TPopBerJahr = apflora._variable.JBerJahr)
		ON apflora.tpop.TPopId = apflora.tpopber.TPopId)
	ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpopber.TPopBerEntwicklung = 8
	AND apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
	AND apflora.tpop.TPopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b7ltpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
	AND apflora.tpop.TPopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_c1lpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	(apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN (apflora.tpopmassn
		INNER JOIN apflora._variable ON apflora.tpopmassn.TPopMassnJahr = apflora._variable.JBerJahr)
	ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId
WHERE
	apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c1ltpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.tpop.TPopId
FROM
	((apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopmassn ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId)
	INNER JOIN apflora._variable ON apflora.tpopmassn.TPopMassnJahr = apflora._variable.JBerJahr
WHERE
	apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft <> 300
	AND apflora.tpop.TPopHerkunft <> 300
GROUP BY
	apflora.pop.ApArtId,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_auswanzprotpopangezartbestjahr0 AS 
SELECT
	apflora.ap.ApArtId,
	apflora.pop.PopId,
	apflora.tpop.TPopId,
	apflora.tpopkontr.TPopKontrId,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.pop_status_werte.HerkunftTxt AS PopHerkunft,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname,
	domPopHerkunft_1.HerkunftTxt AS TPopHerkunft,
	apflora.tpopkontr.TPopKontrTyp,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrDatum,
	apflora.adresse.AdrName AS TPopKontrBearb,
	apflora.tpopkontrzaehl.Anzahl,
	apflora.tpopkontrzaehl_einheit_werte.ZaehleinheitTxt AS Zaehleinheit,
	apflora.tpopkontrzaehl_methode_werte.BeurteilTxt AS Methode,
	apflora.tpopkontr.TPopKontrJungpfl,
	apflora.tpopkontr.TPopKontrVitalitaet,
	apflora.tpopkontr.TPopKontrUeberleb,
	apflora.tpop_entwicklung_werte.EntwicklungTxt AS TPopKontrEntwicklung,
	apflora.tpopkontr.TPopKontrUrsach,
	apflora.tpopkontr.TPopKontrUrteil,
	apflora.tpopkontr.TPopKontrAendUms,
	apflora.tpopkontr.TPopKontrAendKontr,
	apflora.tpopkontr.TPopKontrTxt,
	apflora.tpopkontr.TPopKontrLeb,
	apflora.tpopkontr.TPopKontrFlaeche,
	apflora.tpopkontr.TPopKontrLebUmg,
	apflora.tpopkontr.TPopKontrStrauchschicht,
	apflora.tpopkontr.TPopKontrBodenTyp,
	apflora.tpopkontr.TPopKontrBodenAbtrag,
	apflora.tpopkontr.TPopKontrWasserhaushalt,
	apflora.tpopkontr.TPopKontrHandlungsbedarf,
	apflora.tpopkontr.TPopKontrUebFlaeche,
	apflora.tpopkontr.TPopKontrPlan,
	apflora.tpopkontr.TPopKontrVeg,
	apflora.tpopkontr.TPopKontrNaBo,
	apflora.tpopkontr.TPopKontrUebPfl,
	apflora.tpopkontr.TPopKontrJungPflJN,
	apflora.tpopkontr.TPopKontrVegHoeMax,
	apflora.tpopkontr.TPopKontrVegHoeMit,
	apflora.tpopkontr.TPopKontrGefaehrdung,
	apflora.tpopkontr.TPopKontrMutDat
FROM
	(((((((apflora_beob.adb_eigenschaften
	INNER JOIN (((apflora.ap
		INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
		INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = apflora.pop_status_werte.HerkunftId)
	LEFT JOIN apflora.pop_status_werte AS domPopHerkunft_1 ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId)
	LEFT JOIN apflora.adresse ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
	LEFT JOIN apflora.tpop_entwicklung_werte ON apflora.tpopkontr.TPopKontrEntwicklung = apflora.tpop_entwicklung_werte.EntwicklungCode)
	INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId)
	INNER JOIN apflora.tpopkontrzaehl_methode_werte ON apflora.tpopkontrzaehl.Methode = apflora.tpopkontrzaehl_methode_werte.BeurteilCode)
	LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl.Zaehleinheit = apflora.tpopkontrzaehl_einheit_werte.ZaehleinheitCode;

CREATE OR REPLACE VIEW v_popber_angezapbestjahr0 AS
SELECT
	apflora.ap.ApArtId,
	apflora.pop.PopId,
	apflora.popber.PopBerId,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	pop_status_werte.HerkunftTxt AS PopHerkunft,
	apflora.popber.PopBerJahr,
	pop_entwicklung_werte.EntwicklungTxt AS PopBerEntwicklung,
	apflora.popber.PopBerTxt
FROM
	((apflora_beob.adb_eigenschaften
	INNER JOIN ((apflora.ap
		INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
		INNER JOIN apflora.popber ON apflora.pop.PopId = apflora.popber.PopId)
	ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
	LEFT JOIN apflora.pop_entwicklung_werte ON apflora.popber.PopBerEntwicklung = pop_entwicklung_werte.EntwicklungId;
 
CREATE OR REPLACE VIEW v_ziel AS 
SELECT
	apflora.ap.ApArtId AS "AP Id",
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	apflora.adresse.AdrName AS "AP verantwortlich",
	apflora.ziel.ZielId AS "Ziel Id",
	apflora.ziel.ApArtId AS "Ziel ApId",
	apflora.ziel.ZielJahr AS "Ziel Jahr",
	ziel_typ_werte.ZieltypTxt AS "Ziel Typ",
	apflora.ziel.ZielBezeichnung AS "Ziel Beschreibung"
FROM
	(((((apflora_beob.adb_eigenschaften
	RIGHT JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN apflora.adresse ON apflora.ap.ApBearb = apflora.adresse.AdrId)
	RIGHT JOIN apflora.ziel ON apflora.ap.ApArtId = apflora.ziel.ApArtId)
	LEFT JOIN apflora.ziel_typ_werte ON apflora.ziel.ZielTyp = ziel_typ_werte.ZieltypId
WHERE
	apflora.ziel.ZielTyp = 1
	OR apflora.ziel.ZielTyp = 2
	OR apflora.ziel.ZielTyp = 1170775556
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.ziel.ZielJahr,
	ziel_typ_werte.ZieltypTxt,
	apflora.ziel.ZielTyp;

CREATE OR REPLACE VIEW v_ziel_verwaist AS 
SELECT
	apflora.ap.ApArtId AS "AP Id",
	apflora.ziel.ZielId AS "Ziel Id",
	apflora.ziel.ApArtId AS "Ziel ApId",
	apflora.ziel.ZielJahr AS "Ziel Jahr",
	ziel_typ_werte.ZieltypTxt AS "Ziel Typ",
	apflora.ziel.ZielBezeichnung AS "Ziel Beschreibung"
FROM
	(((((apflora_beob.adb_eigenschaften
	RIGHT JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN apflora.adresse ON apflora.ap.ApBearb = apflora.adresse.AdrId)
	RIGHT JOIN apflora.ziel ON apflora.ap.ApArtId = apflora.ziel.ApArtId)
	LEFT JOIN apflora.ziel_typ_werte ON apflora.ziel.ZielTyp = ziel_typ_werte.ZieltypId
WHERE
	apflora.ap.ApArtId is Null
ORDER BY
	apflora.ziel.ZielJahr,
	ziel_typ_werte.ZieltypTxt,
	apflora.ziel.ZielTyp;

CREATE OR REPLACE VIEW v_zielber AS
SELECT
	apflora.ap.ApArtId AS "AP Id",
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	apflora.adresse.AdrName AS "AP verantwortlich",
	apflora.ziel.ZielId AS "Ziel Id",
	apflora.ziel.ZielJahr AS "Ziel Jahr",
	ziel_typ_werte.ZieltypTxt AS "Ziel Typ",
	apflora.ziel.ZielBezeichnung AS "Ziel Beschreibung",
	apflora.zielber.ZielBerId AS "ZielBer Id",
	apflora.zielber.ZielId AS "ZielBer ZielId",
	apflora.zielber.ZielBerJahr AS "ZielBer Jahr",
	apflora.zielber.ZielBerErreichung AS "ZielBer Erreichung",
	apflora.zielber.ZielBerTxt AS "ZielBer Bemerkungen",
	apflora.zielber.MutWann AS "ZielBer MutWann",
	apflora.zielber.MutWer AS "ZielBer MutWer"
FROM
	((((((apflora_beob.adb_eigenschaften
	RIGHT JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN apflora.adresse ON apflora.ap.ApBearb = apflora.adresse.AdrId)
	RIGHT JOIN apflora.ziel ON apflora.ap.ApArtId = apflora.ziel.ApArtId)
	LEFT JOIN apflora.ziel_typ_werte ON apflora.ziel.ZielTyp = ziel_typ_werte.ZieltypId)
	RIGHT JOIN apflora.zielber ON apflora.ziel.ZielId = apflora.zielber.ZielId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.ziel.ZielJahr,
	ziel_typ_werte.ZieltypTxt,
	apflora.ziel.ZielTyp,
	apflora.zielber.ZielBerJahr;

CREATE OR REPLACE VIEW v_zielber_verwaist AS
SELECT
	apflora.ap.ApArtId AS "AP Id",
	apflora.ziel.ZielId AS "Ziel Id",
	apflora.zielber.ZielBerId AS "ZielBer Id",
	apflora.zielber.ZielId AS "ZielBer ZielId",
	apflora.zielber.ZielBerJahr AS "ZielBer Jahr",
	apflora.zielber.ZielBerErreichung AS "ZielBer Erreichung",
	apflora.zielber.ZielBerTxt AS "ZielBer Bemerkungen",
	apflora.zielber.MutWann AS "ZielBer MutWann",
	apflora.zielber.MutWer AS "ZielBer MutWer"
FROM
	((((((apflora_beob.adb_eigenschaften
	RIGHT JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN apflora.adresse ON apflora.ap.ApBearb = apflora.adresse.AdrId)
	RIGHT JOIN apflora.ziel ON apflora.ap.ApArtId = apflora.ziel.ApArtId)
	LEFT JOIN apflora.ziel_typ_werte ON apflora.ziel.ZielTyp = ziel_typ_werte.ZieltypId)
	RIGHT JOIN apflora.zielber ON apflora.ziel.ZielId = apflora.zielber.ZielId
WHERE
	apflora.ziel.ZielId is Null
ORDER BY
	apflora.ziel.ZielTyp,
	apflora.zielber.ZielBerJahr;

CREATE OR REPLACE VIEW v_bertpopfuerangezeigteap0 AS
SELECT
	apflora.ap.ApArtId,
	apflora.pop.PopId,
	apflora.tpop.TPopId,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.ap_bearbstand_werte.DomainTxt AS ApStatus,
	apflora.ap.ApJahr,
	apflora.ap_umsetzung_werte.DomainTxt AS ApUmsetzung,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	pop_status_werte.HerkunftTxt AS PopHerkunft,
	apflora.pop.PopBekanntSeit,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname,
	apflora.tpop.TPopXKoord,
	apflora.tpop.TPopYKoord,
	apflora.tpop.TPopBekanntSeit,
	domPopHerkunft_1.HerkunftTxt AS TPopHerkunft,
	apflora.tpop.TPopApBerichtRelevant
FROM
	((((apflora_beob.adb_eigenschaften
	INNER JOIN ((apflora.ap
		INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
	LEFT JOIN apflora.pop_status_werte AS domPopHerkunft_1 ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId;

CREATE OR REPLACE VIEW v_tpopkontr AS
SELECT
	apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId,
	apflora_beob.adb_eigenschaften.Familie,
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	tblAdresse_1.AdrName AS "AP verantwortlich",
	apflora.pop.PopGuid AS "Pop Guid",
	apflora.pop.PopNr AS "Pop Nr",
	apflora.pop.PopName AS "Pop Name",
	apflora.pop_status_werte.HerkunftTxt AS "Pop Herkunft",
	apflora.pop.PopBekanntSeit AS "Pop bekannt seit",
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
	apflora.tpop.TPopRadius AS "TPop Radius m",
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
	apflora.tpopkontr.TPopKontrId,
	apflora.tpopkontr.TPopId,
	apflora.tpopkontr.TPopKontrGuid AS "Kontr Guid",
	apflora.tpopkontr.TPopKontrJahr AS "Kontr Jahr",
	apflora.tpopkontr.TPopKontrDatum AS "Kontr Datum",
	apflora.tpopkontr_typ_werte.DomainTxt AS "Kontr Typ",
	apflora.adresse.AdrName AS "Kontr BearbeiterIn",
	apflora.tpopkontr.TPopKontrUeberleb AS "Kontr Ueberlebensrate",
	apflora.tpopkontr.TPopKontrVitalitaet AS "Kontr Vitalitaet",
	apflora.pop_entwicklung_werte.EntwicklungTxt AS "Kontr Entwicklung",
	apflora.tpopkontr.TPopKontrUrsach AS "Kontr Ursachen",
	apflora.tpopkontr.TPopKontrUrteil AS "Kontr Erfolgsbeurteilung",
	apflora.tpopkontr.TPopKontrAendUms AS "Kontr Aenderungs-Vorschlaege Umsetzung",
	apflora.tpopkontr.TPopKontrAendKontr AS "Kontr Aenderungs-Vorschlaege Kontrolle",
	apflora.tpop.TPopXKoord AS "Kontr X-Koord",
	apflora.tpop.TPopYKoord AS "Kontr Y-Koord",
	apflora.tpopkontr.TPopKontrTxt AS "Kontr Bemerkungen",
	apflora.tpopkontr.TPopKontrLeb AS "Kontr Lebensraum Delarze",
	apflora.tpopkontr.TPopKontrLebUmg AS "Kontr angrenzender Lebensraum Delarze",
	apflora.tpopkontr.TPopKontrVegTyp AS "Kontr Vegetationstyp",
	apflora.tpopkontr.TPopKontrKonkurrenz AS "Kontr Konkurrenz",
	apflora.tpopkontr.TPopKontrMoosschicht AS "Kontr Moosschicht",
	apflora.tpopkontr.TPopKontrKrautschicht AS "Kontr Krautschicht",
	apflora.tpopkontr.TPopKontrStrauchschicht AS "Kontr Strauchschicht",
	apflora.tpopkontr.TPopKontrBaumschicht AS "Kontr Baumschicht",
	apflora.tpopkontr.TPopKontrBodenTyp AS "Kontr Bodentyp",
	apflora.tpopkontr.TPopKontrBodenKalkgehalt AS "Kontr Boden Kalkgehalt",
	apflora.tpopkontr.TPopKontrBodenDurchlaessigkeit AS "Kontr Boden Durchlaessigkeit",
	apflora.tpopkontr.TPopKontrBodenHumus AS "Kontr Boden Humusgehalt",
	apflora.tpopkontr.TPopKontrBodenNaehrstoffgehalt AS "Kontr Boden Naehrstoffgehalt",
	apflora.tpopkontr.TPopKontrBodenAbtrag AS "Kontr Oberbodenabtrag",
	apflora.tpopkontr.TPopKontrWasserhaushalt AS "Kontr Wasserhaushalt",
	apflora.tpopkontr_idbiotuebereinst_werte.DomainTxt AS "Kontr Uebereinstimmung mit Idealbiotop",
	apflora.tpopkontr.TPopKontrHandlungsbedarf AS "Kontr Handlungsbedarf",
	apflora.tpopkontr.TPopKontrUebFlaeche AS "Kontr Ueberpruefte Flaeche",
	apflora.tpopkontr.TPopKontrFlaeche AS "Kontr Flaeche der Teilpopulation m2",
	apflora.tpopkontr.TPopKontrPlan AS "Kontr auf Plan eingezeichnet",
	apflora.tpopkontr.TPopKontrVeg AS "Kontr Deckung durch Vegetation",
	apflora.tpopkontr.TPopKontrNaBo AS "Kontr Deckung nackter Boden",
	apflora.tpopkontr.TPopKontrUebPfl AS "Kontr Deckung durch ueberpruefte Art",
	apflora.tpopkontr.TPopKontrJungPflJN AS "Kontr auch junge Pflanzen",
	apflora.tpopkontr.TPopKontrVegHoeMax AS "Kontr maximale Veg-hoehe cm",
	apflora.tpopkontr.TPopKontrVegHoeMit AS "Kontr mittlere Veg-hoehe cm",
	apflora.tpopkontr.TPopKontrGefaehrdung AS "Kontr Gefaehrdung",
	apflora.tpopkontr.MutWann AS "Kontrolle zuletzt geaendert",
	apflora.tpopkontr.MutWer AS "Kontrolle zuletzt geaendert von",
	GROUP_CONCAT(apflora.tpopkontrzaehl.Anzahl SEPARATOR ',') AS Anzahlen,
	GROUP_CONCAT(apflora.tpopkontrzaehl_einheit_werte.ZaehleinheitTxt SEPARATOR ', ') AS Zaehleinheiten,
	GROUP_CONCAT(apflora.tpopkontrzaehl_methode_werte.BeurteilTxt SEPARATOR ', ') AS Methoden
FROM
	apflora.pop_status_werte AS domPopHerkunft_1
	RIGHT JOIN (((((((apflora_beob.adb_eigenschaften
		INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
		INNER JOIN (apflora.pop
			INNER JOIN (apflora.tpop
				INNER JOIN ((((((apflora.tpopkontr
					LEFT JOIN apflora.tpopkontr_typ_werte ON apflora.tpopkontr.TPopKontrTyp = apflora.tpopkontr_typ_werte.DomainTxt)
					LEFT JOIN apflora.adresse ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
					LEFT JOIN apflora.pop_entwicklung_werte ON apflora.tpopkontr.TPopKontrEntwicklung = apflora.pop_entwicklung_werte.EntwicklungId)
					LEFT JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId)
					LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl.Zaehleinheit = apflora.tpopkontrzaehl_einheit_werte.ZaehleinheitCode)
					LEFT JOIN apflora.tpopkontrzaehl_methode_werte ON apflora.tpopkontrzaehl.Methode = apflora.tpopkontrzaehl_methode_werte.BeurteilCode)
				ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
			ON apflora.pop.PopId = apflora.tpop.PopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId)
		LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
		LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
		LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = apflora.pop_status_werte.HerkunftId)
		LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte ON apflora.tpopkontr.TPopKontrIdealBiotopUebereinst = apflora.tpopkontr_idbiotuebereinst_werte.DomainCode)
	LEFT JOIN apflora.adresse AS tblAdresse_1 ON apflora.ap.ApBearb = tblAdresse_1.AdrId)
ON domPopHerkunft_1.HerkunftId = apflora.tpop.TPopHerkunft
WHERE
	apflora_beob.adb_eigenschaften.TaxonomieId > 150
GROUP BY
	apflora.tpopkontr.TPopKontrId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_tpopkontr_letztesjahr AS
SELECT
	apflora.tpop.TPopId,
	Max(apflora.tpopkontr.TPopKontrJahr) AS MaxTPopKontrJahr,
	Count(apflora.tpopkontr.TPopKontrId) AS AnzTPopKontr
FROM
	apflora.tpop
	LEFT JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId
WHERE
	(
		apflora.tpopkontr.TPopKontrTyp Not in ("Ziel", "Zwischenziel")
		AND apflora.tpopkontr.TPopKontrJahr IS NOT NULL
	)
	OR (
		apflora.tpopkontr.TPopKontrTyp IS NULL
		AND apflora.tpopkontr.TPopKontrJahr IS NULL
	)
GROUP BY
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_tpopkontr_letzteid AS
SELECT
	apflora_views.v_tpopkontr_letztesjahr.TPopId,
	Max(apflora.tpopkontr.TPopKontrId) AS MaxTPopKontrId,
	Max(apflora_views.v_tpopkontr_letztesjahr.AnzTPopKontr) AS AnzTPopKontr
FROM
	apflora.tpopkontr
	INNER JOIN apflora_views.v_tpopkontr_letztesjahr ON (apflora_views.v_tpopkontr_letztesjahr.MaxTPopKontrJahr = apflora.tpopkontr.TPopKontrJahr) AND (apflora.tpopkontr.TPopId = apflora_views.v_tpopkontr_letztesjahr.TPopId)
GROUP BY
	apflora_views.v_tpopkontr_letztesjahr.TPopId;

CREATE OR REPLACE VIEW v_tpop_letzteKontrId AS
SELECT
	apflora.tpop.TPopId,
	apflora_views.v_tpopkontr_letzteid.MaxTPopKontrId,
	apflora_views.v_tpopkontr_letzteid.AnzTPopKontr
FROM
	apflora.tpop
	LEFT JOIN apflora_views.v_tpopkontr_letzteid ON apflora.tpop.TPopId = apflora_views.v_tpopkontr_letzteid.TPopId;

CREATE OR REPLACE VIEW v_tpopber_letzteid AS
SELECT
	apflora.tpopkontr.TPopId,
	Max(apflora.tpopber.TPopBerId) AS MaxTPopBerId,
	Max(apflora.tpopber.TPopBerJahr) AS MaxTPopBerJahr,
	Count(apflora.tpopber.TPopBerId) AS AnzTPopBer
FROM
	apflora.tpopkontr
	INNER JOIN apflora.tpopber ON apflora.tpopkontr.TPopId = apflora.tpopber.TPopId
WHERE
	apflora.tpopkontr.TPopKontrTyp Not in ("Ziel", "Zwischenziel")
	AND apflora.tpopber.TPopBerJahr IS NOT NULL
GROUP BY
	apflora.tpopkontr.TPopId;

CREATE OR REPLACE VIEW v_tpopkontr_fuergis AS
SELECT
	apflora.ap.ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS Artname,
	apflora.ap_bearbstand_werte.DomainTxt AS ApStatus,
	apflora.ap.ApJahr,
	apflora.ap_umsetzung_werte.DomainTxt AS ApUmsetzung,
	apflora.pop.PopGuid,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.pop_status_werte.HerkunftTxt AS PopHerkunft,
	apflora.pop.PopBekanntSeit,
	apflora.tpop.TPopGuid,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname,
	apflora.tpop.TPopXKoord,
	apflora.tpop.TPopYKoord,
	apflora.tpop.TPopBekanntSeit,
	apflora.tpopkontr.TPopKontrGuid,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrDatum,
	apflora.tpopkontr_typ_werte.DomainTxt AS TPopKontrTyp,
	apflora.adresse.AdrName AS TPopKontrBearb,
	apflora.tpopkontr.TPopKontrUeberleb,
	apflora.tpopkontr.TPopKontrVitalitaet,
	apflora.pop_entwicklung_werte.EntwicklungTxt AS TPopKontrEntwicklung,
	apflora.tpopkontr.TPopKontrUrsach,
	apflora.tpopkontr.TPopKontrUrteil,
	apflora.tpopkontr.TPopKontrAendUms,
	apflora.tpopkontr.TPopKontrAendKontr,
	apflora.tpop.TPopXKoord AS X,
	apflora.tpop.TPopYKoord AS Y,
	apflora.tpopkontr.TPopKontrLeb,
	apflora.tpopkontr.TPopKontrFlaeche,
	apflora.tpopkontr.TPopKontrLebUmg,
	apflora.tpopkontr.TPopKontrVegTyp,
	apflora.tpopkontr.TPopKontrKonkurrenz,
	apflora.tpopkontr.TPopKontrMoosschicht,
	apflora.tpopkontr.TPopKontrKrautschicht,
	apflora.tpopkontr.TPopKontrStrauchschicht,
	apflora.tpopkontr.TPopKontrBaumschicht,
	apflora.tpopkontr.TPopKontrBodenTyp,
	apflora.tpopkontr.TPopKontrBodenKalkgehalt,
	apflora.tpopkontr.TPopKontrBodenDurchlaessigkeit,
	apflora.tpopkontr.TPopKontrBodenHumus,
	apflora.tpopkontr.TPopKontrBodenNaehrstoffgehalt,
	apflora.tpopkontr.TPopKontrBodenAbtrag,
	apflora.tpopkontr.TPopKontrWasserhaushalt,
	apflora.tpopkontr_idbiotuebereinst_werte.DomainTxt AS TPopKontrIdealBiotopUebereinst,
	apflora.tpopkontr.TPopKontrUebFlaeche,
	apflora.tpopkontr.TPopKontrPlan,
	apflora.tpopkontr.TPopKontrVeg,
	apflora.tpopkontr.TPopKontrNaBo,
	apflora.tpopkontr.TPopKontrUebPfl,
	apflora.tpopkontr.TPopKontrJungPflJN,
	apflora.tpopkontr.TPopKontrVegHoeMax,
	apflora.tpopkontr.TPopKontrVegHoeMit,
	apflora.tpopkontr.TPopKontrGefaehrdung,
	apflora.tpopkontr.MutWann,
	apflora.tpopkontr.MutWer
FROM
	(((((apflora_beob.adb_eigenschaften
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN (apflora.pop
		INNER JOIN (apflora.tpop
			INNER JOIN (((apflora.tpopkontr
				LEFT JOIN apflora.tpopkontr_typ_werte ON apflora.tpopkontr.TPopKontrTyp = apflora.tpopkontr_typ_werte.DomainTxt)
				LEFT JOIN apflora.adresse ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
				LEFT JOIN apflora.pop_entwicklung_werte ON apflora.tpopkontr.TPopKontrEntwicklung = apflora.pop_entwicklung_werte.EntwicklungId)
			ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
		ON apflora.pop.PopId = apflora.tpop.PopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = apflora.pop_status_werte.HerkunftId)
	LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte ON apflora.tpopkontr.TPopKontrIdealBiotopUebereinst = apflora.tpopkontr_idbiotuebereinst_werte.DomainCode
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrDatum;


CREATE OR REPLACE VIEW v_tpopkontr_verwaist AS
SELECT
	apflora.tpopkontr.TPopKontrGuid AS "Kontr Guid",
	apflora.tpopkontr.TPopKontrJahr AS "Kontr Jahr",
	apflora.tpopkontr.TPopKontrDatum AS "Kontr Datum",
	apflora.tpopkontr_typ_werte.DomainTxt AS "Kontr Typ",
	apflora.adresse.AdrName AS "Kontr BearbeiterIn",
	apflora.tpopkontr.TPopKontrUeberleb AS "Kontr Ueberlebensrate",
	apflora.tpopkontr.TPopKontrVitalitaet AS "Kontr Vitalitaet",
	apflora.pop_entwicklung_werte.EntwicklungTxt AS "Kontr Entwicklung",
	apflora.tpopkontr.TPopKontrUrsach AS "Kontr Ursachen",
	apflora.tpopkontr.TPopKontrUrteil AS "Kontr Erfolgsbeurteilung",
	apflora.tpopkontr.TPopKontrAendUms AS "Kontr Aenderungs-Vorschlaege Umsetzung",
	apflora.tpopkontr.TPopKontrAendKontr AS "Kontr Aenderungs-Vorschlaege Kontrolle",
	apflora.tpop.TPopXKoord AS "Kontr X-Koord",
	apflora.tpop.TPopYKoord AS "Kontr Y-Koord",
	apflora.tpopkontr.TPopKontrTxt AS "Kontr Bemerkungen",
	apflora.tpopkontr.TPopKontrLeb AS "Kontr Lebensraum Delarze",
	apflora.tpopkontr.TPopKontrLebUmg AS "Kontr angrenzender Lebensraum Delarze",
	apflora.tpopkontr.TPopKontrVegTyp AS "Kontr Vegetationstyp",
	apflora.tpopkontr.TPopKontrKonkurrenz AS "Kontr Konkurrenz",
	apflora.tpopkontr.TPopKontrMoosschicht AS "Kontr Moosschicht",
	apflora.tpopkontr.TPopKontrKrautschicht AS "Kontr Krautschicht",
	apflora.tpopkontr.TPopKontrStrauchschicht AS "Kontr Strauchschicht",
	apflora.tpopkontr.TPopKontrBaumschicht AS "Kontr Baumschicht",
	apflora.tpopkontr.TPopKontrBodenTyp AS "Kontr Bodentyp",
	apflora.tpopkontr.TPopKontrBodenKalkgehalt AS "Kontr Boden Kalkgehalt",
	apflora.tpopkontr.TPopKontrBodenDurchlaessigkeit AS "Kontr Boden Durchlaessigkeit",
	apflora.tpopkontr.TPopKontrBodenHumus AS "Kontr Boden Humusgehalt",
	apflora.tpopkontr.TPopKontrBodenNaehrstoffgehalt AS "Kontr Boden Naehrstoffgehalt",
	apflora.tpopkontr.TPopKontrBodenAbtrag AS "Kontr Oberbodenabtrag",
	apflora.tpopkontr.TPopKontrWasserhaushalt AS "Kontr Wasserhaushalt",
	apflora.tpopkontr_idbiotuebereinst_werte.DomainTxt AS "Kontr Uebereinstimmung mit Idealbiotop",
	apflora.tpopkontr.TPopKontrHandlungsbedarf AS "Kontr Handlungsbedarf",
	apflora.tpopkontr.TPopKontrUebFlaeche AS "Kontr Ueberpruefte Flaeche",
	apflora.tpopkontr.TPopKontrFlaeche AS "Kontr Flaeche der Teilpopulation m2",
	apflora.tpopkontr.TPopKontrPlan AS "Kontr auf Plan eingezeichnet",
	apflora.tpopkontr.TPopKontrVeg AS "Kontr Deckung durch Vegetation",
	apflora.tpopkontr.TPopKontrNaBo AS "Kontr Deckung nackter Boden",
	apflora.tpopkontr.TPopKontrUebPfl AS "Kontr Deckung durch ueberpruefte Art",
	apflora.tpopkontr.TPopKontrJungPflJN AS "Kontr auch junge Pflanzen",
	apflora.tpopkontr.TPopKontrVegHoeMax AS "Kontr maximale Veg-hoehe cm",
	apflora.tpopkontr.TPopKontrVegHoeMit AS "Kontr mittlere Veg-hoehe cm",
	apflora.tpopkontr.TPopKontrGefaehrdung AS "Kontr Gefaehrdung",
	apflora.tpopkontr.MutWann AS "Datensatz zuletzt geaendert",
	apflora.tpopkontr.MutWer AS "Datensatz zuletzt geaendert von"
FROM
	(apflora.tpop
	RIGHT JOIN (((apflora.tpopkontr
		LEFT JOIN apflora.tpopkontr_typ_werte ON apflora.tpopkontr.TPopKontrTyp = apflora.tpopkontr_typ_werte.DomainTxt)
		LEFT JOIN apflora.adresse ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
		LEFT JOIN apflora.pop_entwicklung_werte ON apflora.tpopkontr.TPopKontrEntwicklung = apflora.pop_entwicklung_werte.EntwicklungId)
	ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte ON apflora.tpopkontr.TPopKontrIdealBiotopUebereinst = apflora.tpopkontr_idbiotuebereinst_werte.DomainCode
WHERE
	apflora.tpop.TPopId Is Null;

CREATE OR REPLACE VIEW v_beob AS
SELECT
	apflora_beob.beob_infospezies.NO_NOTE,
	"" AS "ID_EVAB",
	apflora_beob.beob_infospezies.NO_ISFS,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopGuid,
	apflora.pop.PopNr,
	apflora.tpop.TPopGuid,
	apflora.tpop.TPopNr,
	apflora_beob.beob_infospezies.PROJET,
	apflora_beob.beob_infospezies.NOM_COMMUNE,
	apflora_beob.beob_infospezies.DESC_LOCALITE,
	apflora_beob.beob_infospezies.FNS_XGIS AS X,
	apflora_beob.beob_infospezies.FNS_YGIS AS Y,
	IF (
		apflora_beob.beob_infospezies.FNS_XGIS > 0
		AND apflora.tpop.TPopXKoord > 0
		AND apflora_beob.beob_infospezies.FNS_YGIS > 0
		AND apflora.tpop.TPopYKoord > 0,
		ROUND(
			SQRT(
				(apflora_beob.beob_infospezies.FNS_XGIS - apflora.tpop.TPopXKoord) *
				(apflora_beob.beob_infospezies.FNS_XGIS - apflora.tpop.TPopXKoord) +
				(apflora_beob.beob_infospezies.FNS_YGIS - apflora.tpop.TPopYKoord) *
				(apflora_beob.beob_infospezies.FNS_YGIS - apflora.tpop.TPopYKoord)
			),
			0
		),
		null
	) AS "Distanz zur Teilpopulation (m)",
	apflora_beob.beob_bereitgestellt.Datum,
	apflora_beob.beob_bereitgestellt.Autor,
	apflora.beobzuordnung.beobNichtZuordnen,
	apflora.beobzuordnung.BeobBemerkungen,
	apflora.beobzuordnung.BeobMutWann,
	apflora.beobzuordnung.BeobMutWer 
FROM
	((apflora_beob.beob_infospezies
	INNER JOIN apflora_beob.beob_bereitgestellt ON apflora_beob.beob_infospezies.NO_NOTE = apflora_beob.beob_bereitgestellt.NO_NOTE)
	INNER JOIN apflora_beob.adb_eigenschaften ON apflora_beob.beob_infospezies.NO_ISFS = apflora_beob.adb_eigenschaften.TaxonomieId)
	INNER JOIN ((apflora.pop
		RIGHT JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
		RIGHT JOIN apflora.beobzuordnung ON apflora.tpop.TPopId = apflora.beobzuordnung.TPopId)
	ON apflora_beob.beob_infospezies.NO_NOTE = apflora.beobzuordnung.NO_NOTE
WHERE
	apflora_beob.beob_infospezies.NO_ISFS > 150
UNION SELECT
	"" AS "NO_NOTE",
	apflora_beob.beob_evab.NO_NOTE_PROJET AS "ID_EVAB",
	apflora_beob.beob_evab.NO_ISFS,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopGuid,
	apflora.pop.PopNr,
	apflora.tpop.TPopGuid,
	apflora.tpop.TPopNr,
	apflora_beob.beob_evab.Projekt_ZH AS PROJET,
	apflora_beob.beob_evab.NOM_COMMUNE,
	apflora_beob.beob_evab.DESC_LOCALITE_ AS DESC_LOCALITE,
	apflora_beob.beob_evab.COORDONNEE_FED_E AS X,
	apflora_beob.beob_evab.COORDONNEE_FED_N AS Y,
	IF (
		apflora_beob.beob_evab.COORDONNEE_FED_E > 0
		AND apflora.tpop.TPopXKoord > 0
		AND apflora_beob.beob_evab.COORDONNEE_FED_N > 0
		AND apflora.tpop.TPopYKoord > 0,
		ROUND(
			SQRT(
				(apflora_beob.beob_evab.COORDONNEE_FED_E - apflora.tpop.TPopXKoord) *
				(apflora_beob.beob_evab.COORDONNEE_FED_E - apflora.tpop.TPopXKoord) +
				(apflora_beob.beob_evab.COORDONNEE_FED_N - apflora.tpop.TPopYKoord) *
				(apflora_beob.beob_evab.COORDONNEE_FED_N - apflora.tpop.TPopYKoord)
			),
			0
		),
		null
	) AS "Distanz zur Teilpopulation (m)",
	apflora_beob.beob_bereitgestellt.Datum,
	apflora_beob.beob_bereitgestellt.Autor,
	apflora.beobzuordnung.beobNichtZuordnen,
	apflora.beobzuordnung.BeobBemerkungen,
	apflora.beobzuordnung.BeobMutWann,
	apflora.beobzuordnung.BeobMutWer 
FROM
	((apflora_beob.beob_bereitgestellt
	INNER JOIN apflora_beob.beob_evab ON apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET = apflora_beob.beob_evab.NO_NOTE_PROJET)
	INNER JOIN ((apflora.pop
		RIGHT JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
		RIGHT JOIN apflora.beobzuordnung ON apflora.tpop.TPopId = apflora.beobzuordnung.TPopId)
	ON apflora_beob.beob_evab.NO_NOTE_PROJET = apflora.beobzuordnung.NO_NOTE)
	INNER JOIN apflora_beob.adb_eigenschaften ON apflora_beob.beob_evab.NO_ISFS = apflora_beob.adb_eigenschaften.TaxonomieId 
WHERE
	apflora_beob.beob_evab.NO_ISFS > 150
ORDER BY
	Artname ASC,
	PopNr ASC,
	TPopNr ASC,
	Datum DESC;

CREATE OR REPLACE VIEW v_beob_infospezies AS
SELECT
	apflora_beob.beob_infospezies.NO_NOTE,
	apflora_beob.beob_infospezies.NO_ISFS,
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopGuid,
	apflora.pop.PopNr,
	pop_status_werte.HerkunftTxt AS "Pop Status",
	apflora.tpop.TPopGuid,
	apflora.tpop.TPopNr,
	domPopHerkunft_1.HerkunftTxt AS "TPop Status",
	apflora_beob.beob_infospezies.INTRODUIT,
	apflora_beob.beob_infospezies.PROJET,
	apflora_beob.beob_infospezies.NOM_COMMUNE,
	apflora_beob.beob_infospezies.DESC_LOCALITE,
	apflora_beob.beob_infospezies.FNS_XGIS AS X,
	apflora_beob.beob_infospezies.FNS_YGIS AS Y,
	IF (
		apflora_beob.beob_infospezies.FNS_XGIS > 0
		AND apflora.tpop.TPopXKoord > 0
		AND apflora_beob.beob_infospezies.FNS_YGIS > 0
		AND apflora.tpop.TPopYKoord > 0,
		ROUND(
			SQRT(
				(apflora_beob.beob_infospezies.FNS_XGIS - apflora.tpop.TPopXKoord) *
				(apflora_beob.beob_infospezies.FNS_XGIS - apflora.tpop.TPopXKoord) +
				(apflora_beob.beob_infospezies.FNS_YGIS - apflora.tpop.TPopYKoord) *
				(apflora_beob.beob_infospezies.FNS_YGIS - apflora.tpop.TPopYKoord)
			),
			0
		),
		null
		) AS "Distanz zur Teilpopulation (m)",
	apflora_beob.beob_bereitgestellt.Datum,
	apflora_beob.beob_bereitgestellt.Autor,
	apflora.beobzuordnung.beobNichtZuordnen,
	apflora.beobzuordnung.BeobBemerkungen,
	apflora.beobzuordnung.BeobMutWann,
	apflora.beobzuordnung.BeobMutWer 
FROM
	((((apflora_beob.beob_infospezies
	INNER JOIN apflora_beob.beob_bereitgestellt ON apflora_beob.beob_infospezies.NO_NOTE = apflora_beob.beob_bereitgestellt.NO_NOTE)
	INNER JOIN apflora_beob.adb_eigenschaften ON apflora_beob.beob_infospezies.NO_ISFS = apflora_beob.adb_eigenschaften.TaxonomieId)
	INNER JOIN ((apflora.pop
		RIGHT JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
		RIGHT JOIN apflora.beobzuordnung ON apflora.tpop.TPopId = apflora.beobzuordnung.TPopId)
	ON apflora_beob.beob_infospezies.NO_NOTE = apflora.beobzuordnung.NO_NOTE)
	LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
	LEFT JOIN apflora.pop_status_werte AS domPopHerkunft_1 ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId
WHERE
	apflora_beob.beob_infospezies.NO_ISFS > 150
ORDER BY
	Artname ASC,
	PopNr ASC,
	TPopNr ASC,
	Datum DESC;


# this is a test
CREATE OR REPLACE VIEW v_beob_alle AS
SELECT
	apflora_beob.adb_eigenschaften.Artname,
	apflora.ap_bearbstand_werte.DomainTxt AS ApStatus,
	apflora.ap.ApJahr,
	apflora_beob.beob_bereitgestellt.Datum,
	apflora_beob.beob_bereitgestellt.Autor,
	apflora.beobzuordnung.TPopId,
	apflora.beobzuordnung.BeobNichtZuordnen,
	apflora.beobzuordnung.BeobBemerkungen,
	apflora.beobzuordnung.BeobMutWann,
	apflora.beobzuordnung.BeobMutWer
FROM
	((((apflora_beob.beob_bereitgestellt
	INNER JOIN apflora_beob.beob_infospezies ON apflora_beob.beob_bereitgestellt.NO_NOTE = apflora_beob.beob_infospezies.NO_NOTE)
	INNER JOIN apflora_beob.adb_eigenschaften ON apflora_beob.beob_infospezies.NO_ISFS = apflora_beob.adb_eigenschaften.TaxonomieId)
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN ((apflora.pop
		RIGHT JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
		RIGHT JOIN apflora.beobzuordnung ON apflora.tpop.TPopId = apflora.beobzuordnung.TPopId)
	ON apflora_beob.beob_infospezies.NO_NOTE = apflora.beobzuordnung.NO_NOTE)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

# this shall be added to export form
CREATE OR REPLACE VIEW v_beob_infospezies AS
SELECT
	apflora_beob.adb_eigenschaften.Artname,
	apflora.ap_bearbstand_werte.DomainTxt AS ApStatus,
	apflora.ap.ApJahr,
	apflora_beob.beob_bereitgestellt.Datum,
	apflora_beob.beob_bereitgestellt.Autor,
	apflora.beobzuordnung.TPopId,
	apflora.beobzuordnung.BeobNichtZuordnen,
	apflora.beobzuordnung.BeobBemerkungen,
	apflora.beobzuordnung.BeobMutWann,
	apflora.beobzuordnung.BeobMutWer,
	apflora_beob.beob_infospezies.*
FROM
	((((apflora_beob.beob_bereitgestellt
	INNER JOIN apflora_beob.beob_infospezies ON apflora_beob.beob_bereitgestellt.NO_NOTE = apflora_beob.beob_infospezies.NO_NOTE)
	INNER JOIN apflora_beob.adb_eigenschaften ON apflora_beob.beob_infospezies.NO_ISFS = apflora_beob.adb_eigenschaften.TaxonomieId)
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.beobzuordnung ON apflora_beob.beob_infospezies.NO_NOTE = apflora.beobzuordnung.NO_NOTE)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

# this shall be added to export form
CREATE OR REPLACE VIEW v_beob_evab AS
SELECT
	apflora_beob.adb_eigenschaften.Artname,
	apflora.ap_bearbstand_werte.DomainTxt AS ApStatus,
	apflora.ap.ApJahr,
	apflora_beob.beob_bereitgestellt.Datum,
	apflora_beob.beob_bereitgestellt.Autor,
	apflora.beobzuordnung.TPopId,
	apflora.beobzuordnung.BeobNichtZuordnen,
	apflora.beobzuordnung.BeobBemerkungen,
	apflora.beobzuordnung.BeobMutWann,
	apflora.beobzuordnung.BeobMutWer,
	apflora_beob.beob_evab.*
FROM
	((((apflora_beob.beob_bereitgestellt
	INNER JOIN apflora_beob.beob_evab ON apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET = apflora_beob.beob_evab.NO_NOTE_PROJET)
	INNER JOIN apflora_beob.adb_eigenschaften ON apflora_beob.beob_evab.NO_ISFS = apflora_beob.adb_eigenschaften.TaxonomieId)
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	LEFT JOIN apflora.beobzuordnung ON apflora_beob.beob_evab.NO_NOTE_PROJET = apflora.beobzuordnung.NO_NOTE)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode
ORDER BY
	apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_exportevab_beob AS
SELECT
  CONCAT('{', apflora.tpopkontr.ZeitGuid, '}') AS fkZeitpunkt,
  CONCAT('{', apflora.tpopkontr.TPopKontrGuid, '}') AS idBeobachtung,
  IF(
  		apflora.adresse.EvabIdPerson Is Not Null,
  		apflora.adresse.EvabIdPerson,
  		'{A1146AE4-4E03-4032-8AA8-BC46BA02F468}'
  	) AS fkAutor,
  apflora.ap.ApArtId AS fkArt,
  18 AS fkArtgruppe,
  1 AS fkAA1,
  tpopHerkunft.ZdsfHerkunft AS fkAAINTRODUIT,
  IF(
  		apflora.tpopkontr.TPopKontrEntwicklung = 8,
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
  	tblAdresse_2.EvabIdPerson, apflora.adresse.EvabIdPerson
	) AS EXPERTISE_INTRODUITE_NOM
FROM
	((((((((apflora.ap
	INNER JOIN
		apflora.pop
		ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN
		apflora.tpop
		ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN
		apflora.tpopkontr
		ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	LEFT JOIN
		apflora.adresse
		ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
	LEFT JOIN
		apflora.pop_status_werte
		AS tpopHerkunft ON apflora.tpop.TPopHerkunft = tpopHerkunft.HerkunftId)
	LEFT JOIN
		apflora.tpopkontrzaehl
		ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId)
	LEFT JOIN
		apflora.tpopkontrzaehl_einheit_werte
		ON apflora.tpopkontrzaehl.Zaehleinheit = apflora.tpopkontrzaehl_einheit_werte.ZaehleinheitCode)
	LEFT JOIN
		apflora.tpopkontrzaehl_methode_werte
		ON apflora.tpopkontrzaehl.Methode = apflora.tpopkontrzaehl_methode_werte.BeurteilCode) 
	LEFT JOIN
		apflora.adresse AS tblAdresse_2
		ON apflora.ap.ApBearb = tblAdresse_2.AdrId
WHERE
	apflora.ap.ApArtId > 150
  AND apflora.tpop.TPopXKoord Is Not Null
  AND apflora.tpop.TPopYKoord Is Not Null
  AND apflora.tpopkontr.TPopKontrTyp In ("Zwischenbeurteilung", "Freiwilligen-Erfolgskontrolle")
  AND apflora.tpop.TPopHerkunft <> 201
  AND apflora.tpopkontr.TPopKontrJahr Is Not Null
  AND apflora.tpop.TPopBekanntSeit Is Not Null
  AND (apflora.tpopkontr.TPopKontrJahr - apflora.tpop.TPopBekanntSeit) > 5
GROUP BY
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_exportevab_zeit AS
SELECT
  CONCAT(
  	'{',
  	apflora.tpop.TPopGuid,
  	'}'
	) AS fkOrt,
  CONCAT(
  	'{',
  	apflora.tpopkontr.ZeitGuid,
  	'}'
	) AS idZeitpunkt,
	CAST(
		IF(
			apflora.tpopkontr.TPopKontrDatum Is Not Null,
			DATE_FORMAT(apflora.tpopkontr.TPopKontrDatum, '%d.%m.%Y'),
			CONCAT(
				"01.01.",
				apflora.tpopkontr.TPopKontrJahr
			)
		)
		AS CHAR
	) AS Datum,
  IF(
  	apflora.tpopkontr.TPopKontrDatum Is Not Null,
  	"T",
  	"J"
	) AS fkGenauigkeitDatum,
  IF(
  	apflora.tpopkontr.TPopKontrDatum Is Not Null,
  	'P',
  	'X'
	) AS fkGenauigkeitDatumZDSF,
  LEFT(apflora.tpopkontr.TPopKontrMoosschicht, 10) AS COUV_MOUSSES,
  LEFT(apflora.tpopkontr.TPopKontrKrautschicht, 10) AS COUV_HERBACEES,
  LEFT(apflora.tpopkontr.TPopKontrStrauchschicht, 10) AS COUV_BUISSONS,
  LEFT(apflora.tpopkontr.TPopKontrBaumschicht, 10) AS COUV_ARBRES
FROM
	((((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	LEFT JOIN apflora.adresse ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
	LEFT JOIN apflora.pop_status_werte AS tpopHerkunft ON apflora.tpop.TPopHerkunft = tpopHerkunft.HerkunftId
WHERE
	apflora.ap.ApArtId > 150
  AND apflora.tpop.TPopXKoord Is Not Null
  AND apflora.tpop.TPopYKoord Is Not Null
  AND apflora.tpopkontr.TPopKontrTyp In ("Zwischenbeurteilung", "Freiwilligen-Erfolgskontrolle")
  AND apflora.tpop.TPopHerkunft <> 201
  AND apflora.tpopkontr.TPopKontrJahr Is Not Null
  AND apflora.tpop.TPopBekanntSeit Is Not Null
  AND (apflora.tpopkontr.TPopKontrJahr - apflora.tpop.TPopBekanntSeit) > 5;

CREATE OR REPLACE VIEW v_exportevab_ort AS
SELECT
	CONCAT('{', apflora.pop.PopGuid, '}') AS fkRaum,
  CONCAT('{', apflora.tpop.TPopGuid, '}') AS idOrt,
  LEFT(
  	CAST(
  		CONCAT(
  			apflora.tpop.TPopFlurname,
  			IF(
  				apflora.tpop.TPopNr Is Not Null,
  				CONCAT(" (Nr. ", apflora.tpop.TPopNr, ")"),
  				""
				)
			) AS CHAR
		),
		40
	) AS Name,
  DATE_FORMAT(CURDATE(), '%d.%m.%Y') AS Erfassungsdatum,
  "{7C71B8AF-DF3E-4844-A83B-55735F80B993}" AS fkAutor,
  LEFT(apflora.tpopkontr.TPopKontrLeb, 9) AS fkLebensraumtyp,
  1 AS fkGenauigkeitLage,
  1 AS fkGeometryType,
  IF(
  	apflora.tpop.TPopHoehe Is Not Null,
  	apflora.tpop.TPopHoehe,
  	0
	) AS obergrenzeHoehe,
  4 AS fkGenauigkeitHoehe,
  apflora.tpop.TPopXKoord AS X,
  apflora.tpop.TPopYKoord AS Y,
  LEFT(apflora.tpop.TPopGemeinde, 25) AS NOM_COMMUNE,
  LEFT(apflora.tpop.TPopFlurname, 255) AS DESC_LOCALITE,
  apflora.tpopkontr.TPopKontrLebUmg AS ENV
FROM
	((((apflora.ap
 
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
 
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
 
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
 
	LEFT JOIN apflora.adresse ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
 
	LEFT JOIN apflora.pop_status_werte AS tpopHerkunft ON apflora.tpop.TPopHerkunft = tpopHerkunft.HerkunftId
WHERE
	apflora.ap.ApArtId > 150
  AND apflora.tpop.TPopXKoord Is Not Null
  AND apflora.tpop.TPopYKoord Is Not Null
  AND apflora.tpopkontr.TPopKontrTyp In ("Zwischenbeurteilung", "Freiwilligen-Erfolgskontrolle")
  AND apflora.tpop.TPopHerkunft <> 201
  AND apflora.tpopkontr.TPopKontrJahr Is Not Null
  AND apflora.tpop.TPopBekanntSeit Is Not Null
  AND (apflora.tpopkontr.TPopKontrJahr - apflora.tpop.TPopBekanntSeit) > 5
GROUP BY
	apflora.pop.PopGuid, apflora.tpop.TPopGuid;

CREATE OR REPLACE VIEW v_exportevab_raum AS
SELECT
  CONCAT('{', apflora.ap.ApGuid, '}') AS fkProjekt,
  CONCAT('{', apflora.pop.PopGuid, '}') AS idRaum,
  CAST(
  	CONCAT(
  		apflora.pop.PopName,
  		IF(
  			apflora.pop.PopNr Is Not Null,
  			CONCAT(" (Nr. ", apflora.pop.PopNr, ")"),
  			""
			)
		) AS CHAR
	) AS Name,
  DATE_FORMAT(CURDATE(), '%d.%m.%Y') AS Erfassungsdatum,
  "{7C71B8AF-DF3E-4844-A83B-55735F80B993}" AS fkAutor,
  CAST(
  	IF(
  		apflora.pop.PopHerkunft Is Not Null,
  		CONCAT(
  			"Status: ",
  			popHerkunft.HerkunftTxt,
  			IF(
  				apflora.pop.PopBekanntSeit Is Not Null,
  				CONCAT(
  					"; Bekannt seit: ",
  					apflora.pop.PopBekanntSeit
					),
  				""
				)
			),
  		""
		) AS CHAR
	) AS Bemerkungen
FROM
	((((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	LEFT JOIN apflora.adresse ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
	LEFT JOIN apflora.pop_status_werte AS popHerkunft ON apflora.pop.PopHerkunft = popHerkunft.HerkunftId
WHERE
	apflora.ap.ApArtId > 150
  AND apflora.tpop.TPopXKoord Is Not Null
  AND apflora.tpop.TPopYKoord Is Not Null
  AND apflora.tpopkontr.TPopKontrTyp In ("Zwischenbeurteilung", "Freiwilligen-Erfolgskontrolle")
  AND apflora.tpop.TPopHerkunft <> 201
  AND apflora.tpopkontr.TPopKontrJahr Is Not Null
  AND apflora.tpop.TPopBekanntSeit Is Not Null
  AND (apflora.tpopkontr.TPopKontrJahr - apflora.tpop.TPopBekanntSeit) > 5
GROUP BY
	apflora.pop.PopGuid;

CREATE OR REPLACE VIEW v_exportevab_projekt AS
SELECT
  CONCAT('{', apflora.ap.ApGuid, '}') AS idProjekt,
  CONCAT("AP Flora ZH: ", apflora_beob.adb_eigenschaften.Artname) AS Name,
  CAST(
  	IF(
  		apflora.ap.ApJahr Is Not Null,
  		CONCAT("01.01.", apflora.ap.ApJahr),
  		DATE_FORMAT(CURDATE(), '%d.%m.%Y')
		) AS CHAR
	) AS Eroeffnung,
  "{7C71B8AF-DF3E-4844-A83B-55735F80B993}" AS fkAutor,
  CAST(
  	CONCAT(
  		"Aktionsplan: ",
  		apflora.ap_bearbstand_werte.DomainTxt,
  		IF(
  			apflora.ap.ApJahr Is Not Null,
  			CONCAT("; Start im Jahr: ", apflora.ap.ApJahr),
  			""
			),
  		IF(
  			apflora.ap.ApUmsetzung Is Not Null,
  			CONCAT("; Stand Umsetzung: ", apflora.ap_umsetzung_werte.DomainTxt),
  			""
			),
  		""
		) AS CHAR
	) AS Bemerkungen
FROM
	(((((((apflora.ap
	INNER JOIN apflora_beob.adb_eigenschaften ON apflora.ap.ApArtId = apflora_beob.adb_eigenschaften.TaxonomieId)
	INNER JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	LEFT JOIN apflora.adresse ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
	LEFT JOIN apflora.pop_status_werte AS popHerkunft ON apflora.pop.PopHerkunft = popHerkunft.HerkunftId
WHERE
	apflora.ap.ApArtId > 150
  AND apflora.tpop.TPopXKoord Is Not Null
  AND apflora.tpop.TPopYKoord Is Not Null
  AND apflora.tpopkontr.TPopKontrTyp In ("Zwischenbeurteilung", "Freiwilligen-Erfolgskontrolle")
  AND apflora.tpop.TPopHerkunft <> 201
  AND apflora.tpopkontr.TPopKontrJahr Is Not Null
  AND apflora.tpop.TPopBekanntSeit Is Not Null
  AND (apflora.tpopkontr.TPopKontrJahr - apflora.tpop.TPopBekanntSeit) > 5
GROUP BY
	apflora.ap.ApGuid;

CREATE OR REPLACE VIEW v_tpopmassnber AS
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
  tpopHerkunft.HerkunftTxt AS "TPop Status",
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
  apflora.tpopmassnber.TPopMassnBerId AS "TPopMassnBer Id",
  apflora.tpopmassnber.TPopMassnBerJahr AS "TPopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.BeurteilTxt AS "TPopMassnBer Entwicklung",
  apflora.tpopmassnber.TPopMassnBerTxt AS "TPopMassnBer Interpretation",
  apflora.tpopmassnber.MutWann AS "TPopMassnBer MutWann",
  apflora.tpopmassnber.MutWer AS "TPopMassnBer MutWer"
FROM
	(((((((apflora_beob.adb_eigenschaften
	RIGHT JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	RIGHT JOIN (apflora.pop
		RIGHT JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
	LEFT JOIN apflora.pop_status_werte AS tpopHerkunft ON apflora.tpop.TPopHerkunft = tpopHerkunft.HerkunftId)INNER JOIN apflora.tpopmassnber ON apflora.tpop.TPopId = apflora.tpopmassnber.TPopId)
	LEFT JOIN apflora.tpopmassn_erfbeurt_werte ON apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung = tpopmassn_erfbeurt_werte.BeurteilId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopmassnber.TPopMassnBerJahr;

CREATE OR REPLACE VIEW v_tpop_kml AS
SELECT
	apflora_beob.adb_eigenschaften.Artname AS Art,
  CAST(
  	CONCAT(
  		apflora.pop.PopNr,
  		'/',
  		apflora.tpop.TPopNr
		) AS CHAR
	) AS Label,
  CAST(
  	LEFT(
  		CONCAT(
  			'Population: ',
  			apflora.pop.PopNr,
  			' ',
  			apflora.pop.PopName,
  			'<br /> Teilpopulation: ',
  			apflora.tpop.TPopNr,
  			' ',
  			apflora.tpop.TPopGemeinde,
  			' ',
  			apflora.tpop.TPopFlurname
			),
  		225
		) AS CHAR
	) AS Inhalte,
	(
		2.6779094
		+ (4.728982 * ((apflora.tpop.TPopXKoord - 600000) / 1000000))
		+ (0.791484 * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
		+ (0.1306 * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
		- (0.0436 * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopXKoord - 600000) / 1000000))
	) * 100 / 36 AS Laengengrad,
	(
		16.9023892
		+ (3.238272 * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
		- (0.270978 * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopXKoord - 600000) / 1000000))
		- (0.002528 * ((apflora.tpop.TPopYKoord - 200000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
		- (0.0447 * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
		- (0.014 * ((apflora.tpop.TPopYKoord - 200000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
	) * 100 / 36 AS Breitengrad,
	CAST(
		CONCAT(
			'http://apflora.ch/index.html?ap=',
			apflora.ap.ApArtId,
			'&pop=',
			apflora.tpop.TPopId
		) AS CHAR
	) AS URL
FROM
	(apflora_beob.adb_eigenschaften
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN (apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopYKoord > 0
	AND apflora.tpop.TPopXKoord > 0
ORDER BY
  apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname;

CREATE OR REPLACE VIEW v_tpop_kmlnamen AS
SELECT
  apflora_beob.adb_eigenschaften.Artname AS Art,
	CAST(
		CONCAT(
			apflora_beob.adb_eigenschaften.Artname,
			' ',
			apflora.pop.PopNr,
			'/',
			apflora.tpop.TPopNr
		) AS CHAR
	) AS Label,
	CAST(
		LEFT(
			CONCAT(
				'Population: ',
				apflora.pop.PopNr,
				' ',
				apflora.pop.PopName,
				'<br /> Teilpopulation: ',
				apflora.tpop.TPopNr,
				' ',
				apflora.tpop.TPopGemeinde,
				' ',
				apflora.tpop.TPopFlurname),
			225
		) AS CHAR
	) AS Inhalte,
	(
		2.6779094
		+ (4.728982 * ((apflora.tpop.TPopXKoord - 600000) / 1000000))
		+ (0.791484 * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
		+ (0.1306 * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
		- (0.0436 * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopXKoord - 600000) / 1000000))
	) * 100 / 36 AS Laengengrad,
	(
		16.9023892
		+ (3.238272 * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
		- (0.270978 * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopXKoord - 600000) / 1000000))
		- (0.002528 * ((apflora.tpop.TPopYKoord - 200000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
		- (0.0447 * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopXKoord - 600000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
		- (0.014 * ((apflora.tpop.TPopYKoord - 200000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000) * ((apflora.tpop.TPopYKoord - 200000) / 1000000))
	) * 100 / 36 AS Breitengrad,
	CAST(
		CONCAT(
			'http://www.apflora.ch/index.html?ap=',
			apflora.ap.ApArtId,
			'&pop=',
			apflora.tpop.TPopId
		) AS CHAR
	) AS URL
FROM
	(apflora_beob.adb_eigenschaften
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN (apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopYKoord > 0
	AND apflora.tpop.TPopXKoord > 0
ORDER BY
  apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname;

CREATE OR REPLACE VIEW v_pop_kml AS
SELECT
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.pop.PopNr AS Label,
	CAST(
		LEFT(
			CONCAT('Population: ', apflora.pop.PopNr, ' ', apflora.pop.PopName),
			225
		) AS CHAR
	) AS Inhalte,
	(
		2.6779094
		+ (4.728982 * ((apflora.pop.PopXKoord - 600000) / 1000000))
		+ (0.791484 * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000))
		+ (0.1306 * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000))
		- (0.0436 * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopXKoord - 600000) / 1000000))
	) * 100 / 36 AS Laengengrad,
	(
		16.9023892
		+ (3.238272 * ((apflora.pop.PopYKoord - 200000) / 1000000))
		- (0.270978 * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopXKoord - 600000) / 1000000))
		- (0.002528 * ((apflora.pop.PopYKoord - 200000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000))
		- (0.0447 * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000))
		- (0.014 * ((apflora.pop.PopYKoord - 200000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000))
	) * 100 / 36 AS Breitengrad,
	CAST(
		CONCAT(
			'http://www.apflora.ch/index.html?ap=',
			apflora.ap.ApArtId,
			'&pop=',
			apflora.pop.PopId
		) AS CHAR
	) AS URL
FROM
	(apflora_beob.adb_eigenschaften
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.pop.PopYKoord > 0
	AND apflora.pop.PopXKoord > 0
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.pop.PopName;

CREATE OR REPLACE VIEW v_pop_kmlnamen AS
SELECT
	apflora_beob.adb_eigenschaften.Artname AS Art,
	CAST(
		CONCAT(
			apflora_beob.adb_eigenschaften.Artname,
			' ',
			apflora.pop.PopNr
		) AS CHAR
	) AS Label,
	CAST(
		LEFT(
			CONCAT('Population: ', apflora.pop.PopNr, ' ', apflora.pop.PopName),
			225
		) AS CHAR
	) AS Inhalte,
	(
		2.6779094
		+ (4.728982 * ((apflora.pop.PopXKoord - 600000) / 1000000))
		+ (0.791484 * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000))
		+ (0.1306 * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000))
		- (0.0436 * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopXKoord - 600000) / 1000000))
	) * 100 / 36 AS Laengengrad,
	(
		16.9023892
		+ (3.238272 * ((apflora.pop.PopYKoord - 200000) / 1000000))
		- (0.270978 * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopXKoord - 600000) / 1000000))
		- (0.002528 * ((apflora.pop.PopYKoord - 200000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000))
		- (0.0447 * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopXKoord - 600000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000))
		- (0.014 * ((apflora.pop.PopYKoord - 200000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000) * ((apflora.pop.PopYKoord - 200000) / 1000000))
		) * 100 / 36 AS Breitengrad,
	CAST(
		CONCAT(
			'http://www.apflora.ch/index.html?ap=',
			apflora.ap.ApArtId,
			'&pop=',
			apflora.pop.PopId
		) AS CHAR
	) AS URL
FROM
	(apflora_beob.adb_eigenschaften
	INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.pop.PopYKoord > 0
	AND apflora.pop.PopXKoord > 0
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.pop.PopName;

DROP VIEW IF EXISTS vKontrAnzProZaehleinheit0;

CREATE OR REPLACE VIEW v_kontrzaehl_anzproeinheit AS
SELECT
	apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId,
	apflora_beob.adb_eigenschaften.Artname AS "AP Art",
	apflora.ap_bearbstand_werte.DomainTxt AS "AP Status",
	apflora.ap.ApJahr AS "AP Start im Jahr",
	apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung",
	tblAdresse_1.AdrName AS "AP verantwortlich",
	apflora.pop.PopGuid AS "Pop Guid",
	apflora.pop.PopNr AS "Pop Nr",
	apflora.pop.PopName AS "Pop Name",
	apflora.pop_status_werte.HerkunftTxt AS "Pop Herkunft",
	apflora.pop.PopBekanntSeit AS "Pop bekannt seit",
	apflora.tpop.TPopId AS "TPop ID",
	apflora.tpop.TPopGuid AS "TPop Guid",
	apflora.tpop.TPopNr AS "TPop Nr",
	apflora.tpop.TPopGemeinde AS "TPop Gemeinde",
	apflora.tpop.TPopFlurname AS "TPop Flurname",
	tpopHerkunft.HerkunftTxt AS "TPop Status",
	apflora.tpop.TPopBekanntSeit AS "TPop bekannt seit",
	apflora.tpop.TPopHerkunftUnklar AS "TPop Status unklar",
	apflora.tpop.TPopHerkunftUnklarBegruendung AS "TPop Begruendung fuer unklaren Status",
	apflora.tpop.TPopXKoord AS "TPop X-Koordinaten",
	apflora.tpop.TPopYKoord AS "TPop Y-Koordinaten",
	apflora.tpop.TPopRadius AS "TPop Radius m",
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
	apflora.tpopkontr.TPopKontrId,
	apflora.tpopkontr.TPopId,
	apflora.tpopkontr.TPopKontrGuid AS "Kontr Guid",
	apflora.tpopkontr.TPopKontrJahr AS "Kontr Jahr",
	apflora.tpopkontr.TPopKontrDatum AS "Kontr Datum",
	apflora.tpopkontr_typ_werte.DomainTxt AS "Kontr Typ",
	apflora.adresse.AdrName AS "Kontr BearbeiterIn",
	apflora.tpopkontr.TPopKontrUeberleb AS "Kontr Ueberlebensrate",
	apflora.tpopkontr.TPopKontrVitalitaet AS "Kontr Vitalitaet",
	apflora.pop_entwicklung_werte.EntwicklungTxt AS "Kontr Entwicklung",
	apflora.tpopkontr.TPopKontrUrsach AS "Kontr Ursachen",
	apflora.tpopkontr.TPopKontrUrteil AS "Kontr Erfolgsbeurteilung",
	apflora.tpopkontr.TPopKontrAendUms AS "Kontr Aenderungs-Vorschlaege Umsetzung",
	apflora.tpopkontr.TPopKontrAendKontr AS "Kontr Aenderungs-Vorschlaege Kontrolle",
	apflora.tpop.TPopXKoord AS "Kontr X-Koord",
	apflora.tpop.TPopYKoord AS "Kontr Y-Koord",
	apflora.tpopkontr.TPopKontrTxt AS "Kontr Bemerkungen",
	apflora.tpopkontr.TPopKontrLeb AS "Kontr Lebensraum Delarze",
	apflora.tpopkontr.TPopKontrLebUmg AS "Kontr angrenzender Lebensraum Delarze",
	apflora.tpopkontr.TPopKontrVegTyp AS "Kontr Vegetationstyp",
	apflora.tpopkontr.TPopKontrKonkurrenz AS "Kontr Konkurrenz",
	apflora.tpopkontr.TPopKontrMoosschicht AS "Kontr Moosschicht",
	apflora.tpopkontr.TPopKontrKrautschicht AS "Kontr Krautschicht",
	apflora.tpopkontr.TPopKontrStrauchschicht AS "Kontr Strauchschicht",
	apflora.tpopkontr.TPopKontrBaumschicht AS "Kontr Baumschicht",
	apflora.tpopkontr.TPopKontrBodenTyp AS "Kontr Bodentyp",
	apflora.tpopkontr.TPopKontrBodenKalkgehalt AS "Kontr Boden Kalkgehalt",
	apflora.tpopkontr.TPopKontrBodenDurchlaessigkeit AS "Kontr Boden Durchlaessigkeit",
	apflora.tpopkontr.TPopKontrBodenHumus AS "Kontr Boden Humusgehalt",
	apflora.tpopkontr.TPopKontrBodenNaehrstoffgehalt AS "Kontr Boden Naehrstoffgehalt",
	apflora.tpopkontr.TPopKontrBodenAbtrag AS "Kontr Oberbodenabtrag",
	apflora.tpopkontr.TPopKontrWasserhaushalt AS "Kontr Wasserhaushalt",
	apflora.tpopkontr_idbiotuebereinst_werte.DomainTxt AS "Kontr Uebereinstimmung mit Idealbiotop",
	apflora.tpopkontr.TPopKontrHandlungsbedarf AS "Kontr Handlungsbedarf",
	apflora.tpopkontr.TPopKontrUebFlaeche AS "Kontr Ueberpruefte Flaeche",
	apflora.tpopkontr.TPopKontrFlaeche AS "Kontr Flaeche der Teilpopulation m2",
	apflora.tpopkontr.TPopKontrPlan AS "Kontr auf Plan eingezeichnet",
	apflora.tpopkontr.TPopKontrVeg AS "Kontr Deckung durch Vegetation",
	apflora.tpopkontr.TPopKontrNaBo AS "Kontr Deckung nackter Boden",
	apflora.tpopkontr.TPopKontrUebPfl AS "Kontr Deckung durch ueberpruefte Art",
	apflora.tpopkontr.TPopKontrJungPflJN AS "Kontr auch junge Pflanzen",
	apflora.tpopkontr.TPopKontrVegHoeMax AS "Kontr maximale Veg-hoehe cm",
	apflora.tpopkontr.TPopKontrVegHoeMit AS "Kontr mittlere Veg-hoehe cm",
	apflora.tpopkontr.TPopKontrGefaehrdung AS "Kontr Gefaehrdung",
	apflora.tpopkontr.MutWann AS "Kontrolle zuletzt geaendert",
	apflora.tpopkontr.MutWer AS "Kontrolle zuletzt geaendert von",
	apflora.tpopkontrzaehl.TPopKontrZaehlId,
	apflora.tpopkontrzaehl_einheit_werte.ZaehleinheitTxt AS Zaehleinheit,
	apflora.tpopkontrzaehl_methode_werte.BeurteilTxt AS Methode,
	apflora.tpopkontrzaehl.Anzahl
FROM
	(((apflora.pop_status_werte AS tpopHerkunft
	RIGHT JOIN (((((((apflora_beob.adb_eigenschaften
		INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
		INNER JOIN (apflora.pop
			INNER JOIN (apflora.tpop
				INNER JOIN (((apflora.tpopkontr
					LEFT JOIN apflora.tpopkontr_typ_werte ON apflora.tpopkontr.TPopKontrTyp = apflora.tpopkontr_typ_werte.DomainTxt)
					LEFT JOIN apflora.adresse ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId)
					LEFT JOIN apflora.pop_entwicklung_werte ON apflora.tpopkontr.TPopKontrEntwicklung = apflora.pop_entwicklung_werte.EntwicklungId)
				ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
			ON apflora.pop.PopId = apflora.tpop.PopId)
		ON apflora.ap.ApArtId = apflora.pop.ApArtId)
		LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
		LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
		LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = apflora.pop_status_werte.HerkunftId)
		LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte ON apflora.tpopkontr.TPopKontrIdealBiotopUebereinst = apflora.tpopkontr_idbiotuebereinst_werte.DomainCode)
		LEFT JOIN apflora.adresse AS tblAdresse_1 ON apflora.ap.ApBearb = tblAdresse_1.AdrId)
	ON tpopHerkunft.HerkunftId = apflora.tpop.TPopHerkunft)
	INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId)
	LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl.Zaehleinheit = apflora.tpopkontrzaehl_einheit_werte.ZaehleinheitCode)
	LEFT JOIN apflora.tpopkontrzaehl_methode_werte ON apflora.tpopkontrzaehl.Methode = apflora.tpopkontrzaehl_methode_werte.BeurteilCode
WHERE
	apflora_beob.adb_eigenschaften.TaxonomieId > 150
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrDatum;

CREATE OR REPLACE VIEW v_tpopber AS
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
	tpopHerkunft.HerkunftTxt AS "TPop Status",
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
	apflora.tpopber.TPopBerId AS "TPopBer Id",
	apflora.tpopber.TPopBerJahr AS "TPopBer Jahr",
	pop_entwicklung_werte.EntwicklungTxt AS "TPopBer Entwicklung",
	apflora.tpopber.TPopBerTxt AS "TPopBer Bemerkungen",
	apflora.tpopber.MutWann AS "TPopBer MutWann",
	apflora.tpopber.MutWer AS "TPopBer MutWer"
FROM
	(((((((apflora_beob.adb_eigenschaften
	RIGHT JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId)
	RIGHT JOIN (apflora.pop
		RIGHT JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode)
	LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode)
	LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId)
	LEFT JOIN apflora.pop_status_werte AS tpopHerkunft ON apflora.tpop.TPopHerkunft = tpopHerkunft.HerkunftId)
	RIGHT JOIN apflora.tpopber ON apflora.tpop.TPopId = apflora.tpopber.TPopId)
	LEFT JOIN apflora.pop_entwicklung_werte ON apflora.tpopber.TPopBerEntwicklung = pop_entwicklung_werte.EntwicklungId
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopber.TPopBerJahr,
	pop_entwicklung_werte.EntwicklungTxt;

CREATE OR REPLACE VIEW v_tpop_berjahrundmassnjahr AS
SELECT
	apflora.tpop.TPopId,
	apflora.tpopber.TPopBerJahr as "Jahr"
FROM
	apflora.tpop
	INNER JOIN apflora.tpopber ON apflora.tpop.TPopId = apflora.tpopber.TPopId
UNION DISTINCT SELECT
	apflora.tpop.TPopId,
	apflora.tpopmassnber.TPopMassnBerJahr as "Jahr"
FROM
	apflora.tpop
	INNER JOIN apflora.tpopmassnber ON apflora.tpop.TPopId = apflora.tpopmassnber.TPopId
ORDER BY
	Jahr;

CREATE OR REPLACE VIEW v_tpop_kontrjahrundberjahrundmassnjahr AS
SELECT
	apflora.tpop.TPopId,
	apflora.tpopber.TPopBerJahr AS "Jahr" 
FROM
	apflora.tpop
	INNER JOIN apflora.tpopber ON apflora.tpop.TPopId = apflora.tpopber.TPopId
UNION DISTINCT SELECT
	apflora.tpop.TPopId,
	apflora.tpopmassnber.TPopMassnBerJahr AS "Jahr"
FROM
	apflora.tpop
	INNER JOIN apflora.tpopmassnber ON apflora.tpop.TPopId = apflora.tpopmassnber.TPopId
UNION DISTINCT SELECT
	apflora.tpop.TPopId,
	apflora.tpopkontr.TPopKontrJahr AS "Jahr"
FROM
	apflora.tpop
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId
ORDER BY
	Jahr;

/*diese Abfrage noetig, weil in Access die NO_NOTE zw. beobzuordnung (Text) und beob_infospezies (Zahl) nicht verbunden werden kann*/
CREATE OR REPLACE VIEW v_beobzuordnung_infospeziesapanzmut AS
SELECT
	apflora_beob.adb_eigenschaften.Artname AS Art,
	apflora.beobzuordnung.BeobMutWer,
	apflora.beobzuordnung.BeobMutWann,
	Count(apflora.beobzuordnung.NO_NOTE) AS AnzMut,
	"tblBeobZuordnung_Infospezies" AS Tabelle
FROM
	((apflora.ap
	INNER JOIN apflora_beob.adb_eigenschaften ON apflora.ap.ApArtId = apflora_beob.adb_eigenschaften.TaxonomieId)
	INNER JOIN apflora_beob.beob_infospezies ON apflora.ap.ApArtId = apflora_beob.beob_infospezies.NO_ISFS)
	INNER JOIN apflora.beobzuordnung ON apflora_beob.beob_infospezies.NO_NOTE = apflora.beobzuordnung.NO_NOTE
WHERE
	apflora.ap.ApArtId > 150
GROUP BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.beobzuordnung.BeobMutWer,
	apflora.beobzuordnung.BeobMutWann;

CREATE OR REPLACE VIEW v_datenstruktur AS
SELECT
	TABLES.TABLE_NAME AS "Tabelle: Name",
	TABLES.TABLE_ROWS AS "Tabelle: Anzahl Datensaetze",
	TABLES.TABLE_COMMENT AS "Tabelle: Bemerkungen",
	COLUMNS.COLUMN_NAME AS "Feld: Name",
	COLUMNS.COLUMN_TYPE AS "Feld: Datentyp",
	COLUMNS.IS_NULLABLE AS "Feld: Nullwerte",
	COLUMNS.COLUMN_COMMENT AS "Feld: Bemerkungen"
FROM
	information_schema.COLUMNS
	INNER JOIN information_schema.TABLES ON information_schema.TABLES.TABLE_NAME = information_schema.COLUMNS.TABLE_NAME
WHERE
	information_schema.COLUMNS.TABLE_NAME IN (SELECT
	TABLE_NAME FROM
	information_schema.TABLES WHERE
	TABLE_SCHEMA='apflora');

CREATE OR REPLACE VIEW v_apbera1lpop AS 
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopApBerichtRelevant = 1
	AND apflora.pop.PopHerkunft NOT IN (300, 201)
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_a2lpop AS
SELECT
	apflora.pop.ApArtId,
	apflora.pop.PopId
FROM
	apflora.pop
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.pop.PopHerkunft = 100
	AND apflora.tpop.TPopApBerichtRelevant = 1
GROUP BY
	apflora.pop.ApArtId,
	apflora.pop.PopId;

CREATE OR REPLACE VIEW v_tpop_ohneapberichtrelevant AS
SELECT
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.pop.PopName,
	apflora.tpop.TPopId,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopGemeinde,
	apflora.tpop.TPopFlurname,
	apflora.tpop.TPopApBerichtRelevant
FROM
	apflora_beob.adb_eigenschaften
	INNER JOIN ((apflora.tpop
		INNER JOIN apflora.pop ON apflora.tpop.PopId = apflora.pop.PopId)
		INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId)
	ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId
WHERE
	apflora.tpop.TPopApBerichtRelevant Is Null
	AND apflora.ap.ApArtId > 150
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_tpop_popnrtpopnrmehrdeutig AS
SELECT
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	Count(apflora.tpop.TPopId) AS AnzahlvonTPopId,
	GROUP_CONCAT(
		DISTINCT TPopId ORDER BY TPopId SEPARATOR ', '
	) AS TPopIds,
	GROUP_CONCAT(
		DISTINCT
		CONCAT(
			'http://apflora.ch/index.html?ap=',
			apflora.ap.ApArtId,
			'&pop=',
			apflora.tpop.PopId,
			'&tpop=',
			apflora.tpop.TPopId
		)
		ORDER BY apflora.tpop.TPopId SEPARATOR ', '
	) AS TPopUrls
FROM
	apflora_beob.adb_eigenschaften
	INNER JOIN ((apflora.tpop
		INNER JOIN apflora.pop ON apflora.tpop.PopId = apflora.pop.PopId)
		INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId)
	ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId
WHERE
	apflora.ap.ApArtId > 150
GROUP BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr
HAVING
	Count(apflora.tpop.TPopId) > 1
ORDER BY
	apflora_beob.adb_eigenschaften.Artname,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_qk_tpop_popnrtpopnrmehrdeutig AS
SELECT
	apflora.ap.ApArtId,
	'Teilpopulation: Die Kombination von Pop.-Nr. und TPop.-Nr. ist mehrdeutig:' AS hw,
	GROUP_CONCAT(
		DISTINCT
		CONCAT(
			'<a href="http://apflora.ch/index.html?ap=',
			apflora.ap.ApArtId,
			'&pop=',
			apflora.pop.PopId,
			'&tpop=',
			apflora.tpop.TPopId,
			'" target="_blank">',
			IFNULL(
				CONCAT('Pop: ', apflora.pop.PopNr),
				CONCAT('Pop: id=', apflora.pop.PopId)
			),
			' > TPop: ',
			apflora.tpop.TPopNr,
			' (id=', apflora.tpop.TPopId, ')',
			'</a>'
		) ORDER BY apflora.tpop.TPopId SEPARATOR '<br> '
	) AS link
FROM
	(apflora.tpop
	INNER JOIN apflora.pop ON apflora.tpop.PopId = apflora.pop.PopId)
	INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId
GROUP BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr
HAVING
	Count(apflora.tpop.TPopId) > 1
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_qk_pop_popnrmehrdeutig AS
SELECT
	apflora.ap.ApArtId,
	'Population: Die Nr. ist mehrdeutig:' AS hw,
	GROUP_CONCAT(
		DISTINCT
		CONCAT(
			'<a href="http://apflora.ch/index.html?ap=',
			apflora.ap.ApArtId,
			'&pop=',
			apflora.pop.PopId,
			'" target="_blank">',
			IFNULL(
				CONCAT('Pop: ', apflora.pop.PopNr, ' (id=', apflora.pop.PopId, ')'),
				CONCAT('Pop: id=', apflora.pop.PopId)
			),
			'</a>'
		)
		ORDER BY apflora.pop.PopId
		SEPARATOR '<br> '
	) AS link
FROM
	apflora.pop
	INNER JOIN apflora.ap ON apflora.pop.ApArtId = apflora.ap.ApArtId
GROUP BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr
HAVING
	Count(apflora.pop.PopId) > 1
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_ohnekoord AS
SELECT
	apflora.ap.ApArtId AS 'ApArtId',
	'Population: Mindestens eine Koordinate fehlt:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.pop.PopXKoord IS NULL
	OR apflora.pop.PopYKoord IS NULL 
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_ohnepopnr AS
SELECT
	apflora.ap.ApArtId AS 'ApArtId',
	'Population ohne Nr.:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopName),
			CONCAT('Pop: id=', apflora.pop.PopId)
		),
		'</a>'
	) AS link
FROM
	apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.pop.PopNr IS NULL 
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopName;

CREATE OR REPLACE VIEW v_qk_pop_ohnepopname AS
SELECT
	apflora.ap.ApArtId AS 'ApArtId',
	'Population ohne Name:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.pop.PopName IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_ohnepopstatus AS
SELECT
	apflora.ap.ApArtId AS 'ApArtId',
	'Population ohne Status:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.pop.PopHerkunft IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_ohnebekanntseit AS
SELECT
	apflora.ap.ApArtId AS 'ApArtId',
	'Population ohne "bekannt seit":' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=', apflora.pop.PopId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop: id=', apflora.pop.PopId)
		),
		'</a>'
	) AS link
FROM
	apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.pop.PopBekanntSeit IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_mitstatusunklarohnebegruendung AS
SELECT
	apflora.ap.ApArtId AS 'ApArtId',
	'Population mit "Status unklar", ohne Begruendung:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.pop.PopHerkunftUnklar = 1
	AND apflora.pop.PopHerkunftUnklarBegruendung IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_ohnetpop AS
SELECT
	apflora.ap.ApArtId AS 'ApArtId',
	'Population ohne Teilpopulation:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	(apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	LEFT JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopId Is Null
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_tpop_ohnenr AS 
SELECT
	apflora.ap.ApArtId,
	'Teilpopulation ohne Nr.:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
			CONCAT(' > TPop: ', apflora.tpop.TPopFlurname),
			CONCAT(' > TPop: id=', apflora.tpop.TPopId)
		),
		'</a>'
	) AS link
FROM
	apflora.ap
	INNER JOIN (apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopNr Is Null
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_qk_tpop_ohneflurname AS 
SELECT
	apflora.ap.ApArtId,
	'Teilpopulation ohne Flurname:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	apflora.ap
	INNER JOIN (apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopFlurname Is Null
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_qk_tpop_ohnestatus AS 
SELECT
	apflora.ap.ApArtId,
	'Teilpopulation ohne Status:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	apflora.ap
	INNER JOIN (apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopHerkunft Is Null
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_qk_tpop_ohnebekanntseit AS 
SELECT
	apflora.ap.ApArtId,
	'Teilpopulation ohne "bekannt seit":' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	apflora.ap
	INNER JOIN (apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopBekanntSeit Is Null
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_qk_tpop_ohneapberrelevant AS 
SELECT
	apflora.ap.ApArtId,
	'Teilpopulation ohne "Fuer AP-Bericht relevant":' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	apflora.ap
	INNER JOIN (apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopApBerichtRelevant Is Null
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_qk_tpop_statuspotentiellfuerapberrelevant AS 
SELECT
	apflora.ap.ApArtId,
	'Teilpopulation mit Status "potenzieller Wuchs-/Ansiedlungsort" und "Fuer AP-Bericht relevant?" = ja:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	apflora.ap
	INNER JOIN (apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopHerkunft = 300
	AND apflora.tpop.TPopApBerichtRelevant = 1
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_qk_tpop_mitstatusunklarohnebegruendung AS 
SELECT
	apflora.ap.ApArtId,
	'Teilpopulation mit "Status unklar", ohne Begruendung:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	apflora.ap
	INNER JOIN (apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopHerkunftUnklar = 1
	AND apflora.tpop.TPopHerkunftUnklarBegruendung IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_qk_tpop_ohnekoordinaten AS 
SELECT
	apflora.ap.ApArtId,
	'Teilpopulation: Mindestens eine Koordinate fehlt:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
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
	apflora.ap
	INNER JOIN (apflora.pop
		INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	ON apflora.ap.ApArtId = apflora.pop.ApArtId
WHERE
	apflora.tpop.TPopXKoord Is Null
	OR apflora.tpop.TPopYKoord IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr;

CREATE OR REPLACE VIEW v_qk_massn_ohnejahr AS 
SELECT
	apflora.ap.ApArtId,
	'Massnahme ohne Jahr:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopmassn=',
		apflora.tpopmassn.TPopMassnId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		CONCAT(' > Massn.-ID: ', apflora.tpopmassn.TPopMassnId),
		'</a>'
	) AS link
FROM
	((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopmassn ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId
WHERE
	apflora.tpopmassn.TPopMassnJahr IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopmassn.TPopMassnId;

CREATE OR REPLACE VIEW v_qk_massn_ohnetyp AS 
SELECT
	apflora.ap.ApArtId,
	'Massnahmen ohne Typ:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopmassn=',
		apflora.tpopmassn.TPopMassnId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > MassnJahr: ', apflora.tpopmassn.TPopMassnJahr),
			CONCAT(' > Massn.-ID: ', apflora.tpopmassn.TPopMassnId)
		),
		'</a>'
	) AS link,
	apflora.tpopmassn.TPopMassnJahr AS Berichtjahr
FROM
	((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopmassn ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId
WHERE
	apflora.tpopmassn.TPopMassnTyp IS NULL
	AND apflora.tpopmassn.TPopMassnJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopmassn.TPopMassnJahr,
	apflora.tpopmassn.TPopMassnId;

CREATE OR REPLACE VIEW v_qk_massnber_ohnejahr AS 
SELECT
	apflora.ap.ApArtId,
	'Massnahmen-Bericht ohne Jahr:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopmassnber=',
		apflora.tpopmassnber.TPopMassnBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > MassnBerJahr: ', apflora.tpopmassnber.TPopMassnBerJahr),
			CONCAT(' > MassnBer.-ID: ', apflora.tpopmassnber.TPopMassnBerId)
		),
		'</a>'
	) AS link
FROM
	((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopmassnber ON apflora.tpop.TPopId = apflora.tpopmassnber.TPopId
WHERE
	apflora.tpopmassnber.TPopMassnBerJahr IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopmassnber.TPopMassnBerJahr,
	apflora.tpopmassnber.TPopMassnBerId;

CREATE OR REPLACE VIEW v_qk_massnber_ohneerfbeurt AS 
SELECT
	apflora.ap.ApArtId,
	'Massnahmen-Bericht ohne Entwicklung:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopmassnber=',
		apflora.tpopmassnber.TPopMassnBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > MassnBerJahr: ', apflora.tpopmassnber.TPopMassnBerJahr),
			CONCAT(' > MassnBer.-ID: ', apflora.tpopmassnber.TPopMassnBerId)
		),
		'</a>'
	) AS link,
	apflora.tpopmassnber.TPopMassnBerJahr AS Berichtjahr
FROM
	((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopmassnber ON apflora.tpop.TPopId = apflora.tpopmassnber.TPopId
WHERE
	apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung IS NULL
	AND apflora.tpopmassnber.TPopMassnBerJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopmassnber.TPopMassnBerJahr,
	apflora.tpopmassnber.TPopMassnBerId;

CREATE OR REPLACE VIEW v_qk_feldkontr_ohnejahr AS 
SELECT
	apflora.ap.ApArtId,
	'Feldkontrolle ohne Jahr:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopfeldkontr=',
		apflora.tpopkontr.TPopKontrId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > KontrJahr: ', apflora.tpopkontr.TPopKontrJahr),
			CONCAT(' > Kontr.-ID: ', apflora.tpopkontr.TPopKontrId)
		),
		'</a>'
	) AS link
FROM
	((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId
WHERE
	apflora.tpopkontr.TPopKontrJahr IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_qk_freiwkontr_ohnejahr AS 
SELECT
	apflora.ap.ApArtId,
	'Freiwilligen-Kontrolle ohne Jahr:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopfreiwkontr=',
		apflora.tpopkontr.TPopKontrId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > KontrJahr: ', apflora.tpopkontr.TPopKontrJahr),
			CONCAT(' > Kontr.-ID: ', apflora.tpopkontr.TPopKontrId)
		),
		'</a>'
	) AS link
FROM
	((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId
WHERE
	apflora.tpopkontr.TPopKontrJahr IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_qk_feldkontr_ohnetyp AS 
SELECT
	apflora.ap.ApArtId,
	'Feldkontrolle ohne Typ:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopfeldkontr=',
		apflora.tpopkontr.TPopKontrId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > KontrJahr: ', apflora.tpopkontr.TPopKontrJahr),
			CONCAT(' > Kontr.-ID: ', apflora.tpopkontr.TPopKontrId)
		),
		'</a>'
	) AS link,
	apflora.tpopkontr.TPopKontrJahr AS Berichtjahr
FROM
	((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId
WHERE
	(
		apflora.tpopkontr.TPopKontrTyp IS NULL
		OR apflora.tpopkontr.TPopKontrTyp = 2
	)
	AND apflora.tpopkontr.TPopKontrJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_qk_feldkontr_ohnezaehlung AS 
SELECT
	apflora.ap.ApArtId,
	'Feldkontrolle ohne Zaehlung:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopfeldkontr=',
		apflora.tpopkontr.TPopKontrId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > KontrJahr: ', apflora.tpopkontr.TPopKontrJahr),
			CONCAT(' > Kontr.-ID: ', apflora.tpopkontr.TPopKontrId)
		),
		'</a>'
	) AS link,
	apflora.tpopkontr.TPopKontrJahr AS Berichtjahr
FROM
	(((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	LEFT JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId
WHERE
	apflora.tpopkontrzaehl.TPopKontrZaehlId IS NULL
	AND apflora.tpopkontr.TPopKontrJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_qk_freiwkontr_ohnezaehlung AS 
SELECT
	apflora.ap.ApArtId,
	'Freiwilligen-Kontrolle ohne Zaehlung:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopfreiwkontr=',
		apflora.tpopkontr.TPopKontrId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > KontrJahr: ', apflora.tpopkontr.TPopKontrJahr),
			CONCAT(' > Kontr.-ID: ', apflora.tpopkontr.TPopKontrId)
		),
		'</a>'
	) AS link,
	apflora.tpopkontr.TPopKontrJahr AS Berichtjahr
FROM
	(((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	LEFT JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId
WHERE
	apflora.tpopkontrzaehl.TPopKontrZaehlId IS NULL
	AND apflora.tpopkontr.TPopKontrJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_qk_feldkontrzaehlung_ohneeinheit AS 
SELECT
	apflora.ap.ApArtId,
	'Zaehlung ohne Zaehleinheit (Feldkontrolle):' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopfeldkontr=',
		apflora.tpopkontr.TPopKontrId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > KontrJahr: ', apflora.tpopkontr.TPopKontrJahr),
			CONCAT(' > Kontr.-ID: ', apflora.tpopkontr.TPopKontrId)
		),
		'</a>'
	) AS link,
	apflora.tpopkontr.TPopKontrJahr AS Berichtjahr
FROM
	(((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId
WHERE
	apflora.tpopkontrzaehl.Zaehleinheit IS NULL
	AND apflora.tpopkontr.TPopKontrJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_qk_freiwkontrzaehlung_ohneeinheit AS 
SELECT
	apflora.ap.ApArtId,
	'Zaehlung ohne Zaehleinheit (Freiwilligen-Kontrolle):' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopfreiwkontr=',
		apflora.tpopkontr.TPopKontrId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > KontrJahr: ', apflora.tpopkontr.TPopKontrJahr),
			CONCAT(' > Kontr.-ID: ', apflora.tpopkontr.TPopKontrId)
		),
		'</a>'
	) AS link,
	apflora.tpopkontr.TPopKontrJahr AS Berichtjahr
FROM
	(((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId
WHERE
	apflora.tpopkontrzaehl.Zaehleinheit IS NULL
	AND apflora.tpopkontr.TPopKontrJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_qk_feldkontrzaehlung_ohnemethode AS 
SELECT
	apflora.ap.ApArtId,
	'Zaehlung ohne Methode (Feldkontrolle):' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopfeldkontr=',
		apflora.tpopkontr.TPopKontrId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > KontrJahr: ', apflora.tpopkontr.TPopKontrJahr),
			CONCAT(' > Kontr.-ID: ', apflora.tpopkontr.TPopKontrId)
		),
		'</a>'
	) AS link,
	apflora.tpopkontr.TPopKontrJahr AS Berichtjahr
FROM
	(((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId
WHERE
	apflora.tpopkontrzaehl.Methode IS NULL
	AND apflora.tpopkontr.TPopKontrJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_qk_freiwkontrzaehlung_ohnemethode AS 
SELECT
	apflora.ap.ApArtId,
	'Zaehlung ohne Methode (Freiwilligen-Kontrolle):' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopfreiwkontr=',
		apflora.tpopkontr.TPopKontrId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > KontrJahr: ', apflora.tpopkontr.TPopKontrJahr),
			CONCAT(' > Kontr.-ID: ', apflora.tpopkontr.TPopKontrId)
		),
		'</a>'
	) AS link,
	apflora.tpopkontr.TPopKontrJahr AS Berichtjahr
FROM
	(((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId
WHERE
	apflora.tpopkontrzaehl.Methode IS NULL
	AND apflora.tpopkontr.TPopKontrJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_qk_feldkontrzaehlung_ohneanzahl AS 
SELECT
	apflora.ap.ApArtId,
	'Zaehlung ohne Anzahl (Feldkontrolle):' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopfeldkontr=',
		apflora.tpopkontr.TPopKontrId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > KontrJahr: ', apflora.tpopkontr.TPopKontrJahr),
			CONCAT(' > Kontr.-ID: ', apflora.tpopkontr.TPopKontrId)
		),
		'</a>'
	) AS link,
	apflora.tpopkontr.TPopKontrJahr AS Berichtjahr
FROM
	(((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId
WHERE
	apflora.tpopkontrzaehl.Anzahl IS NULL
	AND apflora.tpopkontr.TPopKontrJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_qk_freiwkontrzaehlung_ohneanzahl AS 
SELECT
	apflora.ap.ApArtId,
	'Zaehlung ohne Anzahl (Freiwilligen-Kontrolle):' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopfreiwkontr=',
		apflora.tpopkontr.TPopKontrId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > KontrJahr: ', apflora.tpopkontr.TPopKontrJahr),
			CONCAT(' > Kontr.-ID: ', apflora.tpopkontr.TPopKontrId)
		),
		'</a>'
	) AS link,
	apflora.tpopkontr.TPopKontrJahr AS Berichtjahr
FROM
	(((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopkontr ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId)
	INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId
WHERE
	apflora.tpopkontrzaehl.Anzahl IS NULL
	AND apflora.tpopkontr.TPopKontrJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopkontr.TPopKontrJahr,
	apflora.tpopkontr.TPopKontrId;

CREATE OR REPLACE VIEW v_qk_tpopber_ohnejahr AS 
SELECT
	apflora.ap.ApArtId,
	'Teilpopulations-Bericht ohne Jahr:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopber=',
		apflora.tpopber.TPopBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > TPopBerJahr: ', apflora.tpopber.TPopBerJahr),
			CONCAT(' > TPopBer.-ID: ', apflora.tpopber.TPopBerId)
		),
		'</a>'
	) AS link
FROM
	((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopber ON apflora.tpop.TPopId = apflora.tpopber.TPopId
WHERE
	apflora.tpopber.TPopBerJahr IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopber.TPopBerJahr,
	apflora.tpopber.TPopBerId;

CREATE OR REPLACE VIEW v_qk_tpopber_ohneentwicklung AS 
SELECT
	apflora.ap.ApArtId,
	'Teilpopulations-Bericht ohne Entwicklung:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&tpop=',
		apflora.tpop.TPopId,
		'&tpopber=',
		apflora.tpopber.TPopBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > TPop: ', apflora.tpop.TPopNr),
			CONCAT(' > TPop.-ID: ', apflora.tpop.TPopId)
		),
		IFNULL(
			CONCAT(' > TPopBerJahr: ', apflora.tpopber.TPopBerJahr),
			CONCAT(' > TPopBer.-ID: ', apflora.tpopber.TPopBerId)
		),
		'</a>'
	) AS link,
	apflora.tpopber.TPopBerJahr AS Berichtjahr
FROM
	((apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId)
	INNER JOIN apflora.tpopber ON apflora.tpop.TPopId = apflora.tpopber.TPopId
WHERE
	apflora.tpopber.TPopBerEntwicklung IS NULL
	AND apflora.tpopber.TPopBerJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.tpop.TPopNr,
	apflora.tpopber.TPopBerJahr,
	apflora.tpopber.TPopBerId;

CREATE OR REPLACE VIEW v_qk_popber_ohneentwicklung AS 
SELECT
	apflora.ap.ApArtId,
	'Populations-Bericht ohne Entwicklung:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&popber=',
		apflora.popber.PopBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > PopBerJahr: ', apflora.popber.PopBerJahr),
			CONCAT(' > PopBer.-ID: ', apflora.popber.PopBerId)
		),
		'</a>'
	) AS link,
	apflora.popber.PopBerJahr AS Berichtjahr
FROM
	(apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.popber ON apflora.pop.PopId = apflora.popber.PopId
WHERE
	apflora.popber.PopBerEntwicklung IS NULL
	AND apflora.popber.PopBerJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.popber.PopBerJahr,
	apflora.popber.PopBerId;

CREATE OR REPLACE VIEW v_qk_popber_ohnejahr AS 
SELECT
	apflora.ap.ApArtId,
	'Populations-Bericht ohne Jahr:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&popber=',
		apflora.popber.PopBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > PopBerJahr: ', apflora.popber.PopBerJahr),
			CONCAT(' > PopBer.-ID: ', apflora.popber.PopBerId)
		),
		'</a>'
	) AS link
FROM
	(apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.popber ON apflora.pop.PopId = apflora.popber.PopId
WHERE
	apflora.popber.PopBerJahr IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.popber.PopBerJahr,
	apflora.popber.PopBerId;

CREATE OR REPLACE VIEW v_qk_popmassnber_ohnejahr AS 
SELECT
	apflora.ap.ApArtId,
	'Populations-Massnahmen-Bericht ohne Jahr:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&popmassnber=',
		apflora.popmassnber.PopMassnBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > PopMassnBerJahr: ', apflora.popmassnber.PopMassnBerJahr),
			CONCAT(' > PopMassnBer.-ID: ', apflora.popmassnber.PopMassnBerId)
		),
		'</a>'
	) AS link
FROM
	(apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.popmassnber ON apflora.pop.PopId = apflora.popmassnber.PopId
WHERE
	apflora.popmassnber.PopMassnBerJahr IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.popmassnber.PopMassnBerJahr,
	apflora.popmassnber.PopMassnBerId;

CREATE OR REPLACE VIEW v_qk_popmassnber_ohneentwicklung AS 
SELECT
	apflora.ap.ApArtId,
	'Populations-Massnahmen-Bericht ohne Entwicklung:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&pop=',
		apflora.pop.PopId,
		'&popmassnber=',
		apflora.popmassnber.PopMassnBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Pop: ', apflora.pop.PopNr),
			CONCAT('Pop.-ID: ', apflora.pop.PopId)
		),
		IFNULL(
			CONCAT(' > PopMassnBerJahr: ', apflora.popmassnber.PopMassnBerJahr),
			CONCAT(' > PopMassnBer.-ID: ', apflora.popmassnber.PopMassnBerId)
		),
		'</a>'
	) AS link,
	apflora.popmassnber.PopMassnBerJahr AS Berichtjahr
FROM
	(apflora.ap
	INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId)
	INNER JOIN apflora.popmassnber ON apflora.pop.PopId = apflora.popmassnber.PopId
WHERE
	apflora.popmassnber.PopMassnBerErfolgsbeurteilung IS NULL
	AND apflora.popmassnber.PopMassnBerJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.pop.PopNr,
	apflora.popmassnber.PopMassnBerJahr,
	apflora.popmassnber.PopMassnBerId;

CREATE OR REPLACE VIEW v_qk_zielber_ohneentwicklung AS 
SELECT
	apflora.ap.ApArtId,
	'Ziel-Bericht ohne Entwicklung:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&apziel=',
		apflora.ziel.ZielId,
		'&zielber=',
		apflora.zielber.ZielBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('ZielJahr: ', apflora.ziel.ZielJahr, ' (id=', apflora.ziel.ZielId, ')'),
			CONCAT('Ziel.-ID: ', apflora.ziel.ZielId)
		),
		IFNULL(
			CONCAT(' > ZielBerJahr: ', apflora.zielber.ZielBerJahr),
			CONCAT(' > ZielBer.-ID: ', apflora.zielber.ZielBerId)
		),
		'</a>'
	) AS link,
	apflora.zielber.ZielBerJahr AS Berichtjahr
FROM
	(apflora.ap
	INNER JOIN apflora.ziel ON apflora.ap.ApArtId = apflora.ziel.ApArtId)
	INNER JOIN apflora.zielber ON apflora.ziel.ZielId = apflora.zielber.ZielId
WHERE
	apflora.zielber.ZielBerErreichung IS NULL
	AND apflora.zielber.ZielBerJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.ziel.ZielJahr,
	apflora.ziel.ZielId,
	apflora.zielber.ZielBerJahr,
	apflora.zielber.ZielBerId;

CREATE OR REPLACE VIEW v_qk_zielber_ohnejahr AS 
SELECT
	apflora.ap.ApArtId,
	'Ziel-Bericht ohne Jahr:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&apziel=',
		apflora.ziel.ZielId,
		'&zielber=',
		apflora.zielber.ZielBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('ZielJahr: ', apflora.ziel.ZielJahr, ' (id=', apflora.ziel.ZielId, ')'),
			CONCAT('Ziel.-ID: ', apflora.ziel.ZielId)
		),
		IFNULL(
			CONCAT(' > ZielBerJahr: ', apflora.zielber.ZielBerJahr),
			CONCAT(' > ZielBer.-ID: ', apflora.zielber.ZielBerId)
		),
		'</a>'
	) AS link
FROM
	(apflora.ap
	INNER JOIN apflora.ziel ON apflora.ap.ApArtId = apflora.ziel.ApArtId)
	INNER JOIN apflora.zielber ON apflora.ziel.ZielId = apflora.zielber.ZielId
WHERE
	apflora.zielber.ZielBerJahr IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.ziel.ZielJahr,
	apflora.ziel.ZielId,
	apflora.zielber.ZielBerJahr,
	apflora.zielber.ZielBerId;

CREATE OR REPLACE VIEW v_qk_ziel_ohnejahr AS 
SELECT
	apflora.ap.ApArtId,
	'Ziel ohne Jahr:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&apziel=',
		apflora.ziel.ZielId,
		'" target="_blank">',
		IFNULL(
			CONCAT('ZielJahr: ', apflora.ziel.ZielJahr, ' (id=', apflora.ziel.ZielId, ')'),
			CONCAT('Ziel.-ID: ', apflora.ziel.ZielId)
		),
		'</a>'
	) AS link
FROM
	apflora.ap
	INNER JOIN apflora.ziel ON apflora.ap.ApArtId = apflora.ziel.ApArtId
WHERE
	apflora.ziel.ZielJahr IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.ziel.ZielJahr,
	apflora.ziel.ZielId;

CREATE OR REPLACE VIEW v_qk_ziel_ohnetyp AS 
SELECT
	apflora.ap.ApArtId,
	'Ziel ohne Typ:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&apziel=',
		apflora.ziel.ZielId,
		'" target="_blank">',
		IFNULL(
			CONCAT('ZielJahr: ', apflora.ziel.ZielJahr, ' (id=', apflora.ziel.ZielId, ')'),
			CONCAT('Ziel.-ID: ', apflora.ziel.ZielId)
		),
		'</a>'
	) AS link
FROM
	apflora.ap
	INNER JOIN apflora.ziel ON apflora.ap.ApArtId = apflora.ziel.ApArtId
WHERE
	apflora.ziel.ZielTyp IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.ziel.ZielJahr,
	apflora.ziel.ZielId;

CREATE OR REPLACE VIEW v_qk_ziel_ohneziel AS 
SELECT
	apflora.ap.ApArtId,
	'Ziel ohne Ziel:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&apziel=',
		apflora.ziel.ZielId,
		'" target="_blank">',
		IFNULL(
			CONCAT('ZielJahr: ', apflora.ziel.ZielJahr, ' (id=', apflora.ziel.ZielId, ')'),
			CONCAT('Ziel.-ID: ', apflora.ziel.ZielId)
		),
		'</a>'
	) AS link
FROM
	apflora.ap
	INNER JOIN apflora.ziel ON apflora.ap.ApArtId = apflora.ziel.ApArtId
WHERE
	apflora.ziel.ZielBezeichnung IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.ziel.ZielJahr,
	apflora.ziel.ZielId;

CREATE OR REPLACE VIEW v_qk_erfkrit_ohnebeurteilung AS 
SELECT
	apflora.ap.ApArtId,
	'Erfolgskriterium ohne Beurteilung:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&erfkrit=',
		apflora.erfkrit.ErfkritId,
		'" target="_blank">',
		CONCAT('Erfkrit.-ID: ', apflora.erfkrit.ErfkritId),
		'</a>'
	) AS link
FROM
	apflora.ap
	INNER JOIN apflora.erfkrit ON apflora.ap.ApArtId = apflora.erfkrit.ApArtId
WHERE
	apflora.erfkrit.ErfkritErreichungsgrad IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.erfkrit.ErfkritId;

CREATE OR REPLACE VIEW v_qk_erfkrit_ohnekriterien AS 
SELECT
	apflora.ap.ApArtId,
	'Erfolgskriterium ohne Kriterien:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&erfkrit=',
		apflora.erfkrit.ErfkritId,
		'" target="_blank">',
		CONCAT('Erfkrit.-ID: ', apflora.erfkrit.ErfkritId),
		'</a>'
	) AS link
FROM
	apflora.ap
	INNER JOIN apflora.erfkrit ON apflora.ap.ApArtId = apflora.erfkrit.ApArtId
WHERE
	apflora.erfkrit.ErfkritTxt IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.erfkrit.ErfkritId;

CREATE OR REPLACE VIEW v_qk_apber_ohnejahr AS 
SELECT
	apflora.ap.ApArtId,
	'AP-Bericht ohne Jahr:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&jber=',
		apflora.apber.JBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Jahr: ', apflora.apber.JBerJahr, ' (id=', apflora.apber.JBerId, ')'),
			CONCAT('AP-Ber.-ID: ', apflora.apber.JBerId)
		),
		'</a>'
	) AS link
FROM
	apflora.ap
	INNER JOIN apflora.apber ON apflora.ap.ApArtId = apflora.apber.ApArtId
WHERE
	apflora.apber.JBerJahr IS NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.apber.JBerJahr,
	apflora.apber.JBerId;

CREATE OR REPLACE VIEW v_qk_apber_ohnevergleichvorjahrgesamtziel AS 
SELECT
	apflora.ap.ApArtId,
	'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&jber=',
		apflora.apber.JBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Jahr: ', apflora.apber.JBerJahr, ' (id=', apflora.apber.JBerId, ')'),
			CONCAT('AP-Ber.-ID: ', apflora.apber.JBerId)
		),
		'</a>'
	) AS link,
	apflora.apber.JBerJahr AS Berichtjahr
FROM
	apflora.ap
	INNER JOIN apflora.apber ON apflora.ap.ApArtId = apflora.apber.ApArtId
WHERE
	apflora.apber.JBerVergleichVorjahrGesamtziel IS NULL
	AND apflora.apber.JBerJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.apber.JBerJahr,
	apflora.apber.JBerId;

CREATE OR REPLACE VIEW v_qk_apber_ohnebeurteilung AS 
SELECT
	apflora.ap.ApArtId,
	'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&jber=',
		apflora.apber.JBerId,
		'" target="_blank">',
		IFNULL(
			CONCAT('Jahr: ', apflora.apber.JBerJahr, ' (id=', apflora.apber.JBerId, ')'),
			CONCAT('AP-Ber.-ID: ', apflora.apber.JBerId)
		),
		'</a>'
	) AS link,
	apflora.apber.JBerJahr AS Berichtjahr
FROM
	apflora.ap
	INNER JOIN apflora.apber ON apflora.ap.ApArtId = apflora.apber.ApArtId
WHERE
	apflora.apber.JBerBeurteilung IS NULL
	AND apflora.apber.JBerJahr IS NOT NULL
ORDER BY
	apflora.ap.ApArtId,
	apflora.apber.JBerJahr,
	apflora.apber.JBerId;

CREATE OR REPLACE VIEW v_qk_assozart_ohneart AS 
SELECT
	apflora.ap.ApArtId,
	'Assoziierte Art ohne Art:' AS hw,
	CONCAT(
		'<a href="http://apflora.ch/index.html?ap=',
		apflora.ap.ApArtId,
		'&assozarten=',
		apflora.assozart.AaId,
		'" target="_blank">',
		CONCAT('Assoz.-Art-ID: ', apflora.assozart.AaId),
		'</a>'
	) AS link
FROM
	apflora.ap
	INNER JOIN apflora.assozart ON apflora.ap.ApArtId = apflora.assozart.AaApArtId
WHERE
	apflora.assozart.AaSisfNr IS NULL
	OR apflora.assozart.AaSisfNr = 0
ORDER BY
	apflora.ap.ApArtId,
	apflora.assozart.AaId;

CREATE OR REPLACE VIEW v_qk_pop_koordentsprechenkeinertpop AS 
SELECT DISTINCT
	apflora.pop.ApArtId,
	'Population: Koordinaten entsprechen keiner Teilpopulation:' AS hw,
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
	) AS link,
	apflora.pop.PopXKoord AS XKoord,
	apflora.pop.PopYKoord AS YKoord
FROM
	apflora.pop
WHERE
	apflora.pop.PopXKoord Is NOT Null
	AND apflora.pop.PopYKoord IS NOT NULL
	AND apflora.pop.PopId NOT IN (
		SELECT
			apflora.tpop.PopId
		FROM
	apflora.tpop
		WHERE
			apflora.tpop.TPopXKoord = PopXKoord
			AND apflora.tpop.TPopYKoord = PopYKoord
	)
ORDER BY
	apflora.pop.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_statusansaatversuchmitaktuellentpop AS 
SELECT DISTINCT
	apflora.pop.ApArtId,
	'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine Teilpopulation mit Status "urspruenglich, aktuell":' AS hw,
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
	apflora.pop
WHERE
	apflora.pop.PopHerkunft = 201
	AND apflora.pop.PopId IN (
		SELECT DISTINCT
			apflora.tpop.PopId
		FROM
	apflora.tpop
		WHERE
			apflora.tpop.TPopHerkunft = 100
	)
ORDER BY
	apflora.pop.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_statusansaatversuchmittpopursprerloschen AS 
SELECT DISTINCT
	apflora.pop.ApArtId,
	'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine Teilpopulation mit Status "urspruenglich, erloschen":' AS hw,
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
	apflora.pop
WHERE
	apflora.pop.PopHerkunft = 201
	AND apflora.pop.PopId IN (
		SELECT DISTINCT
			apflora.tpop.PopId
		FROM
	apflora.tpop
		WHERE
			apflora.tpop.TPopHerkunft = 101
	)
ORDER BY
	apflora.pop.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_statuserloschenmittpopaktuell AS 
SELECT DISTINCT
	apflora.pop.ApArtId,
	'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "aktuell" (urspruenglich oder angesiedelt):' AS hw,
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
	apflora.pop
WHERE
	apflora.pop.PopHerkunft IN (101, 202, 211)
	AND apflora.pop.PopId IN (
		SELECT DISTINCT
			apflora.tpop.PopId
		FROM
	apflora.tpop
		WHERE
			apflora.tpop.TPopHerkunft IN (100, 200, 210)
	)
ORDER BY
	apflora.pop.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_statuserloschenmittpopansaatversuch AS 
SELECT DISTINCT
	apflora.pop.ApArtId,
	'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":' AS hw,
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
	apflora.pop
WHERE
	apflora.pop.PopHerkunft IN (101, 202, 211)
	AND apflora.pop.PopId IN (
		SELECT DISTINCT
			apflora.tpop.PopId
		FROM
			apflora.tpop
		WHERE
			apflora.tpop.TPopHerkunft = 201
	)
ORDER BY
	apflora.pop.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_statusangesiedeltmittpopurspruenglich AS 
SELECT DISTINCT
	apflora.pop.ApArtId,
	'Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "urspruenglich":' AS hw,
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
	apflora.pop
WHERE
	apflora.pop.PopHerkunft IN (200, 201, 202, 210, 211)
	AND apflora.pop.PopId IN (
		SELECT DISTINCT
			apflora.tpop.PopId
		FROM
			apflora.tpop
		WHERE
			apflora.tpop.TPopHerkunft = 100
	)
ORDER BY
	apflora.pop.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_pop_statuspotwuchsortmittpopanders AS 
SELECT DISTINCT
	apflora.pop.ApArtId,
	'Population: Status ist "potenzieller Wuchs-/Ansiedlungsort", es gibt aber eine Teilpopulation mit Status "angesiedelt" oder "urspruenglich":' AS hw,
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
	apflora.pop
WHERE
	apflora.pop.PopHerkunft = 300
	AND apflora.pop.PopId IN (
		SELECT DISTINCT
			apflora.tpop.PopId
		FROM
			apflora.tpop
		WHERE
			apflora.tpop.TPopHerkunft < 300
	)
ORDER BY
	apflora.pop.ApArtId,
	apflora.pop.PopNr;

CREATE OR REPLACE VIEW v_qk_tpop_mitstatusansaatversuchundzaehlungmitanzahl AS 
SELECT DISTINCT
	apflora.pop.ApArtId,
	apflora.pop.PopId,
	apflora.tpop.TPopId,
	'Teilpopulation mit Status "Ansaatversuch", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:' AS hw,
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
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopHerkunft = 201
	AND apflora.tpop.TPopId IN (
		SELECT DISTINCT
			apflora.tpopkontr.TPopId
		FROM
			apflora.tpopkontr
		INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId
		WHERE
			apflora.tpopkontr.TPopKontrTyp NOT IN ('Zwischenziel', 'Ziel')
			AND apflora.tpopkontrzaehl.Anzahl > 0
	)
ORDER BY
	apflora.pop.ApArtId,
	apflora.pop.PopNr,
	apflora.pop.PopId,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_qk_tpop_mitstatuspotentiellundzaehlungmitanzahl AS 
SELECT DISTINCT
	apflora.pop.ApArtId,
	apflora.pop.PopId,
	apflora.tpop.TPopId,
	'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:' AS hw,
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
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopHerkunft = 300
	AND apflora.tpop.TPopId IN (
		SELECT DISTINCT
			apflora.tpopkontr.TPopId
		FROM
			apflora.tpopkontr
		INNER JOIN apflora.tpopkontrzaehl ON apflora.tpopkontr.TPopKontrId = apflora.tpopkontrzaehl.TPopKontrId
		WHERE
			apflora.tpopkontr.TPopKontrTyp NOT IN ('Zwischenziel', 'Ziel')
			AND apflora.tpopkontrzaehl.Anzahl > 0
	)
ORDER BY
	apflora.pop.ApArtId,
	apflora.pop.PopNr,
	apflora.pop.PopId,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_qk_tpop_mitstatuspotentiellundmassnansiedlung AS 
SELECT DISTINCT
	apflora.pop.ApArtId,
	apflora.pop.PopId,
	apflora.tpop.TPopId,
	'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei der eine Massnahme des Typs "Ansiedlung" existiert:' AS hw,
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
	INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE
	apflora.tpop.TPopHerkunft = 300
	AND apflora.tpop.TPopId IN (
		SELECT DISTINCT
			apflora.tpopmassn.TPopId
		FROM
			apflora.tpopmassn
		WHERE
			apflora.tpopmassn.TPopMassnTyp < 4
	)
ORDER BY
	apflora.pop.ApArtId,
	apflora.pop.PopNr,
	apflora.pop.PopId,
	apflora.tpop.TPopNr,
	apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr AS 
SELECT
	apflora.tpopber.TPopId,
	MAX(apflora.tpopber.TPopBerJahr) AS MaxTPopBerJahr
FROM
	apflora.tpopber
GROUP BY
	apflora.tpopber.TPopId;

CREATE OR REPLACE VIEW v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr AS 
SELECT
	apflora.beobzuordnung.TPopId,
	MAX(CONVERT(LEFT(apflora_beob.beob_bereitgestellt.Datum, 4), SIGNED)) AS 'MaxJahr'
FROM
	apflora.beobzuordnung
	INNER JOIN apflora_beob.beob_bereitgestellt ON apflora.beobzuordnung.NO_NOTE = apflora_beob.beob_bereitgestellt.NO_NOTE
GROUP BY
	apflora.beobzuordnung.TPopId