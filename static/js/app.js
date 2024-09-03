/* Libs loaded */
let fuse = null
let goSearch = null

let sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let changeWords = () => {
  let children = document.getElementsByClassName('codinfox-changing-keywords')[0].children;
  let length = children.length;
  let idx = 0;
  setInterval(() => {
    console.log(children)
    children[idx].style.visibility = "hidden";
    idx = (idx + 1) % length;
    children[idx].style.visibility = "visible";
  }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {
  try {
    let options = {
      offset: -100
    }
    new SweetScroll(options);
  } catch (error) {
    console.warn("SweetScroll could not be oaded. Ignoring it!", error)
  }

  try {
    /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 30,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "polygon",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 19.18081918081918,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 4,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        },
        nb: 80
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
  } catch (error) {
    console.warn("ParticleJS could not be oaded. Ignoring it!", error)
  }

  try {
    // Fetch the JSON document
    fetch("/search_index.en.json")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText)
        }
        return response.json(); // Parse the JSON from the response
      })
      .then(data => {
        const fuseOptions = {
          isCaseSensitive: false,
          keys: [
            "title",
            "description"
          ]
        };
        fuse = new Fuse(data, fuseOptions);
      })
      .catch(error => {
        throw error
      });
  } catch (error) {
    console.warn("Fuse could not be loaded. Ignoring it!", error)
  }

  goSearch = (event) => {
    event.preventDefault()
    const main1 = document.querySelector('body > section')
    const main2 = document.querySelector('body > div')
    const input = document.querySelector('input[type="search"]');

    const main = main1 || main2
    if (!main) {
      console.error("Unable to select main content")
      return false
    }

    const searchPattern = input.value
    if (!searchPattern || searchPattern == "") {
      console.error("Invalid search")
      return false
    }
    if (!fuse) {
      return false
    }

    let search_res = fuse.search(searchPattern)
    console.debug(search_res)

    let data = ""
    var html = ""
    html += `
    <h1 id="search-results "class="text-center search-title">
    Search Results
    </h1>
    ${data}
    `

    for (let res of search_res) {
      if (res.item.path.startsWith("/blog") && res.item.path != "/blog/") {
        let card = `
          <div class="card mb-3 search-card px-4">
            <div class="row g-0">
              <div class="col">
                <div class="card-body search-link">
                  <a href="${res.item.url}">
                    <h3 class="card-title text-center">${res.item.title}</h3>
                  </a>
                  <div>
                    <p>
                      ${res.item.description}
                    </p>
                  </div>
                  <a class="project-link justify-content-center" href="${res.item.url}">Read more</a>
                </div>
              </div>
            </div>
          </div>`
        html += card
      }
    }
    main.innerHTML = html

    if (main2.id == 'particles-js') {
      document.getElementById("search-results").scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }

    if (document.getElementById("projects")) {
      document.getElementById("projects").remove()
    }

    if (search_res.length <= 1) {
      const footer = document.querySelector('#footer')
      footer.classList.add("fixed-bottom");

    }
    return false
  }


}, false);
