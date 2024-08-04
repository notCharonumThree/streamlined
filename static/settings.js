function themeChange(select) {
    localStorage.setItem('theme', select.value)
    window.location.reload()
}

function cloakChange(select) {
    localStorage.setItem('cloak', select.value)
    window.location.reload()
}

if (localStorage.getItem('theme') === null) {
    document.querySelector("#themeDropdown").value = 'dracula'
} else {
    document.querySelector("#themeDropdown").value = localStorage.getItem('theme')
}
if (localStorage.getItem('cloak') === null) {
    document.querySelector("#cloakDropdown").value = 'gd'
} else {
    document.querySelector("#cloakDropdown").value = localStorage.getItem('cloak')
}