import { Between } from "typeorm";
import { dbSource } from "../../../db/dbSource";
import { MonitoringData, MonitoringDataInterface } from "../MonitoringData";
import { Furnace } from "../Furnace";
import { FurnaceService } from "./furnace.service";

export class MonitoringDataService {
    private repository = dbSource.getRepository(MonitoringData);
    private furnaceService = new FurnaceService();

    async saveMonitoringData(monitoringData: MonitoringDataInterface): Promise<void> {
        try {
            if (!monitoringData.furnaceId) {
                throw new Error("Field furnaceId has to be provided.")
            }

            const furnace = await this.furnaceService.findFurnaceById(monitoringData.furnaceId);
            if (!furnace || (furnace instanceof Array)) {
                throw new Error("Cannot find furnace with provided id.");
            }

            monitoringData.furnace = furnace;
            await this.repository.save(monitoringData);
        } catch (err: any) {
            throw new Error(`Unable to create new record. Message: ${err}`);
        }
    }

    async findMonitoringDataByFurnace(furnaceId: number, from: Date, to: Date): Promise<Object> {
        try {
            const furnace = await this.furnaceService.findFurnaceById(furnaceId);
            if (!furnace || (furnace instanceof Array)) {
                throw new Error("Cannot find furnace with provided id.");
            }
            
            const monitoringData = await this.repository.find({
                where: {
                    furnace: furnace,
                    timestamp: Between(from, to)
                },
                order: {
                    timestamp: "ASC"
                }
            });
            
            return {furnace, monitoringData};
        } catch (err: any) {
            throw new Error(`Unable to find data with provided furnaceId: ${furnaceId}. Message: ${err.detail}`);
        }
    }
}