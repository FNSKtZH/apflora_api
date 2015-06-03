CREATE TABLE IF NOT EXISTS tpopkontrzaehl (
TPopKontrZaehlId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
TPopKontrId INT(10),
Anzahl INT(10) default NULL COMMENT "Anzahl Zaehleinheiten",
Zaehleinheit INT(10) default NULL COMMENT "Verwendete Zaehleinheit. Auswahl aus Tabelle tpopkontrzaehl_einheit_werte",
Methode INT(10) default NULL COMMENT "Verwendete Methodik. Auswahl aus Tabelle tpopkontrzaehl_methode_werte",
MutWann Date default NULL COMMENT "Wann wurde der Datensatz zuletzt geändert?",
MutWer VARCHAR(20) default NULL COMMENT "Von wem wurde der Datensatz zuletzt geändert?") ENGINE=INNODB COMMENT="Zaehlungen fuer Kontrollen";
ALTER TABLE tpopkontrzaehl ADD INDEX `TPopKontrId` (`TPopKontrId`);
ALTER TABLE tpopkontrzaehl ADD INDEX `Anzahl` (`Anzahl`);
ALTER TABLE tpopkontrzaehl ADD INDEX `Zaehleinheit` (`Zaehleinheit`);
ALTER TABLE tpopkontrzaehl ADD INDEX `Methode` (`Methode`);
