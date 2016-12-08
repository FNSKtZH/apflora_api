DECLARE
  id bigint;
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
  ELSE
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER tpop_notify_update ON apflora.tpop;

DROP TRIGGER tpop_notify_insert ON apflora.tpop;

DROP TRIGGER tpop_notify_delete ON apflora.tpop;
