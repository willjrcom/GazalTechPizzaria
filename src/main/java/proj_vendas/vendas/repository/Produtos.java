package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import proj_vendas.vendas.model.Produto;

public interface Produtos extends JpaRepository<Produto, Long>{
	
	List<Produto> findByNomeProdutoContaining(String nomeProduto);
	
	String findByNomeProduto(String nomeProduto);
	
	List<Produto> findByNomeProdutoContainingOrDescricaoContaining(String nome, String descricao);

	List<Produto> findByNomeProdutoContainingOrCodigoBusca(String nome, String nome2);
	
	@Query("select p from Produto p where p.setor = 'BORDA'")
	List<Produto> findAllProduto();
}
