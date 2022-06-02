const params = new URLSearchParams(window.location.search) 
const years = params.get("years")
const subject = params.get("subject")

async function init (){


    const subjectReqRaw = await fetch(`/general/getYear/${years}`)
    const subjectReq = await subjectReqRaw.json()

    console.log(subjectReq)
    const subjectForPage = subjectReq.response.subjects[subject]

    console.log(subjectForPage)
    document.querySelector(".subject-info").innerHTML = `<h1>${subject}</h1>   <div class="subject-part subject-noteHinzufügen"><select class="subject-addGrade-selectType"><option>Mündlich</option><option>Test</option><option>Klassenarbeit</option></select><input class="subject-noteHinzufügen-neueNote subject-addGrade-grade" min=0 max=6 type='number' placeholder="Note" /><button onclick="addGrade()" class='subject-addGrade'>hinzufügen</button></div>`

    const classtestsMapped = subjectForPage.classtests.map((n, i)=>`<div class="subject-grade"><p>${n}</p><img src="/images/x.png" alt="" onclick="deleteGrade('classtests', ${i})" ></div>`).join("")
    const testsMapped = subjectForPage.tests.map((n, i)=>`<div class="subject-grade"><p>${n}</p><img src="/images/x.png" alt="" onclick="deleteGrade('tests', ${i})" ></div>`).join("")
    const oralGradesMapped = subjectForPage.oralGrades.map((n, i)=>`<div class="subject-grade"><p>${n}</p><img src="/images/x.png" alt="" onclick="deleteGrade('oralGrades', ${i})" ></div>`).join("")

    console.log(classtestsMapped, testsMapped, oralGradesMapped)
    document.querySelector(".subject-content").innerHTML = (
        (subjectForPage.classtests.length > 0 ? ("<div><h2>Klassenarbeiten</h2><div class='subject-content-classtests'>" + classtestsMapped + "</div></div>") : "") +
        (subjectForPage.tests.length > 0 ? ("<div><h2>Tests</h2><div class='subject-content-tests'>" + testsMapped + "</div></div>") : "") +
        (subjectForPage.oralGrades.length > 0 ? ("<div><h2>Mündlich</h2><div class='subject-content-oralGrades'>" + oralGradesMapped + "</div></div>") : "")
    )
}

init()







async function addGrade (){
    const type = document.querySelector(".subject-addGrade-selectType").value
    const grade = document.querySelector(".subject-addGrade-grade").value

    if(subject === "" || type === "" || grade === ""){

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

async function deleteGrade (type, index){
    fetch("/general/deleteGrade", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type,
            index,
            years,
            subject
        })
    }).then(()=>init())
}