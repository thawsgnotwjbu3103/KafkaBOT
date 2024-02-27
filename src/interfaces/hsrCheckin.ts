export interface IHSRCheckin {
    retcode: number;
    message: string;
    data: IHSRCheckinData | null;
}

export interface IHSRInfo {
    retcode: number;
    message: string;
    data: IHSRInfoData | null;
}

export interface IHSRAward {
    retcode: number;
    message: string;
    data: IAwardData | null;
  }

interface IHSRCheckinData {
    code: string;
    risk_code: number;
    gt: string;
    challenge: string;
    success: number;
    is_risk: boolean;
}

interface IHSRInfoData {
    total_sign_day: number;
    today: string;
    is_sign: boolean;
    is_sub: boolean;
    region: string;
    sign_cnt_missed: number;
    short_sign_day: number;
}

interface IAward {
    icon: string;
    name: string;
    cnt: number;
  }
  
  interface IShortExtraAward {
    has_extra_award: boolean;
    start_time: string;
    end_time: string;
    list: IList[];
    start_timestamp: string;
    end_timestamp: string;
  }
  
  interface IAwardData {
    month: number;
    awards: IAward[];
    biz: string;
    resign: boolean;
    short_extra_award: IShortExtraAward;
  }

  interface IList {
    icon: string;
    name: string;
    cnt: number;
    sign_day: number;
    high_light: boolean;
  }
