package proj_vendas.vendas.web.controller.Cadastros;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Produtos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/cadastroProduto")
public class CadastroProdutoController {
	
	@Autowired
	private Produtos produtos;

	@Autowired
	private Usuarios usuarios;
	
	@RequestMapping("/**")
	public ModelAndView cadastroProduto() {
		return new ModelAndView("cadastroProduto");
	}
	
	@RequestMapping(value = "/cadastrar")
	@ResponseBody
	public Produto cadastrarProduto(@RequestBody Produto produto) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		produto.setCodEmpresa(user.getCodEmpresa());
		
		return produtos.save(produto);
	}
	
	@RequestMapping(value = "/editarProduto/{id}")
	@ResponseBody
	public Optional<Produto> buscarProduto(@PathVariable Long id) {
		return produtos.findById(id);
	}

	@RequestMapping(value = "/buscarCodigo/{codigo}/{id}")
	@ResponseBody
	public Produto buscarCodigo(@PathVariable String codigo, @PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Produto busca = produtos.findByCodEmpresaAndCodigoBusca(user.getCodEmpresa(), codigo);
			
		if(busca != null && id != -2) {
			long produto = produtos.findById((long)id).get().getId();
			
			if(busca.getId() == produto) {
				Produto vazio = new Produto();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return busca;
	}
}
