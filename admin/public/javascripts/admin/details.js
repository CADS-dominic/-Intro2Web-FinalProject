function remove(e) {
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			const response = JSON.parse(this.responseText)
			if (!response.error) {
				document.getElementsByClassName(e.target.className)[0].remove()
				document.getElementsByClassName(e.target.className)[0].remove()
			}
		}
	}
	xhttp.open('POST', window.location.origin + `/product/remove`, true)
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
	xhttp.send(`url=${e.target.className}&id=${document.getElementById('getid').textContent.split(' ')[1]}`)
}
