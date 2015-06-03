/*
 * Sicherstellen, das pro Pop/TPop jährlich maximal ein Bericht erstellt wird (massnber, popber, tpopber)
 */

DROP TRIGGER IF EXISTS check_tpopmassnber_year_per_tpop_unique_update;
DELIMITER $$
CREATE TRIGGER check_tpopmassnber_year_per_tpop_unique_update BEFORE UPDATE ON `tpopmassnber`
  FOR EACH ROW 
    BEGIN
    DECLARE msg varchar(255);
    IF (NEW.TPopMassnBerJahr IS NOT NULL AND NEW.TPopMassnBerJahr IN (SELECT TPopMassnBerJahr FROM tpopmassnber WHERE TPopId = NEW.TPopId AND TPopMassnBerId <> NEW.TPopMassnBerId))
    THEN
      SET msg = 'Constraint check_tpopmassnber_year_per_tpop_unique violated: only one tpopmassnber per tpop and year allowed';
      SIGNAL sqlstate '45000' SET message_text = msg;
    END IF;
    END
$$
DELIMITER ;

DROP TRIGGER IF EXISTS check_tpopmassnber_year_per_tpop_unique_insert;
DELIMITER $$
CREATE TRIGGER check_tpopmassnber_year_per_tpop_unique_insert BEFORE INSERT ON `tpopmassnber`
  FOR EACH ROW 
    BEGIN
    DECLARE msg varchar(255);
    IF (NEW.TPopMassnBerJahr IS NOT NULL AND NEW.TPopMassnBerJahr IN (SELECT TPopMassnBerJahr FROM tpopmassnber WHERE TPopId = NEW.TPopId AND TPopMassnBerId <> NEW.TPopMassnBerId))
    THEN
      SET msg = 'Constraint check_tpopmassnber_year_per_tpop_unique violated: only one tpopmassnber per tpop and year allowed';
      SIGNAL sqlstate '45000' SET message_text = msg;
    END IF;
    END
$$
DELIMITER ;

DROP TRIGGER IF EXISTS check_popmassnber_year_per_pop_unique_update;
DELIMITER $$
CREATE TRIGGER check_popmassnber_year_per_pop_unique_update BEFORE UPDATE ON `popmassnber`
  FOR EACH ROW 
    BEGIN
    DECLARE msg varchar(255);
    IF (NEW.PopMassnBerJahr IS NOT NULL AND NEW.PopMassnBerJahr IN (SELECT PopMassnBerJahr FROM popmassnber WHERE PopId = NEW.PopId AND PopMassnBerId <> NEW.PopMassnBerId))
    THEN
      SET msg = 'Constraint check_popmassnber_year_per_pop_unique violated: only one popmassnber per pop and year allowed';
      SIGNAL sqlstate '45000' SET message_text = msg;
    END IF;
    END
$$
DELIMITER ;

DROP TRIGGER IF EXISTS check_popmassnber_year_per_pop_unique_insert;
DELIMITER $$
CREATE TRIGGER check_popmassnber_year_per_pop_unique_insert BEFORE INSERT ON `popmassnber`
  FOR EACH ROW 
    BEGIN
    DECLARE msg varchar(255);
    IF (NEW.PopMassnBerJahr IS NOT NULL AND NEW.PopMassnBerJahr IN (SELECT PopMassnBerJahr FROM popmassnber WHERE PopId = NEW.PopId AND PopMassnBerId <> NEW.PopMassnBerId))
    THEN
      SET msg = 'Constraint check_popmassnber_year_per_pop_unique violated: only one popmassnber per pop and year allowed';
      SIGNAL sqlstate '45000' SET message_text = msg;
    END IF;
    END
$$
DELIMITER ;

DROP TRIGGER IF EXISTS check_popber_year_per_pop_unique_update;
DELIMITER $$
CREATE TRIGGER check_popber_year_per_pop_unique_update BEFORE UPDATE ON `popber`
  FOR EACH ROW 
    BEGIN
    DECLARE msg varchar(255);
    IF (NEW.PopBerJahr IS NOT NULL AND NEW.PopBerJahr IN (SELECT PopBerJahr FROM popber WHERE PopId = NEW.PopId AND PopBerId <> NEW.PopBerId))
    THEN
      SET msg = 'Constraint check_popber_year_per_pop_unique violated: only one popber per pop and year allowed';
      SIGNAL sqlstate '45000' SET message_text = msg;
    END IF;
    END
$$
DELIMITER ;

DROP TRIGGER IF EXISTS check_popber_year_per_pop_unique_insert;
DELIMITER $$
CREATE TRIGGER check_popber_year_per_pop_unique_insert BEFORE INSERT ON `popber`
  FOR EACH ROW 
    BEGIN
    DECLARE msg varchar(255);
    IF (NEW.PopBerJahr IS NOT NULL AND NEW.PopBerJahr IN (SELECT PopBerJahr FROM popber WHERE PopId = NEW.PopId AND PopBerId <> NEW.PopBerId))
    THEN
      SET msg = 'Constraint check_popber_year_per_pop_unique violated: only one popber per pop and year allowed';
      SIGNAL sqlstate '45000' SET message_text = msg;
    END IF;
    END
$$
DELIMITER ;

DROP TRIGGER IF EXISTS check_tpopber_year_per_pop_unique_update;
DELIMITER $$
CREATE TRIGGER check_tpopber_year_per_pop_unique_update BEFORE UPDATE ON `tpopber`
  FOR EACH ROW 
    BEGIN
    DECLARE msg varchar(255);
    IF (NEW.TPopBerJahr IS NOT NULL AND NEW.TPopBerJahr IN (SELECT TPopBerJahr FROM tpopber WHERE TPopId = NEW.TPopId AND tPopBerId <> NEW.TPopBerId))
    THEN
      SET msg = 'Constraint check_tpopber_year_per_pop_unique violated: only one tpopber per pop and year allowed';
      SIGNAL sqlstate '45000' SET message_text = msg;
    END IF;
    END
$$
DELIMITER ;

DROP TRIGGER IF EXISTS check_tpopber_year_per_pop_unique_insert;
DELIMITER $$
CREATE TRIGGER check_tpopber_year_per_pop_unique_insert BEFORE INSERT ON `tpopber`
  FOR EACH ROW 
    BEGIN
    DECLARE msg varchar(255);
    IF (NEW.TPopBerJahr IS NOT NULL AND NEW.TPopBerJahr IN (SELECT TPopBerJahr FROM tpopber WHERE TPopId = NEW.TPopId AND tPopBerId <> NEW.TPopBerId))
    THEN
      SET msg = 'Constraint check_tpopber_year_per_pop_unique violated: only one tpopber per pop and year allowed';
      SIGNAL sqlstate '45000' SET message_text = msg;
    END IF;
    END
$$
DELIMITER ;
