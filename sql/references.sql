-- ap

ALTER TABLE apflora.ap
DROP CONSTRAINT IF EXISTS ap_fk_projekt;

ALTER TABLE apflora.ap
ADD CONSTRAINT ap_fk_projekt
FOREIGN KEY ("ProjId")
REFERENCES apflora.projekt
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.ap
DROP CONSTRAINT IF EXISTS ap_fk_adresse;

ALTER TABLE apflora.ap
ADD CONSTRAINT ap_fk_adresse
FOREIGN KEY ("ApBearb")
REFERENCES apflora.adresse ("AdrId")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.ap
DROP CONSTRAINT IF EXISTS ap_fk_ap_bearbstand_werte;

ALTER TABLE apflora.ap
ADD CONSTRAINT ap_fk_ap_bearbstand_werte
FOREIGN KEY ("ApStatus")
REFERENCES apflora.ap_bearbstand_werte ("DomainCode")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.ap
DROP CONSTRAINT IF EXISTS ap_fk_ap_umsetzung_werte;

ALTER TABLE apflora.ap
ADD CONSTRAINT ap_fk_ap_umsetzung_werte
FOREIGN KEY ("ApUmsetzung")
REFERENCES apflora.ap_umsetzung_werte ("DomainCode")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- apber

ALTER TABLE apflora.apber
DROP CONSTRAINT IF EXISTS apber_fk_ap;

ALTER TABLE apflora.apber
ADD CONSTRAINT apber_fk_ap
FOREIGN KEY ("ApArtId")
REFERENCES apflora.ap
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.apber
DROP CONSTRAINT IF EXISTS apber_fk_ap_erfkrit_werte;

ALTER TABLE apflora.apber
ADD CONSTRAINT apber_fk_ap_erfkrit_werte
FOREIGN KEY ("JBerBeurteilung")
REFERENCES apflora.ap_erfkrit_werte ("BeurteilId")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- get rid of 0 values
update apflora.apber set "JBerBearb" = NULL where "JBerBearb" = 0;

ALTER TABLE apflora.apber
DROP CONSTRAINT IF EXISTS apber_fk_adresse;

ALTER TABLE apflora.apber
ADD CONSTRAINT apber_fk_adresse
FOREIGN KEY ("JBerBearb")
REFERENCES apflora.adresse ("AdrId")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- ber

ALTER TABLE apflora.ber
DROP CONSTRAINT IF EXISTS ber_fk_ap;

ALTER TABLE apflora.ber
ADD CONSTRAINT ber_fk_ap
FOREIGN KEY ("ApArtId")
REFERENCES apflora.ap
ON DELETE SET NULL
ON UPDATE CASCADE;

-- erfkrit

ALTER TABLE apflora.erfkrit
DROP CONSTRAINT IF EXISTS erfkrit_fk_ap;

ALTER TABLE apflora.erfkrit
ADD CONSTRAINT erfkrit_fk_ap
FOREIGN KEY ("ApArtId")
REFERENCES apflora.ap
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.erfkrit
DROP CONSTRAINT IF EXISTS erfkrit_fk_ap_erfkrit_werte;

ALTER TABLE apflora.erfkrit
ADD CONSTRAINT erfkrit_fk_ap_erfkrit_werte
FOREIGN KEY ("ErfkritErreichungsgrad")
REFERENCES apflora.ap_erfkrit_werte ("BeurteilId")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- assozart

ALTER TABLE apflora.assozart
DROP CONSTRAINT IF EXISTS assozart_fk_ap;

ALTER TABLE apflora.assozart
ADD CONSTRAINT assozart_fk_ap
FOREIGN KEY ("AaApArtId")
REFERENCES apflora.ap
ON DELETE SET NULL
ON UPDATE CASCADE;

-- add unique constraint to beob.adb_eigenschaften.TaxonomieId
ALTER TABLE beob.adb_eigenschaften
ADD UNIQUE ("TaxonomieId");

-- get rid of 0 values
-- update beob.adb_eigenschaften set "TaxonomieId" = NULL where "TaxonomieId" = 0;
update apflora.assozart set "AaSisfNr" = NULL where "AaSisfNr" = 0;

ALTER TABLE apflora.assozart
DROP CONSTRAINT IF EXISTS assozart_fk_adb_eigenschaften;

ALTER TABLE apflora.assozart
ADD CONSTRAINT assozart_fk_adb_eigenschaften
FOREIGN KEY ("AaSisfNr")
REFERENCES beob.adb_eigenschaften ("TaxonomieId")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- idealbiotop

delete from apflora.idealbiotop where "IbApArtId" = 150;

ALTER TABLE apflora.idealbiotop
DROP CONSTRAINT IF EXISTS idealbiotop_fk_ap;

ALTER TABLE apflora.idealbiotop
ADD CONSTRAINT idealbiotop_fk_ap
FOREIGN KEY ("IbApArtId")
REFERENCES apflora.ap
ON DELETE SET NULL
ON UPDATE CASCADE;

-- ziel

ALTER TABLE apflora.ziel
DROP CONSTRAINT IF EXISTS ziel_fk_ap;

ALTER TABLE apflora.ziel
ADD CONSTRAINT ziel_fk_ap
FOREIGN KEY ("ApArtId")
REFERENCES apflora.ap
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.ziel
DROP CONSTRAINT IF EXISTS ziel_fk_ziel_typ_werte;

ALTER TABLE apflora.ziel
ADD CONSTRAINT ziel_fk_ziel_typ_werte
FOREIGN KEY ("ZielTyp")
REFERENCES apflora.ziel_typ_werte ("ZieltypId")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- zielber

ALTER TABLE apflora.zielber
DROP CONSTRAINT IF EXISTS zielber_fk_ziel;

ALTER TABLE apflora.zielber
ADD CONSTRAINT zielber_fk_ziel
FOREIGN KEY ("ZielId")
REFERENCES apflora.ziel
ON DELETE SET NULL
ON UPDATE CASCADE;

-- pop

delete from apflora.pop where "ApArtId" not in (select "ApArtId" from apflora.ap);

ALTER TABLE apflora.pop
DROP CONSTRAINT IF EXISTS pop_fk_ap;

ALTER TABLE apflora.pop
ADD CONSTRAINT pop_fk_ap
FOREIGN KEY ("ApArtId")
REFERENCES apflora.ap
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.pop
DROP CONSTRAINT IF EXISTS pop_fk_pop_status_werte;

ALTER TABLE apflora.pop
ADD CONSTRAINT pop_fk_pop_status_werte
FOREIGN KEY ("PopHerkunft")
REFERENCES apflora.pop_status_werte ("HerkunftId")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- popber

delete from apflora.popber where "PopId" not in (select "PopId" from apflora.pop);

ALTER TABLE apflora.popber
DROP CONSTRAINT IF EXISTS popber_fk_pop;

ALTER TABLE apflora.popber
ADD CONSTRAINT popber_fk_pop
FOREIGN KEY ("PopId")
REFERENCES apflora.pop
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.popber
DROP CONSTRAINT IF EXISTS popber_fk_pop_entwicklung_werte;

ALTER TABLE apflora.popber
ADD CONSTRAINT popber_fk_pop_entwicklung_werte
FOREIGN KEY ("PopBerEntwicklung")
REFERENCES apflora.pop_entwicklung_werte ("EntwicklungId")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- popmassnber

delete from apflora.popmassnber where "PopId" not in (select "PopId" from apflora.pop);

ALTER TABLE apflora.popmassnber
DROP CONSTRAINT IF EXISTS popmassnber_fk_pop;

ALTER TABLE apflora.popmassnber
ADD CONSTRAINT popmassnber_fk_pop
FOREIGN KEY ("PopId")
REFERENCES apflora.pop
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.popmassnber
DROP CONSTRAINT IF EXISTS popmassnber_fk_tpopmassn_erfbeurt_werte;

ALTER TABLE apflora.popmassnber
ADD CONSTRAINT popmassnber_fk_tpopmassn_erfbeurt_werte
FOREIGN KEY ("PopMassnBerErfolgsbeurteilung")
REFERENCES apflora.tpopmassn_erfbeurt_werte ("BeurteilId")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- tpop

delete from apflora.tpop where "PopId" not in (select "PopId" from apflora.pop);

ALTER TABLE apflora.tpop
DROP CONSTRAINT IF EXISTS tpop_fk_pop;

ALTER TABLE apflora.tpop
ADD CONSTRAINT tpop_fk_pop
FOREIGN KEY ("PopId")
REFERENCES apflora.pop
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.tpop
DROP CONSTRAINT IF EXISTS tpop_fk_pop_status_werte;

ALTER TABLE apflora.tpop
ADD CONSTRAINT tpop_fk_pop_status_werte
FOREIGN KEY ("TPopHerkunft")
REFERENCES apflora.pop_status_werte ("HerkunftId")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.tpop
DROP CONSTRAINT IF EXISTS tpop_fk_tpop_apberrelevant_werte;

ALTER TABLE apflora.tpop
ADD CONSTRAINT tpop_fk_tpop_apberrelevant_werte
FOREIGN KEY ("TPopApBerichtRelevant")
REFERENCES apflora.tpop_apberrelevant_werte ("DomainCode")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- tpopber

delete from apflora.tpopber where "TPopId" not in (select "TPopId" from apflora.tpop);

ALTER TABLE apflora.tpopber
DROP CONSTRAINT IF EXISTS tpopber_fk_tpop;

ALTER TABLE apflora.tpopber
ADD CONSTRAINT tpopber_fk_tpop
FOREIGN KEY ("TPopId")
REFERENCES apflora.tpop
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.tpopber
DROP CONSTRAINT IF EXISTS tpopber_fk_tpop_entwicklung_werte;

ALTER TABLE apflora.tpopber
ADD CONSTRAINT tpopber_fk_tpop_entwicklung_werte
FOREIGN KEY ("TPopBerEntwicklung")
REFERENCES apflora.tpop_entwicklung_werte ("EntwicklungCode")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- tpopmassn

delete from apflora.tpopmassn where "TPopId" not in (select "TPopId" from apflora.tpop);

ALTER TABLE apflora.tpopmassn
DROP CONSTRAINT IF EXISTS tpopmassn_fk_tpop;

ALTER TABLE apflora.tpopmassn
ADD CONSTRAINT tpopmassn_fk_tpop
FOREIGN KEY ("TPopId")
REFERENCES apflora.tpop
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.tpopmassn
DROP CONSTRAINT IF EXISTS tpopmassn_fk_tpopmassn_typ_werte;

ALTER TABLE apflora.tpopmassn
ADD CONSTRAINT tpopmassn_fk_tpopmassn_typ_werte
FOREIGN KEY ("TPopMassnTyp")
REFERENCES apflora.tpopmassn_typ_werte ("MassnTypCode")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.tpopmassn
DROP CONSTRAINT IF EXISTS tpopmassn_fk_adresse;

ALTER TABLE apflora.tpopmassn
ADD CONSTRAINT tpopmassn_fk_adresse
FOREIGN KEY ("TPopMassnBearb")
REFERENCES apflora.adresse ("AdrId")
ON DELETE SET NULL
ON UPDATE CASCADE;
