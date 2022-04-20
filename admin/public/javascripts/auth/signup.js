const usernameInput = document.getElementById('signup_username')
const passwordInput = document.getElementById('signup_password')
const repasswordInput = document.getElementById('signup_repassword')
const avaInput = document.getElementById('signup_ava')

document.getElementById('signup_username').addEventListener('input', (e) => {
	let xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			if (this.responseText == 'error') {
				document.getElementById('signup_usernameError').style.display = 'block'
				usernameInput.classList.add('auth_error')
				document.getElementById('signup_usernameIcon').classList.add('auth_error')
				document.getElementById('signup_submit').disabled = true
			} else {
				document.getElementById('signup_usernameError').style.display = 'none'
				usernameInput.classList.remove('auth_error')
				document.getElementById('signup_usernameIcon').classList.remove('auth_error')
				document.getElementById('signup_submit').disabled = false
			}
		}
	}
	xhttp.open('GET', window.location.href + `/checkValid?username=${e.target.value}`, true)
	xhttp.send()
})

document.getElementById('signup_password').addEventListener('input', (e) => {
	if (
		e.target.value.length < 8 ||
		!/[A-Z]/.test(e.target.value) ||
		!/[a-z]/.test(e.target.value) ||
		!/\d/.test(e.target.value)
	) {
		document.getElementById('signup_passwordError').style.display = 'block'
		passwordInput.classList.add('auth_error')
		document.getElementById('signup_passwordIcon').classList.add('auth_error')
		document.getElementById('signup_submit').disabled = true
	} else {
		document.getElementById('signup_passwordError').style.display = 'none'
		passwordInput.classList.remove('auth_error')
		document.getElementById('signup_passwordIcon').classList.remove('auth_error')
		document.getElementById('signup_submit').disabled = false
	}
})

document.getElementById('signup_repassword').addEventListener('input', (e) => {
	if (e.target.value != document.getElementById('signup_password').value) {
		document.getElementById('signup_repasswordError').style.display = 'block'
		repasswordInput.classList.add('auth_error')
		document.getElementById('signup_repasswordIcon').classList.add('auth_error')
		document.getElementById('signup_submit').disabled = true
	} else {
		document.getElementById('signup_repasswordError').style.display = 'none'
		repasswordInput.classList.remove('auth_error')
		document.getElementById('signup_repasswordIcon').classList.remove('auth_error')
		document.getElementById('signup_submit').disabled = false
	}
})

document.getElementById('signup_ava').addEventListener('input', (e) => {
	if (e.target.value.match(/\.(jpeg|jpg|gif|png)$/) == null) {
		document.getElementById('signup_avaError').style.display = 'block'
		avaInput.classList.add('auth_error')
		document.getElementById('signup_avaIcon').classList.add('auth_error')
		document.getElementById('signup_submit').disabled = true
	} else {
		document.getElementById('signup_avaError').style.display = 'none'
		avaInput.classList.remove('auth_error')
		document.getElementById('signup_avaIcon').classList.remove('auth_error')
		document.getElementById('signup_submit').disabled = false
	}
})

document.getElementById('signup_form').addEventListener('submit', (e) => {
	e.preventDefault()
	fetch(window.location.href, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: usernameInput.value,
			password: passwordInput.value,
			repassword: repasswordInput.value,
			ava: avaInput.value,
		}),
	})
		.then((res) => {
			return res.json()
		})
		.then((res) => {
			if (res.error) {
				document.getElementById('signup_error').style.display = 'block'
				document.getElementById('signup_submit').disabled = true
			} else {
				window.location.pathname = '/signup/verify'
			}
		})
})
