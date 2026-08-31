//! Step-1

// import { EventEmitter } from "./src/EventEmitter.js";
// const emitter = new EventEmitter();

// const handleLogin = (user) =>{
//     console.log(`Logged in user is ${user.name}`)
// }

// emitter.on("user:Login", handleLogin);

// emitter.once("user:Login", (user) =>{
//     console.log(`[once] Send email to ${user.email}`);
// })

// console.log("First emit is ");
// emitter.emit("user:Login", {name:"rahul"})

// console.log("Second emit is ");
// emitter.emit("user:Login", {name:"priya"})

// emitter.off("user:Login", handleLogin)

// console.log("Third emit is ");
// emitter.emit("user:Login", {name:"Amit"})



// STEP-2

import { CacheStore } from "./src/CacheStore.js";

const cache = new CacheStore();

console.log("--- 1. Basic Set & Mutation Protection Test ---");
const userProfile = {name :"Rahul" , role:"Developer"}
cache.set("user:101" , userProfile);


// External object modify karke dekhte hain
userProfile.name = "Hacked Name";
console.log("Cached User (Should remain Rahul):", cache.get("user:101"));

console.log("\n--- 2. TTL Auto-Expiration Test ---");
cache.set("temp:session", "JWT-TOKEN-999" , 1000);
console.log("Immediate Read:", cache.get("temp:session"));

setTimeout(() => {
  console.log("\n--- After 1.5 Seconds ---");
  console.log("Read Expired Key:", cache.get("temp:session")); // Should be null
  console.log("Cache Metrics:", cache.getStats());
}, 1500);