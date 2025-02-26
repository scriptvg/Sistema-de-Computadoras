async function getUsers() {
    try {
        const response = await fetch('http://localhost:3001/USERS', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching users');
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export { getUsers };

//////////LLAMADO POST//////////

async function postUsers(nombre,apellido,edad) {
    try {
     
        const userData = { 
            nombre,
            apellido,
            edad,
            
        
        };



        const response = await fetch("http://localhost:3001/USERS", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

     
        return await response.json();

        
    } catch (error) {
        console.error('Error posting user:', error);
        throw error;
    }
}

export{postUsers}

//////////////LLAMADO UPDATE/////////////


async function updateUsers(nombre,apellido,edad,id) 
{
    try {
     
        const userData = { 
            nombre, 
            apellido,
            edad
        
        };


        


        const response = await fetch(`http://localhost:3001/USERS/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

     
        return await response.json();
    } catch (error) {
        console.error('Error update user:', error);
        throw error;
    }
}

export{updateUsers}



//////////////LLAMADO DELETE/////////////


async function deleteUser(id) {
    try {
        const response = await fetch(`http://localhost:3001/USERS/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error deleting user with id ${id}`);
        }

        return { message: `User with id ${id} deleted successfully` };
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

export { deleteUser };