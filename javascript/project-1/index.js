//! Event Emitter index.js

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



//! CacheStore index.js

// import { CacheStore } from "./src/CacheStore.js";

// const cache = new CacheStore();

// console.log("--- 1. Basic Set & Mutation Protection Test ---");
// const userProfile = {name :"Rahul" , role:"Developer"}
// cache.set("user:101" , userProfile);


// // External object modify karke dekhte hain
// userProfile.name = "Hacked Name";
// console.log("Cached User (Should remain Rahul):", cache.get("user:101"));

// console.log("\n--- 2. TTL Auto-Expiration Test ---");
// cache.set("temp:session", "JWT-TOKEN-999" , 1000);
// console.log("Immediate Read:", cache.get("temp:session"));

// setTimeout(() => {
//   console.log("\n--- After 1.5 Seconds ---");
//   console.log("Read Expired Key:", cache.get("temp:session")); // Should be null
//   console.log("Cache Metrics:", cache.getStats());
// }, 1500);


//! TaskQueue index.js

import { TaskQueue } from "./src/TaskQueue.js";

// concurrency limit of 2 (ek time par max 2 task)
const queue = new TaskQueue(2);

// Mock async api
const createAsyncTask = (id , delayMs) =>{
    return() => new Promise((resolve) =>{
        console.log(`[START] Task ${id} started (takes ${delayMs}ms)`);
        setTimeout(() =>{
            console.log(`[DONE]  Task ${id} completed`);
            resolve(`Result from Task ${id}`)
        }, delayMs);
    })
}

console.log("--- Pushing 5 Tasks (Concurrency = 2) ---");

// pushing 5 tasks
queue.push(createAsyncTask(1, 1000)).then((res) => console.log(`Output: ${res}`));
queue.push(createAsyncTask(2, 500)).then((res) => console.log(`Output: ${res}`));
queue.push(createAsyncTask(3, 300)).then((res) => console.log(`Output: ${res}`));
queue.push(createAsyncTask(4, 400)).then((res) => console.log(`Output: ${res}`));
queue.push(createAsyncTask(5, 200)).then((res) => console.log(`Output: ${res}`));

