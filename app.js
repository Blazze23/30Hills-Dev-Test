let users = [];
let allUsersID = [];
let user = {};
let friends = [];
let friendsOfFriends = [];
let friendsOfFriendsInfoArray = [];
let potentialFriends = [];
let allPotentialFriends = [];
let potentialFriendsObj;
let potentialFriendsObjArray = [];
let suggestedFriends = [];
let friendsOfFriendsID;


function loadAllUsers() {
    $.getJSON("./data.json", function(json) {
        console.log(json);
        let json_users = json;
        users.push(json_users);
        $("#table").empty();
        $.each(json, function(key, value) {
            let age;
            let surname;
            if(value.age == null) {
                value.age = "n/a";
                age = value.age;
                $("#table").append("<tr><td>"+value.id+"</td><td>"+value.firstName+"</td><td>"+value.surname+"</td><td>"+age+"</td><td>"+value.gender+"</td><td><button class='btn btn-warning btn-sm' onclick='userInfoSetup("+value.id+")'><i class='fas fa-info-circle pe-2'></i>Info</button></td></tr>")
            } else {
                $("#table").append("<tr><td>"+value.id+"</td><td>"+value.firstName+"</td><td>"+value.surname+"</td><td>"+value.age+"</td><td>"+value.gender+"</td><td><button class='btn btn-warning btn-sm' onclick='userInfoSetup("+value.id+")'><i class='fas fa-info-circle pe-2'></i>Info</button></td></tr>")
            }
        })
    })
}

function userInfoSetup(userID) {
    localStorage.setItem("userID", userID);
    location.href = "user.html"
    console.log(userID);
}

function userInfo() {
    local_userID = localStorage.getItem("userID");
    console.log(local_userID);
    $.getJSON("./data.json", function(json) {
       users = Array.from(json);
    //    Finding selected user in array of users and displaying that info in HTML
       user = users.find(obj=> obj.id == local_userID);
       console.log(user);
       $("#firstname").html(user.firstName);
       $("#surname").html(user.surname);
       $("#userid").html(user.id);
       $("#age").html(user.age);
       $("#gender").html(user.gender);
       $("#friends").html(user.friends.length);
    //    Defining friends and getting their info
       let friendsID = user.friends;
       console.log(friendsID);
       for(let x = 0; x<friendsID.length; x++) {
        for(let i = 0; i<users.length; i++) {
            if(users[i].id == friendsID[x]) {
                friends.push(users[i]);
            }
          }
       }
       console.log(friends);
    //    Going through all friends
       $.each(friends, function(key, value) {
        //    Displaying friends info in card
           $("#friendCard").append("<div class='card text-black bg-warning mb-3' style='max-width: 15rem;'><div class='card-header' id='friendName'>"+value.firstName+" "+value.surname+"</div><div class='card-body'><p class='card-title'>Age: "+value.age+"</p><p class='card-text'>Gender: "+value.gender+"</p></div></div>")
            //    Finding friends of friends
            for(let i = 0; i<value.friends.length; i++) {
                console.log(value.friends[i]);
                if(value.friends[i] != local_userID && !friendsID.includes(value.friends[i]) && !friendsOfFriends.includes(value.friends[i])){
                friendsOfFriends.push(value.friends[i]);
                }
        }
       })
       console.log(friendsOfFriends);
    //    Finding friends of friends info amnog all users
       for(let i=0; i<friendsOfFriends.length; i++) {
           let friendsOfFriendsInfo = users.find(obj=> obj.id == friendsOfFriends[i]);
        //    console.log(friendsOfFriendsInfo);
           friendsOfFriendsInfoArray.push(friendsOfFriendsInfo)
                  // Displpayin firends of firends info
                  $("#friendsOfFriendsCard").append("<div class='card text-black bg-warning mb-3' style='max-width: 15rem;'><div class='card-header' id='friendName'>"+friendsOfFriendsInfo.firstName+" "+friendsOfFriendsInfo.surname+"</div><div class='card-body'><p class='card-title'>Age: "+friendsOfFriendsInfo.age+"</p><p class='card-text'>Gender: "+friendsOfFriendsInfo.gender+"</p></div></div>")
        // Creating friends of friends ID's
        friendsOfFriendsID = (friendsOfFriendsInfo.id)
        // console.log(friendsOfFriendsID);
       }
       console.log(friendsOfFriendsInfoArray)
    //    Going through all users to eleminate userID and friends to create potential friends array
    $.each(users, function(key,value) {
       allUsersID.push(value.id);
    })
    console.log(allUsersID);
    potentialFriends = allUsersID.filter(array => !friendsID.includes(array));
    console.log(potentialFriends);
    allPotentialFriends = potentialFriends.filter(value=> !local_userID.includes(value));
    console.log(allPotentialFriends);
    // Create potential Friends Object and array
    for(let i=0; i<allPotentialFriends.length; i++) {
        potentialFriendsObj = users.find(obj=> obj.id == allPotentialFriends[i]);
        potentialFriendsObjArray.push(potentialFriendsObj);
    }
    console.log(potentialFriendsObjArray);
    // Filter function that returns suggested friends
    for(let i=0; i<potentialFriendsObjArray.length; i++) {
      if(potentialFriendsObjArray[i].friends.filter(friendID=> friendsID.includes(friendID)).length >=2) {
        suggestedFriends.push(potentialFriendsObjArray[i]);
      }
    }
    console.log(suggestedFriends);
        // // Going through suggested frineds and displaying their info
            $.each(suggestedFriends, function(key, value) {
                $("#suggestedFriendsCard").append("<div class='card text-black bg-warning mb-3' style='max-width: 15rem;'><div class='card-header' id='friendName'>"+value.firstName+" "+value.surname+"</div><div class='card-body'><p class='card-title'>Age: "+value.age+"</p><p class='card-text'>Gender: "+value.gender+"</p></div></div>")
            })
    })
}

function allUsers() {
    localStorage.removeItem("userID");
    location.href = "index.html";
}