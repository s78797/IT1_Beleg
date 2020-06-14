"use strict";
const URL = "http://idefix.informatik.htw-dresden.de/it1/beleg/quizz-aufgaben.js";
var data;
let p, v, m;

class Model {

  data;
  topicdata = {};
  topicnames = [];

  constructor(URL) {
    this.URL = URL;
    this.data = data;
    this.task = null;
  }

  async fetchData() {
    let response = await fetch(URL);
    data = await response.json();
    return data;
  }

  getdata() {
    return this.fetchData().then(data => {
      this.data = data;
      return this.data;
    });
  }

  getTask() {
    this.task = this.data['teil-mathe'][0]
    console.log(this.task)
    return this.task;
  }

  getTopics() {
    this.topics = Object.keys(this.data);
    return this.topics
  }
}


class Presenter {
  currTopicData;
  currQuestion;
  currRightAnswer;
  recdata;


  currTopicLabel

  setModelandView(m, v) {
    this.m = m;
    this.v = v;
  }
  start() {
    m.getdata()
      .then(() => {
        this.recdata = data;
        m.getTopics();
        this.topics = m.getTopics();
        /*add Radio-Buttons*/
        for (var i = 0; i < this.topics.length; i++) {
          this.addRadioBtn(i);
        }
      })
      .then(() => this.updateTopic(2))
      .then(() => v.chosenTopic())
      .then(() => v.setHandler())
  }


  addRadioBtn(i) {

    /*Setup Button Attributes*/
    var button = document.createElement('input');
    button.setAttribute('type', 'radio');
    button.setAttribute('id', i);
    button.setAttribute('name', 'radiogroup');
    button.setAttribute('class', 'topic');
    if (button.id == 2) {
      button.checked = true;
    }
    button.value = i;
    /*Set Label for Button*/
    var label = document.createElement('label');
    label.htmlFor = this.topics[i];



    switch (this.topics[i]) {
      case "note":
        var description = document.createTextNode("Noten");
        break;
      case "akkord3":
        var description = document.createTextNode("Akkorde");
        break;
      case "teil-mathe":
        var description = document.createTextNode("Mathematik");
        break;
      case "teil-allgemein":
        var description = document.createTextNode("Allgemeinwissen");
        break;
    }

    label.appendChild(description);

    var buttonselector = document.getElementById('selector');
    buttonselector.appendChild(button);
    buttonselector.appendChild(label);
  }


  initAnswerButtons(current) {
    let solutionset = this.randomizeAnswers(current.l);
    for (var i = 0; i < solutionset.length; i++) {
      let button = document.createElement('button');

      button.setAttribute('value', solutionset[i])
      button.setAttribute('id', 'Antwort' + i);

      if (this.currTopicLabel == "teil-mathe") {
        this.renderMathQuestion(solutionset[i], button)
      }
      else {
        button.innerHTML = solutionset[i];
      }

      var answerpanel = document.getElementById('answerpanel');
      answerpanel.appendChild(button);
    }
  }

  initProgressbars() {
    let correct = document.getElementById("correct_bar");
    correct.setAttribute('value', 0);
    correct.setAttribute('max', this.currTopicData.length);

    let wrong = document.getElementById("wrong_bar");
    wrong.setAttribute("value", 0);
    wrong.setAttribute("max", this.currTopicData.length);
  }

  initSolvedKey(currTopic) {
    for (let i = 0; i < currTopic.length; i++) {
      currTopic[i].solved = false;
    }
  }


  updateTopic(nr) {
    m.getdata()
      .then(() => {
        this.recdata = data
      })
    this.currTopicData = this.recdata[Object.keys(this.recdata)[nr]];

    this.currTopicLabel = Object.keys(this.recdata)[nr];
    console.log(this.currTopicLabel);
    this.initSolvedKey(this.currTopicData);

    this.initProgressbars();
    this.currQuestion = this.getRandomTask();

    this.updateQuestion(this.currQuestion);

  }

  getRandomTask() {
    let index;
    let qcount = this.currTopicData.length;

    while (true) {
      let leftquestions = this.currTopicData.filter(data => data.solved).length;
      console.log("Bearbeitet: " + leftquestions + ' von ' + qcount);

      if (leftquestions == qcount) {  //last task solved
        v.openModal();
        break;
      }
      index = Math.floor(Math.random() * this.currTopicData.length)
      var item = this.currTopicData[index];
      if (item.solved == false) {
        this.currTopicData[index].solved = true;

        this.currRightAnswer = item.l[0];
        console.log(this.currRightAnswer);
        return item;
      }
    }
  }

  getNextTask() {
    this.currQuestion = this.getRandomTask();

    if (typeof this.currQuestion !== 'undefined') {//prevent from updating question if no questionns left

      this.updateQuestion(this.currQuestion);
    }
  }

  updateQuestion(currentTask) {
    let questionDOM = document.getElementById("task");
    if (this.currTopicLabel == "teil-mathe") {
      this.renderMathQuestion(this.currQuestion.a, questionDOM);
    }
    else {
      questionDOM.innerHTML = currentTask.a;
    }

    if (document.getElementById('Antwort0') === null) {
      this.initAnswerButtons(currentTask);
    } else
      this.updateAnswerButtons(currentTask);

  }
  updateAnswerButtons(currentTask) {
    let solutionset = currentTask;
    solutionset = this.randomizeAnswers(solutionset.l);
    for (let i = 0; i < solutionset.length; i++) {
      let button = document.getElementById('Antwort' + i);
      button.setAttribute('type', 'button');
      button.setAttribute('value', solutionset[i]);

      if (this.currTopicLabel == "teil-mathe") {
        this.renderMathQuestion(solutionset[i], button)
      }
      else { button.innerHTML = solutionset[i] }
      button.style.backgroundColor = ""
    }
  }

  randomizeAnswers(currentSolutionSet) {
    
    for (let i = currentSolutionSet.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = currentSolutionSet[i];
      currentSolutionSet[i] = currentSolutionSet[j];
      currentSolutionSet[j] = temp;
    }
    return currentSolutionSet;
  }

  renderMathQuestion(element, location) {

    katex.render(element, location, {
      throwOnError: false
    });
  }

  updateProgressbars(bar) {
    let updatebar = document.getElementById(bar);
    updatebar.value++;
  }

  evaluateInput(input) {
    if (input === this.currRightAnswer) {
      this.updateProgressbars("correct_bar");
      return true;
    }
    else {
      this.updateProgressbars("wrong_bar");
      return false
    }
  }
  evaluateResults(bool) {
    let count;
    if (bool === true) {
      count = document.getElementById("correct_bar").value;
    }
    else {
      count = document.getElementById("wrong_bar").value
    }
    return count
  }


}

class View {
  constructor(p) {
    this.p = p;
  }

  setHandler() {
    this.setanswerButtonHandlers();
  }
  setanswerButtonHandlers() {
    for (var i = 0; i < p.currQuestion.l.length; i++) {
      let button = document.getElementById("Antwort" + i);
      button.addEventListener("mousedown", event => {
        this.setColorToButton(button)
      });
      button.addEventListener("mouseup", event => {
        this.p.getNextTask();
      })
    }
  }

  setColorToButton(button) {
    if (this.p.evaluateInput(button.value)) {

      button.style.backgroundColor = "green";
    } else button.style.backgroundColor = "red";

  }
  chosenTopic() {
    let buttons = document.getElementById("selector").querySelectorAll(".topic");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", event => {
        this.evaluateTopicSelection(buttons[i]);
      });
    }
  }

  evaluateTopicSelection(button) {
    if (button.checked) {
      console.log(button.value);
      p.updateTopic(button.value)
    }
  }

  openModal() {
    var modal = document.getElementById("stat_modal");
    modal.style.display = "block";
    var span = document.getElementsByClassName("close")[0];

    let correct = p.evaluateResults(true);//get correct answers count
    let wrong = p.evaluateResults(false);//get false answers count

    let modalcontent = document.getElementById("modal_text");
    modalcontent.innerText = "Fragen richtig beantwortet: " + correct + "\n Fragen falsch beantwortet : " + wrong;
    span.onclick = function () {


      /* Reset Tasks when closed */
      let buttons = document.getElementById("selector").querySelectorAll(".topic");
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].checked) {
          p.updateTopic(buttons[i].value);
        }
      }
      modal.style.display = "none";
    }
  }
}
window.addEventListener('DOMContentLoaded', (event) => {

  console.log('DOM fully loaded and parsed');
  m = new Model(URL);
  p = new Presenter();
  v = new View(p);
  p.setModelandView(m, v);
  p.start()


});
