/**
 * @description 계약 관련 모듈 pinia
 */
import { defineStore } from 'pinia';
import { getAxiosData } from '@/assets/js/function';

type Nullable<T> = T | null;

interface ConInfo {
    conDt       : string;
    deliDt      : string;
    insHour     : number;
    insMinute   : number;
    person      : string;
    payGb       : string;
    amt         : Nullable<number>;
    memo        : string;
}

interface MsgInfo {
    deliDt  : string;
    insTime : string;
}

/**
 * @description 계약서 정보
 */
const getConInfo = (): ConInfo => {
    return {
        conDt       : new Date(),
        deliDt      : '',
        insHour     : 0,
        insMinute   : 0,
        person      : '',
        payGb       : '001',
        amt         : 0,
        memo        : ''
    }
}

const getMsgInfo = (): MsgInfo  => {
    return {
        deliDt  : '',
        insTime : ''
    }
}

interface State {
    conInfo : ConInfo;
    msg     : MsgInfo;
}

export const useContractStore = defineStore('contract', {
    state: (): State => ({
        conInfo : getConInfo(),
        msg     : getMsgInfo(),
        person  : []
    }),
    actions : {
        async getData(params)
        {
            try
            {
                const instance  = await getAxiosData();
                const res       = await instance.post(`https://data.planorder.kr/estiV1/getConData`, params);

                console.log(res);

                this.person                 = res.data['person'];
                this.conInfo['person']      = res.data['person'][0]['value'];
                this.conInfo['insHour']     = res.data['insTime']['hours'];
                this.conInfo['insMinute']   = res.data['insTime']['minutes'];

                // if(res.data['insTime']['hours'] !== 0 || res.data['insTime']['minutes'] !== 0)
                // {
                //     this.conInfo['insTime'] = new Date(`${date} ${String(res.data['insTime']['hours']).padStart(2, "0")}:${res.data['insTime']['minutes']}`);
                // }
            }
            catch(e)
            {
                console.log(e);
            }
        },
        getMsgSet(msg: string, id: string)
        {
            this.msg        = getMsgInfo();
            this.msg[id]    = msg;
        },
        getReset()
        {
            this.conInfo    = getConInfo();
            this.msg        = getMsgInfo();
        }
    }
});