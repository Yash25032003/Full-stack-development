export class CacheStore{
    constructor(){
        // main cache store
        this.store = new Map();

        // timer store : active setTimeout id ko map karenge
        this.timers = new Map();

        // performance matrix
        this.hits = 0;
        this.misses = 0;
    }

    // cache me key value store karne ke liye

    set(key, value , ttlInMs=null){
        // step-1 : agar iss key ka pehle se koi timer chal raha hai to usse cancel kar do
        if(this.timers.has(key)){
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }

        // step-2 :Object value ko store karo

        const safeValue = typeof value === "object" && value !== null ? structuredClone(value): value;
        this.store.set(key, safeValue);

        // step-3 ttl handling

        if(ttlInMs && typeof ttlInMs === "number" && ttlInMs > 0){
            // background microtask set karo
            const timerId = setTimeout(()=>{
                this.delete(key); // TTL expiry hote hi auto delete

            }, ttlInMs)

            // timer id ko map me store karlo

            this.timers.set(key, timerId);

        }

    }

    // cache se data read karne ke liye
    get(key){
        // agar key missing than cache miss
        if(!this.store.has(key)){
            this.misses++;
            return null
        }

        // key mill gai
        this.hits++;

        const rawValue = this.store.get(key);
        // return read only
        return typeof rawValue === "object" && rawValue !== null ? structuredClone(rawValue) : rawValue;


    }

    has(key){
        return this.store.has(key);

    }

    // single key aur uske active timer ko manually delete karna
    delete(key){
        // Active timer cancel karo agar exist karte hai to
        if(this.timers.has(key)){
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
        return this.store.delete(key);
    }

    // complete memory reset
    clear(){
        // saare background timers ko cancel karna zaruri hai
        this.timers.forEach((timerId) =>{
            clearTimeout(timerId);
        })
        // maps ko empty karo
        this.store.clear();
        this.timers.clear();
        // stats ko reset karo
        this.hits = 0;
        this.misses = 0;
    }

    //performance metrics
    getStats(){
        return {
            hits:this.hits,
            misses: this.misses,
            size : this.store.size
        }
    }
}