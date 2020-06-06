"use strict";

const URL="http://idefix.informatik.htw-dresden.de/it1/beleg/quizz-aufgaben.js"


    
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

  // Formel in Element boo schreiben  
  katex.render("",mathrender, {
      throwOnError: false
  });
    fetch(URL)
    .then(response => response.json())
    .then(data => {console.log(data['teil-mathe'])
        console.log(Object.keys(data))
});

});