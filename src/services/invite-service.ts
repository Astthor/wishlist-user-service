import { createToken, getTokenObject } from "./jwt-service";
import { userService } from "./user-service";
import { v4 as uuid } from "uuid";
import User from "../models/User";
import InviteToken from "../models/InviteToken";
import { inviteRepository } from "../repositories/invite-repository";
import { sendEmailToEmailServer } from "./email-server-service";
import { getFriendStatus } from "../models/enums/FriendStatus";


export const inviteService = {
	async sendInvitation(userId: string, friendEmail: string): Promise<boolean> {
		const inviteTokenObject: InviteToken = {
			inviteUserId: userId,
			friendEmail: friendEmail,
			friendId: uuid()
		}
		const token = createToken(inviteTokenObject);
		const inviteFromUser = await userService.getUserById(userId);
		if(!inviteFromUser) {
			throw new Error('userId sending invitation was not found!');
		}
		const dateString = new Date().toUTCString();	
		const tempFriend: User = {
			userId: inviteTokenObject.friendId,
			name: "TEMP_"+friendEmail,
			username: "TEMP_"+friendEmail,
			email: friendEmail,
			signupDate: new Date(dateString)
		};
		const tempUser = await inviteRepository.createTempFriend(userId, tempFriend);
		if(tempUser.email === friendEmail){
			return await sendEmailToEmailServer(inviteFromUser, friendEmail, token);
		} else {
			throw new Error('Could not create temporary friend with email: ' + friendEmail);
		}
	},
	async acceptInvitation(token: string, name: string, username: string) {
		const tokenObject = getTokenObject(token);
		if(!token){
			return "INVALID TOKEN";
		}
		try {
			const user: User = {
				userId: tokenObject.friendId,
				name: name,
				username: username,
				email: tokenObject.friendEmail,
				signupDate: new Date(new Date().toUTCString())
			}
			const oldStatus = getFriendStatus("INVITED");
			const newStatus = getFriendStatus("ACCEPTED");
			const updatedFriend = await inviteRepository.updateTempFriend(tokenObject.inviteUserId, user, oldStatus, newStatus);
			if(!updatedFriend || (updatedFriend.userId !== tokenObject.friendId)){
				throw new Error("Couldn't save user into database! Repo returned: " + JSON.stringify(updatedFriend));
			}
			return updatedFriend;
		} catch (e) {
			console.log("Error in invitationService.acceptInvitation: + " + e.message);
			throw new Error(e.message);
		}

	}
}