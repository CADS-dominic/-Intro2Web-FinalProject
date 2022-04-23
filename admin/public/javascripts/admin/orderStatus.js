const btnDeli = document.getElementsByClassName('order_deli')[0],
	btnDone = document.getElementsByClassName('order_done')[0]

if (btnDeli != null) {
	btnDeli.addEventListener('click', (e) => {
		fetch(window.location.origin + '/order/deli', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: e.target.id,
			}),
		})
			.then((res) => {
				return res.json()
			})
			.then((res) => {
				document.getElementById('order_status').innerHTML = '<b>Status: </b>Delivery'
				btnDeli.remove()
			})
	})
}

if (btnDone != null) {
	btnDone.addEventListener('click', (e) => {
		fetch(window.location.origin + '/order/done', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: e.target.id,
			}),
		})
			.then((res) => {
				return res.json()
			})
			.then((res) => {
				document.getElementById('order_status').innerHTML = '<b>Status: </b>completed'
				btnDone.remove()
			})
	})
}
