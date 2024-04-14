import { dbSource } from "../../../db/dbSource";
import { MonitoringData } from "../MonitoringData";

export class MonitoringDataService {
    private repository = dbSource.getRepository(MonitoringData);

    async saveMonitoringData(monitoringData: any): Promise<void> {
        try {
            await this.repository.save(monitoringData);
        } catch (err: any) {
            throw new Error(`Unable to create new record into table ${err.table}. Message: ${err}`);
        }
    }

    async findMonitoringDataByFurnace(furnace: string): Promise<MonitoringData[]> {
        try {
            const monitoringData = await this.repository.findBy({
                furnace: furnace
            })
            
            return monitoringData;
        } catch (err: any) {
            throw new Error(`Unable to find data in table ${err.table} with provided furnace: ${furnace}. Message: ${err.detail}`);
        }
    }
}