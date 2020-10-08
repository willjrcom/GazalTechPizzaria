package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.Pedido;

public interface Pedidos extends JpaRepository<Pedido, Long>{

	public Pedido findByCelular(String id);//buscar para fazer novo pedido
	
	public List<Pedido> findByStatusAndEnvioAndData(String Status, String Envio, String data);//mostrar nas telas especificas

	public List<Pedido> findByStatusAndData(String string, String dia);//mostrar nas telas especificas

	public List<Pedido> findByDataAndStatusNot(String dia, String statusNot);

	public Pedido findByComanda(Long comanda); //buscar para excluir temp

	public Pedido findByNomePedidoAndData(String nomePedido, String data);//buscar para atualizar ou criar pedido
}
