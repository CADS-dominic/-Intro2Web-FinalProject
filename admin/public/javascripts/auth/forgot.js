document.getElementById('forgot_repassword').addEventListener('input', (e) => {
	const password = document.getElementById('forgot_password').value
	if (e.target.value != password) {
		document.getElementById('forgot_submit').disabled = true
		document.getElementById('forgot_error').style.display = 'block'
	} else {
		document.getElementById('forgot_error').style.display = 'none'
		document.getElementById('forgot_submit').disabled = false
	}
})

document.getElementById('forgot_form').addEventListener('submit', (e) => {
	e.preventDefault()
	const params = new URL(document.location).searchParams
	const username = params.get('username')
	const password = document.getElementById('forgot_password').value
	const repassword = document.getElementById('forgot_repassword').value

	if (username == '' || password == '' || repassword == '') {
		window.location.pathname = '/forgot/form'
	} else {
		fetch('http://' + window.location.host + '/forgot/form', {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		})
			.then((res) => {
				return res.json()
			})
			.then((res) => {
				if (res.error) {
					window.location.pathname = '/forgot'
				} else {
					window.location.pathname = '/admin'
				}
			})
	}
})
