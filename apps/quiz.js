const stage = document.getElementById("stage");
document.addEventListener("keyup", (event_) => {
  if (event_.code == "Space") {
    clearStage();
    incrementQuestionCounter(1);
  }
});

let chosenQuiz;

const firstTwenty = {
  name: "The First Twenty",
  difficulty: "easy",
  words: [
    { english: "I", romanian: "eu" },
    { english: "you", romanian: "tu" },
    { english: "he", romanian: "el" },
    { english: "she", romanian: "ea" },
    { english: "it", romanian: "el/ea" },
    { english: "we", romanian: "noi" },
    { english: "you", romanian: "voi" },
    { english: "they", romanian: "ei/ele" },
    { english: "what", romanian: "ce" },
    { english: "who", romanian: "cine" },
    { english: "where", romanian: "unde" },
    { english: "why", romanian: "de ce" },
    { english: "how", romanian: "cum" },
    { english: "which", romanian: "care" },
    { english: "when", romanian: "când" },
    { english: "then", romanian: "apoi" },
    { english: "if", romanian: "dacă" },
    { english: "really", romanian: "chiar" },
    { english: "but", romanian: "dar" },
    { english: "because", romanian: "deoarece" },
  ]
};

const theCreed = {
  name: "From the Nicene Creed",
  difficulty: "easy",
  words: [
    { english: "father", romanian: "tatăl" },
    { english: "our", romanian: "nostru" },
    { english: "which", romanian: "care" },
    { english: "you", romanian: "ești" },
    { english: "in", romanian: "în" },
    { english: "Hallowed-be", romanian: "sfințească-se" },
    { english: "names", romanian: "numele" },
    { english: "your", romanian: "tău" },
    { english: "vineyard", romanian: "vie" },
    { english: "kingdom", romanian: "împărăția" },
    { english: "your", romanian: "ta" },
    { english: "be-it-is", romanian: "facă-se" },
    { english: "will", romanian: "voia" },
    { english: "as", romanian: "precum" },
    { english: "heaven", romanian: "cer" },
    { english: "so", romanian: "așa" },
    { english: "and", romanian: "și" },
    { english: "on", romanian: "pe" },
    { english: "earth", romanian: "pământ" },
    { english: "bread", romanian: "pâine" },
    { english: "our", romanian: "noastră" },
    { english: "the", romanian: "cea" },
    { english: "To-(for)", romanian: "spre" },
    { english: "being", romanian: "ființă" },
    { english: "give-us", romanian: "dă-ne-o" },
    { english: "nine", romanian: "nouă" },
    { english: "today", romanian: "astǎzi" },
    { english: "us", romanian: "ne" },
    { english: "forgive", romanian: "iartă" },
    { english: "mistakes", romanian: "greșelile" },
    { english: "our", romanian: "noastre" },
    { english: "we", romanian: "noi" },
    { english: "debtors", romanian: "greșiților" },
    { english: "our", romanian: "noștri" },
    { english: "no", romanian: "nu" },
    { english: "cause", romanian: "duce" },
    { english: "temptation", romanian: "ispită" },
    { english: "but", romanian: "ci" },
    { english: "deliver-from", romanian: "izbăveștede" },
    { english: "heaven", romanian: "cel" },
    { english: "river", romanian: "rău" }
  ]
};

const quizList = [firstTwenty, theCreed];

let questions;
let questionCounter = 0;
let questionList = [];
let correctAnswers = 0;

//  This is a Dorian Yates shuffle confunction... allegedly
const shuffle = (array) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
};

const questionClass = class {
  constructor(english, romanian) {
    this.english = english;
    this.romanian = romanian;
    this.used = false;
  }
};

// const createQuestionList = (entry) => {
//   questions.forEach((entry) => {
//     let addQuestion = new questionClass(entry.english, entry.romanian);
//     questionList.push(addQuestion);
//   });
//   shuffle(questionList);
// };

// This function generates a list of wrong answers
const genWrongAnswers = (cantUse, allEntries) => {
  // Assigns an answer that is randomly selected
  let thisAnswer = allEntries[Math.floor(Math.random() * allEntries.length)];

  // This checks if the supposed wrong answer is actually wrong, and does not use it if so
  while (cantUse.includes(thisAnswer)) {
    console.log("fuck me running...")
    thisAnswer = allEntries[Math.floor(Math.random() * allEntries.length)];
  }
  return thisAnswer;
};

const genCorrectAnswer = (chosenQuiz) => {
  // We set our "stage", the window in which our question and answers will both live
  let hasGuessed = false;

  // Here we grab an answer to question, and create it's tags and append etc..
  const questionObject = chosenQuiz[questionCounter];
  const question = questionObject.english;
  console.log(question)
  const questHead = document.createElement("h2");
  const englishElement = document.createTextNode(question);
  questHead.appendChild(englishElement);
  stage.appendChild(questHead);
  questionObject.used = true;

  // Here we create unordered (and unpopulated) answer list
  const answerList = document.createElement("ul");

  // We don't want to add this again as we collect our wrong answers
  const cantUse = [questionObject];

  // Loop and call genWrongAnswers till we have our 3 other incorrect options
  console.log("About to generate wrong answers")
  console.log(`${questionList}`)
  for (let i = 0; i < 3; i++) {
    console.log(`${i}`)
    console.log(`${questionList}`)
    const wrongAnswer = genWrongAnswers(cantUse, chosenQuiz);

    cantUse.push(wrongAnswer);
  }
  console.log("Done generating wrong answers")
  // Shuffle our entire list of answers
  shuffle(cantUse);
  console.log("Done shuffling cantUse")
  // Loop through shuffled list and append to the dom
  cantUse.forEach((answer) => {
    const ansText = document.createTextNode(answer.romanian);
    ansText.textContent.toLowerCase();
    const ansTag = document.createElement("li");
    ansTag.appendChild(ansText);
    ansTag.className = "answer";
    answerList.appendChild(ansTag);

    // Add event listener for some interactivity with our answer options
    ansTag.addEventListener("click", (event_) => {
      // Check if guess was right or wrong
      if (
        questionObject === answer &&
        ansTag.getAttribute("chosen") != "true"
      ) {
        // If correct we change its color
        ansTag.style.color = "lightyellow";
        // We append a correct notification below our list
        const correctAlertElement = document.createTextNode("Correct!");
        const correctAlertTag = document.createElement("span");
        correctAlertTag.appendChild(correctAlertElement);
        stage.appendChild(correctAlertTag);
        // And we change answer's attribute chosen to true, so we can prevent continued interaction with this option.
        ansTag.setAttribute("chosen", "true");
        if (hasGuessed == false) {
          // We add a score marker for this question, above
          document.getElementById("score").innerText += "+";
          correctAnswers += 1;
        }
        //  We set hasGuessed to true so we don't add more than one score marker per question.
        hasGuessed = true;
      } else if (
        questionObject !== answer &&
        ansTag.getAttribute("chosen") != "true"
      ) {
        // Similarly if answer is incorrect we change some styling...
        ansTag.style.color = "red";
        ansTag.style.textDecoration = "line-through";
        if (hasGuessed == false) {
          // We add a score marker for this question, above
          document.getElementById("score").innerText += "-";
        }
        // And we change the class of this selection to chosen.
        ansTag.setAttribute("chosen", "true");
        //  We set hasGuessed to true so we don't add more than one score marker per question.
        hasGuessed = true;
      }
    });
  });
  stage.appendChild(answerList);
};

const incrementQuestionCounter = (by) => {
  questionCounter += by;
  document.getElementById(
    "questionCounter"
  ).innerText = `${questionCounter}/${questions.length}`;
  return questionCounter;
};

const main = () => {
  startPage();
};

const clearStage = (chosenQuiz) => {
  while (stage.hasChildNodes()) {
    stage.lastChild.remove();
  }

  if (questionCounter == quizList.length) {
    finalScreen(correctAnswers, chosenQuiz.length);
  } else {
    genCorrectAnswer(chosenQuiz);
  }
};

const freshStage = (chosenQuiz) => {
  while (stage.hasChildNodes()) {
    stage.lastChild.remove();
  }
  console.log("Generating correct answer")
  genCorrectAnswer(chosenQuiz);
  console.log("Done generating answer")
  const nextButton = document.createElement("button");
  nextButton.addEventListener("click", (event_) => {
    clearStage(chosenQuiz);
    incrementQuestionCounter(1);
  });
  nextButton.innerText = "Next >>";
  nextButton.setAttribute("id", "next-button");
  document.getElementById("body").appendChild(nextButton);
  document.getElementById("score").innerText = "";
  incrementQuestionCounter(1);
};

const finalScreen = (finalScore, numQuestions) => {
  while (stage.hasChildNodes()) {
    stage.lastChild.remove();
  }

  document.getElementById("questionCounter").hidden = true;
  document.getElementById("clear-button").remove();

  const restartButton = document.createElement("button");
  restartButton.innerText = "Restart!";
  restartButton.addEventListener("click", (event_) => {
    incrementQuestionCounter(-questionCounter);
    questionList = [];
    // createQuestionList();
    restartButton.remove();
    quizCongratsElem.remove();
    quizFinalScoreElem.remove();
    document.getElementById("questionCounter").hidden = false;
    freshStage();
  });

  const quizCongratsElem = document.createElement("h2");
  if (finalScore == numQuestions) {
    quizCongratsElem.innerText = "Perfect Score! 🤠"
  } else {
    quizCongratsElem.innerText = "Great Job!";
  }
  const quizFinalScoreElem = document.createElement("p");
  quizFinalScoreElem.innerText = `${finalScore}/${numQuestions}`;
  quizFinalScoreElem.setAttribute("id", "finalScore");
  stage.appendChild(quizCongratsElem);
  stage.appendChild(quizFinalScoreElem);
  document.getElementById("body").appendChild(restartButton);
};

const startPage = () => {
  while (stage.hasChildNodes()) {
    stage.lastChild.remove();
  }

  const startPageHeaderElem = document.createElement("h2");
  startPageHeaderElem.innerText = "Pick a quiz!";
  stage.appendChild(startPageHeaderElem);

  const quizListDropdown = document.createElement("select")
  quizListDropdown.setAttribute("id", "dropdown")
  const defaultOption = document.createElement("option")
  defaultOption.innerText = "⋱⋰⋱⋰"
  quizListDropdown.appendChild(defaultOption)

  quizList.forEach((quiz, index) => {
    const heresThis = document.createElement("option");
    heresThis.value = index;
    heresThis.innerText = quiz.name;
    heresThis.setAttribute("id", "quiz-option")
    quizListDropdown.appendChild(heresThis)
  })
  stage.appendChild(quizListDropdown)

  quizListDropdown.addEventListener("change", (event_) => {
    let selectedIndex = event_.target.value
    chosenQuiz = quizList[selectedIndex].words;
    freshStage(chosenQuiz);
  });
};

main();
