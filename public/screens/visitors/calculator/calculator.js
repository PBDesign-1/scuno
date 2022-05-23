function calculateGrade (){
    const yours = document.querySelector(".calculator-visitors-yours").value
    const max = document.querySelector(".calculator-visitors-max").value

    const grade = Math.round((6 - ((yours / max) * 5)) * 1000) / 1000

    document.querySelector(".calculated-visitor-grade").innerHTML = grade

    let HTMLtoAppend = ""
    for(let i = 0; i <= max; i++){
        const thisGrade = Math.round((6 - ((i / max) * 5)) * 1000) / 1000
        HTMLtoAppend +=  `<div class="possibility-visitor"><p>${i}</p><p>${thisGrade}</p></div>`
    }
    document.querySelector(".possibilities-visitors").innerHTML = HTMLtoAppend

}