function toggleMenu (){
    document.querySelector(".header-container-mobile").classList.toggle("active")
    document.querySelector(".header-toggle").classList.toggle("active")
}

function logout (){
    fetch("/authentication/logout").then(()=>location.reload())
}

function validateEmail (email){
    const re = /\S+@\S+\.\S+/
    return  re.test(email)
}
