import mongoose from "mongoose";

export default interface IHSRRedeem extends mongoose.Document {
    userDiscordId: string;
    uid: string;
    region: string;
    code: string;
}