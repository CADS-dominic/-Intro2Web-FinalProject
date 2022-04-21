function loadUser(response) {
	if (!response.error) {
		document.getElementById('account_listRoot').innerHTML = ''
		localStorage.setItem('currentPage', response.currentPage)
		response.userList.forEach((doc) => {
			let html = `
			<div class='account_item'>
				<img src=${doc.ava} alt='Avatar' />
				<p>${doc.username}</p>
				<p>${doc.role}</p>
				<a href='' id=${doc.username} class="account_details">Details</a>
			</div>
			<hr />`
			document.getElementById('account_listRoot').insertAdjacentHTML('beforeend', html)
		})
	}
}

function bindEvent() {
	document.getElementById('account_next').addEventListener('click', () => {
		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				loadUser(JSON.parse(this.responseText))
				for (let button of document.getElementsByClassName('account_details')) {
					button.href = `/account/details?username=${button.id}`
				}
			}
		}
		xhttp.open('POST', window.location.href + `/next`, true)
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		xhttp.send(
			`currentPage=${localStorage.getItem('currentPage')}&input=${
				document.getElementById('account_search').value
			}&sort=${localStorage.getItem('sort')}`
		)
	})
	document.getElementById('account_prev').addEventListener('click', () => {
		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				loadUser(JSON.parse(this.responseText))
				for (let button of document.getElementsByClassName('account_details')) {
					button.href = `/account/details?username=${button.id}`
				}
			}
		}
		xhttp.open('POST', window.location.href + '/prev', true)
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		xhttp.send(
			`currentPage=${localStorage.getItem('currentPage')}&input=${
				document.getElementById('account_search').value
			}&sort=${localStorage.getItem('sort')}`
		)
	})
	for (let button of document.getElementsByClassName('account_paginNumList')) {
		button.addEventListener('click', () => {
			var xhttp = new XMLHttpRequest()
			xhttp.onreadystatechange = function () {
				loadUser(JSON.parse(this.responseText))
				for (let button of document.getElementsByClassName('account_details')) {
					button.href = `/account/details?username=${button.id}`
				}
			}
			xhttp.open('POST', window.location.href + '/goto', true)
			xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
			xhttp.send(
				`page=${button.id}&input=${document.getElementById('account_search').value}&sort=${localStorage.getItem(
					'sort'
				)}`
			)
		})
	}
}

window.onload = () => {
	localStorage.setItem('sort', 'username')
	fetch(window.location.href + '/pagin', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({}),
	})
		.then((res) => {
			return res.json()
		})
		.then((res) => {
			let html = `<button id='account_prev'><i class="fa-solid fa-caret-left"></i></button>`
			for (let i = 1; i <= res.totalPages; i++) {
				html += `<button class='account_paginNumList' id=${i}>${i}</buttoni>`
			}
			html += `<button id='account_next'><i class="fa-solid fa-caret-right"></i></button>`
			document.getElementById('account_pagin').insertAdjacentHTML('beforeend', html)
			localStorage.setItem('currentPage', 1)
		})
		.then(() => {
			bindEvent()
		})
		.then(() => {
			for (let button of document.getElementsByClassName('account_details')) {
				button.href = `/account/details?username=${button.id}`
			}
		})
}

document.getElementById('account_search').addEventListener('input', (e) => {
	fetch(window.location.href + `?input=${e.target.value}&sort=${localStorage.getItem('sort')}`)
		.then((res) => {
			return res.json()
		})
		.then((res) => {
			loadUser({ error: false, currentPage: 1, userList: res.users })
		})
	fetch(window.location.href + '/pagin', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			input: e.target.value,
		}),
	})
		.then((res) => {
			return res.json()
		})
		.then((res) => {
			let html = `<button id='account_prev'><i class="fa-solid fa-caret-left"></i></button>`
			for (let i = 1; i <= res.totalPages; i++) {
				html += `<button class='account_paginNumList' id=${i}>${i}</buttoni>`
			}
			html += `<button id='account_next'><i class="fa-solid fa-caret-right"></i></button>`
			document.getElementById('account_pagin').innerHTML = ''
			document.getElementById('account_pagin').insertAdjacentHTML('beforeend', html)
			localStorage.setItem('currentPage', 1)
		})
		.then(() => {
			bindEvent()
		})
		.then(() => {
			for (let button of document.getElementsByClassName('account_details')) {
				button.href = `/account/details?username=${button.id}`
			}
		})
})

for (let button of document.getElementsByName('account_sort')) {
	button.addEventListener('click', (e) => {
		localStorage.setItem('sort', e.target.value)
		fetch(
			window.location.href +
				`?input=${document.getElementById('account_search').value}&sort=${localStorage.getItem('sort')}`
		)
			.then((res) => {
				return res.json()
			})
			.then((res) => {
				loadUser({ error: false, currentPage: 1, userList: res.users })
			})
	})
}
