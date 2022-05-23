function validateEmail (email){
    const re = /\S+@\S+\.\S+/
    return  re.test(email)
}

function register (){
    const name = document.querySelector(".register-name").value
    const email = document.querySelector(".register-email").value
    const password1 = document.querySelector(".register-password1").value
    const password2 = document.querySelector(".register-password2").value

    if(name === "" && email === "" && password1 === "" && password2 === ""){
        console.log("sth. is undefined")
    }

    if(password1 !== password2){
        console.log("password isnt equal")
    }


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
            console.log(res)
        })        
    }else {
        console.log("email is not valid")
    }

}