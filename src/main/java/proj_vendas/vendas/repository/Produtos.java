package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import proj_vendas.vendas.model.Produto;

public interface Produtos extends JpaRepository<Produto, Long>{
	
	public List<Produto> findByNomeProdutoContaining(String nomeProduto);
	
	public String findByNomeProduto(String nomeProduto);
	
	public List<Produto> findByNomeProdutoContainingOrDescricaoContaining(String nome, String descricao);

	public List<Produto> findByNomeProdutoContainingOrCodigoBusca(String nome, String nome2);
	
	@Query("select p from Produto p where p.setor = 'BORDA'")
	public List<Produto> findAllProduto();

	public List<Produto> findByNomeProdutoContainingAndDisponivelOrCodigoBuscaAndDisponivel(String nome, boolean i, String nome2, boolean j);

	public List<Produto> findByDisponivel(boolean i);
	
	public List<Produto> findBySetorAndDisponivel(String setor, boolean i);
	
	public Produto findByCodigoBusca(String codigo);
}
