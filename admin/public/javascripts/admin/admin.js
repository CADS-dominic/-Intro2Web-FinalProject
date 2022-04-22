let img

document.getElementById('profile_ava').addEventListener('change', (e) => {
	const file = e.target.files[0]
	const reader = new FileReader()
	reader.readAsDataURL(file)
	reader.onloadend = () => {
		img = reader.result
	}
})

document.getElementById('profile_form').addEventListener('submit', (e) => {
	fetch(window.location.href, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			password: document.getElementById('profile_password').value,
			repassword: document.getElementById('profile_repassword').value,
			ava: img,
		}),
	})
})
