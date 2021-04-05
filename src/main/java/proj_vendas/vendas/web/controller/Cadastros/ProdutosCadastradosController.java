package proj_vendas.vendas.web.controller.Cadastros;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.LogPizza;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Produtos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/u")
public class ProdutosCadastradosController {

	@Autowired
	private Produtos produtos;

	@Autowired
	private Usuarios usuarios;

	@Autowired
	private Empresas empresas;
	
	@GetMapping("/produtosCadastrados")
	public ModelAndView tela() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		ModelAndView mv = new ModelAndView("produtosCadastrados");
		mv.addObject("produtos", produtos.totalProdutos(user.getCodEmpresa()));
		return mv;
	}

	@RequestMapping("/produtosCadastrados/buscar/{nome}")
	@ResponseBody
	public List<Produto> buscar(@PathVariable String nome) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		return produtos.findByCodEmpresaAndNomeContainingOrCodEmpresaAndDescricaoContaining(user.getCodEmpresa(), nome,
				user.getCodEmpresa(), nome);
	}

	@RequestMapping("/produtosCadastrados/excluirProduto/{id}")
	@ResponseBody
	public ResponseEntity<Integer> excluirProdutos(@PathVariable long id) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		List<Produto> todosProdutos = empresa.getProduto();

		for (int i = 0; i < todosProdutos.size(); i++) {
			if (todosProdutos.get(i).getId() == id) {
				todosProdutos.remove(i);
				empresa.setProduto(todosProdutos);
				empresas.save(empresa);
				produtos.deleteById(id);
				return ResponseEntity.ok(200);
			}
		}
		return ResponseEntity.noContent().build();
	}
	
	@RequestMapping("/produtosCadastrados/top10pizzas")
	@ResponseBody
	public List<LogPizza> buscarPizzas() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return empresas.findByCodEmpresa(user.getCodEmpresa()).getLogPizza();
	}
}
