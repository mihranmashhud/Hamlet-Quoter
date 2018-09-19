const playJSON = {
  title: "Hamlet",
  author: "William Shakespeare",
  acts: []
}

let currentScene

let sceneNumber = 0

let actNumber = 0

let currentAct = playJSON.acts[actNumber]

let currentSpeaker = ""

let index = 0

const getType = element => element.nodeName.toLowerCase()

const getText = element => element.innerText

const getAction = element =>
  Object.assign(
    {},
    {
      type: "action",
      text: getText(element),
      index
    }
  )

const getLine = element =>
  Object.assign(
    {},
    {
      type: "line",
      speaker: currentSpeaker,
      text: getText(element),
      number: getLineNumber(element),
      index
    }
  )

const getLineNumber = element => {
  let name = element.getAttribute("name").split(".")
  return Number.parseInt(name[2])
}

window.onload = function() {
  let children = document.body.children
  for (let i = 0; i < children.length; i++) {
    let element = children[i]
    if (getType(element) == "h3") {
      if (getText(element).substring(0, 3) == "ACT") {
        if (actNumber > 0) {
          playJSON.acts.push(currentAct)
        }
        sceneNumber = 0
        actNumber++
        currentAct = Object.assign(
          {},
          {
            number: actNumber,
            text: getText(element),
            scenes: []
          }
        )
      }
      if (getText(element).substring(0, 5) == "SCENE") {
        console.log(currentScene)
        sceneNumber++
        currentSpeaker = ""
        index = 0
        currentScene = Object.assign(
          {},
          {
            number: sceneNumber,
            text: getText(element),
            sceneText: []
          }
        )
        currentAct.scenes.push(currentScene)
      }
    }

    if (getType(element) == "blockquote") {
      for (let j = 0; j < element.children.length; j++) {
        if (getType(element.children[j]) == "a") {
          currentScene.sceneText.push(getLine(element.children[j]))
          index++
        } else if (getType(element.children[j]) == "p") {
          currentScene.sceneText.push(
            getAction(element.children[j].children[0])
          )
          index++
        } else if (getType(element.children[j]) == "i") {
          currentScene.sceneText.push(getAction(element.children[j]))
          index++
        }
      }
    }
    if (getType(element) == "a") {
      currentSpeaker = element.children[0].textContent
    }
  }
  playJSON.acts.push(currentAct)
  console.log(JSON.stringify(playJSON))
}
