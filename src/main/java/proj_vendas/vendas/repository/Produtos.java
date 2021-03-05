package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Produto;

@Transactional(readOnly = true)
@Repository
public interface Produtos extends JpaRepository<Produto, Long>{

	public Produto findByCodEmpresaAndCodigoBusca(int codEmpresa, String codigo);
	
	public List<Produto> findByCodEmpresa(int codEmpresa);
	
	public List<Produto> findByCodEmpresaAndSetorNotAndDisponivel(int codEmpresa, String setorNot, boolean b);

	public List<Produto> findByCodEmpresaAndSetorAndDisponivel(int codEmpresa, String setor, boolean b);

	public List<Produto> findByCodEmpresaAndNomeContainingOrCodEmpresaAndDescricaoContaining(int codEmpresa, String nome, int codEmpresa2, String nome2);

	public List<Produto> findByCodEmpresaAndCodigoBuscaAndSetorNotAndDisponivel(int codEmpresa, String nome, String setorNot, boolean b);

	public List<Produto> findByCodEmpresaAndNomeContainingAndSetorNot(int codEmpresa, String nome, String setorNot);
	
	@Query("SELECT COUNT(u) FROM Produto u WHERE u.codEmpresa=:cod")
    public int totalProdutos(@Param("cod") int codEmpresa);

}
