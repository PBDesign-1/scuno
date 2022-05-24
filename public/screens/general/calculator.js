function calculateGrade (){
    const yours = document.querySelector(".calculator-yours").value
    const max = document.querySelector(".calculator-max").value

    const grade = Math.round((6 - ((yours / max) * 5)) * 1000) / 1000

    document.querySelector(".calculated-grade").innerHTML = grade

    let HTMLtoAppend = ""
    for(let i = 0; i <= max; i++){
        console.log((max + 1) % 2, i === max, i, max)
        if((max + 1) % 2 && `${i}` == `${max}`){
            const thisGrade = Math.round((6 - ((i / max) * 5)) * 1000) / 1000
            const gridSide = i < ((max / 2)) ? 1 : 2;
            const gridRow = (i - Math.round((max / 2)) )+ 1
    
            console.log(gridSide, gridRow, "worked")
            HTMLtoAppend +=  `<div class="calculator-possibility" style="grid-column:${gridSide}; grid-row:${gridRow}" ><p>${i}</p><p>${thisGrade}</p></div>`
        }else {
            const thisGrade = Math.round((6 - ((i / max) * 5)) * 1000) / 1000
            const gridSide = i < ((max / 2)) ? 1 : 2;
            const gridRow = (i % Math.round((max / 2))) + 1
    
            console.log(gridSide, gridRow)
            HTMLtoAppend +=  `<div class="calculator-possibility" style="grid-column:${gridSide}; grid-row:${gridRow}" ><p>${i}</p><p>${thisGrade}</p></div>`
        }
        
    }
    document.querySelector(".calculator-possibilities").innerHTML = HTMLtoAppend

}