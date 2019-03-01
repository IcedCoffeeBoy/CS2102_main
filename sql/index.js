const sql = {}

sql.query = {
    // Search
    search_items: 'select title, description, price, imgurl from items natural join images where lower(title) like $1',
    search_categories: 'select catname from categories where lower(catname) like $1',
    search_users: 'select username from accounts where lower(username) like $1',
}

module.exports = sql;