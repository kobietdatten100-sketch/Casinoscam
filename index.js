require("dotenv").config();

const fs = require("fs");

const {
Client,
GatewayIntentBits,
EmbedBuilder,
PermissionsBitField
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

const DB = "./blacklist.json";

function loadData() {

if (!fs.existsSync(DB))
fs.writeFileSync(DB, "[]");

return JSON.parse(
fs.readFileSync(DB)
);
}

function saveData(data) {

fs.writeFileSync(
DB,
JSON.stringify(data, null, 2)
);
}

client.once("ready", () => {

console.log(
`Logged in as ${client.user.tag}`
);

});

client.on("interactionCreate", async interaction => {

if (!interaction.isChatInputCommand())
return;

if (
!interaction.member.permissions.has(
PermissionsBitField.Flags.Administrator
)
)
{
return interaction.reply({
content:
"❌ Bạn không có quyền.",
ephemeral: true
});
}

let data = loadData();

if (interaction.commandName === "blacklist") {

const user =
interaction.options.getUser("user");

const reason =
interaction.options.getString("reason");

const exist =
data.find(x => x.id === user.id);

if (exist)
{
return interaction.reply({
content:
"⚠️ User đã blacklist.",
ephemeral: true
});
}

const caseId =
data.length + 1;

const record = {

caseId,

id: user.id,

tag: user.tag,

reason,

moderator:
interaction.user.tag,

moderatorId:
interaction.user.id,

date:
new Date().toLocaleString()

};

data.push(record);

saveData(data);

const embed =
new EmbedBuilder()

.setColor("Red")

.setTitle(
"🛡️ BLACKLIST SYSTEM"
)

.setThumbnail(
user.displayAvatarURL()
)

.setDescription(

`### ⚠️ USER ĐÃ BỊ BLACKLIST`

)

.addFields(

{
name: "📌 CASE ID",
value: `#${caseId}`,
inline: false
},

{
name: "👤 USER",
value: `${user.tag}`,
inline: false
},

{
name: "🆔 UID",
value: `${user.id}`,
inline: false
},

{
name: "📋 REASON",
value: reason,
inline: false
},

{
name: "👮 MODERATOR",
value: interaction.user.tag,
inline: false
},

{
name: "🆔 MOD UID",
value:
interaction.user.id,
inline: false
},

{
name: "📅 DATE",
value:
new Date().toLocaleString(),
inline: false
},

{
name: "🔒 STATUS",
value:
"ACTIVE",
inline: false
}

)

.setFooter({
text:
`${interaction.guild.name} • Blacklist Database`
})

.setTimestamp();

interaction.reply({
embeds: [embed]
});

}

if (
interaction.commandName ===
"unblacklist"
)
{

const user =
interaction.options.getUser("user");

const exist =
data.find(x => x.id === user.id);

if (!exist)
{
return interaction.reply({
content:
"❌ Không tồn tại.",
ephemeral: true
});
}

data =
data.filter(
x => x.id !== user.id
);

saveData(data);

interaction.reply(
`✅ Đã gỡ blacklist ${user.tag}`
);

}

if (
interaction.commandName ===
"check"
)
{

const user =
interaction.options.getUser("user");

const record =
data.find(
x => x.id === user.id
);

if (!record)
{
return interaction.reply(
`✅ ${user.tag} không blacklist`
);
}

const embed =
new EmbedBuilder()

.setColor("DarkRed")

.setTitle(
"🔍 BLACKLIST CHECK"
)

.addFields(

{
name: "📌 CASE",
value:
`#${record.caseId}`,
inline: false
},

{
name: "👤 USER",
value:
record.tag,
inline: false
},

{
name: "🆔 UID",
value:
record.id,
inline: false
},

{
name: "📋 REASON",
value:
record.reason,
inline: false
},

{
name: "👮 MODERATOR",
value:
record.moderator,
inline: false
},

{
name: "📅 DATE",
value:
record.date,
inline: false
}

)

.setTimestamp();

interaction.reply({
embeds: [embed]
});

}

});

client.login(
process.env.TOKEN
);