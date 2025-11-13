import { setupStorageListener } from "./StorageListener"
import { monitorWebRequestsForUser } from "./WebReqestListener"


console.log("Background script running");
setupStorageListener();

const username = "a"; 
monitorWebRequestsForUser(username);


/**
 * Authentication:
 * First time username+password,
 * Then api key, 
 * Second time fingerprint
 * Then jwt
 * Mix it all together
 * Also I need somehow to make fastapi ssl
 * After authentication, receiving the regex for listening
 * Should the user login?
 */