function login (){
    const email = document.querySelector(".login-email").value 
    const password = document.querySelector(".login-password").value
    
    if(!email || email === "" || password === "" || !password ){
        setErrorMessage("Überprüfe deine Angaben")
    }else {
        fetch("/authentication/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json()).then((res)=>{
            if(res.success){
                location.reload()
            }else if(res.msg){
                setErrorMessage(res.msg)
            }else{
                setErrorMessage("Etwas ist schiefgelaufen. Versuche es nochmal.")
            }
            
        })        
    }

}





function setErrorMessage(msg){
    document.querySelector(".login-error-container").innerHTML = `<div class="login-error"><p>${msg}</p></div>`
}