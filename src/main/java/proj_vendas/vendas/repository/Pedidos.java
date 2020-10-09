package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.Pedido;

public interface Pedidos extends JpaRepository<Pedido, Long>{

	public Pedido findByCelular(String id);//buscar para fazer novo pedido
	
	public List<Pedido> findByStatusAndEnvioAndData(String Status, String Envio, String data);//mostrar nas telas especificas

	public List<Pedido> findByStatusAndData(String string, String dia);//mostrar nas telas fechamento
	
	public List<Pedido> findByDataAndStatusNot(String dia, String statusNot);

	public Pedido findByComanda(Long comanda); //buscar para excluir temp

	public Pedido findByNomePedidoAndDataAndStatusNot(String nomePedido, String data, String statusNot);//buscar para atualizar ou criar pedido
	
	public List<Pedido> findByStatusAndDataAndEnvioNotOrStatusAndDataAndEnvio(String string, String dia, String string2,
			String string3, String dia2, String string4);//buscar entrega ou tipos balcao
}
