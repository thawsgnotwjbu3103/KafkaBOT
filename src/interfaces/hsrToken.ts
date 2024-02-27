import mongoose from "mongoose";

export default interface IHSToken extends mongoose.Document {
    userDiscordId: string;
    ltokenV2: string;
    ltuidV2: string;
    isCron: boolean
}