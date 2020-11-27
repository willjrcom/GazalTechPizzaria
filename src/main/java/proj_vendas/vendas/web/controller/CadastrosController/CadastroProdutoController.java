package proj_vendas.vendas.web.controller.CadastrosController;

import java.util.Date;
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

import proj_vendas.vendas.model.LogUsuario;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/cadastroProduto")
public class CadastroProdutoController {
	
	@Autowired
	private Produtos produtos;
	
	@Autowired
	private LogUsuarios usuarios;
	
	@RequestMapping("/**")
	public ModelAndView cadastroProduto() {
		return new ModelAndView("cadastroProduto");
	}
	
	@RequestMapping(value = "/cadastrar")
	@ResponseBody
	public Produto cadastrarProduto(@RequestBody Produto produto) {
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal(); //buscar usuario logado
		log.setUsuario(((UserDetails)principal).getUsername());
		log.setAcao("Cadastrar/atualizar produto: " + produto.getNomeProduto());
		log.setData(hora.toString());
		
		usuarios.save(log); //salvar logUsuario
		
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
		Produto busca = produtos.findByCodigoBusca(codigo);
		Produto produto = produtos.findById(id).get();
		if(busca != null) {
			if(busca.getId() == produto.getId()) {
				Produto vazio = new Produto();
				vazio.setId((long) -1);
				return vazio;
			}
		}
		return produtos.findByCodigoBusca(codigo);
	}
}
