package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.Pedido;

public interface Pedidos extends JpaRepository<Pedido, Long>{

	public Pedido findByCelular(String id);
	
	public List<Pedido> findByStatusAndEnvio(String Status, String Envio);
	
	public List<Pedido> findByStatus(String Status);
}
