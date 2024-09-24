
export function isValidPhoneNumber(phoneNumber: string): boolean {
    // Check if the phone number is exactly 10 digits
    if (!/^\d{10}$/.test(phoneNumber)) {
        return false;
    }

    // Check if the phone number starts with a digit between 6 and 9
    if (!/^[6-9]/.test(phoneNumber)) {
        return false;
    }
    return true;
}