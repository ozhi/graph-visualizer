class Queue{
    constructor(){
        this.counter=0;
        this.count = 0;
        this.buffer = {};
    }

    push(item){
        this.buffer[this.counter++]=item;
        this.count++;
    }

    peek(){
        if(!this.any())throw "Can't peek from empty queue";
        let key = Object.keys(this.buffer)[0];
        let item = this.buffer[key];
        return item;
    }

    pop(){
        if(!this.any())throw "Can't pop from empty queue";
        let key = Object.keys(this.buffer)[0];
        let item = this.buffer[key];
        delete this.buffer[key];
        this.count--;
        return item;
    }

    any(){
        return this.count!=0;
    }

    getCount(){
        return this.count;
    }
}