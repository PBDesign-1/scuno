 const init = async ()=>{
    const fetchCurrentYearRaw = await fetch("/general/myCurrentYear")
    const fetchCurrentYear = await fetchCurrentYearRaw.json()
    const {subjects} = fetchCurrentYear.response
    let grades = []
    let subjectGrades = []
    let subjectNamesArray = []
    let subjectArray = []


    Object.keys(subjects).forEach(key=>{
        subjectNamesArray.push(key)
        const subject = subjects[key]
        const {classtests, tests, oralGrades} = subject
        
        let testDurchschnitt =  (tests.reduce((all, part)=>all + part.grade, 0) / tests.length) || tests[0] || 0
        let classtestDurchschnitt =  (classtests.reduce((all, part)=>all + part.grade, 0) / classtests.length) || classtests[0] || 0
        let oralGradesDurchschnitt =  (oralGrades.reduce((all, part)=>all + part.grade, 0) / oralGrades.length) || oralGrades[0] || 0

        subjectArray.push({subject: key, durchschnitt: (testDurchschnitt * subject.percentages.tests + classtestDurchschnitt * subject.percentages.classtests + oralGradesDurchschnitt * subject.percentages.oralGrades)})

        const write = [...classtests, ...tests]
        write.forEach(grade=>{
            grades.push({grade, type: "schriftl.", subject: key})
        })
        oralGrades.forEach(grade=>{
            grades.push({grade, type: "mündl.", subject: key})
        })
        
    }) 
    console.log(subjectArray)
    const sortedGrades = grades.sort((a, b)=>a.grade - b.grade)    
    const sortedSubjects = subjectArray.sort((a, b)=>a.durchschnitt - b.durchschnitt)     
    
    const bestnote = sortedGrades[0].grade
    const besteNoten = sortedGrades.slice(0, 20).reduce((all, grade)=> all + `<div><p>${grade.grade}</p><p>${grade.subject}</p><p>${grade.type}</p></div>`, "")
    const durchschnitt = (sortedGrades.reduce((all, part)=>all + part.grade, 0) / sortedGrades.length) || bestnote.grade

    const subjectOptions = subjectNamesArray.reduce((all, sub)=>all + `<option>${sub}</option>`, "") 
    console.log(subjectOptions)

    document.querySelector(".dashboard").innerHTML = (
        `<div> <p>Durchschnitt</p> <h2>${durchschnitt}</h2></div>` + 
        `<div><p>Bestes Fach</p><h2>${sortedGrades[0].subject}</h2></div>` +
        `<div><h2>Beste Noten</h2><div>${besteNoten}</div></div>` +
        `<div><select>${subjectOptions}</select><select><option>Mündlich</option><option>Test</option><option>Klassenarbeit</option></select><input min=0 max=6 type='number' /><button class='dashboard-addGrade'>hinzufügen</button></div>` + 
        "<div><h2></h2><div><p>Fächer</p><p>Durchschnitt</p><p>mdl.</p><p>schriftl.</p></div></div>"
    );
}

init()