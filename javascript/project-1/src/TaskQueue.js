export class TaskQueue {
   /**
   * @param {number} concurrency - Max kitne tasks ek saath run ho sakte hain
   */

   constructor(concurrency = 2){
    this.concurrency = concurrency;
    this.running = 0; //active running task ka count
    this.queue = []; // pending task ka array
   }

   /**
   * Queue mein naya async task push karne ke liye
   * @param {Function} task - Ek function jo Promise return karta ho () => Promise
   * @returns {Promise} Resolves/Rejects jab task finish ho jaye
   */

   push(task){
    return new Promise((resolve ,  reject) =>{
        // STEP 1: Task ko direct execute mat karo!
      // Isko resolve/reject handlers ke saath object bana kar queue mein rakho.

      this.queue.push({task,resolve,reject});

      // STEP 2: Worker loop ko bolo ki check kare agar space khali hai
      this.process();
    })
   }

   /**
   * Queue ko process karne ka central worker loop
   */
  process() {
   // STEP 1: Condition check karo
    // Jab tak (running < concurrency) AUR queue mein items bache hain, tabhi agla task uthao
    while(this.running < this.concurrency &&  this.queue.length > 0){
        // fifo ke front se task nikalo
        const {task , resolve , reject} = this.queue.shift();
        this.running++; // active counter badhao

        // step-2 task run karo
        task().then((result)=> resolve(result)) // successfull completed
        .catch((error) => reject(error)) // error handling 
        .finally(() =>{
            this.running--; // task khatam slot khali hua
            this.process(); // Queue as agla waiting task uthao
        })
    }
  }
}