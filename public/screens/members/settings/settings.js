let changes = {}

function init (){
    fetch("/general/me").then(res=>res.json()).then(res=>{
        const points = ["name", "email"]
        points.forEach(key=>{
            console.log(res.response[key])
            document.querySelector(`.settings-${key}`).value = res.response[key]
        })
        
        
    })
}
init()

function newChange (type){
    console.log(type)
    const change = document.querySelector(`.settings-${type}`).value
    changes[type] = change
}

function commitChanges (){
    console.log(changes)
    fetch("/general/changeMe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            changes
        })
    })
}