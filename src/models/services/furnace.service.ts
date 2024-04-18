import { Between } from "typeorm";
import { dbSource } from "../../../db/dbSource";
import { Furnace, FurnaceInterface } from "../Furnace";
import { MonitoringDataInterface } from "../MonitoringData";

export class FurnaceService {
    private repository = dbSource.getRepository(Furnace);

    async saveFurnace(furnace: FurnaceInterface): Promise<void> {
        try {
            if (furnace.minTemp >= furnace.maxTemp) {
                throw new Error("Field minTemp should be lower than maxTemp.");
            }
            if (furnace.minTemp < 0 || furnace.maxTemp < 0) {
                throw new Error("Fields minTemp and maxTemp have to be greater than 0.");
            }
            await this.repository.save(furnace);
        } catch (err: any) {
            throw new Error(`Unable to create new record. Message: ${err}`);
        }
    }

    async findFurnaceById(id: number): Promise<Furnace[] | Furnace> {
        try {
            const furnace = await this.repository.findOne({
                where: {
                    id: id
                }
            })
            if (!furnace) {
                return [];
            }
            
            return furnace;
        } catch (err: any) {
            throw new Error(`Unable to find data with provided furnace: ${id}. Message: ${err.detail}`);
        }
    }

    async setTempLimitValue(furnaceId: number, field: string, value: number): Promise<void> {
        try {
            const furnace = await this.findFurnaceById(furnaceId);

            if (!furnace || (furnace instanceof Array)) {
                throw new Error("Cannot find furnace with provided id.");
            }
            if (field !== "minTemp" && field !== "maxTemp") {
                throw new Error(`There is no field with name: ${field}`);
            }
            if (value > 0) {
                furnace[field] = value;
            }

            await this.repository.save(furnace);
        } catch (err: any) {
            throw new Error(`Unable to set field ${field} to furnace with id: ${furnaceId}. Message: ${err}`);
        }
    }

    async setFanState(furnaceId: number, state: boolean): Promise<void> {
        try {
            const furnace = await this.findFurnaceById(furnaceId);

            if (!furnace || (furnace instanceof Array)) {
                throw new Error("Cannot find furnace with provided id.");
            }

            furnace.isFanOn = state;
            await this.repository.save(furnace);
        } catch (err: any) {
            throw new Error(`Unable to set fan state on furnace with id: ${furnaceId}. Message: ${err}`);
        }
    }
}