package proj_vendas.vendas.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/dev")
public class DevController {
	
	@Autowired
	private Usuarios usuarios;
	
	@RequestMapping
	public ModelAndView tela() {
		return new ModelAndView("dev");
	}
	
	@RequestMapping(value = "/liberar/{codigo}", method = RequestMethod.PUT)
	@ResponseBody
	public boolean liberarCadastro(@PathVariable String codigo) {
		if(codigo.equals("willjrcom18")) {
			return true;
		}else {
			return false;
		}
	}

	@RequestMapping(value = "/criar", method = RequestMethod.PUT)
	@ResponseBody
	public Usuario criarUsuario(@RequestBody Usuario usuario) {
		if(usuario.getSenha().equals("-1") == true) {
			usuario.setSenha(usuarios.findByEmail(usuario.getEmail()).getSenha());
		}else {
			usuario.setSenha(new BCryptPasswordEncoder().encode(usuario.getSenha()));
		}
		return usuarios.save(usuario);
	}
	
	@RequestMapping(value = "/validar/{email}/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Usuario validar(@PathVariable String email, @ModelAttribute("id")Usuario usuario) {
		Usuario busca = usuarios.findByEmail(email);
		
		if(busca != null) {
			if(busca.getId() == usuario.getId()) {
				Usuario vazio = new Usuario();
				vazio.setId((long) -1);
				return vazio;
			}
		}	
		return usuarios.findByEmail(email);
	}
	
	@RequestMapping(value = "/todos", method = RequestMethod.PUT)
	@ResponseBody
	public java.util.List<Usuario> todos(){
		return usuarios.findAll();
	}

	@RequestMapping(value = "/excluirUsuario/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public String excluirUsuario(@ModelAttribute("id") Usuario usuario) {
		usuarios.deleteById(usuario.getId());
		return "200";
	}
}
