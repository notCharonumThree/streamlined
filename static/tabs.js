navigator.serviceWorker.register("../sw.js?v=5-5-2024", {
    scope: "/a/",
})
  
  class Tab {
    active = false
    proxy = true
  
    header = document.createElement("div")
    iframe = document.createElement("iframe")
  
    constructor(url) {
      url =
        /^http(s?):\/\//.test(url) ||
        (url.includes(".") && url.substr(0, 1) !== " ")
          ? url.startsWith("http://") || url.startsWith("https://")
            ? url
            : "https://" + url
          : "https://www.google.com/search?q=" + url
      this.iframe.src = `/a/${encode(url)}`
      this.iframe.style.display = "none"
  
      this.header.innerHTML = `
            <span class="title">Tab</span>
            <span class="close">&times;</sp>
          `
    }
  }
  
  class TabManager {
    tabs = []
    tabHistory = []
  
    addTab(tab) {
      this.tabs.push(tab)
      this.setActiveTab(tab)
  
      tab.header.querySelector(".title").onclick = () => this.setActiveTab(tab)
      tab.header.querySelector(".close").onclick = () => this.closeTab(tab)
  
      document.querySelector("#content-container")?.appendChild(tab.iframe)
      document.querySelector("#tabs-container")?.appendChild(tab.header)
  
      tab.iframe.onload = () => {
        tab.header.querySelector(".title").textContent =
          tab.iframe.contentDocument?.title ?? "Tab"
        if (tab.iframe.contentDocument?.title === "")
          tab.header.querySelector(".title").textContent = "Tab"
        if (tab === this.activeTab)
          document.querySelector(".inp").value = decode(
            tab.iframe.contentWindow.location.href.split("/a/")[1]
          )
      }
    }
  
    closeTab(tab) {
      tab.header.remove()
      tab.iframe.remove()
  
      if (tab.active) {
        const lastTab = document.querySelector("#tabs-container")
          ?.lastElementChild
        if (lastTab !== undefined) lastTab?.querySelector(".title").click()
        else this.addTab(new Tab("https://google.com"))
      }
    }
  
    setActiveTab(tab) {
      this.tabs.forEach(tab => {
        if (!tab.active) {
          return
        }
        tab.active = false
        tab.iframe.style.display = "none"
        tab.header.classList.remove("active")
      })
  
      if (tab.proxy) {
        try {
          document.querySelector(".inp").value = decode(
            tab.iframe.contentWindow.location.href.split("/a/")[1]
          )
        } catch (e) {
          document.querySelector(".inp").value = "about:blank"
        }
      } else {
        tab.header.querySelector(".title").textContent = "Tab"
        try {
          document.querySelector(".inp").value =
            tab.iframe.contentWindow.location.href
        } catch (e) {
          document.querySelector(".inp").value = "about:blank"
        }
      }
  
      tab.active = true
      tab.iframe.style.display = "block"
      tab.header.classList.add("active")
  
      this.activeTab = tab
      this.tabHistory.push(tab)
    }
  }
  
  const tabManager = new TabManager()
  
  document.querySelector(".inp")?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      var url = encodeURI(document.querySelector(".inp").value)
      url =
        /^http(s?):\/\//.test(url) ||
        (url.includes(".") && url.substr(0, 1) !== " ")
          ? url.startsWith("http://") || url.startsWith("https://")
            ? url
            : "https://" + url
          : "https://www.google.com/search?q=" + url
      tabManager.activeTab.iframe.src = tabManager.activeTab.proxy
        ? `/a/${encode(url)}`
        : document.querySelector(".inp").value
    }
  })
  console.log(document.querySelector('.add'))
  document.querySelector(".add").onclick = () => {
    tabManager.addTab(new Tab("https://google.com"))
  }
  
  document.querySelector(".refresh").onclick = () => {
    tabManager.activeTab.iframe.contentWindow?.location.reload()
  }
  
  document.querySelector(".back").onclick = () => {
    tabManager.activeTab.iframe.contentWindow?.history.back()
  }
  
  document.querySelector(".forward").onclick = () => {
    tabManager.activeTab.iframe.contentWindow?.history.forward()
  }
  
  document.querySelector(".home").onclick = () => {
    window.location.href = '/'
  }

  document.querySelector(".popout").onclick = () => {
    const popup = open("about:blank", "_blank")
      if (!popup || popup.closed) {
        alert("Please allow popups and redirects.")
      } else {
        const doc = popup.document
        const iframe = doc.createElement("iframe")
        const style = iframe.style
        const link = doc.createElement("link")

        const name = localStorage.getItem("name") || "My Drive - Google Drive"
        const icon = localStorage.getItem("icon") || "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png"

        doc.title = name
        link.rel = "icon"
        link.href = icon

        iframe.src = document.querySelector('iframe').src
        style.position = "fixed"
        style.top = style.bottom = style.left = style.right = 0
        style.border = style.outline = "none"
        style.width = style.height = "100%"

        doc.head.appendChild(link)
        doc.body.appendChild(iframe)

        const script = doc.createElement("script")
        script.textContent = `
          window.onbeforeunload = function (event) {
            const confirmationMessage = 'GoGuardian Lock Prevention: Press Cancel to prevent this webpage from closing.';
            (event || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
          };
        `
        doc.head.appendChild(script)
        tabManager.closeTab(tabManager.activeTab);
      }
  }
  
  document.querySelector(".eruda").onclick = () => {
    var activeIframe = document.querySelector('iframe')
    const erudaWindow = activeIframe.contentWindow
    if (!erudaWindow) {
      console.error("No content window found for the active iframe")
      return
    }
    if (erudaWindow.eruda) {
      if (erudaWindow.eruda._isInit) {
        erudaWindow.eruda.destroy()
      } else {
        console.error("Eruda is not initialized in the active iframe")
      }
    } else {
      const erudaDocument = activeIframe.contentDocument
      if (!erudaDocument) {
        console.error("No content document found for the active iframe")
        return
      }
      const script = erudaDocument.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/eruda"
      script.onload = function () {
        if (!erudaWindow.eruda) {
          console.error("Failed to load Eruda in the active iframe")
          return
        }
        erudaWindow.eruda.init()
        erudaWindow.eruda.show()
      }
      erudaDocument.head.appendChild(script)
    }
  }
  
  document.onfullscreenchange = () => {
    document.querySelector(".fullscreen").innerHTML =
      document.fullscreenElement !== null ? "fullscreen_exit" : "fullscreen"
  }
  
  document.querySelector(".fullscreen").onclick = async () => {
    if (document.fullscreenElement === null) {
      await document
        .querySelector("#content-container")
        .requestFullscreen()
        .catch(e => console.error)
    } else {
      await document.exitFullscreen().catch(e => console.error)
    }
  }
  
  if (sessionStorage.getItem('GoUrl') === null) {
    tabManager.addTab(new Tab("https://google.com"))
  } else {
    tabManager.addTab(new Tab(decode(sessionStorage.getItem('GoUrl'))))
    console.log(decode(sessionStorage.getItem('GoUrl')))
    sessionStorage.removeItem('GoUrl')
  }
  