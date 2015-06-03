DROP TRIGGER IF EXISTS newguidtpf;
DROP TRIGGER IF EXISTS newguid;

DELIMITER $$
CREATE TRIGGER newguid
  BEFORE INSERT
  ON tpopkontr
FOR EACH ROW
BEGIN
  set new.TPopKontrGuid = UUID();
  set new.ZeitGuid = UUID();
END $$
DELIMITER ;
  
DROP TRIGGER IF EXISTS newguidtpm;
CREATE TRIGGER newguidtpm
  BEFORE INSERT
  ON tpopmassn
  FOR EACH ROW
  set new.TPopMassnGuid = UUID();
  
DROP TRIGGER IF EXISTS newguidtp;
CREATE TRIGGER newguidtp
  BEFORE INSERT
  ON tpop
  FOR EACH ROW
  set new.TPopGuid = UUID();
  
DROP TRIGGER IF EXISTS newguidp;
CREATE TRIGGER newguidp
  BEFORE INSERT
  ON pop
  FOR EACH ROW
  set new.PopGuid = UUID();

DROP TRIGGER IF EXISTS newguidap;
CREATE TRIGGER newguidap
  BEFORE INSERT
  ON ap
  FOR EACH ROW
  set new.ApGuid = UUID();