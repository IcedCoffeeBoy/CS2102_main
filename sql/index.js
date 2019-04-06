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
    search_items: 'select title, description, price, imgurl,itemid from items natural join images where lower(title) like $1 and imgno = 0 and sold = 0',
    search_categories: 'select catname from categories where lower(catname) like $1',
    search_users: 'select username,accountid from accounts where lower(username) like $1',
    
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
    sql_getUserReviews: "select star, review, username, timestamp as rtime from reviews join accounts on reviewerid = accountid " + 
        "where revieweeid = $1 order by rtime desc",

    // Product
    sql_getProductInfo:
        "select title, description, price, username, catname, accountid,sold from items join accounts on items.seller = accounts.accountid where itemid = $1",
    sql_getProductImg: "select imgurl from images where itemid = $1",
    sql_getSellerReview: "select star, review, username, timestamp as rtime from reviews join accounts on reviewerid = accountid " + 
        "where revieweeid = (select seller from items where itemid = $1) order by rtime desc",
    sql_getYouMayAlsoLike: "select itemid, title, description, price, imgurl from items natural join images where imgno=0 limit 4",
    sql_getCurrentBid: "select coalesce(max(amount),0) as amount from bids natural join relationships where itemid=$1 and buyer=$2",
    sql_insertBid: "select insertBidshortcut($1,$2,$3)",
    sql_getLikes: "select count(likeid) as likes from likes where itemid = $1",
    sql_insertLike: "insert into likes(likerid, itemid) values ($1, $2) ",

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

}

module.exports = sql;
