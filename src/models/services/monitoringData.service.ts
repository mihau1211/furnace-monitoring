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
            if (!monitoringData.furnaceId || !monitoringData.temperature) {
                throw new Error("Provided fields are incorrect.");
            }
            monitoringData.timestamp = correctTimestamp(monitoringData.timestamp);

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

    async findMonitoringDataByFurnace(furnaceId: number, from: Date | boolean, to: Date | boolean): Promise<Object> {
        try {
            const furnace = await getFurnace(furnaceId, this.furnaceService);

            let query = findByFurnaceAndDateFilter(furnace, from, to);
            
            const monitoringData = query === 0 ? await this.repository.find() : await this.repository.find(query);
            
            return {furnace, monitoringData};
        } catch (err: any) {
            throw new Error(`Unable to find data with provided furnaceId: ${furnaceId}. Message: ${err.detail}`);
        }
    }

    async findAverageForLastProvidedMinutesByFurnace(furnaceId: number, minutes: number): Promise<Object> {
        try {
            if (!minutes || typeof minutes !== 'number' || isNaN(minutes)) {
                minutes = 5;
            }

            const furnace = await getFurnace(furnaceId, this.furnaceService);

            const now = new Date();
            const from = new Date(now.getTime() - minutes * 60000);

            const average = await this.repository
                .createQueryBuilder('monitoring_data')
                .select("AVG(monitoring_data.temperature)", "average_temperature")
                .where('monitoring_data.furnaceId = :furnaceId', { furnaceId: furnaceId })
                .andWhere('monitoring_data.timestamp BETWEEN :from AND :now', { from: from, now: now })
                .getRawMany();

            if (!average) {
                throw new Error('Unable to get data.');
            }

            return {furnace, dateFrom: from, average};
        } catch (err: any) {
            throw new Error(`Unable to find data with provided furnaceId: ${furnaceId}. Message: ${err.detail}`);
        }
    }
}

function correctTimestamp(timestamp: number | Date | undefined | null) {
    if (!timestamp) {
        return new Date();
    } else if (timestamp && typeof timestamp === 'number') {
        return new Date(timestamp);
    }

    return timestamp;
}

function findByFurnaceAndDateFilter(furnace: Furnace, from: Date | boolean, to: Date | boolean): any {
    if (!furnace) {
        return 0;
    }

    if (from && to) {
        return {
            where: {
                furnace: furnace,
                timestamp: Between(from, to)
            },
            order: {
                timestamp: "ASC"
            }
        }
    } else {
        return {
            where: {
                furnace: furnace
            },
            order: {
                timestamp: "ASC"
            }
        }
    }
}

async function getFurnace(furnaceId: number, furnaceService: any): Promise<Furnace> {
    const furnace = await furnaceService.findFurnaceById(furnaceId);
    if (!furnace || (furnace instanceof Array)) {
        throw new Error("Cannot find furnace with provided id.");
    }

    return furnace;
}