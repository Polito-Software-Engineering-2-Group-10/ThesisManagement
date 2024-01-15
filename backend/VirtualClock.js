import dayjs from "dayjs";
import { virtualClockTable } from "./dbentities.js";
class VirtualClock {
    constructor(offset = 0) {
        this.offset = offset;
    }
    async setOffset(offset) {
        this.offset = offset;
        await virtualClockTable.set(this.getSqlDate());
    }
    async resetOffset() {
        this.offset = 0;
        await virtualClockTable.delete();
    }
    getSqlDate() {
        let current_date = dayjs.unix((dayjs().unix() + this.offset));
        let current_date_string = current_date.format('YYYY-MM-DD HH:mm:ss.SSSZ');
        return current_date_string;
    }
}


const virtualClock = new VirtualClock(0);

export default virtualClock;