function loadOrders(response) {
	if (!response.error) {
		document.getElementById('account_listRoot').innerHTML = ''
		localStorage.setItem('currentPage', response.currentPage)
		response.orders.forEach((doc) => {
			let html = `
			<div class='account_item'>
                <p>${doc.status}</p>
                <p>${doc.address}</p>
                <p>${doc.totalPrice}$</p>
				<a href='' id=${doc._id} class="account_details">Details</a>
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
				loadOrders(JSON.parse(this.responseText))
				for (let button of document.getElementsByClassName('account_details')) {
					button.href = `/order/details?id=${button.id}`
				}
			}
		}
		xhttp.open('POST', window.location.href + `/next`, true)
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		xhttp.send(
			`currentPage=${localStorage.getItem('currentPage')}&input=${document.getElementById('account_search').value}`
		)
	})
	document.getElementById('account_prev').addEventListener('click', () => {
		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				loadOrders(JSON.parse(this.responseText))
				for (let button of document.getElementsByClassName('account_details')) {
					button.href = `/order/details?id=${button.id}`
				}
			}
		}
		xhttp.open('POST', window.location.href + '/prev', true)
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		xhttp.send(
			`currentPage=${localStorage.getItem('currentPage')}&input=${document.getElementById('account_search').value}`
		)
	})
	for (let button of document.getElementsByClassName('account_paginNumList')) {
		button.addEventListener('click', () => {
			var xhttp = new XMLHttpRequest()
			xhttp.onreadystatechange = function () {
				loadOrders(JSON.parse(this.responseText))
				for (let button of document.getElementsByClassName('account_details')) {
					button.href = `/order/details?id=${button.id}`
				}
			}
			xhttp.open('POST', window.location.href + '/goto', true)
			xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
			xhttp.send(`page=${button.id}&input=${document.getElementById('account_search').value}`)
		})
	}
}

window.onload = () => {
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
				button.href = `/order/details?id=${button.id}`
			}
		})
}

document.getElementById('account_search').addEventListener('input', (e) => {
	fetch(window.location.href + `?input=${e.target.value}`)
		.then((res) => {
			return res.json()
		})
		.then((res) => {
			loadOrders({ error: false, currentPage: 1, orders: res.orders })
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
				button.href = `/product/details?id=${button.id}`
			}
		})
})
