function calculateGrade (){
    const yours = document.querySelector(".calculator-member-yours").value
    const max = document.querySelector(".calculator-member-max").value

    const grade = Math.round((6 - ((yours / max) * 5)) * 1000) / 1000

    document.querySelector(".calculated-member-grade").innerHTML = grade

    let HTMLtoAppend = ""
    for(let i = 0; i <= max; i++){
        const thisGrade = Math.round((6 - ((i / max) * 5)) * 1000) / 1000
        HTMLtoAppend +=  `<div class="possibility-member"><p>${i}</p><p>${thisGrade}</p></div>`
    }
    document.querySelector(".possibilities-member").innerHTML = HTMLtoAppend

}