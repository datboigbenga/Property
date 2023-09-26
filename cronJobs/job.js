const nodeCron = require("node-cron");
const Subscriptions = require("../models/Subscriptions")
const Property = require("../models/Property")
const moment = require("moment");

const expiredSubscriptions = nodeCron.schedule("* * * * *", async function (req, res, next) {
    // Do whatever you want in here. Send email, Make  database backup or download data.
    let today_date = moment(new Date()).format("YYYY-MM-DD hh:mm");
    const find_subs = await Subscriptions.find()
    if (find_subs) {
        for (let i = 0; i < find_subs.length; i++) {
            let subs = find_subs[i];
            //format user date to same format as today date then compare
            let subDueDate = moment(subs.expiryDate).format("YYYY-MM-DD hh:mm");
            if (today_date === subDueDate) {
                let find_subs = await Subscriptions.findById(subs._id);
                find_subs.status = "expired";
                // find_subs.expiryDate = null;
                // find_subs.startDate = null;
                await find_subs.save()
            }}}})
  module.exports = {expiredSubscriptions}