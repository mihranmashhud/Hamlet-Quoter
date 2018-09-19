const jsonfile = require("jsonfile")
const fs = require("fs")

function buildHtml(body = "") {
  const header = `<meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Hamlet Quotes</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script type="text/javascript" src="main.js"></script>`

  // concatenate header string
  // concatenate body string

  return (
    "<!DOCTYPE html>" +
    "<html><head>" +
    header +
    "</head><body>" +
    body +
    "</body></html>"
  )
}

// const quotesToGet = {
//   acts: [
//     {
//       number: X,
//       scenes: [
//         {
//           number: Y,
//           pages: [
//             {
//               number: Z,
//               lines:[[x,y]]
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }

const quotesToGet = {
  acts: [
    {
      number: 1,
      scenes: [
        {
          number: 2,
          pages: [
            {
              number: 1,
              lines: [[1, 39], [62, 65]]
            },
            {
              number: 2,
              lines: [[87, 117], [129, 159], [235, 258]]
            }
          ]
        },
        {
          number: 3,
          pages: [
            {
              number: 3,
              lines: [[1, 44], [45, 54], [55, 81]]
            },
            {
              number: 4,
              lines: [[82, 88], [89, 111], [112, 136]]
            }
          ]
        },
        {
          number: 4,
          pages: [
            {
              number: 4,
              lines: [[1, 57]]
            },
            {
              number: 5,
              lines: [[58, 78], [79, 92]]
            }
          ]
        },
        {
          number: 5,
          pages: [
            {
              number: 5,
              lines: [[1, 23], [24, 31], [32, 41]]
            },
            {
              number: 6,
              lines: [[42, 91], [92, 112], [144, 169], [170, 199]]
            }
          ]
        }
      ]
    },
    {
      number: 2,
      scenes: [
        {
          number: 1,
          pages: [
            {
              number: 7,
              lines: [[1, 37], [38, 69], [70, 86], [87, 120]]
            }
          ]
        },
        {
          number: 2,
          pages: [
            {
              number: 8,
              lines: [
                [1, 26],
                [27, 40],
                [41, 57],
                [58, 83],
                [84, 96],
                [97, 112]
              ]
            },
            {
              number: 9,
              lines: [
                [113, 130],
                [131, 152],
                [153, 168],
                [169, 190],
                [191, 204],
                [205, 216]
              ]
            },
            {
              number: 10,
              lines: [
                [217, 258],
                [259, 273],
                [274, 277],
                [278, 288],
                [299, 305],
                [306, 313],
                [314, 337],
                [338, 356],
                [359, 369]
              ]
            },
            {
              number: 11,
              lines: [
                [370, 408],
                [409, 420],
                [421, 437],
                [438, 453],
                [454, 470],
                [471, 486],
                [487, 492],
                [493, 508],
                [509, 527]
              ]
            }
          ]
        }
      ]
    }
  ]
}

const file = "./HamletPlay.json"

let output = ""

let speaker = ""

let quotePages = []

let finalOutput = ""

jsonfile
  .readFile(file)
  .then(obj => {
    const acts = obj.acts
    for (let act of quotesToGet.acts) {
      let playAct = acts.find(actObj => actObj.number === act.number)
      output += `<h4><b>${playAct.text}</b></h4>\n`
      for (const scene of act.scenes) {
        let playScene = playAct.scenes.find(
          sceneObj => sceneObj.number == scene.number
        )
        output += `<h4><b>${playScene.text}</b></h4>\n`
        let { sceneText } = playScene
        for (let page of scene.pages) {
          for (let line of page.lines) {
            let startLine = line[0]
            let endLine = line[1]
            output += `<h4><b>LINES ${startLine + " - " + endLine}</b></h4>\n`
            let startIndex = sceneText.find(
              sceneTextObj => sceneTextObj.number == startLine
            ).index
            let endIndex = sceneText.find(
              sceneTextObj => sceneTextObj.number == endLine
            ).index
            if (sceneText[startIndex - 1].type == "action") {
              startIndex--
            }
            for (let i = startIndex; i < endIndex + 1; i++) {
              if (sceneText[i].type == "action") {
                output += `<p><i>${sceneText[i].text}</i></p>\n`
              } else if (sceneText[i].type == "line") {
                if (sceneText[i].speaker != speaker) {
                  speaker = sceneText[i].speaker
                  output += `<p><b>${speaker}</b></p>\n`
                }
                output += `<p>${sceneText[i].text}</p>\n`
              }
            }
            speaker = ""
          }
          quotePages.push({
            number: page.number,
            html: output
          })
          output = ""
        }
      }
    }
    for (let i = 0; i < quotePages.length; i++) {
      finalOutput +=
        `<h3><b>PAGE ${quotePages[i].number}</b></h3>\n` + quotePages[i].html
      if (i + 1 < quotePages.length) {
        if (quotePages[i].number == quotePages[i + 1].number) {
          finalOutput += quotePages[i + 1].html
          i++
        }
      }
    }
    let fileName = "./index.html"
    let stream = fs.createWriteStream(fileName)

    stream.once("open", function(fd) {
      let html = buildHtml(finalOutput)

      stream.end(html)
    })
  })
  .catch(err => console.error(err))
