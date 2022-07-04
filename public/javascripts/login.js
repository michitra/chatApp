// hidden sidebar button
function myOpen() {
    document.getElementById("mySidebar").style.display = "block";
}

function myClose() {
    document.getElementById("mySidebar").style.display = "none";
}
let thisUserMail = '';
let token = '';

//load the users list
window.onload = async () => {
    await loadList();
}

// login
loginForm.onsubmit = async (e) => {
    e.preventDefault();
    let username = loginUser.value;
    let password = loginPassword.value;
    let response = await fetch('http://127.0.0.1:3000/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });
    if (response.status == 200) {
        //socket = io();
        let result = await response.json();
        thisUserMail = result.user.email;
        console.log("login success")
        //load chat page after login
        login.classList.add("hidden");
        welcome.classList.add("hidden");
        signIn.classList.add("hidden");
        sideBarTags.classList.remove("hidden");
        document.getElementById('currentLogin').innerHTML = "Hi " + result.user.name.toUpperCase();
        //checs if user or admin for user managment
        if (result.user.role == 'user' || result.user.role =='User')
            userButton.classList.add("hidden");
        chat.classList.remove("hidden");
        token = result.token;
        socket.emit('user login', thisUserMail);
    }
    else {
        Invalid.style.opacity = 1;
        setTimeout(() => {
            Invalid.style.opacity = 0;
        }, 2000);
    }
}
//sign in
signInButton.onclick = () => {
    login.classList.add("hidden");
    signIn.classList.add("hidden");
    deleteCard.classList.add("hidden");
    updateCard.classList.add("hidden");
    titleManagment.classList.add("hidden");
    document.getElementById("NewUserPhoneNumber").value = "";
    document.getElementById("newUserPassword").value = "";
    adminOpt.disabled = true;
    usermanagement.classList.remove("hidden");
    backToLogin.classList.remove("hidden");
}
//Back to login
backToLoginButton.onclick = () => {
    login.classList.remove("hidden");
    signIn.classList.remove("hidden");
    deleteCard.classList.remove("hidden");
    updateCard.classList.remove("hidden");
    titleManagment.classList.remove("hidden");
    usermanagement.classList.add("hidden");
    backToLogin.classList.add("hidden");
    adminOpt.disabled = false;
}


//chat button
chatButton.onclick = () => {
    usermanagement.classList.add("hidden");
    chat.classList.remove("hidden");
}

//user management button
userButton.onclick = () => {
    chat.classList.add("hidden");
    document.getElementById("NewUserPhoneNumber").value = "";
    document.getElementById("newUserPassword").value = "";
    document.getElementById("UpdateUserPhoneNumber").value = "";
    document.getElementById("UpdateUserPassword").value = "";
    usermanagement.classList.remove("hidden");
}

// log Out button
logOutButton.onclick = () => {
    socket.emit('logout', thisUserMail);
    socket.close();
    location.reload();
}

//Activate logout on page refresh
window.onbeforeunload = () => {
    document.getElementById("logOutButton").click();
}