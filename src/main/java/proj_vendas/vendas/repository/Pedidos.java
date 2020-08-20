package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import proj_vendas.vendas.model.Pedido;

public interface Pedidos extends JpaRepository<Pedido, Long>{

	Pedido findByCelular(String id);
	
	@Query(value = "select p from Pedido p where p.status = 'COZINHA'")
	List<Pedido> findPedidoscozinha();

	//@Query(value = "select a from Pedido a where a.status = 'PRONTO'")
	//List<Pedido> findPedidosmotoboy();
}
