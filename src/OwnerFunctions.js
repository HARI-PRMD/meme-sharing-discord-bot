const { SendAllChannels } = require("./ChannelFunctions");
const { SendAllDms } = require("./DmFunctions");

function HandleNewMeme(message, client) {
  // send embedded image or gif or any other embedded media link
  if (message.embeds.length > 0) {
    SendAllChannels(message.embeds[0].data.url, client);
    SendAllDms(message.embeds[0].data.url, client);
  }
  // send uploaded image or video link
  if (message.attachments.size > 0) {
    message.attachments.forEach(function (attachment) {
      SendAllChannels(attachment.url, client);
      SendAllDms(attachment.url, client);
    });
  }
}

module.exports = {
  HandleNewMeme,
};
