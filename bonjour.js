module.exports.advertise = PORT => {
  try {
    const mdns = require("mdns");

    const ad = mdns.createAdvertisement(mdns.tcp("Bagel"), PORT);
    ad.start();
    console.log("Advertising Bagel using bonjour on " + PORT);
  } catch (e) {
    console.error("Could not start bonjour advertiser", e);
  }
};
