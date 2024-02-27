import IHSRRedeem from '@/interfaces/hsrRedeem';
import mongoose from 'mongoose';

export const HSRRedeemSchema = new mongoose.Schema({
    userDiscordId: {
        type: String,
        required: true,
    },
    uid: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
});

const HSRRedeem = mongoose.model<IHSRRedeem>('HSRRedeem', HSRRedeemSchema);
export default HSRRedeem;
