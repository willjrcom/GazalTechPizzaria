package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.Pedido;

public interface Pedidos extends JpaRepository<Pedido, Long>{

	Pedido findByCelular(String id);
}
