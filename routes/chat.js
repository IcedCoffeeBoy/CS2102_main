var express = require("express");
var router = express.Router();
var db = require("../db");

/* SQL Queries */
const msgInsertQuery = "select insertMessageShortcut($1, $2, $3, $4, $5)";
const msgPollAllQuery =
    "select timestamp, userfrom, msg from messages " +
    "where rid in (select rid from relationships where buyer = $1 " +
    "and seller = $2 and itemid = $3) " +
    "order by timestamp";
const msgPollQuery =
    "select timestamp, msg from messages " +
    "where rid in (select rid from relationships where buyer = $1 " +
    "and seller = $2 and itemid = $3) " +
    "and userfrom <> $1 " +
    "and timestamp > $4 " +
    "order by timestamp";
const getSellerIdQuery = "select seller from items where itemid = $1";
const getChatRelnsQuery =
    "select M.rid as rid, userfrom as userid, username, msg, timestamp " +
    "from (messages as M inner join relationships as R on M.rid = R.rid) " +
    "join accounts on M.userfrom = accountid " +
    "where buyer = $1 or seller = $1 " +
    "order by timestamp";
const getChatUsersQuery =
    "with X as ( " +
    "select R.rid, case when R.seller = $1 then R.buyer else R.seller end as userid, R.itemid, title " +
    "from (relationships as R join items as I on R.itemid = I.itemid) " +
    "where (R.seller = $1 or R.buyer = $1) " +
    "and rid in (select rid from messages)) " +
    "select rid, userid, username, itemid, title from X join accounts as A on X.userid = A.accountid ";
const getRidQuery =
    "select rid from relationships " +
    "where (seller = $1 and buyer = $2) or (seller = $2 and buyer = $1) and itemid = $3";
const msgInsertRExistQuery =
    "insert into messages (rid, userfrom, msg) values ($1, $2, $3)";
const getChatRelnsPollQuery =
    "select M.rid as rid, userfrom as userid, username, msg, timestamp " +
    "from (messages as M inner join relationships as R on M.rid = R.rid) " +
    "join accounts on M.userfrom = accountid " +
    "where (buyer = $1 or seller = $1) " +
    "and userfrom <> $1 and timestamp > $2 " +
    "order by timestamp";
const getCurrentUtcTimeQuery =
    "select CURRENT_TIMESTAMP as ts";

/* Routes */
router.get("/", async (req, res, next) => {
    // Initial message acquisition
    let msgs = await db.db_promise(getChatRelnsQuery, [req.user.id]);
    let users = await db.db_promise(getChatUsersQuery, [req.user.id]);

    let latestTimestamp = await db.db_promise(getCurrentUtcTimeQuery);

    res.render("chatpage", {
        msgs: msgs,
        users: users,
        user: req.user,
        latestTimestamp: latestTimestamp[0].ts
    });
});

router.post("/getChat", async (req, res, next) => {
    try {
        var sellerId = await db.db_promise(getSellerIdQuery, [req.body.itemId]);

        // Sanity check to ensure that the item actually has a seller
        if (sellerId.length != 1)
            throw "DBError: Error when fetching item seller.";

        if (req.body.retrieveAll == "true") {
            let sqlParams = [req.user.id, sellerId[0].seller, req.body.itemId];
            var rawMsgs = await db.db_promise(msgPollAllQuery, sqlParams);
        } else {
            let sqlParams = [
                req.user.id,
                sellerId[0].seller,
                req.body.itemId,
                req.body.tstamp
            ];
            var rawMsgs = await db.db_promise(msgPollQuery, sqlParams);
        }

        let currTimestamp = await db.db_promise(getCurrentUtcTimeQuery);

        // Indicate if its from the buyer or seller
        var msgs = rawMsgs.map(m => {
            return {
                timestamp: m.timestamp,
                toUser: m.userfrom != req.user.id,
                msg: m.msg
            };
        });
        msgs.push(currTimestamp[0].ts);

        res.status(200).send(msgs);
    } catch (err) {
        console.log(err);
        res.sendStatus(403);
    }
});

// When sending a chat message from a product page
router.post("/sendChat", async (req, res, next) => {
    // Checks to prevent malformed chat requests
    if (!req.user.id || !req.body.itemId) {
        return res.sendStatus(403);
    }

    let sender = req.user.id;
    try {
        var sellerId = await db.db_promise(getSellerIdQuery, [req.body.itemId]);

        if (sellerId.length != 1)
            throw "DBError: Error when fetching item seller.";
        if (sender == sellerId)
            throw "DBError: Chat message sender/receiver is the same.";

        // Relationship info is automatically inferred by the DB
        let sqlParams = [
            sender,
            sender,
            sellerId[0].seller,
            req.body.itemId,
            req.body.msg
        ];

        let rid = await db.db_promise(msgInsertQuery, sqlParams);

        if (rid.length === 0) {
            res.sendStatus(403);
        } else {
            res.sendStatus(200);
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// When communicating with people in the main chat page
router.post("/sendChatMain", async (req, res, next) => {
    // Checks to prevent malformed chat requests
    if (!req.user.id || !req.body.itemId) {
        return res.sendStatus(403);
    }

    let sender = req.user.id;
    try {
        let ridSqlParams = [sender, req.body.recipient, req.body.itemId];
        let rid = await db.db_promise(getRidQuery, ridSqlParams);

        if (rid.length == 0) return res.sendStatus(403);

        let sqlParams = [rid[0].rid, sender, req.body.msg];
        let result = await db.db_promise(msgInsertRExistQuery, sqlParams);

        if (!result) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// When polling the server for messages from the main chat page
router.post("/getChatMain", async (req, res, next) => {
    try {
        let sqlParams = [req.user.id, req.body.timestamp];

        let msgs = await db.db_promise(getChatRelnsPollQuery, sqlParams);

        let currTimestamp = await db.db_promise(getCurrentUtcTimeQuery);
        msgs.push(currTimestamp[0].ts);

        console.log(msgs);
        res.status(200).send(msgs);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;


//2019-04-10T10:40:11.970Z
//2019-04-10T02:35:47.266Z