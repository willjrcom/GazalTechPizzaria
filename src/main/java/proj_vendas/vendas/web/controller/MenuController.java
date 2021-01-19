package proj_vendas.vendas.web.controller;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Endereco;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
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
	
	@RequestMapping
	public ModelAndView tela() {
		SimpleDateFormat format = new SimpleDateFormat ("yyy-MM-dd");
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		ModelAndView mv = new ModelAndView("menu");
		try {
			Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
			String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
			Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dia);//busca no banco de dados
			
			mv.addObject("troco", dado.getTrocoInicio());
			mv.addObject("empresa", empresa.getNomeEstabelecimento());
			mv.addObject("contato", empresa.getCelular());
			
		}catch(Exception e) {
			Empresa empresa = new Empresa();
			empresa.setCodEmpresa(user.getCodEmpresa());
			empresa.setNomeEstabelecimento("Pizzaria");
			empresa.setNomeEmpresa("Pizzaria");
			empresa.setCnpj("");
			empresa.setEmail("");
			empresa.setCelular("");
			
			Endereco endereco = new Endereco();
			endereco.setBairro("");
			endereco.setCidade("");
			endereco.setN("");
			endereco.setRua("");
			endereco.setTaxa(0);

			empresa.setEndereco(endereco);
			empresas.save(empresa);
			
			Dia dia = new Dia();
			dia.setCodEmpresa(user.getCodEmpresa());
			dia.setDia(format.format(new Date()));
			dias.save(dia);
			
			Dado dado = new Dado();
			dado.setCodEmpresa(user.getCodEmpresa());
			dado.setData(format.format(new Date()));
			dado.setTrocoInicio(0);
			dados.save(dado);

			mv.addObject("troco", dado.getTrocoInicio());
			mv.addObject("empresa", empresa.getNomeEstabelecimento());
			mv.addObject("contato", empresa.getCelular());
		}
		
		//empresa
		mv.addObject("usuario", user.getEmail());
		mv.addObject("permissao", user.getPerfil());
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
	
	@RequestMapping(value = "/troco/{trocoInicial}")
	@ResponseBody
	public int buscarId(@PathVariable double trocoInicial) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dia);
		dado.setTrocoInicio(trocoInicial);
		dados.save(dado);
		
		return 200;
	}
	
	@RequestMapping(value = "/mostrarDia")
	@ResponseBody
	public Dia MostrarDia() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return dias.findByCodEmpresa(user.getCodEmpresa());
	}
	
	@RequestMapping("/autenticado")
	@ResponseBody
	public String autenticado() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return ((UserDetails)principal).getUsername();
	}
}
