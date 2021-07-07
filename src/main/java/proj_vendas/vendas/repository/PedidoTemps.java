package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.empresa.PedidoTemp;

@Transactional(readOnly = true)
@Repository
public interface PedidoTemps extends JpaRepository<PedidoTemp, Long>{

	public List<PedidoTemp> findByCodEmpresa(Long codEmpresa);

	public List<PedidoTemp> findByCodEmpresaAndEnvio(Long codEmpresa, String string);

	public List<PedidoTemp> findByCodEmpresaAndDataAndComanda(Long codEmpresa, String dia, Long comanda);
	
	@Query("SELECT COUNT(u) FROM PedidoTemp u WHERE u.codEmpresa=:cod AND u.data=:dia AND u.status=:status")
    public int totalPedidos(@Param("cod") Long codEmpresa, @Param("dia") String dia, @Param("status") String status);

	public List<PedidoTemp> findByCodEmpresaAndStatus(Long codEmpresa, String status);
}
