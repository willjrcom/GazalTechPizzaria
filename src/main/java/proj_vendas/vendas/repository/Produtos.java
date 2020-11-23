package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Produto;

@Transactional(readOnly = true)
public interface Produtos extends JpaRepository<Produto, Long>{
	
	public List<Produto> findByNomeProdutoContainingOrDescricaoContaining(String nome, String descricao);//Produtos cadastrados
	
	@Query("select p from Produto p where p.setor = 'BORDA' AND p.disponivel = true")
	public List<Produto> findAllBordas();//novo pedido

	public List<Produto> findByDisponivelAndSetorNot(boolean i, String setor);//novo pedido tablet // mostrar todos

	public List<Produto> findBySetorAndDisponivel(String setor, boolean i);//buscar para paginas

	public List<Produto> findByCodigoBuscaAndDisponivelAndSetorNot(String codigo, boolean i, String setor);//buscar produto por codigo
	
	public Produto findByCodigoBusca(String codigo);//buscar no cadastro

	public List<Produto> findByNomeProdutoContainingAndDisponivelAndSetorNot(String nome, boolean b, String setor);//buscar produto por nome
}
