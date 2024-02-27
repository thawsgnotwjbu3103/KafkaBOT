import IHSRToken from '@/interfaces/hsrToken';
import mongoose from 'mongoose';

export const HSRTokenSchema = new mongoose.Schema({
    userDiscordId: {
        type: String,
        required: true,
    },
    ltokenV2: {
        type: String,
        required: true,
    },
    ltuidV2: {
        type: String,
        required: true,
    },
    isCron: {
        type: Boolean,
        required: true
    }
});

const HSRToken = mongoose.model<IHSRToken>('HSRToken', HSRTokenSchema);
export default HSRToken;
