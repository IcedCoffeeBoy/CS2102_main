var express = require('express');
var router = express.Router();
var db = require('../db');

/* SQL Queries */
const msgInsertQuery = "select insertMessageShortcut($1, $2, $3, $4, $5)"
const msgPollAllQuery = ("select timestamp, userfrom, msg from messages "
        + "where rid = (select rid from relationships where buyer = $1 "
        + "and seller = $2 and itemid = $3) "
        + "order by timestamp")
const msgPollQuery = ("select timestamp, msg from messages "
        + "where rid = (select rid from relationships where buyer = $1 "
        + "and seller = $2 and itemid = $3) "
        + "and userfrom <> $1 "
        + "and timestamp > $4 "
        + "order by timestamp")
const getSellerIdQuery = "select seller from items where itemid = $1"


/* Routes */
router.get('/', async (req, res, next) => {
    res.render("chatpage")
})

router.post('/getChat', async (req, res, next) => {
    try {
        var sellerId = await db.db_promise(getSellerIdQuery, [req.body.itemId])

        // Sanity check to ensure that the item actually has a seller
        if (sellerId.length != 1) throw "DBError: Error when fetching item seller."
        
        if (req.body.retrieveAll == "true") {
            let sqlParams = [req.user.id, sellerId[0].seller, req.body.itemId]
            var rawMsgs = await db.db_promise(msgPollAllQuery, sqlParams)
        } else {
            console.log("Retrieving user's new msgs", req.body.tstamp)
            let sqlParams = [req.user.id, sellerId[0].seller, req.body.itemId, req.body.tstamp]
            var rawMsgs = await db.db_promise(msgPollQuery, sqlParams)
        }

        let currTimestamp = await db.db_promise("select CURRENT_TIMESTAMP as ts")

        // Indicate if its from the buyer or seller
        var msgs = rawMsgs.map((m) => {
            return {"timestamp": m.timestamp,
                    "toUser": m.userfrom != req.user.id,
                    "msg": m.msg}
        })
        msgs.push(currTimestamp[0].ts)

        res.status(200).send(msgs)
    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
});

router.post('/sendChat', async (req, res, next) => {
    // Checks to prevent malformed chat requests
    if (!req.user.id || !req.body.itemId) {
        res.sendStatus(403)
    }

    let sender = req.user.id
    try {
        var sellerId = await db.db_promise(getSellerIdQuery, [req.body.itemId])
        
        if (sellerId.length != 1) throw "DBError: Error when fetching item seller."
        if (sender == sellerId) throw "DBError: Chat message sender/receiver is the same."

        // Relationship info is automatically inferred by the DB
        let sqlParams = [
            sender,
            sender,
            sellerId[0].seller,
            req.body.itemId,
            req.body.msg
        ]
        
        let rid = await db.db_promise(msgInsertQuery, sqlParams)

        if (rid.length === 0) {
            res.sendStatus(403)
        } else {
            res.sendStatus(200)
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/', (req, res, next) => {
    res.render('chat', { user: req.user })
})

module.exports = router;
