import { userServiceClient } from "@/shared/lib/api-client";
import type { UserProfile } from "../types/profile.types"; 


export async function getUserById(userId:number): Promise<UserProfile>{
    const result = await userServiceClient.get(`/${userId}`)
    return result.data;
}

