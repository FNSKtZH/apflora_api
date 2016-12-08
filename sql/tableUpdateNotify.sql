CREATE OR REPLACE FUNCTION tpop_update_notify() RETURNS trigger AS $$
DECLARE
  id bigint;
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    id = NEW."TPopId";
  ELSE
    id = OLD."TPopId";
  END IF;
  PERFORM pg_notify('tpop_update', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER tpop_notify_update ON apflora.tpop;
CREATE TRIGGER tpop_notify_update AFTER UPDATE ON apflora.tpop FOR EACH ROW EXECUTE PROCEDURE tpop_update_notify();

DROP TRIGGER tpop_notify_insert ON apflora.tpop;
CREATE TRIGGER tpop_notify_insert AFTER INSERT ON apflora.tpop FOR EACH ROW EXECUTE PROCEDURE tpop_update_notify();

DROP TRIGGER tpop_notify_delete ON apflora.tpop;
CREATE TRIGGER tpop_notify_delete AFTER DELETE ON apflora.tpop FOR EACH ROW EXECUTE PROCEDURE tpop_update_notify();
