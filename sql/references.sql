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

ALTER TABLE apflora.apber
DROP CONSTRAINT IF EXISTS apber_fk_ap;

ALTER TABLE apflora.apber
ADD CONSTRAINT apber_fk_ap
FOREIGN KEY ("ApArtId")
REFERENCES apflora.ap
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.ber
DROP CONSTRAINT IF EXISTS ber_fk_ap;

ALTER TABLE apflora.ber
ADD CONSTRAINT ber_fk_ap
FOREIGN KEY ("ApArtId")
REFERENCES apflora.ap
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE apflora.erfkrit
DROP CONSTRAINT IF EXISTS erfkrit_fk_ap;

ALTER TABLE apflora.erfkrit
ADD CONSTRAINT erfkrit_fk_ap
FOREIGN KEY ("ApArtId")
REFERENCES apflora.ap
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
