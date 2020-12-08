package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.PedidoTemp;

@Transactional(readOnly = true)
public interface PedidoTemps extends JpaRepository<PedidoTemp, Long>{

	public List<PedidoTemp> findByCodEmpresaAndDataAndStatus(int codEmpresa, String data, String status);

	public List<PedidoTemp> findByCodEmpresaAndStatus(int codEmpresa, String status);


	public List<PedidoTemp> findByCodEmpresa(int codEmpresa);

	public List<PedidoTemp> findByCodEmpresaAndDataAndComanda(int codEmpresa, String dia, Long comanda);
	
	@Query("SELECT COUNT(u) FROM PedidoTemp u WHERE u.codEmpresa=:cod AND u.data=:dia AND u.status=:status")
    public int totalPedidos(@Param("cod") int codEmpresa, @Param("dia") String dia, @Param("status") String status);

}
