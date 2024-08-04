document.addEventListener('DOMContentLoaded', function () {
    const themes = {
        "dracula": {
            "text": "#fff",
            "primary": "#2b2b2b",
            "base": "#1c1c1c",
            "secondary": "#1f1f1f"
        },
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
    cloakSites = {
        "gd": ["My Drive - Google Drive", "https://drive.google.com"],
        "gc": ["Home", "https://sites.google.com/view/classroom-workspace/"],
        "msn": ["my.sduhsd.net", "https://www.sduhsd.net/subsites/my-sduhsd-net/"]
      }
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    const nextToStyleButton = document.getElementById('next-to-style');
    const finishButton = document.getElementById('finish');

    document.querySelectorAll('.theme-btn')[0].classList.add('selected');
    document.querySelectorAll('.cloak-btn')[0].classList.add('selected');

    document.querySelectorAll('.theme-btn').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            theme = this.dataset.theme;
            var r = document.querySelector(':root')
            r.style.setProperty('--base', themes[theme]['base']);
            r.style.setProperty('--secondary', themes[theme]['secondary']);
            r.style.setProperty('--primary', themes[theme]['primary']);
            r.style.setProperty('--text', themes[theme]['text']);
            localStorage.setItem('theme', theme)
        });
    });

    document.querySelectorAll('.cloak-btn').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.cloak-btn').forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            cloak = this.dataset.style;

            var site = cloakSites[cloak]
            
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
            localStorage.setItem('cloak', cloak)
        });
    });

    nextToStyleButton.addEventListener('click', function () {
        page1.classList.add('hidden');
        page2.classList.remove('hidden');
    });

    finishButton.addEventListener('click', function () {
        window.location.href = '/'
    });
});
