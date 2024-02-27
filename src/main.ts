import BotClient from './structures/BotClient';

BotClient.run().catch((error) => {
    console.error(`Error: ${error}`);
});
