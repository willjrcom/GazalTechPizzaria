package proj_vendas.vendas.web.controller;

import java.time.LocalDate;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.LogUsuario;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/menu")
public class MenuController {
	
	@Autowired
	private Dados dados;
	
	@Autowired
	private Dias dias;
	
	@Autowired
	private Empresas empresas;
	
	@Autowired
	private Usuarios usuarios;

	@Autowired
	private LogUsuarios logUsuarios;
	
	@RequestMapping
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		ModelAndView mv = new ModelAndView("menu");
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		
		if(empresa != null) {
			String nome = empresa.getNomeEstabelecimento();
			String contato = empresa.getCelular();
			
			mv.addObject("empresa", nome);
			mv.addObject("contato", "Contato: " + contato);
		}else {
			mv.addObject("empresa", "GazalTech");
			mv.addObject("contato", "Acesse: EMPRESA -> OPÇÕES -> Cadastre-se");
		}
		String usuario = user.getEmail();
		mv.addObject("usuario", "Usuário conectado: " + usuario);
		return mv;
	}
	
	@RequestMapping("/login")
	@ResponseBody
	public void login() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		LocalDate diaAtual = LocalDate.now(); // Create a date object
		String dia = diaAtual.toString();
	    
		//alterar a tabela dados
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dia);//busca no banco de dados
		
		if(dado == null) {//verifica se ja existe
			dado = new Dado();
		}
		dado.setCodEmpresa(user.getCodEmpresa());
		dado.setData(dia);//seta a data atual
		
		//alterar a tabela dia
		Dia data = dias.findByCodEmpresa(user.getCodEmpresa());
		
		if(data == null) {//verifica se dia existe
			data = new Dia();
		}
		data.setCodEmpresa(user.getCodEmpresa());
		data.setDia(dia);//seta dia
		
		//salvar dados
		dias.save(data);//salva o dia
		dados.save(dado);//salva a data
		
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();
		
		log.setUsuario(user.getEmail());
		log.setAcao("login");
		log.setData(hora.toString());
		log.setCodEmpresa(user.getCodEmpresa());
		
		logUsuarios.save(log); //salvar logUsuario
	}
	
	@RequestMapping(value = "/verificarData/{dia}")
	@ResponseBody
	public Dado alterarData(@PathVariable String dia) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Dado dado1 = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dia);
		
		if(dado1 != null) {//se ja existir
			Dia data = dias.findByCodEmpresa(user.getCodEmpresa());
			data.setDia(dia);
			data.setCodEmpresa(user.getCodEmpresa());
			dias.save(data);
			return dado1;
			
		}else {//se nao existir
			//alterar a tabela dados
			Dado dado = new Dado();
			dado.setCodEmpresa(user.getCodEmpresa());
			dado.setData(dia);
			
			//alterar a tabela dia
			Dia data = dias.findByCodEmpresa(user.getCodEmpresa());
			
			if(data == null) {
				data = new Dia();
			}
			data.setDia(dia);
			data.setCodEmpresa(user.getCodEmpresa());
			//salvar dados
			dias.save(data);
			return dados.save(dado);
		}
	}
	
	@RequestMapping(value = "/buscarIdData/{data}")
	@ResponseBody
	public Dado buscarId(@PathVariable String data) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return dados.findByCodEmpresaAndData(user.getCodEmpresa(), data);
	}
	
	@RequestMapping(value = "/troco/{id}")
	@ResponseBody
	public Dado alterarTroco(@RequestBody Dado dado) {
		return dados.save(dado);
	}
	
	@RequestMapping(value = "/mostrarDia")
	@ResponseBody
	public Dia MostrarDia() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return dias.findByCodEmpresa(user.getCodEmpresa());
	}
}
