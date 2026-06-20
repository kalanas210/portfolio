// Find your Telegram chat id so notifications can be delivered to your DM.
//
// Steps:
//   1. In Telegram, create a bot via @BotFather (/newbot) and copy its token.
//   2. Open a chat with your new bot and send it any message (e.g. "hi").
//   3. Run this script with the token:
//        node scripts/telegram-chatid.mjs <BOT_TOKEN>
//      or set it in the environment:
//        TELEGRAM_BOT_TOKEN=xxx node scripts/telegram-chatid.mjs
//   4. Copy the printed chat id into .env.local (and Vercel) as TELEGRAM_CHAT_ID.
//
// Note: getUpdates only returns recent messages and won't work while a webhook
// is set. If you see nothing, message the bot again and re-run.

const token = process.argv[2] || process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error("Usage: node scripts/telegram-chatid.mjs <BOT_TOKEN>");
  console.error("   or: set TELEGRAM_BOT_TOKEN in the environment.");
  process.exit(1);
}

const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const data = await res.json();

if (!data.ok) {
  console.error("Telegram API error:", data.description || data);
  process.exit(1);
}

if (!data.result?.length) {
  console.log("No messages found. Send your bot a message in Telegram, then re-run.");
  process.exit(0);
}

const seen = new Map();
for (const update of data.result) {
  const chat = update.message?.chat || update.channel_post?.chat || update.my_chat_member?.chat;
  if (chat && !seen.has(chat.id)) {
    seen.set(chat.id, chat);
  }
}

if (!seen.size) {
  console.log("Got updates but no chat could be read. Send the bot a plain text message and re-run.");
  process.exit(0);
}

console.log("\nFound these chats:\n");
for (const chat of seen.values()) {
  const who = chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(" ") || chat.username || "(unknown)";
  console.log(`  chat id: ${chat.id}   type: ${chat.type}   →  ${who}`);
}
console.log("\nUse the chat id above as TELEGRAM_CHAT_ID.\n");
