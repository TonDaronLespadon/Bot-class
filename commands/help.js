const Command = require("../base/Command.js");

/*
La commande HELP est utilisée pour afficher le nom et la description de chaque commande
  à l'utilisateur, afin qu'il puisse voir quelles commandes sont disponibles. L'aide
  La commande est également filtrée par niveau. Ainsi, si un utilisateur n’a pas accès à
  une commande, il ne leur est pas montré. Si un nom de commande est donné avec le
  help command, son aide étendue est affichée.
*/
class Help extends Command {
  constructor (client) {
    super(client, {
      name: "help",
      description: "Displays all the available commands for you.",
      category: "System",
      usage: "help [command]",
      aliases: ["h", "halp"]
    });
  }

  async run (message, args, level) {
// Si aucune commande spécifique n'est appelée, affiche toutes les commandes filtrées.    
if (!args[0]) {
// Charger les paramètres de guilde (pour les préfixes et éventuellement des ajustements par guilde)
      const settings = message.settings;
      
// Filtre toutes les commandes disponibles pour le niveau utilisateur, à l'aide de la méthode <Collection> .filter ().
      const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level) : this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);
      
      // Ici, nous devons obtenir uniquement les noms de commande, et nous utilisons ce tableau pour obtenir le nom le plus long.
            // Ceci rend les commandes d'aide "alignées" dans la sortie.
      const commandNames = myCommands.keyArray();
      const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
      let currentCategory = "";
      let output = `= Command List =\n\n[Use ${this.client.config.defaultSettings.prefix}help <commandname> for details]\n`;
      const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
      sorted.forEach( c => {
        const cat = c.help.category.toProperCase();
        if (currentCategory !== cat) {
          output += `\u200b\n== ${cat} ==\n`;
          currentCategory = cat;
        }
        output += `${c.help.name}${"".repeat(longest - c.help.name.length)}, `;
      });
      message.channel.send(output, {code:"asciidoc", split: { char: "\u200b" }});
    } else {

// Affiche l'aide des commandes individuelles.
      let command = args[0];
      if (this.client.commands.has(command)) {
        command = this.client.commands.get(command);
        if (level < this.client.levelCache[command.conf.permLevel]) return;
        message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\nalises:: ${command.conf.aliases.join(", ")}`, {code:"asciidoc"});
      }
    }
  }
}
module.exports = Help;
