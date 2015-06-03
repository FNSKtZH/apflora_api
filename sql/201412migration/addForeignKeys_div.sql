select TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where REFERENCED_COLUMN_NAME IS NOT NULL order by REFERENCED_COLUMN_NAME;

show fields from ziel where Field = 'ApArtId';
show fields from ap where Field = 'ApArtId';

select * from information_schema.columns where table_name = 'apber' and column_name = 'ApArtId';
select * from information_schema.columns where table_name = 'ap' and column_name = 'ApArtId';


SELECT ENGINE, TABLE_COLLATION
FROM information_schema.TABLES
WHERE
  TABLE_SCHEMA='apflora';

mysqlcheck -u root --password=cA3c6FAYPk -A --auto-repair --all-databases

show create table tpop;