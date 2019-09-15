const Command = require("../base/Command.js");

class Say extends Command {
  constructor (client) {
    super(client, {
      name: "Say",
      description: "Displays your permission level for your location.",
      usage: "say",
    });
  }
  async run (message, args, level) { // eslint-disable-line no-unused-vars

    const response = args.join(' ');
    message.delete();
    message.channel.send(response);
  }
}

module.exports = Say;
