$(document).ready(function () {

    // Array of users
    // var users = [];

    /* new user form functions */
    function clearForm() {
        $("form input").val("");
    } //clearForm end

    $("#newUser").click(function () {
        $("#form").css("display", "block");
        $("#menu").css("display", "none");
    });// newUser click handler end

    $("#backbtnform").click(function () {
        $("#form").css("display", "none");
        $("#menu").css("display", "block");
        clearForm();
    });// backbtn click handler end

    $("#cancelbtn").click(function () {
        clearForm();
    });// cancelbtn click handler

    $("#submitbtn").click(function () {
        var postData = JSON.stringify($("#newUserForm").serializeArray());
        console.log("postData = " + postData);
        $.ajax({
            method: "post",
            url: "/mongodb/newUser",
            contentType: "application/json",
            data: postData,
            dataType: "json",
            success: function (data) {console.log(data);}
        });// end ajax
    });// end submit button event handler

    /* view user table functions */

    $("#backbtnview").click(function () {
        $("#table").css("display", "none");
        $("#menu").css("display", "block");
    });// backbtn click handler end

    var createTable = function (data) {
        console.log(data);
        var tableHtml = "<thead><tr><th></th><th>First name</th><th>Last name</th><th>email</th></tr></thead><tbody id='userRows'>"
        data.forEach(function(e, i) {
            // populate the users array with the user objects sent from the server
            // users[i] = {_id: e._id, firstName: e.firstName, lastName: e.lastName, email: e.email};
            tableHtml += "<tr><td><input type='checkbox'></td>";
            tableHtml += "<td id='firstName"+i+"'>" + e.firstName + "</td>";
            tableHtml += "<td id='lastName"+i+"'>" + e.lastName + "</td>";
            tableHtml += "<td id='email"+i+"'>" + e.email + "</td></tr>"
        });
        tableHtml += "</tbody>";
        $("#userTable").html(tableHtml);
    };

    $("#viewUser").click(function () {
        $("#table").css("display", "block");
        $("#menu").css("display", "none");
        $.ajax({
            method: "get",
            url: "/mongodb/viewUser",
            dataType: "json",
            success: function (data) {
                    createTable(data)
                }
        });// end ajax
    });// viewUser click handler end

    /**
     *  Table search functions. If focus is on the text input, the enter key is presssed,
     *  and the text input is not empty, then search. 
     */
     var findUsers = function () {
        var inputText = $("#searchInput").val();
        $.ajax({
            method: "get",
            url: "/mongodb/viewUser",
            data: { searchInput: inputText },
            dataType: "json",
            success: function (data) {
                createTable(data)
            }
        });
     }
     // Event handlers to search for users
    $("#searchInput").keypress(function(event) {
        if(event.which == 13) {
            findUsers();
        }
    });
    $("#searchbtn").click(function() {
        findUsers();
    });

    /*modify quasi code
        -- client side --
        on modify selection
            if nothing is selected
                return
            else
                populate an array of objects with the details of the users
                post json data to the server /modify/user

        -- server side --
        merge incoming rows with existing rows*/
    $("#modifybtn").click(function(){
        // Create array to hold the selected user's email addresses
        var selectedUsers = [];
        // loop through the table and add the selected user's emails to the array
        $("#userRows tr").each(function(i){
            var row = $(this);
            if(row.find("input").prop("checked")){
                selectedUsers.push(row.find("#email" + i).html());
            }
        });
        //console.log(selectedUsers);
    });
}); // end document ready
