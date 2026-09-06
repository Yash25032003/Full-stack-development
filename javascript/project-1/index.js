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

// import { TaskQueue } from "./src/TaskQueue.js";

// // concurrency limit of 2 (ek time par max 2 task)
// const queue = new TaskQueue(2);

// // Mock async api
// const createAsyncTask = (id , delayMs) =>{
//     return() => new Promise((resolve) =>{
//         console.log(`[START] Task ${id} started (takes ${delayMs}ms)`);
//         setTimeout(() =>{
//             console.log(`[DONE]  Task ${id} completed`);
//             resolve(`Result from Task ${id}`)
//         }, delayMs);
//     })
// }

// console.log("--- Pushing 5 Tasks (Concurrency = 2) ---");

// // pushing 5 tasks
// queue.push(createAsyncTask(1, 1000)).then((res) => console.log(`Output: ${res}`));
// queue.push(createAsyncTask(2, 500)).then((res) => console.log(`Output: ${res}`));
// queue.push(createAsyncTask(3, 300)).then((res) => console.log(`Output: ${res}`));
// queue.push(createAsyncTask(4, 400)).then((res) => console.log(`Output: ${res}`));
// queue.push(createAsyncTask(5, 200)).then((res) => console.log(`Output: ${res}`));



// index.js
import { EventEmitter } from "./src/EventEmitter.js";
import { CacheStore } from "./src/CacheStore.js";
import { TaskQueue } from "./src/TaskQueue.js";

// 1. Teeno modules ke instances initialize karo
const eventBus = new EventEmitter();
const cache = new CacheStore();
const queue = new TaskQueue(2); // Max 2 parallel async API calls allowed

// ==========================================================================
// 2. EVENT SYSTEM LISTENERS (Logging & Monitoring)
// ==========================================================================
eventBus.on("cache:hit", ({ key }) => {
  console.log(`⚡ [EVENT - CACHE HIT] Fast return for: ${key}`);
});

eventBus.on("cache:miss", ({ key }) => {
  console.log(`🔍 [EVENT - CACHE MISS] Data missing for: ${key}. Queuing task...`);
});

eventBus.on("task:start", ({ userId }) => {
  console.log(`🚀 [EVENT - TASK START] Fetching API for User: ${userId}`);
});

eventBus.on("task:complete", ({ userId, data }) => {
  console.log(`✅ [EVENT - TASK COMPLETE] Received data for User: ${userId}`);
});

// ==========================================================================
// 3. INTEGRATION PIPELINE: Fetch User Profile
// ==========================================================================
function getUserProfile(userId) {
  const cacheKey = `user:${userId}`;

  // STEP A: Cache Check (O(1) Fast Path)
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    eventBus.emit("cache:hit", { key: cacheKey });
    return Promise.resolve(cachedData);
  }

  eventBus.emit("cache:miss", { key: cacheKey });

  // STEP B: Queue Task (Concurrency Limited to 2)
  return queue.push(() => {
    return new Promise((resolve) => {
      eventBus.emit("task:start", { userId });

      // Simulated Async API Call (Takes 600ms)
      setTimeout(() => {
        const fetchedData = { userId, name: `User_${userId}`, timestamp: Date.now() };

        // STEP C: Save in Cache with 2000ms TTL
        cache.set(cacheKey, fetchedData, 2000);

        eventBus.emit("task:complete", { userId, data: fetchedData });
        resolve(fetchedData);
      }, 600);
    });
  });
}

// ==========================================================================
// 4. TEST SUITE EXECUTION
// ==========================================================================
console.log("=== 🧪 PHASE 1 SYSTEM INTEGRATION TEST ===");

// Scenario 1: Simultaneously 4 users request data
// Concurrency 2 hone ki wajah se sirf User 1 aur User 2 pehle API hit karenge
getUserProfile(101);
getUserProfile(102);
getUserProfile(103);
getUserProfile(104);

// Scenario 2: 200ms baad User 101 dobara request karta hai (Instant Cache Hit)
setTimeout(() => {
  console.log("\n--- Requesting User 101 again (Within TTL) ---");
  getUserProfile(101).then((data) => {
    console.log("Retrieved Data:", data);
  });
}, 200);

// Scenario 3: 2.5s baad User 101 request karta hai (TTL Expire -> Cache Miss -> Re-queue)
setTimeout(() => {
  console.log("\n--- Requesting User 101 after 2.5s (Post TTL Expiry) ---");
  getUserProfile(101).then((data) => {
    console.log("Retrieved Data after re-fetch:", data);
    console.log("\n=== Final System Stats ===");
    console.log("Cache Stats:", cache.getStats());
  });
}, 2500);