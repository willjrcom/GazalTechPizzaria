package proj_vendas.vendas.web.controller.Dev;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.cadastros.Empresa;
import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.model.empresa.Mensalidade;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("dev")
public class DevController {
	
	@Autowired
	private Usuarios usuarios;
	
	@Autowired
	private Empresas empresas;
	
	@GetMapping("/dev")
	public ModelAndView tela() {
		return new ModelAndView("dev");
	}

	@RequestMapping(value = "/dev/criarUsuario")
	@ResponseBody
	public Usuario criarUsuario(@RequestBody Usuario usuario) {
		if(usuario.getSenha().equals("-1") == true) {
			usuario.setSenha(usuarios.findByEmail(usuario.getEmail()).getSenha());
		}else {
			usuario.setSenha(new BCryptPasswordEncoder().encode(usuario.getSenha()));
		}
		
		Empresa empresa = null;
		try {
			empresa = empresas.findByCodEmpresa(usuario.getCodEmpresa());
			usuario.setEmpresa(empresa);
		}catch(Exception e) {}
		
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
		return busca;
	}
	
	
	@RequestMapping(value = "/dev/todosUsuarios")
	@ResponseBody
	public List<String> todosUsuarios(){
		return usuarios.mostrarTodos();
	}
	
	
	@RequestMapping(value = "/dev/todosEmpresas")
	@ResponseBody
	public List<String> todosEmpresas(){
		return empresas.mostrarTodos();
	}
	

	@RequestMapping(value = "/dev/excluirUsuario/{id}")
	@ResponseBody
	public String excluirUsuario(@PathVariable long id) {
		usuarios.deleteById(id);
		return "200";
	}
	

	@RequestMapping(value = "/dev/controlAcess/{codEmpresa}/{type}")
	@ResponseBody
	public ResponseEntity<?> controlAcess(@PathVariable Long codEmpresa, @PathVariable int type) {
		
		List<Usuario> todosUsuarios = usuarios.findByCodEmpresa(codEmpresa);
		
		for(int i = 0; i< todosUsuarios.size(); i++) {
			if(type == 0) {
				todosUsuarios.get(i).setAtivo(false);
			}else {
				todosUsuarios.get(i).setAtivo(true);
			}
		}
		
		usuarios.saveAll(todosUsuarios);
		
		return ResponseEntity.ok("200");
	}
	
	
	@RequestMapping(value = "/dev/addMensalidade/{codEmpresa}")
	@ResponseBody
	public ResponseEntity<?> addMensalidade(@RequestBody Mensalidade mensalidade, @PathVariable Long codEmpresa) {
		SimpleDateFormat format = new SimpleDateFormat ("yyyy-MM-dd");
		mensalidade.setData(format.format(new Date()));
		Empresa empresa = empresas.findByCodEmpresa(codEmpresa);
		List<Mensalidade> mensalidades = empresa.getMensalidade();
		mensalidades.add(mensalidade);
		empresas.save(empresa);
		return ResponseEntity.ok(200);
	}
}
