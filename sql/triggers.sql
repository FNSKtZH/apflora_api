/*
 * Sicherstellen, das pro Pop/TPop jährlich maximal ein Bericht erstellt wird (massnber, popber, tpopber)
 */

DROP TRIGGER IF EXISTS tpop_max_one_massnber_per_year ON apflora.tpopmassnber;
DROP FUNCTION IF EXISTS tpop_max_one_massnber_per_year();
CREATE FUNCTION tpop_max_one_massnber_per_year() RETURNS trigger AS $tpop_max_one_massnber_per_year$
  BEGIN
    -- check if a tpopmassnber already exists for this year
    IF 
      (
        NEW."TPopMassnBerJahr" > 0
        AND NEW."TPopMassnBerJahr" IN
          (
            SELECT
              "TPopMassnBerJahr"
            FROM
              apflora.tpopmassnber
            WHERE
              "TPopId" = NEW."TPopId"
              AND "TPopMassnBerId" <> NEW."TPopMassnBerId"
          )
      )
    THEN
      RAISE EXCEPTION  'Pro Teilpopulation und Jahr darf maximal ein Massnahmenbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$tpop_max_one_massnber_per_year$ LANGUAGE plpgsql;

CREATE TRIGGER tpop_max_one_massnber_per_year BEFORE UPDATE OR INSERT ON apflora.tpopmassnber
  FOR EACH ROW EXECUTE PROCEDURE tpop_max_one_massnber_per_year();


DROP TRIGGER IF EXISTS pop_max_one_massnber_per_year ON apflora.popmassnber;
DROP FUNCTION IF EXISTS pop_max_one_massnber_per_year();
CREATE FUNCTION pop_max_one_massnber_per_year() RETURNS trigger AS $pop_max_one_massnber_per_year$
  BEGIN
    IF
      (
        NEW."PopMassnBerJahr" > 0
        AND NEW."PopMassnBerJahr" IN
          (
            SELECT
              "PopMassnBerJahr"
            FROM
              apflora.popmassnber
            WHERE
              "PopId" = NEW."PopId"
              AND "PopMassnBerId" <> NEW."PopMassnBerId"
          )
      )
    THEN
      RAISE EXCEPTION 'Pro Population und Jahr darf maximal ein Massnahmenbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$pop_max_one_massnber_per_year$ LANGUAGE plpgsql;

CREATE TRIGGER pop_max_one_massnber_per_year BEFORE INSERT OR UPDATE ON apflora.popmassnber
  FOR EACH ROW EXECUTE PROCEDURE pop_max_one_massnber_per_year();



DROP TRIGGER IF EXISTS pop_max_one_popber_per_year ON apflora.popber;
DROP FUNCTION IF EXISTS pop_max_one_popber_per_year();
CREATE FUNCTION pop_max_one_popber_per_year() RETURNS trigger AS $pop_max_one_popber_per_year$
  BEGIN
    IF
      (
        NEW."PopBerJahr" > 0
        AND NEW."PopBerJahr" IN
          (
            SELECT
              "PopBerJahr"
            FROM
              apflora.popber
            WHERE
              "PopId" = NEW."PopId"
              AND "PopBerId" <> NEW."PopBerId"
          )
      )
    THEN
      RAISE EXCEPTION 'Pro Population und Jahr darf maximal ein Populationsbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$pop_max_one_popber_per_year$ LANGUAGE plpgsql;

CREATE TRIGGER pop_max_one_popber_per_year BEFORE INSERT OR UPDATE ON apflora.popber
  FOR EACH ROW EXECUTE PROCEDURE pop_max_one_popber_per_year();



DROP TRIGGER IF EXISTS tpop_max_one_tpopber_per_year ON apflora.tpopber;
DROP FUNCTION IF EXISTS tpop_max_one_tpopber_per_year();
CREATE FUNCTION tpop_max_one_tpopber_per_year() RETURNS trigger AS $tpop_max_one_tpopber_per_year$
  BEGIN
    -- check if a tpopber already exists for this year
    IF
      (
        NEW."TPopBerJahr" > 0
        AND NEW."TPopBerJahr" IN
        (
          SELECT
            "TPopBerJahr"
          FROM
            apflora.tpopber
          WHERE
            "TPopId" = NEW."TPopId"
            AND "TPopBerId" <> NEW."TPopBerId"
        )
      )
    THEN
      RAISE EXCEPTION 'Pro Teilpopulation und Jahr darf maximal ein Teilpopulationsbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$tpop_max_one_tpopber_per_year$ LANGUAGE plpgsql;

CREATE TRIGGER tpop_max_one_tpopber_per_year BEFORE UPDATE OR INSERT ON apflora.tpopber
  FOR EACH ROW EXECUTE PROCEDURE tpop_max_one_tpopber_per_year();
