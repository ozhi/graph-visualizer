"use strict";

class Stack{
    constructor(){
        this.buffer = [];
    }

    push(params) {
        this.buffer.push(params);
    }

    getCount(){
        return this.buffer.length;
    }
    
    any(){
        return this.buffer.length!=0;
    }

    peek(){
        if(!this.any())throw "Can't peek from an empty deque";
        return this.buffer[this.buffer.length-1];
    }

    pop(){
        if(!this.any())throw "Can't pop from an empty deque";
        let item = this.buffer[this.buffer.length];
        this.buffer.pop();
        return item;
    }
}