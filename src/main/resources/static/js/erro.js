var usuarios = [];

$.ajax({
	url: '/erro/todos',
	type: 'PUT'
}).done(function(e){
	
	usuarios = e;
	var usuarioHtml = '<tr>'
			+'<th class="col-md-1"><h5>Email</h5></th>'
			+'<th class="col-md-1"><h5>Perfil</h5></th>'
		+'</tr>';

	for(usuario of usuarios) {
	usuarioHtml += '<tr>'
				+'<td align="center">' + usuario.email + '</td>'
				+'<td align="center">' + usuario.perfil + '</td>';
	}
	
	$("#todosUsuarios").html(usuarioHtml);
});