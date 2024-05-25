import { dbSource } from "../../../db/dbSource";
import { Furnace, FurnaceInterface } from "../Furnace";
import { UserService } from "./user.service";

export class FurnaceService {
    private repository = dbSource.getRepository(Furnace);
    private userService = new UserService();

    async saveFurnace(furnace: FurnaceInterface): Promise<void> {
        try {
            if (!furnace.ownerId || !furnace.maxTemp || !furnace.minTemp || !furnace.name) {
                throw new Error("Missing required fields name, userId, minTemp, maxTemp");
            }
            if (furnace.minTemp >= furnace.maxTemp) {
                throw new Error("Field minTemp should be lower than maxTemp.");
            }
            if (furnace.minTemp < 0 || furnace.maxTemp < 0) {
                throw new Error("Fields minTemp and maxTemp have to be greater than 0.");
            }
            furnace.isFanOn = (furnace.isFanOn === null || furnace.isFanOn === undefined) ? false : furnace.isFanOn;

            const user = await this.userService.findById(furnace.ownerId);

            if (!user) {
                throw new Error('Unable to find user.')
            }
            furnace.owner = user;

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

    async findFurnacesByOwnerId(ownerId: number): Promise<Furnace[] | Furnace> {
        try {
            const user = await this.userService.findById(ownerId);
            if (!user) {
                throw new Error('Unable to find furnace');
            }

            const furnaces = await this.repository.find({
                where: {
                    owner: user
                }
            })
            if (!furnaces) {
                return [];
            }
            
            return furnaces;
        } catch (err: any) {
            throw new Error(`Unable to find furnaces for provided ownerId : ${ownerId}. Message: ${err.detail}`);
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
            if (field === "minTemp" && furnace.maxTemp <= value) {
                throw new Error('Value of minTemp has to be lower than current maxTemp');
            }
            if (field === "maxTemp" && furnace.minTemp >= value) {
                throw new Error('Value of maxTemp has to be grater than current minTemp');
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