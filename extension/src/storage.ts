import { Storage } from "@plasmohq/storage"

const storage = new Storage()


export interface IAuthToken {
    access_token: string;
    token_type: string;
    username: string;
}

export const saveToken = async (tokenData: IAuthToken) => {
    await storage.set("authToken", JSON.stringify(tokenData));
}

export const getToken = async (): Promise<IAuthToken | null> => {
    const data = await storage.get("authToken");
    if (!data) return null;
    try {
        return JSON.parse(data) as IAuthToken;
    } catch {
        return null;
    }
}

export const removeToken = async () => {
    await storage.remove("authToken");
}

export default storage;