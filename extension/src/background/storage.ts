import { Storage } from "@plasmohq/storage"
import { type IAuthToken } from "../types";
const storage = new Storage()


export const saveToken = async (tokenData: IAuthToken) => {
    await storage.set("authToken", JSON.stringify(tokenData));
}

export const getToken = async (): Promise<IAuthToken | null> => {
    const data = await storage.get("authToken");
    if (!data) return null;
    try {
        return JSON.parse(data) as IAuthToken;
    } catch {
        console.error("Failed to parse auth token from storage");
        return null;
    }
}

export const removeToken = async () => {
    await storage.remove("authToken");
}

export default storage;
