const loadArchive = ()=>{
    fetch("/general/myYears").then(res=>res.json()).then((res)=>{
        console.log(res)
        let appendHtml = ""
        const years = res.response
        console.log(years.sort((a,b)=>b.year - a.year))
        years.sort((a,b)=>b.year - a.year).forEach(year=>{
            const {subjects} = year
            let grades = []
            
    
            Object.keys(subjects).forEach(key=>{
                const subject = subjects[key]
                const {classtests, tests, oralGrades} = subject
                
                const write = [...classtests, ...tests]
                write.forEach(grade=>{
                    grades.push({grade, type: "schriftl."})
                })

                oralGrades.forEach(grade=>{
                    grades.push({grade, type: "mündl."})
                })
            }) 
            const sortedGrades = grades.sort((a, b)=>a.grade - b.grade)         
            
            const bestnote = sortedGrades[0].grade
            const durchschnitt = (sortedGrades.reduce((all, part)=>all + part.grade, 0) / sortedGrades.length) || bestnote.grade

            appendHtml += `<div><p>${year.year}</p><p>Bestnote: ${bestnote}</p><p>Durchschnitt: ${durchschnitt}</p></div>`
        })
        
        document.querySelector(".archive-container").innerHTML = appendHtml

    })
}

loadArchive()

function validateEmail (email){
    const re = /\S+@\S+\.\S+/
    return  re.test(email)
}
console.log(validateEmail("abc@abcabc"))