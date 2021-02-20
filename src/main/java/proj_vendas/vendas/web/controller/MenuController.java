package proj_vendas.vendas.web.controller;

import java.time.LocalDate;
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
import proj_vendas.vendas.model.Divulgar;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Endereco;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Cupons;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Divulgacoes;
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
	
	@Autowired
	private Divulgacoes divulgacoes;
	
	@RequestMapping
	public ModelAndView tela() {
		//SimpleDateFormat format = new SimpleDateFormat ("yyyy-MM-dd");
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		ModelAndView mv = new ModelAndView("menu");
		Empresa empresa = null;
		
		//empresa----------------------------------------------------------------------------------------------
		try {
			empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
			if(empresa == null) {
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
			}
			mv.addObject("empresa", empresa.getNomeEstabelecimento());
			mv.addObject("contato", empresa.getCelular());
			
		}catch(Exception e) {}

		
		//dados
		mv.addObject("troco", acessarDados(LocalDate.now().toString()).getTrocoInicio());
		
		//empresa
		mv.addObject("usuario", user.getEmail());
		mv.addObject("permissao", user.getPerfil());

		try {
		Divulgar divulgar = divulgacoes.findById((long)1).get();
			//divulgações
			mv.addObject("empresa1", divulgar.getEmpresa1());
			mv.addObject("empresa2", divulgar.getEmpresa2());
			mv.addObject("empresa3", divulgar.getEmpresa3());
			mv.addObject("empresa4", divulgar.getEmpresa4());
			mv.addObject("empresa5", divulgar.getEmpresa5());
	
			mv.addObject("texto1", divulgar.getTexto1());
			mv.addObject("texto2", divulgar.getTexto2());
			mv.addObject("texto3", divulgar.getTexto3());
			mv.addObject("texto4", divulgar.getTexto4());
			mv.addObject("texto5", divulgar.getTexto5());
	
			mv.addObject("link1", divulgar.getLink1());
			mv.addObject("link2", divulgar.getLink2());
			mv.addObject("link3", divulgar.getLink3());
			mv.addObject("link4", divulgar.getLink4());
			mv.addObject("link5", divulgar.getLink5());
		}catch(Exception e) {}

		return mv;
	}
	
	
	@RequestMapping("/login")
	@ResponseBody
	public void login() {
		
		//acessar o dia atual a cada login
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		String dia = LocalDate.now().toString(); // criar data atual
		setDados(dia);
		
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

		Dado dado = setDados(dia);
		
		return dado;
	}
	
	
	@RequestMapping(value = "/troco/{trocoInicial}")
	@ResponseBody
	public int salvarTrocoInicial(@PathVariable float trocoInicial) {
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
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		return user.getPerfil();
	}
	
	
	//criar dia e dado no banco
	public Dado setDados(String data) {

		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Dado dado = null;
		Dia dia = null;
		
		try {
			dia = dias.findByCodEmpresa(user.getCodEmpresa());
			
			if(dia == null) {
				dia = new Dia();
			}
			dia.setDia(data);
			dia.setCodEmpresa(user.getCodEmpresa());
			dias.save(dia);
		}catch(Exception e) {
			System.out.println(e);
		}
		
		try {
			dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), data);//busca no banco de dados
			if(dado == null) {
				dado = new Dado();
				dado.setCodEmpresa(user.getCodEmpresa());
				dado.setData(data);
				dado.setTrocoInicio(0);
				dados.save(dado);
			}
		}catch(Exception e) {
			System.out.println(e);
		}
		
		return dado;
	}
	
	
	//acessar dia e dado no banco
	public Dado acessarDados(String data) {

		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Dado dado = null;
		Dia dia = null;
		
		try {
			dia = dias.findByCodEmpresa(user.getCodEmpresa());
			
			if(dia == null) {
				dia = new Dia();
			}else {
				data = dia.getDia();
			}
			dia.setDia(data);
			dia.setCodEmpresa(user.getCodEmpresa());
			dias.save(dia);
		}catch(Exception e) {
			System.out.println(e);
		}
		
		try {
			dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), data);//busca no banco de dados
			if(dado == null) {
				dado = new Dado();
				dado.setCodEmpresa(user.getCodEmpresa());
				dado.setData(data);
				dado.setTrocoInicio(0);
				dados.save(dado);
			}
		}catch(Exception e) {
			System.out.println(e);
		}
		
		return dado;
	}
}
