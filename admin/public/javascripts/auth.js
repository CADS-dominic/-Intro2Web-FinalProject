document.getElementById('login_form').addEventListener('submit', (e) => {
	e.preventDefault()
	fetch(e.target.action, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify({
			username: document.getElementById('login_username').value,
			password: document.getElementById('login_password').value,
		}),
	})
		.then((res) => {
			return res.json()
		})
		.then((res) => {
			console.log(res.error == true)
			if (res.error == true) {
				document.getElementById('login_error').style.display = 'inherit'
			} else {
				document.getElementById('login_error').style.display = 'none'
				window.location.pathname = '/admin'
			}
		})
})
