const alphanumValid = (name) => {
    try {
        const nameRegex = /^(?! )[A-Za-z0-9 ]*(?<! )$/;
        return nameRegex.test(name);
    } catch (error) {
        console.error(error);
        return false;
    }
};

const isValidCoupon = (coupon) => {
    try {
        const couponRegex = /^[A-Za-z0-9%]+(?:-[A-Za-z0-9%]+)?$/;
        return couponRegex.test(coupon);
    } catch (error) {
        console.error(error);
        return false;
    }
};

const onlyNumbers = (str) => {
    try {
        const numbersOnlyRegex = /^[1-9][0-9]*(\.[0-9]+)?$/;
        return str.length > 0 && numbersOnlyRegex.test(str);
    } catch (error) {
        console.error(error);
        return false;
    }
};

const isFutureDate = (selectedDate) => {
    try {
        const selectedDateTime = new Date(selectedDate);
        const currentDate = new Date();
        return selectedDateTime > currentDate;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {
    alphanumValid,
    onlyNumbers,
    isFutureDate,
    isValidCoupon
};
