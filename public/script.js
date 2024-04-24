/* eslint-disable prettier/prettier */
document.addEventListener('DOMContentLoaded', function () {
    const createUserButton = document.getElementById('createUserButton');
    const usersTableBody = document.getElementById('usersTableBody');
    const newUserForm = document.getElementById('newUserForm');
    const createUserForm = document.getElementById('createUserForm');
    const loadingIndicator = document.getElementById('loadingIndicator'); // Assuming you have this element

    function loadUsers() {
        loadingIndicator.style.display = 'block'
        fetch('http://localhost:3002/user')
            .then(response => response.json())
            .then(users => {
                usersTableBody.innerHTML = ''
                users.forEach((user, index) => {
                    const row = usersTableBody.insertRow()
                    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.p5Balance}</td>
            <td>${user.rewardsBalance}</td>
            <td><button onclick="editUser('${user.id}')">Edit</button></td>
          `
                })
                loadingIndicator.style.display = 'none'
            })
    }

    createUserButton.addEventListener('click', function () {
        newUserForm.style.display = 'block';
    });

    createUserForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(createUserForm);
        const userData = {
            name: formData.get('name'),
            p5Balance: formData.get('p5Balance'),
            rewardsBalance: formData.get('rewardsBalance')
        };

        fetch('http://localhost:3002/user/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                createUserForm.reset();
                loadUsers();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    loadUsers();
});

function editUser(userId) {
    window.location.href = `/user/${userId}`;
}

const rewardsTableBody = document.getElementById('rewardsTableBody');
const rewardsBalanceSpan = document.getElementById('rewardsBalance');
const userId = new URLSearchParams(window.location.search).get('userId');

function loadRewards() {
    fetch(`http://localhost:3002/user/${userId}/rewards`)
        .then(response => response.json())
        .then(rewardsData => {
            rewardsBalanceSpan.textContent = rewardsData.balance;

            rewardsTableBody.innerHTML = '';
            rewardsData.history.forEach((reward, index) => {
                const row = rewardsTableBody.insertRow();
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${reward.dateTime}</td>
                    <td>${reward.rewardsReceived}</td>
                    <td>${reward.userName}</td>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

if (userId) {
    loadRewards();
} else {
    console.error('User ID is missing from the query string.');
}
