var sql = {
    // Main
    /* The items are sorted by bids and followed by views */
    sql_getPopularItems:
      'select r1.itemid,title,description,price,imgurl, count(distinct rid), count(distinct viewid) from (items natural join images) as r1 ' +
      'left join relationships on r1.itemid = relationships.itemid ' +
      'left join viewhistory on r1.itemid = viewhistory.itemid ' +
      'where imgno=0 and sold=0 ' +
      'group by r1.itemid,title,description,price,imgurl ' +
      'order by count(rid) desc, count(viewid) desc',
    /* The items are sorted by likes and followed by bids */
    sql_getTopRatedItems: 
      'select r1.itemid, title, description, price, imgurl, count(distinct likeid), count(distinct rid) from (items natural join images) as r1 ' +
      'left join likes on r1.itemid = likes.itemid ' +
      'left join relationships on r1.itemid = relationships.itemid ' +
      'where imgno=0 and sold=0 ' +
      'group by r1.itemid, title, description, price, imgurl ' +
      'order by count(likeid) desc, count(rid) desc',
  
  
    // Search
    search_itemsPopular: 'select r1.itemid,title,description,price,imgurl, count(distinct rid), count(distinct viewid) from (items natural join images) as r1 ' +
      'left join relationships on r1.itemid = relationships.itemid ' +
      'left join viewhistory on r1.itemid = viewhistory.itemid ' +
      'where imgno=0 and sold=0 and lower(title) like $1 ' +
      'group by r1.itemid,title,description,price,imgurl ' +
      'order by count(rid) desc, count(viewid) desc',

    search_itemsRated: 'select r1.itemid, title, description, price, imgurl, count(distinct likeid), count(distinct rid) from (items natural join images) as r1 ' +
      'left join likes on r1.itemid = likes.itemid ' +
      'left join relationships on r1.itemid = relationships.itemid ' +
      'where imgno=0 and sold=0 and lower(title) like $1 ' +
      'group by r1.itemid, title, description, price, imgurl ' +
      'order by count(likeid) desc, count(rid) desc',
    
    search_items: 'select title, description, price, imgurl,itemid from items natural join images where lower(title) like $1 and imgno = 0 and sold = 0',
    search_users: 'select username,accountid from accounts where lower(username) like $1 order by username',
    search_usersRating: 'select coalesce(avg(star),0) as mark from accounts left join reviews on accountid = revieweeid ' +
      'group by username having lower(username) like $1 order by username',
    
    // User Page
    sql_getItems: 'SELECT * FROM Items i NATURAL JOIN Images WHERE seller = $1 AND imgno = 0 AND sold = 0 ORDER BY timeListed DESC',
    sql_getSoldItems: 'SELECT * FROM (Items i NATURAL JOIN Images) join transactions t on i.sold = t.rid WHERE seller = $1 AND imgno = 0 AND i.sold <> 0 ORDER BY timeListed DESC',
    sql_getuserinfo: 'select datejoined, username from accounts where accountid = $1',
    sql_getDatejoined: 'select datejoined from accounts where accountid = $1',
    sql_getBidItems: "select itemid, description, max(amount) as amount, title, price, imgurl " +
        "from relationships natural join bids natural join items natural join images " +
        "where imgNo=0 and buyer=$1 group by itemid, description, title, price, imgurl",
    sql_getSuccessfulBids: "SELECT * FROM (((Items i NATURAL JOIN Images) join transactions t on i.sold = t.rid) natural join relationships) join accounts on accountid = seller " + 
        "WHERE buyer = $1 AND imgno = 0 AND i.sold <> 0 ORDER BY datestart",
    sql_insertview: "insert into viewHistory(itemid,userid) values ($1,$2)",
    sql_updateViews: "UPDATE Items SET views = views + 1 WHERE itemid = $1",
    sql_getUserReviews: "select star, review, username, timestamp as rtime from reviews join accounts on reviewerid = accountid " + 
        "where revieweeid = $1 order by rtime desc",
    sql_getUserRating: "select coalesce(avg(star), 0) as rating, count(reviewid) as crating from reviews where revieweeid = $1",
    

    // Product
    sql_getProductInfo:
        "select title, description, price, username, catname, accountid,sold, loanstart, loanend, location from items join accounts on items.seller = accounts.accountid where itemid = $1",
    sql_getProductImg: "select imgurl from images where itemid = $1",
    sql_getSellerReview: "select star, review, username, timestamp as rtime from reviews join accounts on reviewerid = accountid " + 
        "where revieweeid = (select seller from items where itemid = $1) order by rtime desc",
    sql_getSellerRating: "select avg(star) as rating, count(reviewid) as crating from reviews where revieweeid = (select distinct seller from items where itemid = $1 limit 1)",
    sql_getYouMayAlsoLike: "select itemid, title, description, price, imgurl from items natural join images where imgno=0 limit 4",
    sql_getCurrentBid: "select coalesce(max(amount),0) as amount from bids natural join relationships where itemid=$1 and buyer=$2",
    sql_insertBid: "select insertBidshortcut($1,$2,$3)",
    sql_insertLike: "insert into likes(likerid, itemid) values ($1, $2) ",
    sql_insertComment: "insert into qnas(itemid, userid, comment) values ($1, $2, $3)",
    sql_getLikes: "select count(likeid) as likes from likes where itemid = $1",
    sql_getComments: "select * from qnas join accounts on userid = accountid where itemid = $1 order by timestamp desc",

    // Own Product
    sql_getNoBidders: "select count(distinct rid) as counts from bids natural join relationships where itemid=$1",
    sql_getSoldInfo: "select buyer, username as buyername, transactionid from (items join relationships on items.sold <> 0 and items.sold = relationships.rid) " + 
    "join accounts on buyer = accountid natural join transactions where items.itemid = $1",
    sql_insertTran: "select insertTransactionShortcut($1)",
    sql_getSellerId: "select seller from items where itemid=$1",
    sql_getBiddingHistory: "select timestamp,amount from bids natural join relationships where itemid=$1 ",

    // Review
    sql_reviewPageB: "select * from (transactions natural join relationships) " + 
      "join accounts on accountid = seller " +
      "where transactionid = $1",
    sql_reviewPageS: "select * from (transactions natural join relationships) " + 
      "join accounts on accountid = buyer " +
      "where transactionid = $1",
    sql_insertReviewB:"select insertReviewShortcutB($1,$2,$3,$4)",
    sql_insertReviewS:"select insertReviewShortcutS($1,$2,$3,$4)",

    // List Item
    sql_getCategories: 'SELECT * FROM Categories',
    sql_insertItem: "INSERT INTO Items(title,description,price,seller,catname,loanstart,loanend,location) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING itemid",
    sql_insertImage: "INSERT INTO Images(imgurl,itemid,imgno) VALUES ($1,$2,$3)",

    // Recommender
    sql_getRecommended: `WITH MostRecent AS (
                            SELECT *
                            FROM viewHistory NATURAL JOIN Items
                            WHERE userid = $1
                            ORDER BY timestamp DESC LIMIT 10
                        ), RecommendedCat AS (
                            SELECT catname, count(*) FROM MostRecent
                            GROUP BY catname
                        ), ItemsLikes AS (
                          SELECT DISTINCT itemid, title, description, price, catname,
                            COALESCE((SELECT count(likeid) FROM Likes L GROUP BY L.itemid HAVING L.itemid = I.itemid),0) AS likes
                          FROM Items I
                        )
                        SELECT DISTINCT itemid, title, description, price, imgurl, catname, likes
                        FROM (ItemsLikes NATURAL JOIN Images) AS I1
                        WHERE imgno = 0
                        AND catname IN (SELECT catname FROM RecommendedCat)
                        AND itemid IN (
                            SELECT itemid FROM ItemsLikes I2
                            WHERE I2.catname = I1.catname AND I2.itemid != $2
                            ORDER BY likes DESC LIMIT (
                              (SELECT count FROM RecommendedCat WHERE catname = I1.catname) / (SELECT sum(count) FROM RecommendedCat) * 5
                          )
                        )
                        ORDER BY likes desc`,
    
    // Edit Listing
    sql_getItemInfo: 'SELECT * FROM Items WHERE itemid = $1',
    sql_updateItem: "UPDATE Items SET title=$1, description=$2, price=$3, catname=$4, loanstart=$5, loanend=$6, location=$7 WHERE itemid=$8 RETURNING itemid",
    
}

module.exports = sql;
