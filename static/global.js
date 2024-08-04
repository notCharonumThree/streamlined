function encode(string) {
    return encodeURIComponent(
      string
        .toString()
        .split('')
        .map((char, ind) => {
          let indCheck
          if (ind % 2 === 0) { indCheck = false } else { indCheck = true }
  
          return indCheck ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
        })
        .join('')
    )
  }
  function decode(string) {
    const [input, ...search] = string.split('?')
  
    return (
      decodeURIComponent(input)
        .split('')
        .map((char, ind) => {
          let indCheck
          if (ind % 2 === 0) { indCheck = false } else { indCheck = true }
  
          return indCheck ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
        })
        .join('') + ((search.length > 0) ? `?${search.join('?')}` : '')
    )
  }


const form = document.getElementById("fs")
const input = document.getElementById("is")

if (form && input) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault()
    if (window.top.location.pathname === "/ta") {
      processUrl(input.value, "")
    } else {
      processUrl(input.value, "/ta")
    }
  })
}
function processUrl(value, path) {
  let url = value.trim()
  const engine = localStorage.getItem("engine")
  const searchUrl = engine ? engine : "https://www.google.com/search?q="

  if (!isUrl(url)) {
    url = searchUrl + url
  } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
    url = "https://" + url
  }

  sessionStorage.setItem("GoUrl", __uv$config.encodeUrl(url))
  const dy = localStorage.getItem("dy")

  if (dy === "true") {
    window.location.href = "/a/q/" + __uv$config.encodeUrl(url)
  } else {
    if (path) {
      location.href = path
    } else {
      window.location.href = "/a/" + __uv$config.encodeUrl(url)
    }
  }
}

function go(value) {
  processUrl(value, "/ta")
}

function blank(value) {
  processUrl(value)
}

function dy(value) {
  processUrl(value, "/a/q/" + __uv$config.encodeUrl(value))
}

function isUrl(val = "") {
  if (/^http(s?):\/\//.test(val) || (val.includes(".") && val.substr(0, 1) !== " ")) {
    return true
  }
  return false
}

const theme = localStorage.getItem('theme')

const themes = {
    "mocha": {
        "base": "#1e1e2e",
        "secondary": "#313244",
        "primary": "#4f5370",
        "text": "#cdd6f4"
    },
    "latte": {
        "base": "#eff1f5",
        "secondary": "#ccd0da",
        "primary": "#bcc0cc",
        "text": "#4c4f69"
    }
}

if (theme === null) {
    localStorage.setItem('theme', 'dracula')
}

var r = document.querySelector(':root')

if (theme != 'dracula') {
    r.style.setProperty('--base', themes[theme]['base']);
    r.style.setProperty('--secondary', themes[theme]['secondary']);
    r.style.setProperty('--primary', themes[theme]['primary']);
    r.style.setProperty('--text', themes[theme]['text']);
}

cloakSites = {
  "gd": ["My Drive - Google Drive", "https://drive.google.com"],
  "gc": ["Home", "https://sites.google.com/view/classroom-workspace/"],
  "msn": ["my.sduhsd.net", "https://www.sduhsd.net/subsites/my-sduhsd-net/"]
}

if (localStorage.getItem('cloak') !== null) {
  var site = cloakSites[localStorage.getItem('cloak')]

  window.parent.document.title = site[0]
  const linkElement = window.parent.document.createElement('link')
  linkElement.rel = 'icon'
  linkElement.href = 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=' + site[1] + '&size=128'
  var divElement = window.parent.document.head
    
  var linkElements = divElement.getElementsByTagName('link');
  
  var linkElementsArray = Array.prototype.slice.call(linkElements);
  linkElementsArray.forEach(function(linkElement) {
      linkElement.parentNode.removeChild(linkElement);
  });
  window.parent.document.head.appendChild(linkElement)
}