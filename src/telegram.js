const { Telegraf } = require("telegraf");
const { telegram } = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

exports.notifyMe = async function (message) {
  const sent = await telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
  return sent;
};
