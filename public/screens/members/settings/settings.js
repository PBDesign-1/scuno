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
    if(!!document.querySelector(".settings-error")){
        document.querySelector(".settings-error").remove()
    }
    
    if(Object.keys(changes).map(change=>(!!changes[change] && changes[change] !== "")).every(change=>change)){
        fetch("/general/changeMe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                changes
            })
        }).then(()=>init())    
    }else {
        setErrorMessage("Überprüfe deine Angaben")
    }

}




function setErrorMessage(msg){
    document.querySelector(".settings-error-container").innerHTML = `<div class="settings-error"><p>${msg}</p></div>`
}