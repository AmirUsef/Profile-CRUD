let users = [];
for (let index = 1; index <= 2; index++) {
    $.ajax({
        url: `https://reqres.in/api/users?page=${index}`,
        async: false,
        success: function(result) {
            users = [...users, ...result.data];
        }
    });
}

let currentPage = 1;
$(document).ready(function() {
    displayCards(1);
    displayPagInation();
    $("#addBtn").click(createUser)
})

function displayCards(page) {
    $(".cards").html("");
    let index = (page - 1) * 6;
    for (; index < page * 6 && index < users.length; index++) {
        $(".cards").append(`    
        <div class="card col-12 col-md-6 col-lg-4">
            <img class="card-img-top" src="${users[index].avatar}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">id: ${users[index].id}</h5>
                <p class="card-text">email: ${users[index].email}</p>
                <a class="btn btn-primary" id="${users[index].id}">user profile</a>
            </div>
        </div>`);
    }
    $(".btn-primary").click(function() {
        readUser($(this).attr("id"));
    })

}

function displayPagInation() {
    $(".pagination").html(`<li class="page-item" id="pre"><a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span></a></li>`)
    for (let index = 0; index < users.length / 6; index++)
        $(".pagination").append(`<li class="page-item"><a class="page-link" href="#">${index+1}</a></li>`)
    $(".pagination").append(`<li class="page-item" id="next">
        <a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`)
    $(".page-item").click(function() {
        if ($(this).attr("id") == "pre") {
            if (currentPage != 1)
                currentPage--;
        } else if ($(this).attr("id") == "next") {
            if (currentPage != Math.ceil(users.length / 6))
                currentPage++;
        } else
            currentPage = $(this).find("a").html();
        displayCards(currentPage)
    });
}

function createUser() {
    $(".modal").css("display", "block")
    $('.modal-header h2').html("Create")
    for (let key in users[0])
        $(".modal-body").append(`<span id="${key}"><label>${key}: </label><input></input><p></p></span>`)

    $('.modal-footer').html(`<button class="btn createBtn">Create</button>`)
    $(".createBtn").click(function() {
        if (!checkEmptyInput()) {
            newObject = {};
            $(".modal-body input").each(function() { newObject[$(this).parent().attr("id")] = $(this).val() });
            if (users.create(newObject) == -1)
                $("#id").children(":last").html("This ID already exist");
            else {
                closeModel();
                currentPage = Math.ceil(users.length / 6);
                displayPagInation();
                displayCards(currentPage);
            }
        }
    })
}

function readUser(id) {
    let object = users.find((el) => el.id - "" === id - "")
    $(".modal").css("display", "block")
    $('.modal-header h2').html("Read")
    for (const key in object)
        $(".modal-body").append(`<p>${key}: ${object[key]}</p>`)

    $('.modal-footer').html(`<button class="btn updateBtn">Update</button>
                             <button class="btn removeBtn">Delete</button>`)
    $(".removeBtn").click(function() { deleteUser(id) })
    $(".updateBtn").click(function() { updateUser(object) })
}

function updateUser(object) {
    $('.modal-header h2').html("Update")
    $(".modal-body").html("")
    for (let key in object)
        $(".modal-body").append(`<span id="${key}"><label>${key}: </label><input value=${object[key]}></input><p></p></span>`)

    $("#id input").prop("readonly", true);
    $('.modal-footer').html(`<button class="btn saveBtn">Save</button>`)
    $(".saveBtn").click(function() {
        if (!checkEmptyInput()) {
            updatedObject = {};
            $(".modal-body input").each(function() { updatedObject[$(this).parent().attr("id")] = $(this).val() });
            users.update(updatedObject);
            closeModel();
            displayCards(currentPage)
        }
    })
}

function deleteUser(id) {
    users.delete(id);
    closeModel();
    if ((currentPage - 1) * 6 == users.length) {
        currentPage--;
        displayPagInation();
    }
    displayCards(currentPage);
}

function checkEmptyInput() {
    let isEmpty = false;
    $(".modal-body input").each(function() {
        if ($(this).val() == "") {
            isEmpty = true;
            $(this).siblings(":last").html("This field is empty");
        } else
            $(this).siblings(":last").html("");
    });
    return isEmpty;
}

Array.prototype.delete = function(id) {
    this.splice(this.findIndex(item => item.id == id), 1);
}

Array.prototype.update = function(object) {
    let similarUID = this.find(item => item.id == object.id);
    for (let element in object) {
        similarUID[element] = object[element];
    }
}

Array.prototype.create = function(newObject) {
    if (this.find(item => item.id == newObject.id) === undefined)
        this.push(newObject);
    else
        return -1;
}