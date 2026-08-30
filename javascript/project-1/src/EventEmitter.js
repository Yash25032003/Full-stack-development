export class EventEmitter{
    constructor(){
        // saare events aur unke listners ko ek jagah store karne ke liye ye constructor
        // banaya hai
        this.events = {};
    }

    // event ko listen karne ke liye
    on(eventName , listner) {
     if(!this.events[eventName]){
        this.events[eventName] = [];
     }
     this.events[eventName].push(listner);
    }

    // event ko trigger or emit karne ke liye
    emit(eventName , ...args){
        //agar ye event exist nahi karta then return kar jao
        if(!this.events[eventName]){
            return;
        }
        // is event ke saare registered functions ko run karo
        const listners = [...this.events[eventName]];
        listners.forEach((listner)=>{
            listner(...args)
        })

    }

    // event se specific listner ko hatane ke liye
    off(eventName , listener){
        if(!this.events[eventName]) return;

        // filter use karke target listner ko array se nikal do
        this.events[eventName] = this.events[eventName].filter((text) => text !== listener)
    }

    // listner ko sirf ek baar chalane ke liye 
     once(eventName , listener){
        // ek temporary function banao 
        const wrapper = (...args) =>{
            // pehle khud ko off karo 
            this.off(eventName , wrapper);
            // phir original listener ko run karo
            listener(...args);
        }

        // wrapper ko register kar do
        this.on(eventName , wrapper);
    }
}