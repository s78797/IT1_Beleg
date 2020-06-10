"use strict";

const URL="http://idefix.informatik.htw-dresden.de/it1/beleg/quizz-aufgaben.js"

var data;
let p,v,m;

class Model{
  constructor(URL){
    this.URL=URL;
    this.data=data;
    this.task= null;
    
  }

  async  fetchData(){
    let response = await fetch(URL);
    data =await response.json();
    return data;
}
  getdata(){   
     
     return this.fetchData().then(data=>{
        this.data = data;
        this.addSolutionKeys();
        console.log(this.data);
        
      });
    
  }

  addSolutionKeys(){
    this.data["teil-mathe"][0].solved=false;
    this.data["teil-mathe"][0].answer=null;
  }

  

  getTask(){ 
   this.task=this.data['teil-mathe'][0]
    console.log(this.task)
    return this.task;
  }
    
  getTopics(){
    this.topics=Object.keys(this.data);
    console.log(this.topics)
    return this.topics
  }

}
  


class Presenter{
  setModelandView(m,v){
    this.m=m;
    this.v=v;
   
  
  }
  start(){
    m.fetchData();
   this.data=m.getdata()
   .then(()=>this.task=m.getTask())
   .then(()=>{m.getTopics();
    this.topics=m.getTopics();

    /*add Radio-Buttons*/
    for(var i=0;i<this.topics.length;i++){
      this.addRadioBtn(i);
    }
    return 1;
  })
  .then(()=>{m.getTask()
  this.task=m.getTask();
  
  this.renderMath();
  this.addAnwerButtons();
  
  console.log(this.task)
})
  .then(()=>v.setHandler())
}


addRadioBtn(i){
  
    /*Setup Button Attributes*/
    var button = document.createElement('input');
    button.setAttribute('type', 'radio');
    console.log(button)
    button.setAttribute('id',this.topics[i]);
    button.setAttribute('name','radiogroup');
    if(button.id=="teil-mathe"){
      button.checked=true;
    }
  
    button.value=i;
    /*Set Label for Button*/
    var label = document.createElement('label')
    label.htmlFor = this.topics[i];
  
    var description = document.createTextNode(this.topics[i]);
    label.appendChild(description);
    
    var buttonselector=document.getElementById('selector');
    buttonselector.appendChild(button); 
    buttonselector.appendChild(label);
  }

renderMath(){
  katex.render(this.task.a ,task, {
    throwOnError: false
});
}

addAnwerButtons(){
console.log(this.task.l)
  
  for(var i=0;i<this.task.l.length;i++){
    var button =document.createElement('input');
    button.setAttribute('type','button');
    button.setAttribute('id','Antwort'+i);
    button.setAttribute('value',this.task.l[i])
    button.innerHTML=this.task.l[i]
   
   


    var answerpanel= document.getElementById('answerpanel');
    answerpanel.appendChild(button);
    
  }

}

}





class View{
  constructor(p){
    this.p=p;
    
    
  }
  
  setHandler(){
    for(var i=0;i<p.task.l.length;i++)
    document.getElementById("Antwort"+i).addEventListener("click",console.log.bind("clicked"))

  }

  evaluateAnswer(){


  }

  chosenTopic(){

  }

}

window.addEventListener('DOMContentLoaded', (event) => {
  
  console.log('DOM fully loaded and parsed');
  m=new Model(URL);
  p= new Presenter();
  v =new View(p);
  p.setModelandView(m,v);
  p.start()

      
    });
