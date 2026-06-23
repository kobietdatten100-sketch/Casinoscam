import os
import sqlite3
from datetime import datetime
import discord
from discord.ext import commands

TOKEN = os.getenv("TOKEN")
if not TOKEN:
    raise ValueError("TOKEN chưa được thiết lập")

BO_TRUONG = 1518871534935085127
THU_TRUONG = 0
CUC_TRUONG = 0

ROLE_LIMITS = {
    BO_TRUONG: 1_000_000_000,
    THU_TRUONG: 500_000_000,
    CUC_TRUONG: 100_000_000
}

db = sqlite3.connect("finance.db")
cursor = db.cursor()

cursor.execute("CREATE TABLE IF NOT EXISTS treasury (id INTEGER PRIMARY KEY, budget INTEGER)")
cursor.execute("""CREATE TABLE IF NOT EXISTS transactions (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user TEXT,target TEXT,action TEXT,amount INTEGER,date TEXT)""")

cursor.execute("SELECT * FROM treasury WHERE id=1")
if cursor.fetchone() is None:
    cursor.execute("INSERT INTO treasury (id,budget) VALUES (1,1000000000)")
    db.commit()

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

def get_budget():
    cursor.execute("SELECT budget FROM treasury WHERE id=1")
    return cursor.fetchone()[0]

def set_budget(amount):
    cursor.execute("UPDATE treasury SET budget=? WHERE id=1",(amount,))
    db.commit()

def get_user_limit(member):
    highest = 0
    for role in member.roles:
        if role.id in ROLE_LIMITS:
            highest = max(highest, ROLE_LIMITS[role.id])
    return highest

@bot.event
async def on_ready():
    await bot.tree.sync()
    print(f"Bot online: {bot.user}")

@bot.tree.command(name="ngansach", description="Xem ngân sách quốc gia")
async def ngansach(interaction: discord.Interaction):
    await interaction.response.send_message(f"Ngân sách: {get_budget():,} VNĐ")

bot.run(TOKEN)
