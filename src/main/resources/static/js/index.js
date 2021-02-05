
if(window.location.href.split("/")[3] == "login-erro") {
	$("#erro").show('slow');
}

$("button").click(() => {
	$(".loading").css({
		"display": "block"
	});
});