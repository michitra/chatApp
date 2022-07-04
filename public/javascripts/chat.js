let socket = io();
let otherUserMail = '';
let chatListNames = '';
let activeChat = '';

//Load all users and their details 
async function loadList() {
    let response = await fetch('http://127.0.0.1:3000/users/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    });
    let result = await response.json();

    //fill the list of users from db
    let chooseList = `<option selected disabled value="choose">Choose User</option>`;
    let pList = '';
    let index = 1;

    result.forEach(user => {
        //create the Update select list
        chooseList +=
            `<option value="${user.email}">${user.name} ${user.lname}</option>`;
        //create the Chat users list
        pList +=
            `<li class="clearfix" id="${user.email}"  onclick="importChat('${user.email}')">
                <img src="./images/icons/${index}.png" alt="avatar">
                <div class="about">
                    <div class="name">${user.name} ${user.lname}</div>
                    <div id="status" class="status" name="${user.email}"> <i class="fa fa-circle offline"></i> offline</div>
                </div>
            </li>`
        index++;
        if(index>16)
        index = 1;
    });
    document.getElementById("UpdateChooseUser").innerHTML = chooseList;
    document.getElementById("plist").innerHTML = pList;
    //save the list for later use
    chatListNames = document.querySelectorAll("#plist > li.clearfix");
}

//search user in Chat users list
searchInput.oninput = () => {
    let input = searchInput.value
    chatListNames.forEach(name => {
        //get the user name from html
        tmp = name.querySelector("div.about > div.name").textContent;
        if (tmp.includes(input)) {
            name.classList.remove("hidden");
        }
        else {
            name.classList.add("hidden");
        }
    })
}

//using ENTER to send messages
message.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("newMessage").click();
    }
  });

//new message
newMessage.onclick = () => {
    //Checks if a contact user has been selected and the message is not empty
    if (otherUserMail && message.value != '') {
        let time = new Date()
        let messageData =
            { message: message.value, sender: thisUserMail, reciever: otherUserMail, date: time }
        socket.emit("message", messageData);
        message.value = '';
    }
    else if (message.value == '') {
        alert('Empty message')
    }

    else
        alert('Choose chat user from your friends list');

}

//Socket.io listeners
socket.on("message", (message) => {
    if (message.sender || message.reciever == thisUserMail)
        chatBoxLoading(message)
})

socket.on("user login", (userMail) => {
    userStatus('login', userMail)
})

socket.on("user logout", (userMail) => {
    userStatus('logout', userMail)
})

socket.on('connected list', (arrayList) => {
    arrayList.forEach(user => {
        userStatus('login', user)
    })
})



//Set the status of the users (online/offline)
function userStatus(flag, userMail) {
    if (userMail) {
        if (flag == 'login') {
            document.querySelector("[name=" + CSS.escape(userMail) + "]").innerHTML = `<i class="fa fa-circle online"></i> online`
        }
        else if (flag == 'logout') {
            document.querySelector("[name=" + CSS.escape(userMail) + "]").innerHTML = `<i class="fa fa-circle offline"></i> offline`
        }
    }
    else
        console.log('users list is empty');

}

//Loading the Chat with the relevante user chat
function importChat(userMail) {
    otherUserMail = userMail;
    chatListNames.forEach(async name => {
        if (name.id == otherUserMail) {
            //clean the chatbox
            chatBox.innerHTML = '';
            //mark the user in the chat list
            name.classList.add("active");
            //get the user photo for the chat header
            tmpImg = name.querySelector("li > img")
            //get the user name for the chat header
            tmpName = name.querySelector("div.about > div.name").textContent;
            document.getElementById("chatHeader").innerHTML =
                `<img src="${tmpImg.src}" alt="avatar">
                <div class="chat-about">
                    <h4 class="m-b-0 ">${tmpName}</h4>
                </div>`;

            //get the chat from db
            let response = await fetch('http://127.0.0.1:3000/chat/chat',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': token,
                    },
                    body: JSON.stringify({
                        otherUserMail,
                        thisUserMail
                    })
                });
            let result = await response.json();
            if (result) {
                result.forEach(message => {
                    chatBoxLoading(message);
                })
                scrollToBottom(chatHistory);
            }
        }
        else
            name.classList.remove("active");
    }
    )
}

//Load the chat  from db
function chatBoxLoading(message) {
    let time = new Date(message.date)

    //format the messege time
    let msgTime = time.getHours() + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + (time.getHours() < 12 ? ' AM, ' : ' PM, ') + time.getDate() + '/' + (time.getMonth() + 1) + '/' + time.getFullYear();
    //enter new message to chatbox
    if (message.sender == thisUserMail) {
        chatBox.innerHTML += `<li class="clearfix">
                            <div class="message-data text-right">
                                <span class="message-data-time">${msgTime}</span>
                                 <img src="https://bootdey.com/img/Content/avatar/avatar7.png"
                                    alt="avatar">
                            </div>
                            <div class="message other-message float-right"> ${message.message} </div>
                        </li>`
    }
    if (message.reciever == thisUserMail) {
        chatBox.innerHTML += `<li class="clearfix">
                            <div class="message-data">
                                <span class="message-data-time">${msgTime}</span>
                            </div>
                            <div class="message my-message">${message.message}</div>
                        </li>`
    }
    scrollToBottom(chatHistory)
}

//Function to scroll to bottom
function scrollToBottom(el) {
    el.scrollTop = el.scrollHeight + el.offsetHeight;
}

