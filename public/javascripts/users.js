let currentMail;
//new user
newUserForm.onsubmit = async (e) => {
    e.preventDefault();
    let response = await fetch('http://127.0.0.1:3000/users/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
            name: newUserFName.value,
            lname: newUserLName.value,
            phone: NewUserPhoneNumber.value,
            email: newUserEmail.value,
            password: newUserPassword.value,
            role: newUserRole.value,
        })
    });
    let result = await response.json();
    console.log('new result:', result);
    alert('new user added successfully')
    document.getElementById("newUserFName").value = "";
    document.getElementById("newUserLName").value = "";
    document.getElementById("NewUserPhoneNumber").value = "";
    document.getElementById("newUserEmail").value = "";
    document.getElementById("newUserPassword").value = "";
    document.getElementById("newUserRole").value = "";
    loadList();
}
//delete user
deleteForm.onsubmit = async (e) => {
    e.preventDefault();
    if (DeleteUser.value == 'michaeltra12@gmail.com')
        return alert("Can't delete this user");
    let response = await fetch('http://127.0.0.1:3000/users/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': token,
        },
        body: JSON.stringify({
            email: DeleteUser.value,
        })
    });
    let result = await response.json();
    console.log("delete result: ", result);
    result.deletedCount > 0 ?
        alert('User deleted successfully') : alert('No such user')
    document.getElementById("DeleteUser").value = "";
    loadList();
}
//fill the fields when user is chosen in update card
document.getElementById("UpdateChooseUser").onchange = async (e) => {

    let response = await fetch('http://127.0.0.1:3000/Users/find', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': token,
        },
        body: JSON.stringify({
            user: e.target.value
        })
    });
    let result = await response.json();
    console.log("choose to update result: ", result);
    document.getElementById("UpdateUserFName").value = result[0].name
    document.getElementById("UpdateUserLName").value = result[0].lname
    document.getElementById("UpdateUserPhoneNumber").value = result[0].phone
    document.getElementById("UpdateUserEmail").value = result[0].email
    document.getElementById("UpdateUserRole").value = result[0].role
    currentMail = result[0].email;
}
//update user
UpdateForm.onsubmit = async (e) => {
    e.preventDefault();
    let toUpdate = {
        name: UpdateUserFName.value,
        lname: UpdateUserLName.value,
        role: UpdateUserRole.value,
        phone: UpdateUserPhoneNumber.value,
        email: UpdateUserEmail.value,
        password: UpdateUserPassword.value
    }
    let response = await fetch('http://127.0.0.1:3000/users/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': token,
        },
        body: JSON.stringify([
            toUpdate,
            currentMail
        ])
    });
    let result = await response.json();
    alert('User updated successfully')
    console.log("result: ", result);
    document.getElementById("newUserFName").value = "";
    document.getElementById("newUserLName").value = "";
    document.getElementById("NewUserPhoneNumber").value = "";
    document.getElementById("newUserEmail").value = "";
    document.getElementById("newUserPassword").value = "";
    document.getElementById("newUserRole").value = "";
    //load the list after changes have been made
    loadList();
}