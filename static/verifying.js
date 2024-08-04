async function updateTree(name) {
        var modifiedJSON = {};
        var options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': '$2a$10$6BysE.FjRL4.6NTAj0f/NeEo/rgbrxRsG0nimym.HRclykKDcDwm.'
            }
        };

        try {
            const response = await fetch('https://api.jsonbin.io/v3/b/666356cead19ca34f875bc4d', options);
            const data = await response.json();
            modifiedJSON = data['record'];
        } catch (err) {
            console.error(err);
        }
        console.log(modifiedJSON['tree'])
        if (Object.keys(modifiedJSON['tree'])[0] != localStorage.getItem('verified')) {
            modifiedJSON['tree'][Object.keys(modifiedJSON['tree'])[0]][localStorage.getItem('verified')][name] = {};
        } else {
            modifiedJSON['tree'][localStorage.getItem('verified')][name] = {}
        }
        
        var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': '$2a$10$6BysE.FjRL4.6NTAj0f/NeEo/rgbrxRsG0nimym.HRclykKDcDwm.'
        },
        body: JSON.stringify(modifiedJSON)
        };

        fetch('https://api.jsonbin.io/v3/b/666356cead19ca34f875bc4d', options)
    }
    function updateTable() {
        fetch('/waiting')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('waiting-list');
                tableBody.innerHTML = '';
                
                data.forEach(name => {
                    const row = document.createElement('tr');
                    
                    const nameCell = document.createElement('td');
                    nameCell.textContent = name;
                    row.appendChild(nameCell);
                    
                    const buttonCell = document.createElement('td');
                    const button = document.createElement('button');
                    button.classList.add('button');
                    button.textContent = 'Verify';
                    button.onclick = function () {
                        updateTree(name)

                        fetch("/verify-user", {
                        method: "POST",
                        body: JSON.stringify({"name": name}),
                        headers: {
                            "Content-type": "application/json"
                        }
                        });
                        updateTable()
                    };
                    buttonCell.appendChild(button);
                    row.appendChild(buttonCell);
                    
                    tableBody.appendChild(row);
                });
            });
    }

if (localStorage.getItem('omega') === null) {
    window.location.href = '/'
}
document.getElementById('refresh-button').addEventListener('click', updateTable);
updateTable();