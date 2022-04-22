let img = []

document.getElementById('ava').addEventListener('change', (e) => {
	for (let file of e.target.files) {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onloadend = () => {
			img.push(reader.result)
		}
	}
})

document.getElementById('add_form').addEventListener('submit', (e) => {
	e.preventDefault()
	fetch(window.location.href, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: document.getElementById('name').value,
			price: document.getElementById('price').value,
			brand: document.getElementById('brand').value,
			category: document.getElementById('cat').value,
			description: document.getElementById('des').value,
			ava: img,
			status: document.getElementById('status_on').checked,
		}),
	})
		.then((res) => {
			return res.json()
		})
		.then((res) => {
			if (res.error) {
				document.getElementById('error_addProduct').style.display = 'block'
				document.getElementById('success_addProduct').style.display = 'none'
			} else {
				document.getElementById('error_addProduct').style.display = 'none'
				document.getElementById('success_addProduct').style.display = 'block'
			}
		})
})
