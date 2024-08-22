async function checkVerification(){
    res = await fetch("/verified", {
        method: "POST",
        body: JSON.stringify({"name": localStorage.getItem('verified')}),
        headers: {
            "Content-type": "application/json"
        }
    })
    if (!await res.json()) {
        window.location.href = '/verify.html'
    }
}

checkVerification();