package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.empresa.Pedido;

@Transactional(readOnly = true)
@Repository
public interface Pedidos extends JpaRepository<Pedido, Long>{
	
	public Pedido findByCodEmpresaAndDataAndNomeAndStatusNotAndStatusNot(Long codEmpresa, String data, String nome, String statusNot, String statusNot2);
	
	public List<Pedido> findByCodEmpresaAndDataAndStatus(Long codEmpresa, String data, String status);

	public List<Pedido> findByCodEmpresaAndDataAndEnvioNotAndStatusOrCodEmpresaAndDataAndEnvioAndStatus(Long codEmpresa, String data, String envio, String statusNot, Long codEmpresa2, String data2, String envio2, String status2);

	public List<Pedido> findByCodEmpresaAndDataAndEnvioAndStatus(Long codEmpresa, String data, String envio, String status);

	public List<Pedido> findByCodEmpresaAndDataAndStatusNotAndStatusNot(Long codEmpresa, String data, String statusNot, String statusNot2);

	@Query("SELECT COUNT(u) FROM Pedido u WHERE u.codEmpresa=:cod AND u.data=:dia AND NOT u.status=:status1 AND NOT u.status=:status2")
    public int totalPedidos(@Param("cod") Long codEmpresa, @Param("dia") String dia, @Param("status1") String status1, @Param("status2") String status2);

}
