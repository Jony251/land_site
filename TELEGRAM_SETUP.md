# Telegram Bot & Channel Setup Guide

Complete guide for setting up Telegram bot and channel for lead notifications.

## Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a conversation and send `/newbot`
3. Follow the prompts:
   - Choose a name for your bot (e.g., "My AI Chatbot Bot")
   - Choose a username (must end with `bot`, e.g., `my_ai_chatbot_bot`)
4. BotFather will give you a **token** that looks like:
   ```
   <telegram_bot_token_from_botfather>
   ```
5. Save this token - this is your `TELEGRAM_BOT_TOKEN`

## Step 2: Create a Telegram Channel

### Option A: Create a New Channel

1. Open Telegram
2. Click the **menu** (☰) in the top left
3. Select **New Channel**
4. Choose a name for your channel (e.g., "AI Chatbot Leads")
5. Add a description (optional)
6. Choose if it should be **Public** or **Private**

### Option B: Use an Existing Channel

If you already have a channel, skip to Step 3.

## Step 3: Get Channel Username (For Public Channels)

### If Your Channel is Public:

1. Open your channel in Telegram
2. Click on the channel name at the top
3. You'll see the channel info page
4. Look for **Username** or **@username**
   - If you see something like `@mychannel`, that's your channel username
   - Format: `@channelname` (with the @ symbol)

**If you don't see a username:**
1. Click **Edit** or the **pencil icon**
2. Look for **Username** or **Add Username**
3. Create a username (must be unique and 5-32 characters)
4. Save it
5. Copy the username including the `@` symbol (e.g., `@my_ai_leads`)

### If Your Channel is Private:

1. Open your channel
2. Click on the channel name at the top
3. Click **Administrators**
4. Look for **Channel Info** - you'll see the channel ID instead
5. For private channels, you'll need to use the **Channel ID** instead of username

**To get Channel ID for private channels:**
1. Add your bot as an administrator (Step 4)
2. Send a message to your channel
3. Forward that message to [@userinfobot](https://t.me/userinfobot)
4. It will show you the channel ID (looks like `-1001234567890`)
5. Use this ID in `.env` as `TELEGRAM_CHANNEL_ID=-1001234567890` (no @ symbol for IDs)

## Step 4: Add Bot as Administrator

1. Open your channel
2. Click on the channel name at the top
3. Click **Administrators** or **Manage Channel**
4. Click **Add Administrator**
5. Search for your bot by its username (the one you created in Step 1)
6. Select your bot
7. Give it **Post Messages** permission (make sure this is enabled!)
8. Click **Done**

## Step 5: Configure in Your Project

Add to your `.env` file:

```env
# For public channel with username
TELEGRAM_BOT_TOKEN=<telegram_bot_token_from_botfather>
TELEGRAM_CHANNEL_ID=@my_ai_leads

# OR for private channel (use channel ID instead)
TELEGRAM_BOT_TOKEN=<telegram_bot_token_from_botfather>
TELEGRAM_CHANNEL_ID=-1001234567890
```

## Quick Checklist

- [ ] Bot created via @BotFather
- [ ] Bot token copied to `.env` as `TELEGRAM_BOT_TOKEN`
- [ ] Channel created (public or private)
- [ ] Channel username obtained (or channel ID for private)
- [ ] Channel username/ID added to `.env` as `TELEGRAM_CHANNEL_ID`
- [ ] Bot added as channel administrator
- [ ] Bot has "Post Messages" permission

## Testing

After setting up, test your Telegram integration:

```bash
# Make sure your server is running
python manage.py runserver 0.0.0.0:8234

# In another terminal, test Telegram
curl -X POST http://localhost:8234/api/test/telegram/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message from backend"}'
```

You should receive a test message in your Telegram channel!

## Troubleshooting

### "Channel not found" Error
- Make sure your channel username includes the `@` symbol
- Verify the channel is public or the bot is an administrator
- Check that you copied the username correctly (no extra spaces)

### "Bot not administrator" Error
- Go back to Step 4 and ensure the bot is added as administrator
- Make sure "Post Messages" permission is enabled

### "Invalid channel ID" Error
- For private channels, make sure you're using the channel ID (negative number starting with `-100`)
- For public channels, make sure you're using the username with `@` symbol

### Bot Can't Post Messages
- Go to channel settings → Administrators
- Select your bot
- Enable "Post Messages" permission
- Save changes

## Examples

**Public Channel Example:**
```
Channel Name: "AI Chatbot Leads"
Channel Username: @ai_chatbot_leads
TELEGRAM_CHANNEL_ID=@ai_chatbot_leads
```

**Private Channel Example:**
```
Channel Name: "Private Leads"
Channel ID: -1001234567890
TELEGRAM_CHANNEL_ID=-1001234567890
```

## Security Note

- Keep your bot token secret - never commit it to version control
- Add `.env` to `.gitignore` (already done)
- Don't share your bot token publicly
- Regularly rotate tokens if compromised

