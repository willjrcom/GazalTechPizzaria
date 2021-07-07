package proj_vendas.vendas.web.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.cadastros.Empresa;
import proj_vendas.vendas.model.cadastros.Endereco;
import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.model.empresa.Conquista;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/")
public class HomeController {

	@Autowired
	private Usuarios usuarios;

	@Autowired
	private Empresas empresas;
	
	@GetMapping({ "/index" })
	public ModelAndView tela() {
		return new ModelAndView("index");
	}

	@GetMapping("/login-erro")
	public String erro(ModelMap model, HttpServletRequest resp) {
		HttpSession session = resp.getSession();
		String lastException = String.valueOf(session.getAttribute("SPRING_SECURITY_LAST_EXCEPTION"));
		if (lastException.contains(SessionAuthenticationException.class.getName())) {
			model.addAttribute("titulo", "Acesso recusado!");
			model.addAttribute("texto", "Você já está conectado em outro dispositivo!");
			return "index";
		}

		model.addAttribute("titulo", "Credenciais inválidas!");
		model.addAttribute("texto", "Login e/ou senha incorretos, tente novamente!");
		return "index";
	}

	@GetMapping("/expired")
	public String expired(ModelMap model) {
		model.addAttribute("titulo", "Acesso recusado");
		model.addAttribute("texto", "Sua sessão expirou, Você acessou em outro dispositivo!");
		model.addAttribute("subtexto", "!");
		return "index";
	}
	
	@RequestMapping("/criarUsuario")
	@ResponseBody
	public int criarUsuario(@RequestBody Usuario usuario) {
		if (usuarios.findByEmail(usuario.getEmail()) != null) {
			return 300;
		}
		
		// Cnpj se torna o codEmpresa
		Long cnpj_long = usuario.getId();
		String cpnj_string = usuario.getEmpresa().getCnpj();
		
		List<Empresa> todasEmpresas = empresas.findByCnpj(cpnj_string);
		
		// Se encontrar uma empresa
		if(todasEmpresas.size() != 0) {
			usuario.setEmpresa(todasEmpresas.get(0));
			usuario.setCodEmpresa(todasEmpresas.get(0).getCodEmpresa());
		
		} else {
			Empresa empresa = new Empresa();
			empresa.setCodEmpresa(cnpj_long);
			empresa.setCnpj(cpnj_string);
			empresa.setNomeEstabelecimento("");
			empresa.setNomeEmpresa("");
			empresa.setEmail("");
			empresa.setCelular("");

			Endereco endereco = new Endereco();
			endereco.setCodEmpresa(cnpj_long);
			endereco.setBairro("");
			endereco.setCidade("");
			endereco.setN(0);
			endereco.setRua("");
			endereco.setTaxa(0);
			empresa.setEndereco(endereco);

			Conquista conquista = new Conquista();
			empresa.setConquista(conquista);
			empresa.setCodEmpresa(cnpj_long);
			
			empresas.save(empresa);
			
			usuario.setEmpresa(empresa);
			usuario.setCodEmpresa(cnpj_long);
		}

		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

		try {
			usuario.setSenha(new BCryptPasswordEncoder().encode(usuario.getSenha()));
			usuario.setAtivo(true);
			usuario.setPerfil("GRATUITO");
			usuario.setDataLimite(format.format(new Date()));
			usuario.setDia(format.format(new Date()));
			usuarios.save(usuario);

			return 200;
		} catch (Exception e) {
			System.out.println("Erro - cadastrar usuario" + e);
			return 404;
		}
	}
}
