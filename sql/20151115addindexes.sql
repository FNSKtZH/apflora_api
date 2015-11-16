ALTER TABLE `tpopber` ADD INDEX `tpopberjahr` (TPopBerJahr);
ALTER TABLE `tpopkontr` ADD INDEX `tpopkontrjahr` (TPopKontrJahr);
ALTER TABLE `tpopkontr` ADD INDEX `tpopkontrtyp` (`TPopKontrTyp`);
ALTER TABLE `ap` ADD INDEX `apbearb` (ApBearb);
ALTER TABLE `adb_eigenschaften` ADD INDEX `artname` (`Artname`);
ALTER TABLE `pop` ADD INDEX `popnr` (`PopNr`);
ALTER TABLE `tpop` ADD INDEX `tpopnr` (`TPopNr`);
ALTER TABLE `tpopkontr_typ_werte` ADD INDEX `DomainTxt` (`DomainTxt`);
ALTER TABLE `tpopkontr` ADD INDEX `TPopKontrDatum` (`TPopKontrDatum`);
ALTER TABLE `beob_infospezies` ADD INDEX `NO_ISFS` (`NO_ISFS`);
ALTER TABLE `beob_evab` ADD INDEX `NO_ISFS` (`NO_ISFS`);
ALTER TABLE `tpopmassnber` ADD INDEX `TPopMassnBerJahr` (`TPopMassnBerJahr`);
ALTER TABLE `popmassnber` ADD INDEX `PopMassnBerJahr` (`PopMassnBerJahr`);
ALTER TABLE `popber` ADD INDEX `PopBerJahr` (`PopBerJahr`);
ALTER TABLE `tpopmassn` ADD INDEX `TPopMassnJahr` (`TPopMassnJahr`);
ALTER TABLE `tpop` ADD INDEX `TPopGemeinde` (`TPopGemeinde`);
ALTER TABLE `tpop` ADD INDEX `TPopFlurname` (`TPopFlurname`);
ALTER TABLE `pop` ADD INDEX `popname` (`PopName`);
ALTER TABLE `pop_entwicklung_werte` ADD INDEX `EntwicklungTxt` (`EntwicklungTxt`);
ALTER TABLE `pop` ADD INDEX `PopBekanntSeit` (`PopBekanntSeit`);
ALTER TABLE `apber` ADD INDEX `JBerJahr` (JBerJahr);


ALTER TABLE `_variable` ADD INDEX `JBerJahr` (JBerJahr);
ALTER TABLE `_variable` ADD INDEX `ApArtId` (ApArtId);