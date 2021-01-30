package proj_vendas.vendas.web.controller;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cupom;
import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Endereco;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Cupons;
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
	
	@Autowired
	private Cupons cupons;
	
	@RequestMapping
	public ModelAndView tela() {
		SimpleDateFormat format = new SimpleDateFormat ("yyyy-MM-dd");
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		ModelAndView mv = new ModelAndView("menu");
		Empresa empresa = null;
		
		//empresa----------------------------------------------------------------------------------------------
		try {
			empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
			mv.addObject("empresa", empresa.getNomeEstabelecimento());
			mv.addObject("contato", empresa.getCelular());
			
		}catch(Exception e) {
			empresa = new Empresa();
			empresa.setCodEmpresa(user.getCodEmpresa());
			empresa.setNomeEstabelecimento("Pizzaria");
			empresa.setNomeEmpresa("Pizzaria");
			empresa.setCnpj("");
			empresa.setEmail("");
			empresa.setCelular("");
			
			Endereco endereco = new Endereco();
			endereco.setBairro("");
			endereco.setCidade("");
			endereco.setN(0);
			endereco.setRua("");
			endereco.setTaxa(0);
			empresa.setEndereco(endereco);
			empresas.save(empresa);

			mv.addObject("empresa", empresa.getNomeEstabelecimento());
			mv.addObject("contato", empresa.getCelular());
		}

		setData(format.format(new Date()));
		
		Dia dia = dias.findByCodEmpresa(user.getCodEmpresa());
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dia.getDia());//busca no banco de dados
		
		//dados
		mv.addObject("troco", dado.getTrocoInicio());
		
		//empresa
		mv.addObject("usuario", user.getEmail());
		mv.addObject("permissao", user.getPerfil());
		return mv;
	}
	
	
	@RequestMapping("/login")
	@ResponseBody
	public void login() {
		
		//acessar o dia atual a cada login
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		String dia = LocalDate.now().toString(); // criar data atual
	    setData(dia);
	    
		List<Cupom> listCupom = null;
		
		 int cont = 0;
		 //controlar cupons validados
		 try {
			 listCupom = cupons.findByCodEmpresa(user.getCodEmpresa());
			 for(int i = 0; i < listCupom.size(); i++) {
				 if(listCupom.get(i).getValidade().compareTo(dia) == -1) {
					 listCupom.remove(i);
					 cont++;
				 }
			 }
			 if(cont != 0) {
				 cupons.deleteAll();
				 cupons.saveAll(listCupom);
			 }
		 }catch(Exception e) {}
	}
	
	
	@RequestMapping(value = "/verificarData/{dia}")
	@ResponseBody
	public Dado alterarData(@PathVariable String dia) {
		
		//alterar data de acesso
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		setData(dia);
		Dia data = null;
		Dado dado = null;
		
		try {
			data = dias.findByCodEmpresa(user.getCodEmpresa());
			dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), data.getDia());//busca no banco de dados
		}catch(Exception e) {}
		
		return dado;
	}
	
	
	@RequestMapping(value = "/troco/{trocoInicial}")
	@ResponseBody
	public int buscarId(@PathVariable float trocoInicial) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dias.findByCodEmpresa(user.getCodEmpresa()).getDia());
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
	
	
	//criar dia e dado no banco
	public int setData(String data) {

		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Dado dado = null;
		Dia dia = null;
		
		//dia--------------------------------------------------------------------------------------------------
		try {
			dia = dias.findByCodEmpresa(user.getCodEmpresa());
		}catch(Exception e) {
			dia = new Dia();
		}
		
		dia.setDia(data);
		dia.setCodEmpresa(user.getCodEmpresa());
		dias.save(dia);

		//dados--------------------------------------------------------------------------------------------------
		try {
			dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), data);//busca no banco de dados
			dados.save(dado);
		}catch(Exception e) {
			dado = new Dado();
			dado.setCodEmpresa(user.getCodEmpresa());
			dado.setData(data);
			dado.setTrocoInicio(0);
			dados.save(dado);
		}
		
		return 200;
	}
}
