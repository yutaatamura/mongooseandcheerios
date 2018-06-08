$(document).ready(function() {
console.log("we live");

$("#scrapeBtn").on("click", scrape);

function scrape(event) {
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

function newComment(event) {
    
    event.preventDefault();
    
    let id = $(this).data('id');

    let content="";
    //have to use .each here to evaluate each textarea; jQuery val() will serve only the value of one match
    $(".comment").each(function() {
        content += $(this).val().trim();
    })
    
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
            $('.comment').val('');
            console.log("now im here")
            location.reload();
        })
    }
}


$(".displayComments").on("click", displayComment);

function displayComment() {
    
    let id = $(this).data('id');

    $.ajax({
        url: `/articles/${id}`,
        method: 'GET'
    })
    .then(function(data) {
        $('.modal-content').html(
            `<div class="modal-header">
                <div class="modal-title">
                    <h3>${data.headline}</h3>
                    <p>- ${data.author}</p>
                    <br>
                    <h5>Comments</h5>
                </div>
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
        console.log(count);
        console.log(data)
        if (count == 0) {
            let noCommentMsg = `<small class="text-muted">This article currently has no comments.</small>`;
            $('.modal-body').prepend(noCommentMsg);
        } else {
            let comments = data.comment;
            
            console.log(comments)
            comments.forEach(function(comment) {
                
                console.log(comment)
                let commentTime = comment.timestamp;
                 
                    let formattedTime = moment(commentTime).format("dddd, MMMM Do YYYY, h:mm:ss a");
                    
                
                $('.list-group').append(`
                <li class="list-group-item" style="background-color: rgb(218, 215, 207)">
                ${comment.body}
                <hr>
                <p>Submitted: ${formattedTime}</p>
                </li>
                <br>
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