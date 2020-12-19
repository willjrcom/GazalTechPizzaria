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
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.Produtos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("/cadastroProduto")
public class CadastroProdutoController {
	
	@Autowired
	private Produtos produtos;
	
	@Autowired
	private LogUsuarios logUsuarios;

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
		
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();
		
		log.setUsuario(user.getEmail());
		log.setAcao("Cadastrar/atualizar produto: " + produto.getNomeProduto());
		log.setData(hora.toString());
		log.setCodEmpresa(user.getCodEmpresa());
		
		logUsuarios.save(log); //salvar logUsuario
		
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
