function login (){
    const email = document.querySelector(".login-email").value 
    const password = document.querySelector(".login-password").value
    console.log(email, password)
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
        }
        
    })
}