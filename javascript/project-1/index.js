import { EventEmitter } from "./src/EventEmitter.js";
const emitter = new EventEmitter();

const handleLogin = (user) =>{
    console.log(`Logged in user is ${user.name}`)
}

emitter.on("user:Login", handleLogin);

emitter.once("user:Login", (user) =>{
    console.log(`[once] Send email to ${user.email}`);
})

console.log("First emit is ");
emitter.emit("user:Login", {name:"rahul"})

console.log("Second emit is ");
emitter.emit("user:Login", {name:"priya"})

emitter.off("user:Login", handleLogin)

console.log("Third emit is ");
emitter.emit("user:Login", {name:"Amit"})
