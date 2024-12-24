async function registerUser(username, password) {
  const response = await fetch('http://localhost:8000/api/register/', {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json',
	},
	body: JSON.stringify({
	  username: username,
	  password: password,
	}),
  });

if(response.ok) {
  const data = await response.json();
  console.log('register successful:', data);
  // Fermez le modal de login
  // const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
  // modal.hide();
  } else {
	const errorData = await response.json();
	console.error('Error logging in:', errorData);
	alert('Login failed: ' + errorData.detail);
  }
}

export function setupRegister() {
document.getElementById('validate-btn-register').addEventListener('click', () => {
  const username = document.getElementById('inputLoginRegister').value;
  const password = document.getElementById('inputPasswordRegister').value;
  registerUser(username, password);
});
}