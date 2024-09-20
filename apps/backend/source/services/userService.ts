import { failureResponse, successResponse } from "../utils/helper/api-handler";
import logger from "../utils/logger";


class UserService {

    aggregatedDataHandler = async (startDate: any, endDate: any) => {
        try {
            const matchStage: any = {};
            return successResponse(true);
        } catch (error) {
            logger.error(error);
            return failureResponse(error);
        }
    };
}

export default new UserService();