function getNum(num) {
    const type = typeof num;
    if (type === 'number') {
        return num;
    } else if (type === 'string') {
        return Number.parseInt(num);
    } else {
        throw new Error('Invalid type for number');
    }
}

export { getNum };