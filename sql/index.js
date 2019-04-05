var sql = {
    // Search
    search_items: 'select title, description, price, imgurl,itemid from items natural join images where lower(title) like $1 and imgno = 0 and sold = 0',
    search_categories: 'select catname from categories where lower(catname) like $1',
    search_users: 'select username,accountid from accounts where lower(username) like $1',
    sql_getItems: 'SELECT * FROM Items i NATURAL JOIN Images WHERE seller = $1 AND imgno = 0 AND sold = 0 ORDER BY timeListed DESC',
    sql_getSoldItems: 'SELECT * FROM (Items i NATURAL JOIN Images) join transactions t on i.sold = t.rid WHERE seller = $1 AND imgno = 0 AND i.sold <> 0 ORDER BY timeListed DESC',
    sql_getuserinfo: 'select datejoined, username from accounts where accountid = $1',
    sql_getDatejoined: 'select datejoined from accounts where accountid = $1',
    sql_getBidItems: "select itemid, description, max(amount) as amount, title, price, imgurl " +
        "from relationships natural join bids natural join items natural join images " +
        "where imgNo=0 and buyer=$1 group by itemid, description, title, price, imgurl",
    sql_getSuccessfulBids: "SELECT * FROM (((Items i NATURAL JOIN Images) join transactions t on i.sold = t.rid) natural join relationships) join accounts on accountid = seller " + 
        "WHERE buyer = $1 AND imgno = 0 AND i.sold <> 0 ORDER BY datestart",
    sql_insertview: "insert into viewHistory(itemid,userid) values ($1,$2)"
}

module.exports = sql;
