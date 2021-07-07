package proj_vendas.vendas.web.controller;

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

import proj_vendas.vendas.model.cadastros.Empresa;
import proj_vendas.vendas.model.cadastros.Endereco;
import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.model.empresa.Conquista;
import proj_vendas.vendas.model.empresa.Dado;
import proj_vendas.vendas.model.empresa.Divulgar;
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
		mv.addObject("troco", acessarDados(user.getDia(), 0, user).getTrocoInicio());
		
		// Procurar Empresa
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		 
		// Se a empresa não existir
		if(empresa == null) {
			empresa = gerarEmpresa((long)user.getCodEmpresa());
		}

		// Procurar divulgação
		Divulgar divulgar = divulgacoes.findById((long) 1).get();
		
		if (divulgar != null && divulgar.isMostrarNovidades()) {
			mv.addObject("mostrarNovidades", true);
			
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

		Conquista conquista = empresa.getConquista();
		
		// conquistas
		if (!conquista.isCadEmpresa() || !conquista.isCadFuncionario() || !conquista.isCadPedido() || !conquista.isCadProduto()) {
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
		mv.addObject("perfil", user.getPerfil());
		
		if(user.getPerfil().equals("DEV")|| user.getPerfil().equals("USUARIO") || user.getPerfil().equals("ADM")) {
			mv.addObject("permissao", true);
		}else {
			mv.addObject("permissao", false);
		}
		
		// Menu
		mv.addObject("empresa", empresa.getNomeEstabelecimento());
		mv.addObject("contato", empresa.getCelular());
		
		// Se for motoboy nao tem necessidade
		if (user.getPerfil().equals("MOTOBOY") || user.getPerfil().equals("GRATUITO")) {
			// É definido 1 pois, qualquer numero diferente de 0 quer dizer que não precisa de troco
			mv.addObject("troco", 1);
		}
		
		// Mostrar data atual
		mv.addObject("data", user.getDia().split("-")[2] + "/" + user.getDia().split("-")[1] + "/" + user.getDia().split("-")[0]);
		return mv;
	}


	@RequestMapping(value = "/troco/{trocoInicial}")
	@ResponseBody
	public int salvarTrocoInicial(@PathVariable float trocoInicial) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		
		// Procurar dado
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
	
	// Executada apos o click do usuario
	@RequestMapping(value = "/acessarData/{dia}")
	@ResponseBody
	public ModelAndView acessarData(@PathVariable String dia) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		
		// Modo setar novo dia no usuario
		acessarDados(dia, 1, user);
		return new ModelAndView("menu");
	}

	// Acessar dia e dado no banco
	public Dado acessarDados(String data, int tipo, Usuario user) {
		/* Tipo 0: utilizado para acessar o dia atual 
		 * Tipo 1: utilizado para setar o dia
		 */

		// Setar nova data no usuario
		// Utilizado no login e pelo usuario
		if (tipo == 1) {
			user.setDia(data);
			usuarios.save(user);
		}
		
		// Validar se Dado existe
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), data);// busca no banco de dados
		
		// Se Dado não existir
		if (dado == null) {
			// Nova instancia
			dado = new Dado();
			dado.setCodEmpresa(user.getCodEmpresa());
			dado.setData(data);
			dado.setTrocoInicio(0);

			// Adicionar a Empresa
			Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
			List<Dado> todosDados = empresa.getDado();
			
			todosDados.add(dado);
			empresa.setDado(todosDados);
			
			empresas.save(empresa);
			
			// Verificar se é necessario
			liberarConquistas(dados.findByCodEmpresa((long)user.getCodEmpresa()).size(), user.getCodEmpresa());
		}

		return dado;
	}

	
	// Executada apos o click do usuario
	@RequestMapping(value = "/verificarDiasAbertos")
	@ResponseBody
	public ResponseEntity<List<String>> verificarDiasAbertos() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		return ResponseEntity.ok(dados.findByDiasEmAberto(user.getCodEmpresa()));
	}

	
	// Apenas no login
	public Empresa gerarEmpresa(Long codEmpresa) {
		// Procurar empresa
		Empresa empresa = empresas.findByCodEmpresa(codEmpresa);
		
		// Se não existir, criar
		if (empresa == null) {
			empresa = new Empresa();
			empresa.setCodEmpresa(codEmpresa);
			empresa.setNomeEstabelecimento("");
			empresa.setNomeEmpresa("");
			empresa.setCnpj("");
			empresa.setEmail("");
			empresa.setCelular("");

			Endereco endereco = new Endereco();
			endereco.setCodEmpresa(codEmpresa);
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
		
		return empresa;
	}


	private void liberarConquistas(int totalDias, Long codEmpresa) {
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
