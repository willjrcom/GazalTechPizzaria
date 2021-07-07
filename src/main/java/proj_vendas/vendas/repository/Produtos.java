package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.cadastros.Produto;

@Transactional(readOnly = true)
@Repository
public interface Produtos extends JpaRepository<Produto, Long>{

	public Produto findByCodEmpresaAndCodigoBusca(Long codEmpresa, String codigo);
	
	public List<Produto> findByCodEmpresa(Long codEmpresa);
	
	public List<Produto> findByCodEmpresaAndSetorNotAndDisponivel(Long codEmpresa, String setorNot, boolean b);

	public List<Produto> findByCodEmpresaAndSetorAndDisponivel(Long codEmpresa, String setor, boolean b);

	public List<Produto> findByCodEmpresaAndNomeContainingOrCodEmpresaAndDescricaoContaining(Long codEmpresa, String nome, Long codEmpresa2, String nome2);

	public List<Produto> findByCodEmpresaAndCodigoBuscaAndSetorNotAndDisponivel(Long codEmpresa, String nome, String setorNot, boolean b);

	public List<Produto> findByCodEmpresaAndNomeContainingAndSetorNot(Long codEmpresa, String nome, String setorNot);
	
	@Query("SELECT COUNT(u) FROM Produto u WHERE u.codEmpresa=:cod")
    public int totalProdutos(@Param("cod") Long codEmpresa);

	@Query("SELECT nome, setor FROM Produto u WHERE u.codEmpresa=:cod AND u.setor != 'BORDA' ")
	public List<String> nomesProdutos(@Param("cod") Long codEmpresa);
}
