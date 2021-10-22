const mainElement = document.getElementById('main')
const promptElement = document.getElementById('prompt')

let companies = null 
document.addEventListener('submit', async event => {
    event.preventDefault()

    const introForm = document.forms['introForm']
    let response = await fetch('/api/intro', {
        method: 'post',
        body: new FormData(introForm) 
    })

    if (!response.ok) {
        promptElement.innerText = 
            `Could not post your introduction :(\n${response.status} ${response.statusText}` 
        return
    }

    companies = await response.json()
    showCompanyPicker()
})

document.addEventListener('input', async event => {
    if (event.target.id != 'companies') return

    const selected = event.target.selectedOptions[0].value.replace(/ +/g, '_')
    const response = await fetch(`/api/companies/${selected}`)
    const pickedCompany = await response.json()
    showCompanyTable(pickedCompany)
})


function showCompanyPicker() {
    promptElement.innerText = 'Your introduction is sent successfully! \nSelect the company you are interested in.'

    const picker = document.createElement('select')
    Object.assign(picker, {
        name: 'companies',
        id: 'companies'
    })
    picker.innerHTML = '<option value="">--Pick a Company--</option>'
    companies.forEach(company => {
        picker.innerHTML += `<option value="${company}">${company}</option>`
    })

    mainElement.innerHTML = ''
    mainElement.appendChild(picker)
}

function showCompanyTable(data) {
    promptElement.innerText = 
        `Salary Insiders data on ${data[0].company} is shown in the table below`

    const table = document.createElement('table')
    const thead = table.createTHead().insertRow()
    const tbody = table.createTBody()

    Object.keys(data[0]).forEach(key => {
        thead.insertCell().innerText = key
    })

    data.forEach(row => {
        let newRow = tbody.insertRow()  
        Object.values(row).forEach(cell => {
            newRow.insertCell().innerText = cell
        })
    })

    mainElement.innerHTML = ''
    mainElement.appendChild(table)

    const backButton = document.createElement('button')
    Object.assign(backButton, {
        innerText: 'Pick Another Company',
        onclick: showCompanyPicker
    })
    mainElement.appendChild(backButton)
}
