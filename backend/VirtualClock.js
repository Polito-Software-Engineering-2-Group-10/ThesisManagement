import dayjs from "dayjs";
class VirtualClock {
    constructor(offset = 0) {
        this.offset = offset;
    }
    setOffset(offset) {
        this.offset = offset;
    }
    resetOffset() {
        this.offset = 0;
    }
    getSqlDate() {
        let current_date = dayjs.unix((dayjs().unix() + this.offset));
        let current_date_string = current_date.format('YYYY-MM-DD HH:mm:ss.SSSZ');
        return current_date_string;
    }
}


const virtualClock = new VirtualClock(0);

export default virtualClock;