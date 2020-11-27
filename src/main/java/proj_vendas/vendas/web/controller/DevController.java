package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class DevController {
	
	@Autowired
	private Usuarios usuarios;
	
	@GetMapping("/dev")
	public ModelAndView tela() {
		return new ModelAndView("dev");
	}
	
	@RequestMapping(value = "/dev/liberar/{codigo}")
	@ResponseBody
	public boolean liberarCadastro(@PathVariable String codigo) {
		if(codigo.equals("willjrcom18")) {
			return true;
		}else {
			return false;
		}
	}

	@RequestMapping(value = "/dev/criar")
	@ResponseBody
	public Usuario criarUsuario(@RequestBody Usuario usuario) {
		if(usuario.getSenha().equals("-1") == true) {
			usuario.setSenha(usuarios.findByEmail(usuario.getEmail()).getSenha());
		}else {
			usuario.setSenha(new BCryptPasswordEncoder().encode(usuario.getSenha()));
		}
		return usuarios.save(usuario);
	}
	
	@RequestMapping(value = "/dev/validar/{email}/{id}")
	@ResponseBody
	public Usuario validar(@PathVariable String email, @PathVariable long id) {
		Usuario busca = usuarios.findByEmail(email);
		
		if(busca != null) {
			if(busca.getId() == id) {
				Usuario vazio = new Usuario();
				vazio.setId((long) -1);
				return vazio;
			}
		}	
		return usuarios.findByEmail(email);
	}
	
	@RequestMapping(value = "/dev/todos")
	@ResponseBody
	public java.util.List<Usuario> todos(){
		return usuarios.findAll();
	}

	@RequestMapping(value = "/dev/excluirUsuario/{id}")
	@ResponseBody
	public String excluirUsuario(@PathVariable long id) {
		usuarios.deleteById(id);
		return "200";
	}
}
