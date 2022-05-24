const calcPerc = (perc, max)=>1/(max/perc)

const loadArchive = ()=>{
    fetch("/general/myYears").then(res=>res.json()).then((res)=>{
        let appendHtml = ""
        const years = res.response

        years.sort((a,b)=>b.year - a.year).forEach(year=>{
            const {subjects} = year
            let grades = []
            let subjectArray = []
    
            Object.keys(subjects).forEach(key=>{
                const subject = subjects[key]
                const {classtests, tests, oralGrades} = subject
                
                const allPercentages = (subject.tests.length > 0 ? subject.percentages.tests : 0) + (subject.classtests.length > 0 ? subject.percentages.classtests : 0) + (subject.oralGrades.length > 0 ? subject.percentages.oralGrades : 0);
                console.log(allPercentages, subject)
                let testDurchschnitt =  (tests.reduce((all, part)=>all + part.grade, 0) / tests.length) || tests[0] || 0
                let classtestDurchschnitt =  (classtests.reduce((all, part)=>all + part.grade, 0) / classtests.length) || classtests[0] || 0
                let oralGradesDurchschnitt =  (oralGrades.reduce((all, part)=>all + part.grade, 0) / oralGrades.length) || oralGrades[0] || 0
        
                subjectArray.push({subject: key, durchschnitt: (testDurchschnitt * calcPerc(subject.percentages.tests, allPercentages) + classtestDurchschnitt * calcPerc(subject.percentages.classtests, allPercentages) + oralGradesDurchschnitt * calcPerc(subject.percentages.oralGrades, allPercentages))})


                const write = [...classtests, ...tests]
                write.forEach(grade=>{
                    grades.push({grade, type: "schriftl."})
                })

                oralGrades.forEach(grade=>{
                    grades.push({grade, type: "mündl."})
                })
            }) 
            console.log(subjectArray)

            const sortedGrades = grades.sort((a, b)=>a.grade - b.grade)         
            const bestnote = sortedGrades[0].grade
            const durchschnitt = (subjectArray.reduce((all, part)=>all + part.durchschnitt, 0) / subjectArray.length) || subjectArray[0].durchschnitt

            appendHtml += `<div class="archive-year"><p>${year.year}</p><p>Bestnote: ${bestnote}</p><p>Durchschnitt: ${durchschnitt}</p></div>`
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