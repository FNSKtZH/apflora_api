UPDATE tpop SET TPopPunktgeometrie = GeomFromText(CONCAT('POINT(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopyKoord AS DECIMAL(10,0)), ')')) WHERE TPopXKoord > 0 AND TPopyKoord > 0

UPDATE tpop SET TPopGeometriecollection = GeomFromText(CONCAT('POINT(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopyKoord AS DECIMAL(10,0)), ')')) WHERE TPopXKoord > 0 AND TPopyKoord > 0

UPDATE pop SET PopGeometriepolygon = GeomFromText(CONCAT('Polygon((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ',', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), '))')) WHERE PopXKoord > 0 AND PopYKoord > 0



simple, update:
UPDATE pop SET PopGeomPoint = GeomFromText(CONCAT('POINT(', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE pop SET PopGeomLine = GeomFromText(CONCAT('LineString(', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE pop SET PopGeomPolygon = PolygonFromText(CONCAT('Polygon((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ',', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), '))')) WHERE PopXKoord > 0 AND PopYKoord > 0





simple, insert:
INSERT INTO tpm_polygon (TPopMassnGuid, TpmPolyPolygon) SELECT tpopmassn.TPopMassnGuid, PolygonFromText(CONCAT('Polygon((', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord+50 AS DECIMAL(10,0)), ',', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), '))')) FROM tpop INNER JOIN tpopmassn ON tpop.TPopId = tpopmassn.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0

INSERT INTO tpm_line (TPopMassnGuid, TpmLineLine) SELECT tpopmassn.TPopMassnGuid, GeomFromText(CONCAT('LineString(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ',', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord+50 AS DECIMAL(10,0)), ')')) FROM tpop INNER JOIN tpopmassn ON tpop.TPopId = tpopmassn.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0

INSERT INTO tpm_point (TPopMassnGuid, TpmPointPoint) SELECT tpopmassn.TPopMassnGuid, GeomFromText(CONCAT('Point(', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')')) FROM tpop INNER JOIN tpopmassn ON tpop.TPopId = tpopmassn.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0




multi, insert:
INSERT INTO tblPopPolygon (PopId, Polygon) SELECT pop.PopId, PolygonFromText(CONCAT('MultiPolygon(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')),((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')))')) FROM pop WHERE PopXKoord > 0 AND PopYKoord > 0

INSERT INTO tpopmassn (TPopMassnPolygon) SELECT PolygonFromText(CONCAT('MultiPolygon(((', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')),((', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')),((', CAST(TPopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord+50 AS DECIMAL(10,0)), ')),((', CAST(TPopXKoord AS DECIMAL(10,0)), ' ',  CAST(TPopYKoord AS DECIMAL(10,0)), ')))')) FROM tpop INNER JOIN tpopmassn ON tpop.TPopId = tpopmassn.TPopId WHERE TPopXKoord > 0 AND TPopYKoord > 0

SELECT tpopmassn.TPopMassnGuid
FROM tpop INNER JOIN tpopmassn ON tpop.TPopId = tpopmassn.TPopId
WHERE (((tpop.TPopXKoord)>0) AND ((tpop.TPopYKoord)>0));






multi:
UPDATE pop SET PopGeomPoint = GeomFromText(CONCAT('MultiPoint(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')))')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE pop SET PopGeomLine = GeomFromText(CONCAT('LineString((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), '))')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE pop SET PopGeomLine = GeomFromText(CONCAT('MultiLineString(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ',', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')))')) WHERE PopXKoord > 0 AND PopYKoord > 0

UPDATE pop SET PopGeomPolygon = PolygonFromText(CONCAT('MultiPolygon(((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')),((', CAST(PopXKoord+50 AS DECIMAL(10,0)), ' ',  CAST(PopYKoord+50 AS DECIMAL(10,0)), ')),((', CAST(PopXKoord AS DECIMAL(10,0)), ' ',  CAST(PopYKoord AS DECIMAL(10,0)), ')))')) WHERE PopXKoord > 0 AND PopYKoord > 0