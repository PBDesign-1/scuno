const loadArchive = ()=>{
    fetch("/general/myYears").then(res=>res.json()).then((res)=>{
        console.log(res)
        const years = res.response
        years.forEach(year=>{
            const {subjects} = year
            let grades = []
            let appendHtml = ""
    
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
            
            const bestnote = sortedGrades[0]
            const durchschnitt = (sortedGrades.reduce((all, part)=>all + part.grade, 0) / sortedGrades.length) || bestnote.grade

            console.log(bestnote, durchschnitt, sortedGrades, sortedGrades.reduce((all, part)=>all + part.grade, 0))
        })

    })
}

loadArchive()

function validateEmail (email){
    const re = /\S+@\S+\.\S+/
    return  re.test(email)
}
console.log(validateEmail("abc@abcabc"))