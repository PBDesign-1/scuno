const calcPerc = (perc, max)=>1/(max/perc)
let years = (new Date(new Date().getFullYear(), 8, 2) - new Date()) > 0 ? `${new Date().getFullYear() - 1}-${new Date().getFullYear()}` : `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
 
 const init = async ()=>{
    const fetchCurrentYearRaw = await fetch(`/general/getYear/${years}`)
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
        const allPercentages = (subject.tests.length > 0 ? subject.percentages.tests : 0) + (subject.classtests.length > 0 ? subject.percentages.classtests : 0) + (subject.oralGrades.length > 0 ? subject.percentages.oralGrades : 0);
        
        let testDurchschnitt =  (tests.reduce((all, part)=>all + part, 0) / tests.length) || tests[0] || 0
        let classtestDurchschnitt =  (classtests.reduce((all, part)=>all + part, 0) / classtests.length) || classtests[0] || 0
        let oralGradesDurchschnitt =  (oralGrades.reduce((all, part)=>all + part, 0) / oralGrades.length) || oralGrades[0] || 0

        subjectArray.push({subject: key, durchschnitt: (testDurchschnitt * calcPerc(subject.percentages.tests, allPercentages) + classtestDurchschnitt * calcPerc(subject.percentages.classtests, allPercentages) + oralGradesDurchschnitt * calcPerc(subject.percentages.oralGrades, allPercentages)), tests: tests.length, classtests: classtests.length, oralGrades: oralGrades.length})

        classtests.forEach(grade=>{
            grades.push({grade, type: "Klassenarbeit", subject: key})
        })
        tests.forEach(grade=>{
            grades.push({grade, type: "Test", subject: key})
        })
        oralGrades.forEach(grade=>{
            grades.push({grade, type: "mündlich", subject: key})
        })
        
    }) 
    const sortedGrades = grades.sort((a, b)=>a.grade - b.grade)    
    const sortedSubjects = subjectArray.sort((a, b)=>a.durchschnitt - b.durchschnitt)     
    
    const besteNoten = sortedGrades.slice(0, 20).reduce((all, grade)=> all + `<div class="dashboard-besteNoten-part"><p>${grade.grade}</p><p>${grade.subject}</p><p>${grade.type}</p></div>`, "")
    const durchschnitt = (parseInt(((sortedSubjects.reduce((all, part)=>all + (part.durchschnitt || 0), 0) / sortedSubjects.filter(s=>!!s.durchschnitt).length)) * 1000) / 1000) || (sortedSubjects.length > 0 ? parseInt(sortedSubjects[0].durchschnitt * 1000) / 1000 : "-")

    const subjectOptions = subjectNamesArray.reduce((all, sub)=>all + `<option>${sub}</option>`, "") 
    const subjectsMapped = sortedSubjects.map(sub=>`<div class='dashboard-fach'onclick='openSubjectRoute("${sub.subject}")' ><p>${sub.subject}</p><p>${parseInt(sub.durchschnitt * 1000) / 1000 || "-"}</p><p class='delete-dash'>${sub.classtests}</p><p  class='delete-dash'>${sub.tests}</p><p  class='delete-dash'>${sub.oralGrades}</p><img alt="x" data-subject="${sub.subject}" class="dashboard-fach-x" src="images/x.png" /></div>`).reduce((all, sub)=> all + sub, "")


    document.querySelector(".dashboard-selectYear").innerHTML = fetchCurrentYear.years.reduce((all, y)=>all + `<option>${y[0]}-${y[1]}</option>`, "")
    document.querySelector(".dashboard-selectYear").value = years

    document.querySelector(".dashboard").innerHTML = (
        `<div class="dashboard-part dashboard-durchschnitt"> <p>Durchschnitt</p> <h2>${durchschnitt || "-"}</h2></div>` + 
        `<div class="dashboard-part dashboard-bestesFach"><p>Bestes Fach</p><h2>${sortedGrades[0] ? sortedGrades[0].subject : "-"}</h2></div>` +
        `<div class="dashboard-besteNoten dashboard-part"><h2>Beste Noten</h2><div>${besteNoten}</div></div>` +
        (subjectArray.length > 0 ? `<div class="dashboard-part dashboard-noteHinzufügen"><select class="dashboard-addGrade-selectSubject">${subjectOptions}</select><select class="dashboard-addGrade-selectType"><option>Mündlich</option><option>Test</option><option>Klassenarbeit</option></select><input class="dashboard-noteHinzufügen-neueNote dashboard-addGrade-grade" min=0 max=6 type='number' placeholder="Note" /><button onclick="addGrade()" class='dashboard-addGrade'>hinzufügen</button></div>` : "") + 
        `<div class="dashboard-part dashboard-fächer"><div class="dashboard-fächer-info"><p>Fächer</p><p>Durchschnitt</p><p class='delete-dash'>Klassenarbeiten</p><p class='delete-dash'>Tests</p><p class='delete-dash'>mündlich</p></div><div class='dashboard-fächer-content'>${subjectsMapped}</div><button class="dashboard-addSubject" onclick="openSubjectModal()">Neues Fach hinzufügen</button></div>`
    );

    document.querySelector(".dashboard-fach-x").addEventListener("click", (e)=>deleteSubject(e))
}

init()



function onChangeYear(){
    years = document.querySelector(".dashboard-selectYear").value
    init()
}


async function addGrade (){
    if(!!document.querySelector(".dashboard-error")){
        document.querySelector(".dashboard-error").remove()
    }
    
    
    const subject = document.querySelector(".dashboard-addGrade-selectSubject").value
    const type = document.querySelector(".dashboard-addGrade-selectType").value
    const grade = document.querySelector(".dashboard-addGrade-grade").value

    if(subject === "" || type === "" || grade === ""){
        setErrorMessage("Dein Fach, deine Note oder die Art der Note sind nicht definiert")
    }else if(grade < 1 || grade > 6){
        setErrorMessage("Noten müssen sich zwischen 1 und 6 befinden")
    }else {
        const addNewGrade = await fetch("/general/grade", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                type,
                grade,
                subject,
                years
            })
        })
        init()
    }

}







function openSubjectModal(){
    const modal = document.createElement("div")
    modal.innerHTML = "<div class='dashboard-subjectModal-background'> </div><div class='dashboard-subjectModal'>  <div class='dashboard-subjectModal-content'>  <div class='dashboard-subjectModal-error-container'></div>  <div class='dashboard-subjectModal-name'><p>Name des Fachs</p><input class='dashboard-subjectModal-nameInput' type='text' placeholder='z.B. Mathe, Deutsch, ..'/></div>  <div class='dashboard-subjectModal-input-container'><p>Klassenarbeiten</p><input type='number' class='dashboard-subjectModal-classtestsInput' placeholder='Anteil der Gesamtnote (in %)' /></div>   <div class='dashboard-subjectModal-input-container'><p>Tests</p><input type='number' class='dashboard-subjectModal-testsInput' placeholder='Anteil der Gesamtnote (in %)' /></div>  <div class='dashboard-subjectModal-input-container'><p>Mündlich</p><input type='number' class='dashboard-subjectModal-oralGradesInput' placeholder='Anteil der Gesamtnote (in %)' /></div>      <div class='dashboard-subjectModal-buttons'> <button class='dashbord-subjectModal-buttons-close' onclick='closeSubjectModal()'>Abbrechen</button> <button class='dashbord-subjectModal-buttons-add' onclick='addSubject()'>Hinzufügen</button> </div>  </div> </div>"
    modal.className = "dashboard-subjectModal-container"

    document.querySelector("html").appendChild(modal)
}
function closeSubjectModal (){
    document.querySelector(".dashboard-subjectModal-container").remove()
}
async function addSubject(){
    const newSubject = document.querySelector(".dashboard-subjectModal-nameInput").value

    const classtests = parseFloat(document.querySelector(".dashboard-subjectModal-classtestsInput").value) / 100
    const tests = parseFloat(document.querySelector(".dashboard-subjectModal-testsInput").value) / 100
    const oralGrades = parseFloat(document.querySelector(".dashboard-subjectModal-oralGradesInput").value) / 100

    if(newSubject === "" || !newSubject    || classtests === "" || (!classtests && classtests !== 0)    || tests === "" || (!tests && tests !== 0)    || oralGrades === "" ||(!oralGrades && oralGrades !== 0)  ){
        setModalErrorMessage("Überprüfe deine Angaben")
    } else if(Math.round((classtests + tests + oralGrades) * 1000000000) / 1000000000   !== 1){
        setModalErrorMessage("Der Gesamtprozentanteil beträgt nicht 100%.")
    }else {
        const adding = await fetch("/general/subject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                newSubject,
                classtests,
                tests,
                oralGrades,
                years
            })
            
        })
        const addingResponse = await adding.json()

        if(addingResponse.success){
            closeSubjectModal()
            init()            
        }else if(addingResponse.exists){
            setModalErrorMessage("Dieses Fach existiert bereits")
        }else {
            setModalErrorMessage("Etwas ist schiefgelaufen. Versuche es nochmal.")
        }

    }

}



async function deleteSubject (e){
    const subject = e.target.dataset.subject
    e.stopPropagation()
    e.preventDefault()
    if(window.confirm(`Willst du das Fach ${subject} wirklich löschen`)){
        fetch("/general/deleteSubject", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject,
                years
            })
        }).then(()=>init())
        
    }
}

function openSubjectRoute (subject){
    window.location.assign(`/fach?subject=${subject}&years=${years}`)
}







function setErrorMessage(msg){
    document.querySelector(".dashboard-error-container").innerHTML = `<div class="dashboard-error"><p>${msg}</p></div>`
}
function setModalErrorMessage (msg){
    document.querySelector(".dashboard-subjectModal-error-container").innerHTML = `<div class="dashboard-subjectModal-error"><p>${msg}</p></div>`
}