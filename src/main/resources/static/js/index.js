
if(window.location.href.split("/")[3] == "login-erro" || window.location.href.split("/")[3] == "expired") {
	$("#erro").show('slow');
}

$("button").click(() => {
	$(".loading").css({
		"display": "block"
	});
});