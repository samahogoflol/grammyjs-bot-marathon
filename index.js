require("dotenv").config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require("grammy");

const { hydrate } = require("@grammyjs/hydrate");

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
  {
    command: "start",
    description: "Запуск бота",
  },
  {
    command: "menu",
    description: "Отримати меню",
  },
]);

bot.command("start", async (ctx) => {
  await ctx.reply('Привіт! Я - бот. Тг канал: <a href="https://www.youtube.com/watch?v=q-AFR0D7Vuw">Посилання</a>', {
    parse_mode: "HTML",
  });
});

const menuKeyboard = new InlineKeyboard()
  .text("Дізнасти статус замовлення", "order-status")
  .text("Звернутись до підтримки", "support");

const backKeybord = new InlineKeyboard().text("< Назад в меню");

bot.command("menu", async (ctx) => {
  await ctx.reply("Виберіть пунк меню", {
    reply_markup: menuKeyboard,
  });
});

bot.callbackQuery("order-status", async (ctx) => {
  await ctx.callbackQuery.message.editText("Статус замовлнення : В дорозі", {
    reply_markup: backKeybord,
  });
  await ctx.answerShippingQuery();
});

bot.callbackQuery("support", async (ctx) => {
  await ctx.callbackQuery.message.editText("Зараз з Вами зв’яжеться наша команда", {
    reply_markup: backKeybord,
  });
  await ctx.answerShippingQuery();
});

bot.callbackQuery("back", async (ctx) => {
  await ctx.callbackQuery.message.editText("Виберіть пунк меню", {
    reply_markup: menuKeyboard,
  });
  await ctx.answerShippingQuery();
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error", e);
  }
});

bot.start();
