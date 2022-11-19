import User from "../models/User";
import { userRepository } from "../repositories/user-repository";
import { isEmail } from "../validation/input-validation";
import { v4 as uuid } from "uuid";

export const userService = {
	async getUserById(userId: string): Promise<User | null> {
		const user = await userRepository.getUserById(userId);
		return user;
	},
	async createUser(name: string, username: string, email: string): Promise<User | null> {
		if(!isEmail(email)){
			return null;
		}
		const today = new Date(new Date().toUTCString());
		const id = uuid();
		const user: User = {
			userId: id,
			name: name,
			username: username,
			email: email,
			signupDate: today,
		}
		return userRepository.createUser(user);
	},
	async updateUser(userId: string, name: string, username: string): Promise<User | null> {
		if(!userId){
      return null;
    }
		return userRepository.updateUser(userId, name, username);
	},
	async deleteUser(userId: string): Promise<User | null> {
		const user = await userRepository.deleteUser(userId);
		return user;
	},
}
