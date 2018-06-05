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


$("#commentBtn").on("click", newComment);

function newComment() {
    event.preventDefault();
    let id = $(this).data('id');
    let content = $("#comment").val().trim();

    if (content) {
        $.ajax({
            url: `/note/${id}`,
            method: 'POST',
            //'body' here refers to the body in CommentSchema in comment.js
            data: {body: content}
        })
        .then(function(data) {
            $('#comment').val('');
            return;
        })
    }
}



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




})