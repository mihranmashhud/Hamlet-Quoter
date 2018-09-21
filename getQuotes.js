const jsonfile = require("jsonfile")
const fs = require("fs")

function buildHtml(body = "") {
  const header = `<meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Hamlet Quotes</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <!-- Compiled and minified CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

  <!-- Compiled and minified JavaScript -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script type="text/javascript" src="main.js"></script>`

  // concatenate header string
  // concatenate body string

  return "<!DOCTYPE html>" + "<html><head>" + header + "</head><body>" + body + "</body></html>"
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
              lines: [[1, 26], [27, 40], [41, 57], [58, 83], [84, 96], [97, 112]]
            },
            {
              number: 9,
              lines: [[113, 130], [131, 152], [153, 168], [169, 190], [191, 204], [205, 216]]
            },
            {
              number: 10,
              lines: [[217, 258], [259, 273], [274, 277], [278, 288], [299, 305], [306, 313], [314, 337], [338, 356], [359, 369]]
            },
            {
              number: 11,
              lines: [[370, 408], [409, 420], [421, 437], [438, 453], [454, 470], [471, 486], [487, 492], [493, 508], [509, 527]]
            }
          ]
        }
      ]
    },
    {
      number: 3,
      scenes: [
        {
          number: 2,
          pages: [
            {
              number: 12,
              lines: [[16, 43], [44, 84], [84, 113]]
            },
            {
              number: 13,
              lines: [[114, 130], [140, 146], [147, 173], [174, 219], [220, 243], [244, 259]]
            },
            {
              number: 14,
              lines: [[260, 284], [285, 315], [316, 383]]
            }
          ]
        },
        {
          number: 3,
          pages: [
            {
              number: 14,
              lines: [[1, 26]]
            },
            {
              number: 15,
              lines: [[27, 35], [36, 72], [73, 98]]
            }
          ]
        },
        {
          number: 4,
          pages: [
            {
              number: 15,
              lines: [[1, 5], [6, 27], [28, 52]]
            },
            {
              number: 16,
              lines: [[53, 88], [89, 96], [97, 110], [111, 116], [117, 130], [142, 182], [183, 219]]
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

let finalPages = ""

let actLinks = []

let sceneLinks = []

let pageLinks = []

let lineLinks = []

jsonfile
  .readFile(file)
  .then(obj => {
    const acts = obj.acts
    for (const act of quotesToGet.acts) {
      let playAct = acts.find(actObj => actObj.number === act.number)
      output += `<h4 class="act" id="act${act.number}"><b>${playAct.text}</b></h4>\n`
      for (const scene of act.scenes) {
        let playScene = playAct.scenes.find(sceneObj => sceneObj.number == scene.number)
        output += `<h4 class="scene" id="act${act.number}_scene${scene.number}"><b>${playScene.text}</b></h4>\n`
        let { sceneText } = playScene
        for (let page of scene.pages) {
          for (let line of page.lines) {
            let startLine = line[0]
            let endLine = line[1]
            output += `<h4 class="lines" id="lines${startLine + "-" + endLine}"><b>LINES ${startLine + " - " + endLine}</b></h4>\n`
            let startIndex = sceneText.find(sceneTextObj => sceneTextObj.number == startLine).index
            let endIndex = sceneText.find(sceneTextObj => sceneTextObj.number == endLine).index
            if (startIndex != 0) {
              if (sceneText[startIndex - 1].type == "action") {
                startIndex--
              }
            }
            for (let i = startIndex; i < endIndex + 1; i++) {
              if (sceneText[i].type == "action") {
                output += `<p class="action"><i>${sceneText[i].text}</i></p>\n`
              } else if (sceneText[i].type == "line") {
                if (sceneText[i].speaker != speaker) {
                  speaker = sceneText[i].speaker
                  output += `<p class="speaker"><b>${speaker}</b></p>\n`
                }
                output += `<blockquote class="line">${sceneText[i].text}</blockquote>\n`
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
    for (let i = 0; i < quotePages.length - 1; i++) {
      if (quotePages[i].number == quotePages[i + 1].number) {
        quotePages[i].html += quotePages[i + 1].html
        quotePages.splice(i + 1, 1)
        i--
      }
    }
    for (let i = 0; i < quotePages.length; i++) {
      let pageButtons = ""
      if (i == 0) {
        pageButtons += `
          <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>\n
        `
      } else {
        pageButtons += `
          <li class="waves-effect"><a href="page${quotePages[i - 1].number}.html"><i class="material-icons">chevron_left</i></a></li>\n
        `
      }

      for (let j = 0; j < quotePages.length; j++) {
        if (quotePages[j].number == quotePages[i].number) {
          pageButtons += `
            <li class="active"><a href="page${quotePages[i].number}.html">${quotePages[i].number}</a></li>\n
          `
        } else {
          pageButtons += `
            <li class="waves-effect"><a href="page${quotePages[j].number}.html">${quotePages[j].number}</a></li>\n
          `
        }
      }

      if (i == quotePages.length - 1) {
        pageButtons += `
          <li class="disabled"><a href="#!"><i class="material-icons">chevron_right</i></a></li>\n
        `
      } else {
        pageButtons += `
          <li class="waves-effect"><a href="page${quotePages[i + 1].number}.html"><i class="material-icons">chevron_right</i></a></li>\n
        `
      }

      output = `
        <ul class="pagination">\n
          ${pageButtons}
        </ul>\n
        <h3 id="pg${quotePages[i].number}">
          <b>PAGE ${quotePages[i].number}</b>
        </h3>\n
        ${quotePages[i].html}
        
      `
      // if (i + 1 < quotePages.length) {
      //   if (quotePages[i].number == quotePages[i + 1].number) {
      //     output += quotePages[i + 1].html
      //     i++
      //   }
      // }

      let fileName = `./page${quotePages[i].number}.html`
      fs.writeFile(fileName, buildHtml(output), err => console.log)
    }

    const fileName = "./index.html"
    const indexHTML = buildHtml("")
    fs.writeFile(fileName, indexHTML, err => console.log(err))
  })
  .catch(err => console.error(err))
