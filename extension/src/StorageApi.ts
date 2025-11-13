import { type IAuthToken } from "./types" // אם יש קובץ types.ts נפרד

const sendMessageToBackground = <T = any>(message: any): Promise<T> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response)
    })
  })
}

export const saveToken = async (tokenData: IAuthToken): Promise<boolean> => {
  const response = await sendMessageToBackground({
    action: "saveToken",
    token: tokenData,
  })
  return response?.success || false
}

export const getToken = async (): Promise<IAuthToken | null> => {
  const response = await sendMessageToBackground({
    action: "getToken",
  })
  return response?.success ? (response.token as IAuthToken) : null
}

export const removeToken = async (): Promise<boolean> => {
  const response = await sendMessageToBackground({
    action: "removeToken",
  })
  return response?.success || false
}