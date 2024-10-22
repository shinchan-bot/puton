import axios from "axios";

export const sendOtpPost = async (otp: number, phone_number: string, user?: string) => {
    try {
        /** process.env is not working fix it ASAP */
        if (user === (process.env.PUTON_USER || "testing")|| 'coustomer') { // remove coustomer after testing
            console.log(`Development mode: Bypassing OTP service and using static OTP: ${otp}`);
            return { success: true, message: 'OTP sent successfully' };
        }

        const data = JSON.stringify({
            "route": "dlt",
            "sender_id": process.env.OTP_SENDER_ID,
            "message": process.env.OTP_MESSAGE_ID,
            "variables_values": otp,
            "flash": 0,
            "numbers": phone_number
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.OTP_SERVICE_URL,
            headers: {
                'Authorization': process.env.OTP_SERVICE_TOKEN,
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config);

        // Check if the OTP service responded with success
        if (response.data.return === "success") {
            return { success: true, message: 'OTP sent successfully' };
        } else {
            return { success: false, message: 'Failed to send OTP' };
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        return { success: false, message: 'OTP service is currently unavailable. Please try again later.' };
    }
};
