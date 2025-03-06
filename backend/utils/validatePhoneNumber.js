import libphonenumber from "google-libphonenumber";
const phoneUtilInstance = libphonenumber.PhoneNumberUtil.getInstance();

export const validatePhoneNumber = (phoneNumber, countryCode) => {
    try {
        const number = phoneUtilInstance.parseAndKeepRawInput(phoneNumber, countryCode);
        return phoneUtilInstance.isValidNumber(number);
    } catch (error) {
        return false;
    }
}