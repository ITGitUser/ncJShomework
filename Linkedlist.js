'use strict'
class Node{
	constructor(value){
		this.value=value;
		this.next=null;
		this.prev=null;
	}
}
class LinkedList{
	constructor(){
		this.length=0;
		this.head=null;
		this.tail=null;
		Array.prototype.forEach.call(arguments, data => this.push(data));
	}
  // forEach on list - iterates over all elements in list and invokes callback method for each element
	forEach(callback){
		var currentNode = this.head;
		var index = 0;
		while (index<this.length) {
			callback(currentNode, index);
			currentNode=currentNode.next;
			index++;
		}
	}
	// adds element or elements at the end of the list
	push(){
		for (var i = 0; i < arguments.length; i++) {
			var node = new Node(arguments[i]);
			if(this.head===null){this.head=this.tail=node;}
			this.forEach((element, index)=>{
				if (element.next==null) {
					element.next=node;
					this.tail=element.next;
					this.tail.prev=element;
				}
			});
			this.length++;
		}
	}
  //returns value element
	get(nodeIndex){
		var node=null;
		this.forEach((currentNode, index)=>{
			if (nodeIndex===index) {
				node=currentNode.value;
			}
		});
		return node;
	}
	// return boolean
	contains(value){
		var result=false;
		this.forEach((currentNode, index)=>{
			if (currentNode.value===value) {
				result=true;
			}
		});
		return result;
	}
	// removes last element from the list
	pop(){
		var currentNode=this.tail.value;
		this.tail=this.tail.prev;
		this.tail.next=null;
		this.length--;
		return currentNode;
	}
	//removes object any position from list
  removes(index){
    var currentNode = this.head;
    var currentIndex=0;
    while (currentIndex<index) {
      currentNode=currentNode.next;
      currentIndex++;
    }
    currentNode.prev.next=currentNode.next;
    currentNode.next.prev=currentNode.prev;
    this.length--;
    return currentNode;
  }
	// removes first element from the list
	shift(){
		var currentNode=this.head.value;
		this.head=this.head.next;
		this.head.prev=null;
		this.length--;
		return currentNode;
	}
	// adds element or elements at the beginning of the list
	unshift(){
		for (var i = arguments.length; i >= 0; i--) {
			var currentNode = this.head;
			this.head=new Node(arguments[i]);//set new object
			this.head.next=currentNode;//set the new object reference to the next
			this.head.next.prev=this.head;//set the next object reference to the previous one
			this.length++;
		}
	}
	// set an element to specific position
	set(index, element){
		var currentNode = this.head;
		var node = new Node(element);
  	var currentIndex=0;
  	while (currentIndex<index) {
  		currentNode=currentNode.next;
  		currentIndex++;
  	}
		node.next = currentNode;//set the new object reference to the next
		node.prev = currentNode.prev;//set the new object reference to the previous
		currentNode.prev.next=node;//set the next object reference to the previous
		currentNode.prev=node;//set the previous object reference to the next
		if (index!==0 | index<this.length) {
			this.length++;
		}
	}
	// reverse list and returns
	reverse(){
		var currentNode=this.tail;
		var previousNode=null;
		var nextNode=null;
		for (var i = 0; i < this.length; i++) {
			nextNode=currentNode.prev;
			currentNode.prev=previousNode;
			currentNode.next=nextNode;
			previousNode=currentNode;
			currentNode=nextNode;
		}
		var head=this.tail;
		this.tail=previousNode;
		this.head=head;
		return this;
	}
  // returns string representation of a list
	toString(){
		var string = "[";
		this.forEach( (element, index) => {
			if (typeof(element.value)=='string') {
				string+="\""+element.value+"\"";
			}
			else if (typeof(element.value)==='object') {
				(Object.keys(element.value).length === 0)?string+="{}":string+=objToString(element.value);
			}	else {
					string+=element.value;
			}
			(element.next!==null)?string+=",":string+="]";
		});
		return string;
	}
	//change value only in list object
  changeValue(index, element){
    var currentNode = this.head;
		var currentIndex=0;
		while (currentIndex<index && index<this.length) {
			currentNode=currentNode.next;
			currentIndex++;
		}
    currentNode.value=element;
    return currentNode.value;
  }
	//mutually change values
  swap(lowIndex, highIndex){
    var temp=this.get(highIndex);
    this.changeValue(highIndex, this.get(lowIndex));
    this.changeValue(lowIndex, temp);
  }
	//sort list
  sort(){
    var x=partitionList(this, 0, this.length-1);
    quicksort(this, 0, x-1, 'number');//sorting is only valid for numbers
    //quicksort(this, 5, this.length-1, 'string');
    }
}

function quicksort(list, lowIndex, highIndex, type){
	var p=0;
  if (type=='string') {
    p=partitionString(list, lowIndex, highIndex);
  }
  if (type=='number') {
  	p=partitionNumber(list, lowIndex, highIndex);
  }
  if (lowIndex<highIndex){
    if (lowIndex<p) quicksort(list, lowIndex, p-1, type);
    if (p<highIndex)  quicksort(list, p, highIndex, type);
  }
	return list;
}
//divides the list into parts with numbers and part with string
function partitionList(list, lowIndex, highIndex){
	var averageIndex=Math.floor( (lowIndex+highIndex)/2);
	var piv=list.get( averageIndex );//обязательно берем целое число, потому что метод get не умеет искать по дробным индексам!!! из-за этого перегружается стэк!
  var i=lowIndex, j=highIndex, a=averageIndex;
  while (i<j) {
  	while( typeof( list.get(i) )==='number')  i++;
    while ( typeof( list.get(j) )==='string') j--;
    if(i<=j){
    	list.swap(i, j);
      i++;
      j--;
    }
	}
  return i;
}
//sorts part of the list with numbers
function partitionNumber(list, lowIndex, highIndex){
  var piv=list.get( Math.floor( (lowIndex+highIndex)/2) );//обязательно берем целое число, потому что метод get не умеет искать по дробным индексам!!! из-за этого перегружается стэк!
  var i=lowIndex, j=highIndex;
  while (i<=j) {
    while(list.get(i)<piv)  i++;
    while (list.get(j)>piv) j--;
    if(i<=j){
      list.swap(i, j);
      i++;
      j--;
    }
  }
	return i;
}
//sorts part of the list with strings
function partitionString(list, lowIndex, highIndex){
  var piv=list.get( Math.floor( (lowIndex+highIndex)/2) );
  var i=lowIndex, j=highIndex;
  while (i<=j) {
    while((list.get(i)).length<piv.length)  i++;
    while ((list.get(i)).length>piv.length) j--;
    if(i<=j){
      list.swap(i, j);
      i++;
      j--;
    }
  }
	return i;
}
//returns object value in string
function objToString(obj) {
	var str = '';
  for (var p in obj) {
  	if (obj.hasOwnProperty(p)) {
    	str += p + '::' + obj[p] + '\n';
    }
  }
  return str;
}

module.exports = LinkedList;
