package proj_vendas.vendas.web.controller.Adm;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.cadastros.Usuario;
import proj_vendas.vendas.model.empresa.Dado;
import proj_vendas.vendas.model.empresa.Pedido;
import proj_vendas.vendas.model.empresa.Sangria;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class FechamentoController {

	@Autowired
	private Pedidos pedidos;
	
	@Autowired
	private Dados dados;
	
	@Autowired
	private Usuarios usuarios;

	@GetMapping("/fechamento")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		ModelAndView mv = new ModelAndView("fechamento");
		mv.addObject("permissao", user.getPerfil());
		return mv;
	}
	
	
	@RequestMapping(value = "/fechamento/pedidos")
	@ResponseBody
	public List<Pedido> pedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		return pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), user.getDia(), "FINALIZADO");
	}
	
	
	@RequestMapping(value = "/fechamento/dados")
	@ResponseBody
	public Dado dados() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		return dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia());
	}
	
	
	@RequestMapping(value = "/fechamento/u/finalizar/{trocoFinal}")
	@ResponseBody
	public Dado finalizarCaixa(@PathVariable float trocoFinal) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		/*
		//pedidos
		List<Pedido> finalizados = pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), dia, "FINALIZADO");
		List<Pedido> excluidos = pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), dia, "EXCLUIDO");
		pedidos.deleteInBatch(finalizados);
		pedidos.deleteInBatch(excluidos);
		*/
		//buscar dado do dia
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia());
		dado.setTrocoFinal(trocoFinal);
		return dados.save(dado);
	}
	
	
	@RequestMapping(value = "/fechamento/sangria/{nome}/{valor}")
	@ResponseBody
	public Dado sangria(@PathVariable String nome, @PathVariable float valor) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		//buscar dado do dia
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia());
		
		//gerar nova sangria
		Sangria sangria = new Sangria();
		sangria.setNome(nome);
		sangria.setValor(valor);
		
		//pegar todas sangrias do dia
		List<Sangria> sangrias = dado.getSangria();
		sangrias.add(sangria);
		
		//salvar sangrias
		dado.setSangria(sangrias);
		
		return dados.save(dado);
	}
}
