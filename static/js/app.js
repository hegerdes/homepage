/* Libs loaded */
let fuse = null
let goSearch = null
let cacheKey = "search_index.en.json"

let sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    let options = {
      offset: -100
    }
    new SweetScroll(options);
  } catch (error) {
    console.warn("SweetScroll could not be loaded. Ignoring it!", error)
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
    console.warn("ParticleJS could not be loaded. Ignoring it!", error)
  }

  try {
    const fuseOptions = {
      isCaseSensitive: false,
      keys: [
        "title",
        "description"
      ]
    };

    // Check if the data is already in localStorage
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      fuse = new Fuse(JSON.parse(cachedData), fuseOptions);
      console.info('Loaded search-index from cache');
    } else {
      // Fetch the JSON document
      fetch("/search_index.en.json")
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response for search index load was not ok ' + response.statusText)
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem(cacheKey, JSON.stringify(data));
          fuse = new Fuse(data, fuseOptions);
          console.info('Loaded search-index from server');
        })
        .catch(error => {
          throw error
        });
    }
  } catch (error) {
    console.warn("Fuse could not be loaded. Ignoring it!", error)
  }

  goSearch = (event) => {
    // Prevent default submit load
    event.preventDefault()

    // Get main content container on screen
    const main1 = document.querySelector('body > section')
    const main2 = document.querySelector('body > div')
    const input = document.querySelector('input[type="search"]');
    const footer = document.querySelector('#footer')

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

    // Replace main content with search res
    main.innerHTML = html
    footer.classList.remove("fixed-bottom")

    // Collapse navbar if it is shown
    if (document.getElementById("navbarSupportedContent")) {
      document.getElementById("navbarSupportedContent").classList.remove("show")
    }
    // Remove particales if present
    if (document.getElementById("particles-js")) {
      document.getElementById("particles-js").remove()
    }
    // Remove projects if present
    if (document.getElementById("projects")) {
      document.getElementById("projects").remove()
    }

    if (search_res.length <= 1) {
      footer.classList.add("fixed-bottom");
    }

    if (document.getElementById("search-results")) {
      document.getElementById("search-results").scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
    return false
  }

}, false);
