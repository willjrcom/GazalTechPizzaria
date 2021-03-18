package proj_vendas.vendas.web.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Conquista;
import proj_vendas.vendas.model.Cupom;
import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Divulgar;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Endereco;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Divulgacoes;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/menu")
public class MenuController {

	@Autowired
	private Dados dados;

	@Autowired
	private Empresas empresas;

	@Autowired
	private Usuarios usuarios;

	@Autowired
	private Divulgacoes divulgacoes;

	@RequestMapping
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		ModelAndView mv = new ModelAndView("menu");
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		estruturarTelaCompleta(empresa, mv, user);
		mv.addObject("troco", acessarDados(user.getDia(), 0).getTrocoInicio());
		//se for motoboy nao tem necessidade
		if(user.getPerfil().equals("MOTOBOY")) {
			mv.addObject("troco", 1);
		}
		mv.addObject("data", user.getDia().split("-")[2] + "/" + user.getDia().split("-")[1] + "/" + user.getDia().split("-")[0]);
		return mv;
	}

	@RequestMapping("/login")
	@ResponseBody
	public ModelAndView login() {
		// acessar o dia atual a cada login
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		ModelAndView mv = new ModelAndView("menu");
		Empresa empresa = gerarEmpresa(user.getCodEmpresa());
		estruturarTelaCompleta(empresa, mv, user);

		liberarConquistas(dados.findByCodEmpresa(user.getCodEmpresa()).size(), user.getCodEmpresa());
		
		mv.addObject("troco", acessarDados(format.format(new Date()), 1).getTrocoInicio());
		//se for motoboy nao tem necessidade
		if(user.getPerfil().equals("MOTOBOY")) {
			mv.addObject("troco", 1);
		}
		mv.addObject("data", user.getDia().split("-")[2] + "/" + user.getDia().split("-")[1] + "/" + user.getDia().split("-")[0]);
		return mv;
	}

	@RequestMapping(value = "/troco/{trocoInicial}")
	@ResponseBody
	public int salvarTrocoInicial(@PathVariable float trocoInicial) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia());
		dado.setTrocoInicio(trocoInicial);
		dados.save(dado);

		return 200;
	}

	@RequestMapping("/autenticado")
	@ResponseBody
	public String autenticado() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		return user.getPerfil();
	}

	@RequestMapping(value = "/acessarData/{dia}")
	@ResponseBody
	public ModelAndView acessarData(@PathVariable String dia) {
		acessarDados(dia, 1);
		return new ModelAndView("menu");
	}

	// acessar dia e dado no banco
	public Dado acessarDados(String data, int tipo) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Dado dado = null;

		// altera no usuario
		if (tipo == 1) {
			user.setDia(data);
			usuarios.save(user);
		}

		try {
			dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), data);// busca no banco de dados
			if (dado == null) {
				dado = new Dado();
				dado.setCodEmpresa(user.getCodEmpresa());
				dado.setData(data);
				dado.setTrocoInicio(0);

				Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
				List<Dado> todosDados = empresa.getDado();
				todosDados.add(dado);
				empresa.setDado(todosDados);
				empresas.save(empresa);
			}
		} catch (Exception e) {
			System.out.println(e);
		}

		return dado;
	}

	@RequestMapping(value = "/diaAberto")
	@ResponseBody
	public ResponseEntity<List<Dado>> todos() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		if(!user.getPerfil().equals("MOTOBOY")) {
			return ResponseEntity.ok(dados.findByCodEmpresaAndTrocoFinal(user.getCodEmpresa(), 0));
		}
		return ResponseEntity.ok(null);
	}

	private Empresa gerarEmpresa(int codEmpresa) {
		Empresa empresa = null;
		try {
			empresa = empresas.findByCodEmpresa(codEmpresa);
			if (empresa == null) {
				empresa = new Empresa();
				empresa.setCodEmpresa(codEmpresa);
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

				Conquista conquista = new Conquista();
				empresa.setConquista(conquista);
				empresa.setCodEmpresa(codEmpresa);
				empresas.save(empresa);
			}
		} catch (Exception e) {
			System.out.println(e);
		}

		verificarCupom(empresa);
		return empresa;
	}

	private ModelAndView estruturarTelaCompleta(Empresa empresa, ModelAndView mv, Usuario user) {
		mostrarDivulgacoes(mv);
		Conquista conquista = empresa.getConquista();

		mv.addObject("empresa", empresa.getNomeEstabelecimento());
		mv.addObject("contato", empresa.getCelular());

		// dev
		if (user.getPerfil().equals("DEV"))
			mv.addObject("dev", 1);

		// conquistas
		if (!conquista.isCadEmpresa() || !conquista.isCadFuncionario() || !conquista.isCadPedido()
				|| !conquista.isCadProduto()) {
			mv.addObject("mostrarConquistas", true);
			mv.addObject("cadPedido", conquista.isCadPedido());
			mv.addObject("cadFuncionario", conquista.isCadFuncionario());
			mv.addObject("cadEmpresa", conquista.isCadEmpresa());
			mv.addObject("cadProduto", conquista.isCadProduto());
		} else {
			mv.addObject("mostrarConquistas", false);
		}

		// dados
		mv.addObject("usuario", user.getEmail());
		mv.addObject("permissao", user.getPerfil());
		return mv;
	}

	private ModelAndView mostrarDivulgacoes(ModelAndView mv) {
		try {
			Divulgar divulgar = divulgacoes.findById((long) 1).get();
			if (divulgar.isMostrarNovidades()) {
				mv.addObject("mostrarNovidades", true);

				// divulgações
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
			} else {
				mv.addObject("mostrarNovidades", false);
			}
		} catch (Exception e) {
			System.out.println(e);
		}
		return mv;
	}

	private void verificarCupom(Empresa empresa) {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

		int cont = 0;
		// controlar cupons validados
		try {
			List<Cupom> listCupom = empresa.getCupom();
			for (int i = 0; i < listCupom.size(); i++) {
				if (listCupom.get(i).getValidade().compareTo(format.format(new Date())) == -1) {
					listCupom.remove(i);
					cont++;
				}
			}
			if (cont != 0) {
				empresa.setCupom(listCupom);
				empresas.save(empresa);
			}
		} catch (Exception e) {
			System.out.println(e);
		}
	}

	private void liberarConquistas(int totalDias, int codEmpresa) {
		Empresa empresa = empresas.findByCodEmpresa(codEmpresa);
		Conquista conquista = empresa.getConquista();

		if (conquista.getTotalDias() < totalDias) {
			conquista.setTotalDias(totalDias);
		}
		if (totalDias >= 730 && conquista.isT4() == false) {
			conquista.setT4(true);
		} else if (totalDias >= 365 && conquista.isT3() == false) {
			conquista.setT3(true);
		} else if (totalDias >= 180 && conquista.isT2() == false) {
			conquista.setT2(true);
		} else if (totalDias >= 30 && conquista.isT1() == false) {
			conquista.setT1(true);
		}
		empresa.setConquista(conquista);
		empresas.save(empresa);
	}
}
