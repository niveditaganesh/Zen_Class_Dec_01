getUser(1);
getUser(2);
// https://nodejs-zen.herokuapp.com
async function getUser(role) {
    try {
        let api;
        let table;
        let target = '';
        let funName;
        let ancName;
        let viewName;
        let viewFunc;
        if (role == 1) {
            api = await fetch('http://localhost:3000/students');
            table = document.getElementById('student-table');
            ancName = 'Remove Mentor';
            funName = 'removeAssignedMentor';
            viewFunc = 'viewMentor';
            viewName = 'View Mentor';
        } else if (role == 2) {
            api = await fetch('http://localhost:3000/mentors');
            table = document.getElementById('mentor-table');
            target = '#modal-assign';
            ancName = 'Assign New';
            funName = 'showStudents';
            viewFunc = 'getAssignedStudent';
            viewName = 'View Students';
        }
        let res = await api.json();
        console.log(res)
        if (res) {
            table.innerHTML = '';
            res.data.forEach((ele, index) => {
                let tr = createMyTag('tr');
                let td1 = createMyTag('td');
                td1.innerHTML = index + 1;
                let td2 = createMyTag('td');
                td2.innerHTML = ele.name;
                let td3 = createMyTag('td');
                td3.innerHTML = ele.email;
                let td4 = createMyTag('td');
                td4.innerHTML = ele.tel;
                let td5 = createMyTag('td');
                td5.innerHTML = `
                    <button class="btn btn-link text-warning" data-toggle="modal" 
                    data-target="#modal" onclick="editUser('${role}','${ele['_id']}','${ele.name}','${ele.email}','${ele.tel}')">Edit
                    </button>
                    <button class="btn btn-link text-danger" onclick="deleteUser('${role}','${ele["_id"]}')">Delete</button>
                    <button class="btn btn-link text-primary" data-toggle="modal" onclick="${funName}('${ele["_id"]}')"
                    data-target="${target}">${ancName}</button>
                    <button class="btn btn-link text-success" onclick="${viewFunc}('${ele["_id"]}')">${viewName}</button>`;
                tr.append(td1, td2, td3, td4, td5);
                table.appendChild(tr);
            });
        } else {
            table.innerHTML = '';
            let tr = createMyTag('tr', 'text-center');
            let td = createMyTag('td');
            td.setAttribute('colspan', 5);
            td.innerHTML = `No data`
            tr.append(td);
            table.appendChild(tr);
        }
    } catch (error) {
        console.log(error)
    }

}

function createMyTag(tagName, className = '') {
    let ele = document.createElement(tagName);
    ele.setAttribute('class', className);
    return ele;
}

function validation(tel, id) {
    if ((+tel).toString().length != 10) {
        document.getElementById(id).innerHTML = `Mobile Number should be of 10 digits`;
        return false;
    } else {
        document.getElementById(id).innerHTML = ``;
        return true;
    }
}

async function createUser() {
    try {

        let role = document.getElementById('role').value;
        if (validation(document.getElementById('tel').value, 'error')) {
            data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                tel: document.getElementById('tel').value
            }
            if (role == 1) {
                let api = await fetch('http://localhost:3000/student-create', {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-type": "application/json"
                    }
                });
                let res = await api.json();
                alertMessage(res.message, 'success');
                getUser(1);
            } else if (role == 2) {
                let api = await fetch('http://localhost:3000/mentor-create', {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-type": "application/json"
                    }
                });
                let res = await api.json();
                alertMessage(res.message, 'success');
                getUser(2);
            }
            document.getElementById('my-form').reset();
        }
    } catch (error) {
        console.log(error)
    }
}

function alertMessage(message, id) {
    let alertBox = document.getElementById(id);
    alertBox.innerHTML = `${message}`;
    alertBox.style.display = 'flex';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2500);
}

function editUser(role, userId, name, email, tel) {
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-tel').value = tel;
    document.getElementById('userId').value = userId;
    document.getElementById('role').value = role;
}

async function updateUser() {
    try {
        if (validation(document.getElementById('edit-phone').value, 'edit-error')) {
            $('#modal').modal('hide');
            let data = {
                name: document.getElementById('edit-name').value,
                email: document.getElementById('edit-email').value,
                tel: document.getElementById('edit-phone').value
            };

            let userId = document.getElementById('userId').value;
            let role = document.getElementById('role').value;
            if (role == 1) {
                let api = await fetch(`http://localhost:3000/student-update/${userId}`, {
                    method: "PUT",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-type": "application/json"
                    }
                });
                let res = await api.json();
                alertMessage(res.message, 'warning');
                getUser(1);
            } else if (role == 2) {
                let api = await fetch(`http://localhost:3000/mentor-update/${userId}`, {
                    method: "PUT",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-type": "application/json"
                    }
                });
                let res = await api.json();
                alertMessage(res.message, 'warning');
                getUser(2);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteUser(role, userId) {
    try {
        let check = confirm("You won't be able to revert this!");
        if (check) {
            let api;
            if (role == 1) {
                api = await fetch(`http://localhost:3000/student-delete/${userId}`, {
                    method: "DELETE",
                });
                let res = await api.json();
                alertMessage(res.message, 'danger');
                getUser(1);
            } else if (role == 2) {
                api = await fetch(`http://localhost:3000/mentor-delete/${userId}`, {
                    method: "DELETE",
                });
                let res = await api.json();
                alertMessage(res.message, 'danger');
                getUser(2);
            }
        }
    } catch (error) {
        console.log(error)
    }
}


async function assignStudent() {
    try {
        document.getElementById('btn-assign').disabled = true;
        let mentorId = document.getElementById('mentorId').value;
        let students = [];
        let options = document.getElementById('students').options;
        for (let option of options) {
            if (option.selected) {
                students.push(option.value);
            }
        }
        let data = {
            mentorId,
            students,
        }
        let api = await fetch('http://localhost:3000/assign-students-and-mentors', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            }
        });
        let res = await api.json();
        $('#modal-assign').modal('hide');
        document.getElementById('btn-assign').disabled = false;
        alertMessage(res.message, 'success-msg');
    } catch (error) {
        console.log(error);
    }
}

async function showStudents(mentorID) {
    try {
        let api = await fetch('http://localhost:3000/not-assigned-students');
        let res = await api.json();
        let select = document.getElementById('students');
        if (res.items) {
            document.getElementById('mentorId').value = `${mentorID}`;
            select.innerHTML = ``;
            res.data.map(obj => {
                let option = createMyTag('option');
                option.setAttribute('value', `${obj['_id']}`);
                option.innerHTML = `${obj.name}`;
                select.appendChild(option);
            })
        } else {
            select.innerHTML = `<option>No student available</option>`;
        }
    } catch (error) {
        console.log(error);
    }
}

async function getAssignedStudent(mentorId) {
    try {
        $('#mentor-students').modal('show');
        document.getElementById('assignedModalLabel').innerHTML = 'Assigned Students';
        let api = await fetch(`http://localhost:3000/students-under-mentor/${mentorId}`);
        let res = await api.json();
        let list = document.getElementById('students-list');
        if (res.status == 'success') {
            list.innerHTML = '';
            res.data[0].results.map(obj => {
                let li = createMyTag('li', 'list-group-item');
                li.innerHTML = `${obj.name}`;
                list.appendChild(li);
            })
        } else {
            list.innerHTML = '';
            let li = createMyTag('li', 'list-group-item');
            li.innerHTML = `${res.message}`;
            list.appendChild(li);
        }
    } catch (error) {
        console.log(error);
    }
}

async function removeAssignedMentor(mentorId) {
    try {
        let decision = confirm('You sure you want to remove your mentor');
        if (decision) {
            let api = await fetch(`http://localhost:3000/delete-assignment/${mentorId}`, {
                method: "DELETE",
            });
            let res = await api.json();
            alertMessage(res.message, 'danger');
        }
    } catch (error) {
        console.log(error);
    }
}

async function viewMentor(id) {
    try {
        $('#mentor-students').modal('show');
        document.getElementById('assignedModalLabel').innerHTML = 'Assigned Mentor';
        let api = await fetch(`http://localhost:3000/mentor-for-student/${id}`);
        let res = await api.json();
        let list = document.getElementById('students-list');
        list.innerHTML = '';
        let li = createMyTag('li', 'list-group-item');
        if (res.status == 'success') {
            li.innerHTML = `${res.data[0].results[0].name}`;
        } else {
            li.innerHTML = `${res.message}`;
        }
        list.appendChild(li);
    } catch (error) {

    }
}