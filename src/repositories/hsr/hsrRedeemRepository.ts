import axios from 'axios';
import { HonkaiStarRail } from '@/helpers/constants';

interface IRedeemApiInput {
    cdkey: string;
    game_biz: string;
    lang: string;
    region: string;
    t: Date;
    uid: string;
}

interface IRedeemData {
    retcode: number;
    message: string;
    data: {
        list: IListItem[];
    } | null;
}

interface IListItem {
    has_role: boolean;
    game_id: number;
    game_role_id: string;
    nickname: string;
    region: string;
    level: number;
    background_image: string;
    is_public: boolean;
    data: IData[];
    region_name: string;
    url: string;
    data_switches: ISwitch[];
    h5_data_switches: any[];
    background_color: string;
    background_image_v2: string;
}

interface ISwitch {
    switch_id: number;
    is_public: boolean;
    switch_name: string;
}

interface IData {
    name: string;
    type: number;
    value: string;
}

export default new (class HsrRedeemRepository {
    async getGameRecordCard(uid: string): Promise<IRedeemData> {
        try {
            const response = await axios({
                method: 'GET',
                url: HonkaiStarRail.HSR_USER_RECORD_API,
                params: { uid },
                headers: {
                    'User-Agent':
                        HonkaiStarRail.HSR_USER_AGENTS[
                            Math.floor(Math.random() * HonkaiStarRail.HSR_USER_AGENTS.length)
                        ],
                    'x-rpc-app_version': HonkaiStarRail.HSR_RPC_APP_VERSION,
                    'x-rpc-client_type': HonkaiStarRail.HSR_RPC_CLIENT_TYPE,
                },
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

    async redeemCode(input: IRedeemApiInput) {
        try {
            const response = await axios({
                url: HonkaiStarRail.HSR_REDEEM_API,
                method: 'GET',
                params: input,
                headers: {
                    'User-Agent':
                        HonkaiStarRail.HSR_USER_AGENTS[
                            Math.floor(Math.random() * HonkaiStarRail.HSR_USER_AGENTS.length)
                        ],
                    'x-rpc-app_version': HonkaiStarRail.HSR_RPC_APP_VERSION,
                    'x-rpc-client_type': HonkaiStarRail.HSR_RPC_CLIENT_TYPE,
                },
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
