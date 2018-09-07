class PriorityQueueItem{
    getPriority(){
        throw "getPriority not implemented";
    }
}

class PriorityQueue{
    constructor(){
        this.count = 0;
        this.buckets = {
            //JavaScript will sort object keys in ascending order :)
        };
    }

    push(item) {
        this._guardItem(item);

        let priority = item.getPriority();
        if(!this.buckets[priority])this.buckets[priority] = [];
        let bucket = this.buckets[priority];

        bucket.push(item);
        this.count++; 
    }

    pop(){
        if(!this.any())throw "Can't pop from an empty queue";

        let first = this._getFirst();
        first.bucket.pop();

        if(first.bucket.length == 0){
            delete this.buckets[first.bucketKey];
        }

        this.count--;
        return first.item;
    }

    peek(){
        if(!this.any())throw "Can't peek an empty queue";
        return this._getFirst().item;
    }

    any(){ 
        return this.count!=0; 
    }

    getCount(){
         return this.count; 
    }

    _getFirst(){
        let bucketKey = Object.keys(this.buckets)[0];
        let bucket =  this.buckets[bucketKey];
        let item = bucket[bucket.length-1];
        return{
            bucketKey: bucketKey,
            bucket: bucket,
            item: item
        };
    }

    _guardItem(x){
        if(!(x instanceof PriorityQueueItem)){
            throw "Bad Priority queue item: " + x;
        }
    }
}