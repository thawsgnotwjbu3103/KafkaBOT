import { HonkaiStarRail } from '@/helpers/constants';
import { IHSRCheckin, IHSRInfo, IHSRAward } from '@/interfaces/hsrCheckin';
import HSRToken from '@/models/hsrTokenModel';
import axios from 'axios';

// Initialize interface for api call parameters
interface IHSRApiInput {
    userAgent: string;
    cookies: string;
}

export default new (class HsrCheckInRepository {
    apiSign = `${HonkaiStarRail.HOYOLAB_BASE_API}/sign`; // api for check-in (POST method)
    apiInfo = `${HonkaiStarRail.HOYOLAB_BASE_API}/info?act_id=${HonkaiStarRail.CHECK_IN_ACT_ID}`; // api for getting user's check-in info (GET method)
    apiAward = `${HonkaiStarRail.HOYOLAB_BASE_API}/home?act_id=${HonkaiStarRail.CHECK_IN_ACT_ID}`; // api for getting user's check-in award (GET method)

    async postCheckInApi(input: IHSRApiInput, discordId: string) {
        try {
            const response = await axios({
                url: this.apiSign,
                method: 'POST',
                headers: {
                    'User-Agent': input.userAgent,
                    Cookie: input.cookies,
                    Referer: HonkaiStarRail.HSR_REFERER,
                    Origin: HonkaiStarRail.HSR_ORIGIN,
                    'x-rpc-app_version': HonkaiStarRail.HSR_RPC_APP_VERSION,
                    'x-rpc-client_type': HonkaiStarRail.HSR_RPC_CLIENT_TYPE,
                },
                data: {
                    act_id: HonkaiStarRail.CHECK_IN_ACT_ID,
                },
                withCredentials: true,
            });

            const setCookies = response.headers['set-cookie']; // get all value from set-cookie headers
            if (setCookies) {
                const ltoken_v2 = setCookies[0].split(';')[0].split('=')[1]; //This will get the ltoken_v2 value
                await HSRToken.updateOne({ userDiscordId: discordId }, { ltokenV2: ltoken_v2 }); // perform to update the token in case of token expired
            }

            const data: IHSRCheckin = response.data;
            if (data.retcode === 0 && data.message === 'OK') {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async getInfo(input: IHSRApiInput): Promise<IHSRInfo> {
        try {
            const response = await axios({
                url: this.apiInfo,
                method: 'GET',
                headers: {
                    'User-Agent': input.userAgent,
                    Cookie: input.cookies,
                    Referer: HonkaiStarRail.HSR_REFERER,
                    Origin: HonkaiStarRail.HSR_ORIGIN,
                    'x-rpc-app_version': HonkaiStarRail.HSR_RPC_APP_VERSION,
                    'x-rpc-client_type': HonkaiStarRail.HSR_RPC_CLIENT_TYPE,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return {
                data: null,
                message: 'Not logged in',
                retcode: -100,
            };
        }
    }

    async getAwards(input: IHSRApiInput): Promise<IHSRAward> {
        try {
            const response = await axios({
                url: this.apiAward,
                method: 'GET',
                headers: {
                    'User-Agent': input.userAgent,
                    Cookie: input.cookies,
                    Referer: HonkaiStarRail.HSR_REFERER,
                    Origin: HonkaiStarRail.HSR_ORIGIN,
                    'x-rpc-app_version': HonkaiStarRail.HSR_RPC_APP_VERSION,
                    'x-rpc-client_type': HonkaiStarRail.HSR_RPC_CLIENT_TYPE,
                },
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            return {
                data: null,
                message: 'Not logged in',
                retcode: -100,
            };
        }
    }
})();
