package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.PedidoTemp;

@Transactional(readOnly = true)
@Repository
public interface PedidoTemps extends JpaRepository<PedidoTemp, Long>{

	public List<PedidoTemp> findByCodEmpresa(int codEmpresa);

	public List<PedidoTemp> findByCodEmpresaAndSetor(int codEmpresa, int i);
	
	public List<PedidoTemp> findByCodEmpresaAndStatus(int codEmpresa, String string);
	
	public List<PedidoTemp> findByCodEmpresaAndSetorAndEnvio(int codEmpresa, int i, String string);

	public List<PedidoTemp> findByCodEmpresaAndSetorAndStatus(int codEmpresa, int i, String string);
	
	public List<PedidoTemp> findByCodEmpresaAndEnvio(int codEmpresa, String envio);
	
	public List<PedidoTemp> findByCodEmpresaAndDataAndStatus(int codEmpresa, String data, String status);

	public List<PedidoTemp> findByCodEmpresaAndDataAndComanda(int codEmpresa, String dia, Long comanda);
	
	@Query("SELECT COUNT(u) FROM PedidoTemp u WHERE u.codEmpresa=:cod AND u.data=:dia AND u.status=:status")
    public int totalPedidos(@Param("cod") int codEmpresa, @Param("dia") String dia, @Param("status") String status);
}
