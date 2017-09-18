-- ap

ALTER TABLE apflora.ap
DROP CONSTRAINT IF EXISTS ap_fk_projekt;

ALTER TABLE apflora.ap
ADD CONSTRAINT ap_fk_projekt
FOREIGN KEY ("ProjId")
REFERENCES apflora.projekt
ON DELETE CASCADE
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
ON DELETE CASCADE
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
ON DELETE CASCADE
ON UPDATE CASCADE;

-- erfkrit

ALTER TABLE apflora.erfkrit
DROP CONSTRAINT IF EXISTS erfkrit_fk_ap;

ALTER TABLE apflora.erfkrit
ADD CONSTRAINT erfkrit_fk_ap
FOREIGN KEY ("ApArtId")
REFERENCES apflora.ap
ON DELETE CASCADE
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
ON DELETE CASCADE
ON UPDATE CASCADE;

-- add unique constraint to beob.adb_eigenschaften.TaxonomieId
-- but only once!
-- ALTER TABLE beob.adb_eigenschaften
-- ADD UNIQUE ("TaxonomieId");

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
ON DELETE CASCADE
ON UPDATE CASCADE;

-- ziel

ALTER TABLE apflora.ziel
DROP CONSTRAINT IF EXISTS ziel_fk_ap;

ALTER TABLE apflora.ziel
ADD CONSTRAINT ziel_fk_ap
FOREIGN KEY ("ApArtId")
REFERENCES apflora.ap
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE apflora.ziel
DROP CONSTRAINT IF EXISTS ziel_fk_ziel_typ_werte;

ALTER TABLE apflora.ziel
ADD CONSTRAINT ziel_fk_ziel_typ_werte
FOREIGN KEY ("ZielTyp")
REFERENCES apflora.ziel_typ_werte ("ZieltypId")
ON DELETE SET NULL
ON UPDATE CASCADE;
