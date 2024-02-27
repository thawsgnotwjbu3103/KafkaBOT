export class Misc {
    public static readonly PRIMARY_EMBED_COLOR = 0xeb86c6;
    public static readonly MATH_JS_API = 'http://api.mathjs.org/v4';
    public static readonly TIME_COLLECTOR = 100_000;
}

export class HonkaiStarRail {
    public static readonly CHECK_IN_ACT_ID = 'e202303301540311';
    public static readonly HOYOLAB_BASE_API = 'https://sg-public-api.hoyolab.com/event/luna/os';
    public static readonly HSR_USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 YaBrowser/20.9.0.933 Yowser/2.5 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36 OPR/74.0.3911.218',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0',
        'Mozilla/5.0 (Windows NT 6.1; ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 ',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36 Edg/101.0.1210.39 Agency/90.8.3027.28',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',
    ];
    public static readonly HSR_CHECKIN_CRON_PATTERN = '0 0 0 * * *';
    public static readonly HSR_REFERER = 'https://act.hoyolab.com/';
    public static readonly HSR_ORIGIN = 'https://act.hoyolab.com/';
    public static readonly HSR_RPC_APP_VERSION = '2.42.0';
    public static readonly HSR_RPC_CLIENT_TYPE = 4;
    public static readonly HSR_EXCLUDE_CODES = ['STARRAILGIFT'];
    public static readonly HSR_REDEEM_CRON_PATTERN = '*/30 * * * *';
    public static readonly HSR_REDEEM_API =
        'https://sg-hkrpg-api.hoyolab.com/common/apicdkey/api/webExchangeCdkeyHyl';
    public static readonly HSR_USER_RECORD_API =
        'https://bbs-api-os.hoyolab.com/game_record/card/wapi/getGameRecordCard';
}
