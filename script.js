const text = document.querySelector('.text')
const btn = document.querySelector('.btn')
const input = document.querySelector('.input input')
const time = document.querySelector('.time span')
const accuracy = document.querySelector('.accuracy span')
const speed = document.querySelector('.speed span')
const mistakes = document.querySelector('.mistakes span')
const setTime = document.querySelector('.setTime')
const timeInput = document.querySelector('.setting input')
const setting = document.querySelector('.setting')

mistakes.innerText = 0;

let maxTime = 60
let leftTime = maxTime
time.innerText = leftTime
let typingTimer;

let isTyping = false

setTime.onclick = () => {

    let value = timeInput.value
    if (value > 120) {

        return alert('currently above 120s is not available')

    }
    maxTime = value
    leftTime = maxTime
    time.innerText = maxTime

}

//generating random quotes using quotable.io free api
async function randomQuote() {

    if (typingTimer != undefined && typingTimer != null) {

        clearInterval(typingTimer)

    }

    charIndex = 0
    text.innerHTML = ''
    input.value = ''
    input.removeAttribute('readonly')
    mistakes.innerText = 0
    leftTime = maxTime
    time.innerText = leftTime
    accuracy.innerText = 0
    isTyping = false

    const response = await fetch('https://api.quotable.io/quotes/random?minLength=200')

    const quotes = await response.json()

    // Output the quote and author name given from api.quotable.io
    // console.log(quote.content)
    // console.log(`- ${quote.author}`)

    let quote = quotes[0].content.split('')

    // let quote = 'The Universal Zulu Nation stands to acknowledge wisdom, understanding, freedom, justice, and equality, peace, unity, love, and having fun, work, overcoming the negative through the positive, science, mathematics, faith, facts, and the wonders of God, whether we call him Allah, Jehovah, Yahweh, or Jah.'
    // quote = quote.split('')


    quote.forEach(value => {

        let span = `<span>${value}</span>`
        text.innerHTML += span

    })

}

randomQuote()

//generating random quotes onclick on try again
btn.addEventListener('click', () => {

    randomQuote()
    setting.style.display = 'block'

})

input.oninput = (e) => {

    let user_input = input.value.split('')
    let spans = text.querySelectorAll('span')
    input.setAttribute('maxlength', spans.length)
    setting.style.display = 'none'
    let seconds = maxTime - leftTime
    let typedWords = user_input.length / 5
    words = Math.round((typedWords / seconds) * 60)
    words = (words == Infinity) ? 0 : words
    speed.innerText = words
    let speedCounter

    if (leftTime > 0) {

        if (!isTyping) {

            isTyping = true
            typingTimer = setInterval(() => {

                timer()

            }, 1000)


            speedCounter = setInterval(()=>{

                seconds = maxTime - leftTime
                typedWords = input.value.split('').length / 5
                words = Math.round((typedWords / seconds) * 60)
                words = (words == Infinity) ? 0 : words
                speed.innerText = words
                
            }, 100)

        }

        if (time.innerText == 0) {

            input.setAttribute('readonly', true)

        }


        if (user_input.length > spans.length) return

        user_input.forEach((value, index) => {

            //removing correct incorrect class on clicking backspace
            for (i = user_input.length - 1; i <= spans.length - 1; i++) {

                spans[i].classList.remove('correct', 'incorrect')

            }

            if (user_input[index] === spans[index].innerText) {

                spans[index].classList.add('correct')
                spans[index].classList.remove('incorrect')

            } else {

                spans[index].classList.remove('correct')
                spans[index].classList.add('incorrect')

            }

            if (user_input.join('') === text.innerText) {

                input.setAttribute('readonly', true)
                setting.style.display = 'block'
                clearInterval(typingTimer)

            }

            spans.forEach(span => {

                span.classList.remove('active')

            })

            if (user_input.length < spans.length) {

                spans[user_input.length].classList.add('active')

            }

            //setting mistakes in mistake span
            let incorrectWords = text.querySelectorAll('.incorrect')
            mistakes.innerHTML = incorrectWords.length

            if (words > 1) {

                let acc = Math.round(((words - incorrectWords.length) / words) * 100)
                accuracy.innerText = (acc >= 0) ? acc : 0

            } else {

                accuracy.innerText = 0

            }


        })

        if (user_input.length == 0) {

            spans.forEach(span => {

                span.classList.remove('correct', 'incorrect', 'active')

            })

        }

    } else {

        setting.style.display = 'block'
        clearInterval(typingTimer)
        leftTime = 0
        time.innerText = 0
        input.setAttribute('readonly', true)

        if(speedCounter){

            clearInterval(speedCounter)

        }

    }



}

function timer() {

    if (leftTime > 0) {

        time.innerText = leftTime
        leftTime--

    } else {

        leftTime = 0
        time.innerText = leftTime

    }

}
