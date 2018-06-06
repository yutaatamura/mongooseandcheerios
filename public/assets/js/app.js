$(document).ready(function() {
console.log("we live");

$("#scrapeBtn").on("click", scrape);

function scrape() {
    event.preventDefault();
    $.get('/scrape')
    .then(function(data) {
        if (data) {
        location.reload();
        } else {
            console.log("No data scraped");
        }
    })
};


$(".commentBtn").on("click", newComment);

function newComment() {
    
    event.preventDefault();
    
    let id = $(this).data('id');
    let content = $(".comment").val().trim();
    console.log(content)
    console.log("im here")
    if (content) {
        $.ajax({
            url: `/note/${id}`,
            method: 'POST',
            //'body' here refers to the body in CommentSchema in comment.js
            data: {body: content}
        })
        .then(function(data) {
            $('#comment').val('');
            location.reload();
        })
    }
}


$("#displayComments").on("click", displayComment);

function displayComment() {
    event.preventDefault();
    let id = $(this).data('id');

    $.ajax({
        url: `/articles/${id}`,
        method: 'GET'
    })
    .then(function(data) {
        $('.modal-content').html(
            `<div class="modal-header">
                <h3 class="modal-title">${data.headline}</h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <ul class="list-group"></ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>`
        );

        let count = data.comment.length;

        if (count == 0) {
            alert("No comments")
        } else {
            let comments = data.comment;
            console.log(comments)
            Object.keys(comments).forEach(function(comment) {
                $('.list-group').append(`
                <li class="list-group-item>
                ${comment.body}
                </li>
                `
            );
            });
        }
        $('.modal').modal('show');
    });
};



$("#deleteComment-btn").on("click", deleteComment);

function deleteComment() {
    event.preventDefault();
    let id = $(this).data('id');

    $.ajax({
        url: `/comment/${id}`,
        method: 'DELETE'
    })
    .then(function(data) {

    })
}


// function commentQuantity() {
//     let id = $(this).data('id');

//     $.ajax({
//         url: `/article/${id}`,
//         method: 'GET'
//     })
//     .then(function(data) {
//         console.log("wooo");
//         console.log(data.comment)
        
//     });

// console.log(data);
//             let count = data.comment.length;
//             console.log("i am here")
//             console.log(data.comment)
//             console.log(data.comment.length)
//             $(("span[data-id=" + id + "]")).text(count);


    
// }




})