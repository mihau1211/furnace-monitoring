import { Between } from "typeorm";
import { format } from "date-fns";
import { dbSource } from "../../../db/dbSource";
import { MonitoringData, MonitoringDataInterface } from "../MonitoringData";

export class MonitoringDataService {
    private repository = dbSource.getRepository(MonitoringData);

    async saveMonitoringData(monitoringData: MonitoringDataInterface): Promise<void> {
        try {
            await this.repository.save(monitoringData);
        } catch (err: any) {
            throw new Error(`Unable to create new record. Message: ${err}`);
        }
    }

    async findMonitoringDataByFurnace(furnace: string, from: Date, to: Date): Promise<MonitoringDataInterface[]> {
        try {
            const monitoringData = await this.repository.find({
                where: {
                    furnace: furnace,
                    timestamp: Between(from, to)
                }
            })
            
            return monitoringData;
        } catch (err: any) {
            throw new Error(`Unable to find data with provided furnace: ${furnace}. Message: ${err.detail}`);
        }
    }
}