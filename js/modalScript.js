// When the user clicks on <span> (x), close the modal
$(".close").click(function() {
    closeModel();
});

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if ($(event.target).attr("id") === $("#myModal").attr("id"))
//         closeModel();
// };

function closeModel() {
    $("#myModal").css("display", "none");
    $('.modal-header h2').html("");
    $('.modal-body').html("");
    $('.modal-footer').html("");
}