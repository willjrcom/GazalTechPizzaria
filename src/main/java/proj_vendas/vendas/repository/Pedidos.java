package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import proj_vendas.vendas.model.Pedido;

public interface Pedidos extends JpaRepository<Pedido, Long>{

	Pedido findByCelular(String id);
	
	@Query(value = "select p from Pedido p where p.status = 'COZINHA'")
	public List<Pedido> findPedidoscozinha();

	@Query(value = "select a from Pedido a where a.status = 'PRONTO'")
	public List<Pedido> findPedidospronto();

	@Query(value = "select a from Pedido a where a.status = 'MOTOBOY'")
	public List<Pedido> findPedidosmotoboy();
	
	@Query(value = "select a from Pedido a where a.status = 'FINALIZADO'")
	public List<Pedido> findPedidosfinalizado();
	
	@Query(value = "select a from Pedido a where a.status = 'EXCLUIDO'")
	public List<Pedido> findPedidosexcluido();
	
	public List<Pedido> findByStatusAndEnvio(String Status, String Envio);
}
