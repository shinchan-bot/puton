import { MasterAttrs } from "../utils/Enums/master";
import { failureResponse, successResponse } from "../utils/helper/api-handler";
import logger from "../utils/logger";


class MasterService {

   public masterDataHandler = async (attr: MasterAttrs ) => {
        try {
            let finalResult: any;
            switch (attr) {
                case MasterAttrs.Header:
                    finalResult = await this.fetchHeader();
            }
            return successResponse(finalResult);
        } catch (error) {
            logger.error(error);
            return failureResponse(error);
        }
    };


    private fetchHeader = async () => {
        try {
            
        } catch (error) {
            return failureResponse(error);
        }
    }
}

export default new MasterService();