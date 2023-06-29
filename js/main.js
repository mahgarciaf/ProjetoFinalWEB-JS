const conselhos = JSON.parse(localStorage.getItem("conselhos")) || []

const btnCloseModal = document.querySelector('#btnCloseModal')
const form = document.querySelector('form')
const editModal = document.querySelector('#edit-advice')
const btnTranslate = document.querySelector(".btn-translate")

const translation = (evento) => {
    const tag = evento.target.closest('.ticker')
    var adviceContent = tag.querySelector('p')
    
    console.log(adviceContent.innerText)
    loadTranslation(adviceContent)
    console.log(conselhos)
}

function loadTranslation(adviceContent) {
    fetch(`https://api.mymemory.translated.net/get?q=${adviceContent.innerText}&langpair=en-GB|pt-BR`)
        .then((res) => res.json())
        .then((data) => {
            adviceContent.textContent = data.responseData.translatedText;
            console.log(data)
            console.log(data.responseData)
            console.log(data.responseData.translatedText)
        })
        localStorage.setItem("conselhos", JSON.stringify(conselhos))
}

const editarAdvice = (evento) => {
    const tag = evento.target.closest('.ticker')
    const adviceID = tag.parentNode.parentNode.parentNode
    const teste = adviceID.querySelector('id')
    const adviceName = tag.querySelector('h2')
    const adviceContent = tag.querySelector('p')
    const modal = document.querySelector('#edit-advice')
    modal.style.display = "flex"

    const h2 = modal.querySelector('h2')
    h2.textContent = adviceName.innerText
    const textArea = modal.querySelector('textArea')
    textArea.value = adviceContent.innerText

    const btnEdit = modal.querySelector('.button-modal')
    
    btnEdit.addEventListener('click', evento => {
        evento.preventDefault()
        adviceContent.innerText = textArea.value
        console.log(adviceContent.innerText);
        modal.style.display = "none"
    })

    const btnCloseEdit = modal.querySelector('#btnCloseModalEdit')
    
    btnCloseEdit.addEventListener('click', evento => {
        modal.style.display = "none"
    })

    localStorage.setItem("conselhos", JSON.stringify(conselhos))
}

const apagarAdvice = (evento) => {
    const tag = evento.target.closest('.ticker')
    // removendo a div
    tag.remove()

    //removendo do local storege
    //procurando o indice
    const adviceIndex = conselhos.findIndex(elemento => elemento.id == tag.id)
    //removendo o objeto
    conselhos.splice(adviceIndex, 1)
    //atualizando o local storege
    localStorage.setItem("conselhos", JSON.stringify(conselhos))
    
}

const adviceMouseEnter = (evento) => {
    const tag = evento.target
    const botoes = tag.querySelector('.botoes')
    botoes.style.display = "block"
    tag.style.borderColor = "#e37c8f"
    tag.style.backgroundColor = "#e37c8f"
    tag.style.color = "#000"
}

const adviceMouseLeave = (evento) => {
    const tag = evento.target
    const botoes = tag.querySelector('.botoes')
    botoes.style.display = "none"
    tag.style.borderColor = "#52afa6"
    tag.style.backgroundColor = "#eabb00"
    tag.style.color = "#000"
}

const atribuirEvento = () => {
    const todosAdvice = document.querySelectorAll('.ticker')

    todosAdvice.forEach(elemento => {
        const btn_remove = elemento.querySelector('.btn-remove')
        btn_remove.addEventListener('click', apagarAdvice)
        const btn_edit = elemento.querySelector('.btn-edit')
        btn_edit.addEventListener('click', editarAdvice)
        const btn_translate = elemento.querySelector('.btn-translate')
        btn_translate.addEventListener('click', translation)


        elemento.addEventListener("mouseenter", adviceMouseEnter)
        elemento.addEventListener("mouseleave", adviceMouseLeave)
    })

    

}

conselhos.forEach(element => {
    criarAdvice(element)
});

const openModal = (idModal) => {
    const divModal = document.querySelector(idModal)
    divModal.style.display = "flex"
}

btnCloseModal.addEventListener('click', evento => {
    //console.log(evento.target.closest('#add-stock'))
    //const modal = evento.target.parentNode.parentNode
    const modal = evento.target.closest('#add-stock')
    modal.style.display = "none"
})

const consultaAdvice = async (id) => {

    const response = await fetch(`https://api.adviceslip.com/advice/${id}`)
    const data = await response.json()
    return data

}

const advice = async (id) => {

    try {
        const data = await consultaAdvice(id)
        // const dataTranslate = await translateAdvice()
        // console.log(dataTranslate)
        const adviceAtual = {
            "idAdvice": data.slip.id,
            "advice": data.slip.advice
        }
        
        criarAdvice(adviceAtual)
        conselhos.push(adviceAtual)

        localStorage.setItem("conselhos", JSON.stringify(conselhos))


    } catch (error) {
        
    }

}

function criarAdvice(adviceAtual) {

    const newAdvice = 
    `<div class="ticker" id="${adviceAtual.idAdvice}">
        <button class="btn-close">x</button>
        <h2>ADVICE #${adviceAtual.idAdvice}</h2>
        <p>${adviceAtual.advice}</p>
        <div class="botoes">
            <button class="btn-translate">translate</button>
            <button class="btn-edit">edit</button>
            <button class="btn-remove">remove</button>
        </div>
    </div>`

    const listaAdvice = document.querySelector('#tickers-list')
    listaAdvice.innerHTML = listaAdvice.innerHTML + newAdvice

    atribuirEvento()

}

form.addEventListener('submit', evento => {
    evento.preventDefault()
    const input = form.querySelector('#ticker')
    //console.log(input)
    const idAdvice = input.value
    //console.log(idAdvice)

    advice(idAdvice)

    const modal = evento.target.closest('#add-stock')
    modal.style.display = "none"

    input.value = ""
})


