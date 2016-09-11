$(document).ready(function () {
    $('#btnAddRestaurantr').on('click', addRestaurant);
    $('#btnAddMainFood').on('click', addMainFood);
    $('#btnAddSubFood').on('click', addSubFood);
    $('#btnAddFoodList').on('click', addFoodList);

    loadRestaurants();
    loadRestaurantsFoods();

});

// Add Restaurant
function addRestaurant(event) {
    event.preventDefault();

    // checking any fields are blank
    var errorCount = 0;
    $('#addRestaurant input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    var lat = $('#addRestaurant fieldset input#rLatitude').val();
    var lon = $('#addRestaurant fieldset input#rLongitude').val();
    var restaurantRating = $('#addRestaurant fieldset input#restaurantRating').val();

    if (errorCount != 0) {
        alert('Please fill in all fields');
        return false;
    } else if (!/^-?(\d*\.)?\d*$/.test(restaurantRating) || restaurantRating < 0.0 || restaurantRating > 5.0) {
        alert('Restaurant rating must be within 0.0 to 5.0');
        return false;
    } else if (!lat.match(/^\d{0,2}(?:\.\d{0,10}){0,1}$/)) {
        alert('Latitude is not valid');
        return false;
    } else if (!lon.match(/^\d{0,2}(?:\.\d{0,10}){0,1}$/)) {
        alert('Longitude is not valid');
        return false;
    } else if (errorCount === 0) {
        // If it is, compile all restaurant info into one object
        var newRestaurant = {
            'restaurantName': $('#addRestaurant fieldset input#rName').val(),
            'address': $('#addRestaurant fieldset input#rAddress').val(),
            'restaurantRating': $('#addRestaurant fieldset input#restaurantRating').val(),
            //'locationRating': $('#addRestaurant fieldset input#locationRating').val(),
            //'serviceRating': $('#addRestaurant fieldset input#serviceRating').val(),
            'description': $('#addRestaurant fieldset input#description').val(),
            'ownerUsername': $('#addRestaurant fieldset input#rOwnerUsername').val(),
            'latitude': $('#addRestaurant fieldset input#rLatitude').val(),
            'longitude': $('#addRestaurant fieldset input#rLongitude').val()
        };

        // Use AJAX to post the object to our add restaurant service
        $.ajax({
            type: 'POST',
            data: newRestaurant,
            url: '/restaurant/addRestaurant',
            dataType: 'JSON'
        }).done(function (response) {

            // Check for successful (blank) response
            if (response.msg === '') {
                alert("Restaurant added successfully");
                //$('#addRestaurant fieldset span#result').innerHTML = 'Restaurant added successfully';
                // Clear the form inputs
                $('#addRestaurant fieldset input').val('');
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
}

function addMainFood(event) {
    event.preventDefault();

    // empty field validation
    var errorCount = 0;
    $('#addMainFood input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    if ($('#addMainFood fieldset select#inputRestaurant').val() == '') {
        errorCount++;
    }

    if (errorCount != 0) {
        // If errorCount is more than 0, error out
        alert('Please fill/select in all fields');
        return false;
    }

    var file = document.getElementById('files').files[0];
    var preview = document.querySelector('img');
    var imageRead;
    if (file) {
        // create reader
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (e) {
            if (file.size < 50000) {
                imageRead = reader.result;
                preview.src = reader.result;
            } else {
                alert('Image size should be less than 50kb');
            }
        };
        reader.readAsDataURL(file);
    }

    if (file.size < 50000) {
        // Check and make sure errorCount's still at zero
        if (errorCount === 0) {
            alert("Image Loaded");

            var mainFood = {
                'foodName': $('#addMainFood fieldset input#mCategoryFoodName').val(),
                'foodImage': imageRead
            };

            // Use AJAX to post the object to our add main food service
            $.ajax({
                type: 'PUT',
                data: mainFood,
                url: '/restaurant/addMainFood/' + $('#addMainFood fieldset select#inputRestaurant').val(),
                dataType: 'JSON'
            }).done(function (response) {

                // Check for successful (blank) response
                if (response.msg === '') {
                    $('#addMainFood fieldset #notification').html('Main Category Food Added Successfully');

                    //alert('Success');
                    // Clear the form inputs
                    $('#addMainFood fieldset input').val('');
                    $('#addMainFood fieldset select#inputRestaurant').val('');
                    preview.src = '';

                }
                else {
                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);
                }
            });
        }

    }

}

// load restaurant details
function loadRestaurants() {

    // Empty content string
    html = '<option value=""> Select Restaurant </option>';

    var preview = document.querySelector('img');

    // jQuery AJAX call for JSON
    $.getJSON('/restaurant/restaurant', function (data) {

        // For each item in our JSON, add restaurant name to select tag
        $.each(data, function () {
            html += '<option value="' + this._id + '">' + this.restaurantName + '</option>';
        });

        // Inject the whole content string into our existing HTML table
        $('#addMainFood select ').html(html);
    });
}


// load restaurant and main food details
function loadRestaurantsFoods() {

    // Empty content string
    var htmlR = '';
    var htmlF = "";
    var htmlSF = '';

    // jQuery AJAX call for JSON
    $.getJSON('/restaurant/restaurant', function (data) {
        htmlR += '<option value=""> Select Restaurant </option>';
        htmlF += '<option value=""> Select Main Food </option>';
        htmlSF += '<option value=""> Select Sub Food </option>';

        // add restaurant to select tag
        $.each(data, function () {
            htmlR += '<option value="' + this._id + '">' + this.restaurantName + '</option>';
        });
        $.each(data, function () {
            var mF = this.mainFood;
            for (var i in mF) {
                htmlF += '<option value="' + mF[i].foodName + '">' + mF[i].foodName + '</option>';

                var sF = mF[i].subFood;
                for (var i in sF) {
                    htmlSF += '<option value="' + sF[i].foodName + '">' + sF[i].foodName + '</option>';
                }

            }
        });

        // Inject the whole content string into our existing HTML table
        $('#inputRestaurants').html(htmlR);
        $('#inputMainFood').html(htmlF);
        $('#inputSubFood').html(htmlSF);
    });
}

function addSubFood(event) {
    event.preventDefault();

    var errorCount = 0;
    $('#addSubFood input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    if ($('#addSubFood fieldset select#inputRestaurants').val() == '') {
        errorCount++;
    }
    if ($('#addSubFood fieldset select#inputMainFood').val() == '') {
        errorCount++;
    }

    if (errorCount != 0) {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }

    var file = document.getElementById('files').files[0];
    var preview = document.querySelector('img');
    var imageRead = '';
    if (file) {
        // create reader
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (e) {
            if (file.size < 50000) {
                imageRead = reader.result;
                preview.src = reader.result;
            } else {
                alert('Image size should be less than 50kb');
            }

        };
        reader.readAsDataURL(file);
    }
    if (file.size < 50000) {

        // Check and make sure errorCount's still at zero
        if (errorCount === 0) {

            alert("Image Loaded");

            // If it is, compile all user info into one object
            var mainFood = {
                'mainFood': $('#addSubFood fieldset select#inputMainFood').val(),
                'foodName': $('#addSubFood fieldset input#mCategoryFoodName').val(),
                'foodImage': imageRead
            }
            // Use AJAX to post the object to our add sub food service
            $.ajax({
                type: 'PUT',
                data: mainFood,
                url: '/restaurant/addSubFood/' + $('#addSubFood fieldset select#inputRestaurants').val(),
                dataType: 'JSON'
            }).done(function (response) {

                // Check for successful (blank) response
                if (response.msg === '') {
                    $('#addSubFood fieldset #notification').html('Sub Category Food Added Successfully');

                    // Clear the form inputs
                    $('#addSubFood fieldset input').val('');
                    $('#addSubFood fieldset select#inputRestaurants').val('');
                    $('#addSubFood fieldset select#inputMainFood').val('');

                }
                else {
                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);
                }
            });
        }
    }
}

function addFoodList(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addFoodList input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    if (errorCount != 0) {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }

    var file = document.getElementById('files').files[0];
    var preview = document.querySelector('img');
    var imageRead;
    if (file) {
        // create reader
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (e) {
            if (file.size < 50000) {
                imageRead = reader.result;
                preview.src = reader.result;
            } else {
                alert('Image size should be less than 50kb');
            }

        };
        reader.readAsDataURL(file);
    }

    if (file.size < 50000) {

        // Check and make sure errorCount's still at zero
        if (errorCount === 0) {
            alert("Image Loaded");

            // If it is, compile all user info into one object
            var mainFood = {
                'mainFood': $('#addFoodList fieldset select#inputMainFood').val(),
                'subFood': $('#addFoodList fieldset select#inputSubFood').val(),
                'foodName': $('#addFoodList fieldset input#mCategoryFoodName').val(),
                'foodImage': imageRead
            }
            // Use AJAX to post the object to our adduser service
            $.ajax({
                type: 'PUT',
                data: mainFood,
                url: '/restaurant/addFoodList/' + $('#addFoodList fieldset select#inputRestaurants').val(),
                dataType: 'JSON'
            }).done(function (response) {

                // Check for successful (blank) response
                if (response.msg === '') {
                    $('#addFoodList fieldset #notification').html('Food Added Successfully');

                    // Clear the form inputs
                    $('#addFoodList fieldset input').val('');
                    $('#addFoodList fieldset select#inputMainFood').val('');
                    $('#addFoodList fieldset select#inputSubFood').val('');
                    $('#addFoodList fieldset select#inputRestaurants').val('');

                }
                else {
                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);
                }
            });
        }
    }
}

function getMainFoodForSub() {
    htmlF = '';
    htmlF += '<option value=""> Select Main Food </option>';


    $.getJSON('/restaurant/getMainFoodForSub/' + $('#addSubFood fieldset select#inputRestaurants').val(),
        function (data) {

            $.each(data, function () {
                var mF = this.mainFood;
                for (var i in mF) {
                    htmlF += '<option value="' + mF[i].foodName + '">' + mF[i].foodName + '</option>';
                }
            });

            // Inject the whole content string into our existing HTML table
            $('#inputMainFood').html(htmlF);
        });

}

function getMainFoodForList() {
    htmlF = '';

    $.getJSON('/restaurant/getMainFoodForSub/' + $('#addFoodList fieldset select#inputRestaurants').val(),
        function (data) {
            htmlF += '<option value="">Select Main Food</option>';

            $.each(data, function () {
                var mF = this.mainFood;
                for (var i in mF) {
                    htmlF += '<option value="' + mF[i].foodName + '">' + mF[i].foodName + '</option>';
                }
            });

            // Inject the whole content string into our existing HTML table
            $('#inputMainFood').html(htmlF);
        });

}

function getSubFoodForList() {
    var htmlSF = '';

    $.getJSON('/restaurant/getSubFoodForList/' + $('#addFoodList fieldset select#inputRestaurants').val() +
        "/" + $('#addFoodList fieldset select#inputMainFood').val(),
        function (data) {

            $.each(data, function () {
                var mF = this.mainFood;
                for (var i in mF) {
                    var sF = mF[i].subFood;
                    for (var i in sF) {
                        htmlSF += '<option value="' + sF[i].foodName + '">' + sF[i].foodName + '</option>';
                    }

                }
            });

            // Inject the whole content string into our existing HTML table
            $('#inputSubFood').html(htmlSF);

        });

}