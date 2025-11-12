import { saveToken, getToken, removeToken } from "./storage"
import { type IAuthToken } from "../types";

declare const chrome: any
declare const browser: any

export const setupStorageListener = () => {
  const runtime = typeof chrome !== "undefined" ? chrome.runtime : browser.runtime

  if (!runtime || !runtime.onMessage) {
    console.error("Runtime messaging API not found")
    return
  }

  runtime.onMessage.addListener(
    async (message: any, sender: any, sendResponse: (response?: any) => void) => {
      try {
        switch (message.action) {
          case "getToken":
            const token = await getToken()
            console.log("Getting token in background:", message);
            sendResponse({ success: true, token })
            break
          case "saveToken":
            await saveToken(message);
            sendResponse({ success: true })
            break
          case "removeToken":
            await removeToken()
            sendResponse({ success: true })
            break
          default:
            sendResponse({ success: false, error: "Unknown action" })
        }
      } catch (err: any) {
        sendResponse({ success: false, error: err.message })
      }
      return true // keep the message channel open for async response
    }
  )
}