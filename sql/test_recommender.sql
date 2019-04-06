
INSERT INTO Items(itemid,title,description,price,seller,catname,loanstart,loanend,location) VALUES (100,'test1','test',3.0,201,'Animals','2019-04-17 00:00:00','2019-04-17 00:00:00','bb') ON CONFLICT DO NOTHING;
INSERT INTO Images(imgurl,itemid,imgno) VALUES ('url100',100,0) ON CONFLICT DO NOTHING;

INSERT INTO Items(itemid,title,description,price,seller,catname,loanstart,loanend,location) VALUES (101,'test1','test',3.0,201,'Household','2019-04-17 00:00:00','2019-04-17 00:00:00','bb') ON CONFLICT DO NOTHING;
INSERT INTO Images(imgurl,itemid,imgno) VALUES ('url101',101,0) ON CONFLICT DO NOTHING;

INSERT INTO Items(itemid,title,description,price,seller,catname,loanstart,loanend,location) VALUES (102,'test1','test',3.0,201,'Animals','2019-04-17 00:00:00','2019-04-17 00:00:00','bb') ON CONFLICT DO NOTHING;
INSERT INTO Images(imgurl,itemid,imgno) VALUES ('url100',102,0) ON CONFLICT DO NOTHING;

INSERT INTO Items(itemid,title,description,price,seller,catname,loanstart,loanend,location) VALUES (103,'test1','test',3.0,201,'Animals','2019-04-17 00:00:00','2019-04-17 00:00:00','bb') ON CONFLICT DO NOTHING;
INSERT INTO Images(imgurl,itemid,imgno) VALUES ('url100',103,0) ON CONFLICT DO NOTHING;

INSERT INTO Items(itemid,title,description,price,seller,catname,loanstart,loanend,location) VALUES (104,'test1','test',3.0,201,'Household','2019-04-17 00:00:00','2019-04-17 00:00:00','bb') ON CONFLICT DO NOTHING;
INSERT INTO Images(imgurl,itemid,imgno) VALUES ('url101',104,0) ON CONFLICT DO NOTHING;

INSERT INTO Items(itemid,title,description,price,seller,catname,loanstart,loanend,location) VALUES (105,'test1','test',3.0,201,'Animals','2019-04-17 00:00:00','2019-04-17 00:00:00','bb') ON CONFLICT DO NOTHING;
INSERT INTO Images(imgurl,itemid,imgno) VALUES ('url100',105,0) ON CONFLICT DO NOTHING;

INSERT INTO Items(itemid,title,description,price,seller,catname,loanstart,loanend,location) VALUES (106,'test1','test',3.0,201,'Household','2019-04-17 00:00:00','2019-04-17 00:00:00','bb') ON CONFLICT DO NOTHING;
INSERT INTO Images(imgurl,itemid,imgno) VALUES ('url101',106,0) ON CONFLICT DO NOTHING;

INSERT INTO Items(itemid,title,description,price,seller,catname,loanstart,loanend,location) VALUES (107,'test1','test',3.0,201,'Animals','2019-04-17 00:00:00','2019-04-17 00:00:00','bb') ON CONFLICT DO NOTHING;
INSERT INTO Images(imgurl,itemid,imgno) VALUES ('url101',107,0) ON CONFLICT DO NOTHING;

INSERT INTO Items(itemid,title,description,price,seller,catname,loanstart,loanend,location) VALUES (108,'test1','test',3.0,201,'Animals','2019-04-17 00:00:00','2019-04-17 00:00:00','bb') ON CONFLICT DO NOTHING;
INSERT INTO Images(imgurl,itemid,imgno) VALUES ('url101',108,0) ON CONFLICT DO NOTHING;

INSERT INTO viewHistory(viewid,itemid,userid) VALUES (1,100,202) ON CONFLICT DO NOTHING;
INSERT INTO viewHistory(viewid,itemid,userid) VALUES (2,100,202) ON CONFLICT DO NOTHING;


SELECT * FROM Items;
SELECT * FROM Images;
SELECT * FROM viewHistory;


WITH MostRecent AS (
    SELECT *
    FROM viewHistory NATURAL JOIN Items
    WHERE userid = 202
    ORDER BY timestamp DESC LIMIT 20
), RecommendedCat AS (
    SELECT catname, count(*) FROM MostRecent
    GROUP BY catname
)
SELECT itemid, title, description, price, imgurl, catname
FROM (Items NATURAL JOIN Images) AS I1
WHERE catname IN (SELECT catname FROM RecommendedCat)
AND itemid IN (
    SELECT itemid FROM Items I2
    WHERE I2.catname = I1.catname AND I2.itemid != 1000000
    ORDER BY views DESC LIMIT (
        (SELECT count FROM RecommendedCat WHERE catname = I1.catname) / (SELECT sum(count) FROM RecommendedCat) * 10)
)
ORDER BY views DESC;