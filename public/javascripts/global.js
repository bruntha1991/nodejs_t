// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function () {

    // Populate the user table on initial page load
    populateTable();


    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);
    $('#btnLogin').on('click', login);
    $('#btnEditUser').on('click', editUser);


    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    $("input").change(function (e) {

        for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {

            var file = e.originalEvent.srcElement.files[i];

            var img = document.createElement("img");
            var reader = new FileReader();
            reader.onloadend = function () {
                img.src = reader.result;
            }
            reader.readAsDataURL(file);
            $("input").after(img);
        }
    });

    $('#mc').hide();
    $('#sc').hide();

});

// Fill user table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function (data) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function (arrayItem) {
        return arrayItem.username;
    }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').val(thisUserObject.username);
    $('#userInfoEmail').val(thisUserObject.email);
    $('#userInfoFirstName').val(thisUserObject.firstname);
    $('#userInfoLastName').val(thisUserObject.lastname);
    $('#userInfoRole').val(thisUserObject.role);
    $('#userInfoPassword').val(thisUserObject.password);
    $('#userInfoId').val(thisUserObject._id);

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'firstname': $('#addUser fieldset input#inputFirstName').val(),
            'lastname': $('#addUser fieldset input#inputLastName').val(),
            'password': $('#addUser fieldset input#inputPassword').val(),
            'favouriteFood': $('#addUser fieldset input#inputFavFood').val(),
            'favouritePlace': $('#addUser fieldset input#inputFavPlace').val(),
            'role': $('#addUser fieldset select#inputRole').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function (response) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

function editUser(event) {
    event.preventDefault();

    // empty field validation
    var errorCount = 0;
    $('#userInfo input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#userInfo fieldset input#userInfoName').val(),
            'email': $('#userInfo fieldset input#userInfoEmail').val(),
            'firstname': $('#userInfo fieldset input#userInfoFirstName').val(),
            'lastname': $('#userInfo fieldset input#userInfoLastName').val()
        }

        // Use AJAX to post the object to our edit user service
        $.ajax({
            type: 'PUT',
            data: newUser,
            url: '/users/update/' + $('#userInfo fieldset input#userInfoId').val(),
            dataType: 'JSON'
        }).done(function (response) {

            // Check for successful (blank) response
            if (response.msg === '') {
                alert('Success');
                // Clear the form inputs
                $('#userInfo fieldset input').val('');

                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};



function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function (response) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            // Update the table
            populateTable();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};

// Login
function login(event) {

    var newUserLogin = {
        'email': $('#login fieldset input#loginUserEmail').val(),
        'password': $('#login fieldset input#loginFirstName').val()
    }

    $.ajax({
        type: 'POST',
        data: newUserLogin,
        url: '/users/login/',
        dataType: 'JSON'
    }).done(function (response) {

        // Check for a successful (blank) response
        if (response.msg === '') {
            window.location.href = "/home";
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
};





