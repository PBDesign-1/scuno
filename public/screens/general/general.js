function toggleMenu (){
    console.log("test")
    document.querySelector(".header-container-mobile").classList.toggle("active")
    document.querySelector(".header-toggle").classList.toggle("active")
}

function logout (){
    fetch("/authentication/logout").then(()=>location.reload())
}