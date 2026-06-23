require("dotenv").config();

const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [

new SlashCommandBuilder()
.setName("blacklist")
.setDescription("Blacklist user")
.addUserOption(option =>
option
.setName("user")
.setDescription("User")
.setRequired(true))
.addStringOption(option =>
option
.setName("reason")
.setDescription("Reason")
.setRequired(true)),

new SlashCommandBuilder()
.setName("unblacklist")
.setDescription("Remove blacklist")
.addUserOption(option =>
option
.setName("user")
.setDescription("User")
.setRequired(true)),

new SlashCommandBuilder()
.setName("check")
.setDescription("Check blacklist")
.addUserOption(option =>
option
.setName("user")
.setDescription("User")
.setRequired(true))

].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" })
.setToken(process.env.TOKEN);

(async () => {
await rest.put(
Routes.applicationGuildCommands(
process.env.CLIENT_ID,
process.env.GUILD_ID
),
{ body: commands }
);

console.log("Commands Loaded");
})();