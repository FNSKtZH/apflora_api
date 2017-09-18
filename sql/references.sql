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
