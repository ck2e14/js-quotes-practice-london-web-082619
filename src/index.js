document.addEventListener("DOMContentLoaded", function(){
    getQuotes();
})

function getQuotes(){
    return fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(quotes => renderQuotes(quotes))
}

function renderQuotes(quotes){
    quotes.forEach(function(quote){
        renderQuote(quote)
    })
}

function renderQuote(quote){
    quoteList = document.getElementById('quote-list')

    let li = document.createElement('li')

    let blockquote = document.createElement('blockquote')
        blockquote.className = 'blockquote'
        
    let p = document.createElement('p')
        p.className = 'mb-0'
        p.innerText = quote.quote

    let footer = document.createElement('footer')
        footer.className = 'blockquote-footer'
        footer.innerText = quote.author

    let likeButton = document.createElement('button')
        likeButton.className = 'btn-success'
        likeButton.innerText = `Likes: ${quote.likes.length}`
        likeButton.addEventListener('click', function (e){
            fetch("http://localhost:3000/likes", {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": "application/json"
                },
                body: JSON.stringify({ quoteId: quote.id })
            }) 
            let likesNumber = parseInt(e.target.innerText.split(' ')[1])
            event.target.innerText = `Likes: ${likesNumber +=1}`;
        }) 

    let deleteButton = document.createElement('button')
        deleteButton.className = 'btn-danger'
        deleteButton.innerText = 'Delete'
        deleteButton.addEventListener('click', function(){
            fetch("http://localhost:3000/quotes/" + quote.id, {
                method: 'DELETE'
            }); quoteList.removeChild(li);
        })


    blockquote.append(p, footer, likeButton, deleteButton)
    li.append(blockquote)
    quoteList.append(li)

}

const quoteForm = document.getElementById('new-quote-form')
quoteForm.addEventListener('submit', function(event){
    console.log('form submitted')
    event.preventDefault();
    addNewQuote({
        quote: event.target[0].value,
        author: event.target[1].value,
    });
})


function addNewQuote(newQuote){
    console.log(newQuote)
    postQuote(newQuote)
    .then(quote => renderQuote(quote))
}

function postQuote(newQuote){
    return fetch("http://localhost:3000/quotes/", {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
        },
        body: JSON.stringify({...newQuote, likes: []})
    }).then(resp => resp.json())
}