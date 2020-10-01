package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.Pedido;

public interface Pedidos extends JpaRepository<Pedido, Long>{

	public Pedido findByCelular(String id);
	
	public List<Pedido> findByStatusAndEnvioAndData(String Status, String Envio, String data);

	public List<Pedido> findByStatusAndData(String string, String dia);

	public List<Pedido> findByDataAndStatusOrDataAndStatusOrDataAndStatus(String dia, String string, String dia1,String string2, String dia2,String string3);
}
