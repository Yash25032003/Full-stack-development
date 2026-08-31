// Custom EventEmittor Notes:

//! STEP-1
//! 1. Why we built this ?
// node.js aur browser ke event driven system ka architecture samajhne ke liye bina external libraries ke 

// Project 1: Custom EventEmitter — Short Revision Notes

// Core Goal & Purpose

// Node.js aur Browser ke event-driven system ka base architecture samajhna.

// External libraries ke bina pure JS engine mechanics, memory references, aur closures master karna.

// Key JS Concepts Learned

// Objects as HashMaps: eventName ko key ki tarah store karke fast O(1) lookup paana.

// First-Class Functions: Functions ko normal values/data ki tarah array mein store karna.

// Pass-by-Reference: Unsubscribe (off) karne ke liye exact memory address match hona zaroori hai (fn1 === fn2). Naya anonymous function (() => {}) match nahi hota.

// Rest & Spread (...args & [...]): Dynamic parameters accept karna aur array mutation bugs se bachne ke liye safe shallow copy banana.

// Closures: once() ka inner wrapper function outer scope ke variables (eventName, listener) ko execution ke baad bhi yaad rakhta hai.

// Method-by-Method Logic

// constructor(): Central memory store this.events = {} initialize karta hai (Structure: { "eventName": [fn1, fn2] }).

// on(): Key exist karti hai ya nahi check karta hai. Agar nahi, toh [] initialize karke function memory reference push karta hai.

// emit(): Shallow copy [...listeners] banata hai aur ...args unpack karke array ke saare functions order-wise run karta hai.

// off(): filter() se exact memory reference matching function remove karta hai (Memory leaks bachane ke liye).

// once(): Temporary wrapper closure banata hai jo pehle khud ko off() (delete) karta hai, phir original callback execute karta hai.

// Interview Traps & Common Bugs

// Array Mutation Trap: emit() ke loop ke dauran agar once() chal kar khud ko delete karega, toh original array mutate ho jayega aur agla function skip ho jayega. Fix: Loop se pehle shallow copy [...array] banao.

// Reference Trap: off() mein wahi exact function reference pass karna padega jo on() mein diya tha, warna filter match nahi kar payega.


//!STEP-2:
/* ==========================================================================
   📌 STEP 2: CACHESTORE (TTL, MAP, & MUTATION DEFENSE) - REVISION NOTES
   ==========================================================================
   Goal: High-speed in-memory caching engine with automatic TTL cleanup,
   memory leak prevention, and object mutation protection.
   ========================================================================== */

/**
 * 🛠️ CORE JS CONCEPTS MASTERED:
 * 1. Map vs Plain Object: Map frequent reads/writes ke liye optimized O(1) 
 *    performance deta hai aur dynamic keys ke saath best works karta hai.
 * 2. Macrotask Management: `setTimeout` callbacks ko Macrotask Queue mein daalta hai. 
 *    Active timers track/clear na karne se memory leaks hote hain.
 * 3. Mutation Defense (`structuredClone`): JS objects pass-by-reference hote hain. 
 *    Set & Get dono waqt clone karne se cached data outside modifications se safe rehta hai.
 * 4. State & Metrics Isolation: Hits/Misses track karna without side-effects.
 */

/* ==========================================================================
   🧠 ARCHITECTURAL & METHOD BREAKDOWN
   ========================================================================== */

// 1. constructor()
// - Data Store: `this.store = new Map()` (Actual cached key-values).
// - Timers Store: `this.timers = new Map()` (Timer IDs stored against keys).
// - Metrics: `this.hits = 0`, `this.misses = 0`.

// 2. set(key, value, ttlInMs)
// - STEP A (Timer Overwrite Fix): `if (this.timers.has(key))` -> `clearTimeout()` run 
//   karke purana active timer cancel karo. Prevent premature auto-deletion!
// - STEP B (Mutation Defense): Objects ko `structuredClone(value)` karke store karo.
// - STEP C (TTL Handling): `setTimeout(() => this.delete(key), ttlInMs)` set karke 
//   uska `timerId` `this.timers` map mein save kar lo.

// 3. get(key)
// - Key missing: `this.misses++` and return `null`.
// - Key present: `this.hits++` and return `structuredClone(value)` (Read-only protection).

// 4. delete(key)
// - Active timer cleanup: `clearTimeout(timerId)` & `timers.delete(key)`.
// - Map deletion: `this.store.delete(key)`.

// 5. clear()
// - Complete Reset: `this.timers.forEach(id => clearTimeout(id))` chala kar saare 
//   pending background timers cancel karo (Avoids memory leaks).
// - Both Maps clear karo (`store`, `timers`) & reset counters (`hits`, `misses`).

/* ==========================================================================
   ⚡ INTERVIEW TRAPS & EDGE CASES
   ==========================================================================
   ❓ Q1: Re-set karne par purana timer cancel na karein toh kya hoga?
   💡 Ans: Purana Macrotask callback fire hokar naye dataset ko uske TTL 
          expire hone se pehle hi delete kar dega (Premature Auto-deletion Bug).

   ❓ Q2: `structuredClone()` vs Shallow Copy (`{...obj}`)?
   💡 Ans: `{...obj}` top-level properties copy karta hai lekin nested objects 
          ko reference hi rehne deta hai. Deep object isolation ke liye 
          `structuredClone()` mandatory hai.
   ========================================================================== */








   /* ==========================================================================
   📌 STEP 3: TASKQUEUE (CONCURRENCY LIMITER WITH PROMISES) - REVISION NOTES
   ==========================================================================
   Goal: Async operations ko queue mein hold karke max N parallel execution
   limit (concurrency) enforce karna taaki backend server crash/overload na ho.
   ========================================================================== */

/**
 * 🛠️ CORE JS CONCEPTS JO HUMNE SIKHE:
 * 1. Deferred Promise Resolution: `push()` ke andar naya Promise bana kar
 *    uske `resolve` aur `reject` handlers ko queue object mein capture karna.
 * 2. FIFO Queue (First-In-First-Out): Array `.push()` (enqueue) aur `.shift()`
 *    (dequeue) se execution order maintain rakhna.
 * 3. Microtask Lifecycle (`.finally()`): Task success ho ya fail, slot free 
 *    karna aur next task ko scheduling ke liye trigger karna.
 * 4. Central Worker Pattern: Slot availability ke base par tasks release karna.
 */

/* ==========================================================================
   🧠 METHODS KA DETAILED BREAKDOWN & LOGIC
   ========================================================================== */

// 1. constructor(concurrency = 2)
// - Limit: `this.concurrency` (Ek saath max kitne tasks chal sakte hain).
// - Counter: `this.running = 0` (Abhi active running tasks ki count).
// - Queue: `this.queue = []` (Pending tasks objects `{ task, resolve, reject }`).

// 2. push(task)
// - Direct Call Roko: Function ko immediately execute nahi karte (`task()` nahi karte).
// - Deferred Promise: Naya `Promise` return karke uske `{ task, resolve, reject }` 
//   handlers ko `this.queue` array mein hold karte hain.
// - Trigger Worker: Immediately `this.process()` call karte hain.

// 3. process() - Central Worker Loop
// - Condition Check: `while (this.running < this.concurrency && this.queue.length > 0)`
// - Dequeue: `this.queue.shift()` se front task object nikaalte hain.
// - Counter Increment: `this.running++` (Slot occupy hua).
// - Execution & Cleanup:
//     - `task()` execute karte hain.
//     - `.then(resolve)` / `.catch(reject)` se original caller ko result/error dete hain.
//     - `.finally()` mein `this.running--` (slot khali) aur dobara `this.process()` 
//       call karke next pending task ko start karte hain.

/* ==========================================================================
   ⚡ INTERVIEW TRAPS & EDGE CASES
   ==========================================================================
   ❓ Q1: `push()` karte waqt task turant execute kyun ho jata hai agar galti se
          `task()` likh dein?
   💡 Ans: `task` ek function reference (`() => Promise`) hona chahiye. Agar `task()` 
          pass karenge toh function turant execute ho jayega aur `push()` limit 
          enforce hi nahi kar payega.

   ❓ Q2: Task reject/fail hone par `finally()` na lagayein toh kya hoga?
   💡 Ans: Agar koi async task crash hoga, toh `this.running--` decrement nahi 
          hoga. Slot permanently block ho jayega aur baki ke queued tasks hamesha 
          ke liye hang (unprocessed) reh jayenge.
   ========================================================================== */