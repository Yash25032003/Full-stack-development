// Custom EventEmittor Notes:

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

