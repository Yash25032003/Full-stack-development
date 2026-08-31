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