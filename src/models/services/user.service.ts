import { dbSource } from "../../../db/dbSource";
import { User, UserInterface } from "../User";

export class UserService {
    private repository = dbSource.getRepository(User);

    async saveUser(user: UserInterface): Promise<void> {
        try {
            if (!user.imei || !user.password) {
                throw new Error("Missing required fields imei and password.");
            }

            await this.repository.save(user);
        } catch (err: any) {
            throw new Error(`Unable to create new record. Message: ${err}`);
        }
    }

    async findById(userId: number): Promise<User> {
        try {
            if (!userId) {
                throw new Error("Missing required field userId");
            }

            const user = await this.repository.find({
                where: {
                    id: userId
                }
            })

            if (user.length <= 0) {
                throw new Error(`Unable to find user with id: ${userId}`);
            }

            return user[0];
        } catch (err: any) {
            throw new Error(`Unable to find user. Message: ${err}`);
        }
    }

    async login(imei: string, password: string) :Promise<User> {
        try {
            if (!imei || !password) {
                throw new Error(`Missing required imei and password`);
            }

            const user = await this.repository.find({
                where: {
                    imei,
                    password
                }
            })

            if (user.length <= 0) {
                throw new Error(`Imei or password are not correct.`);
            }

            return user[0];
        } catch (err: any) {
            throw new Error(`Unable to login. Message: ${err}`);
        }
    }
}