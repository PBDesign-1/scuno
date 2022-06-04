function validateEmail (email){
    const re = /\S+@\S+\.\S+/
    return  re.test(email)
}

function register (){
    const name = document.querySelector(".register-name").value
    const email = document.querySelector(".register-email").value
    const password1 = document.querySelector(".register-password1").value
    const password2 = document.querySelector(".register-password2").value

    if(name === "" || email === "" || password1 === "" || password2 === ""){
        setErrorMessage("Überprüfe deine Angaben")
    }else if(password1 !== password2){
        setErrorMessage("Dein wiederholtes Password unterscheidet sich.")
    }else {
        if(validateEmail(email)){
            fetch("/authentication/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password: password1
                })
            }).then(res=>res.json()).then(res=>{
                if(res.success){
                    location.assign("/login")
                }else if(res.msg){
                    setErrorMessage(res.msg)
                }else{
                    setErrorMessage("Etwas ist schiefgelaufen. Versuche es nochmal.")
                }
            })        
        }else {
            setErrorMessage("Deine Emailadresse ist ungültig.")
        }
    }
}




function setErrorMessage(msg){
    document.querySelector(".register-error-container").innerHTML = `<div><p>${msg}</p></div>`
}