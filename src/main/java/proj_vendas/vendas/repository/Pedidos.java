package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Pedido;

@Transactional(readOnly = true)
public interface Pedidos extends JpaRepository<Pedido, Long>{
	
	public List<Pedido> findByStatusAndEnvioAndData(String Status, String Envio, String data);//mostrar nas telas especificas

	public List<Pedido> findByStatusAndData(String string, String dia);//mostrar nas telas fechamento

	public List<Pedido> findByStatusAndDataAndEnvioNotOrStatusAndDataAndEnvio(String string, String dia, String string2,
			String string3, String dia2, String string4);//buscar entrega ou tipos balcao

	public List<Pedido> findByDataAndStatusNotAndStatusNot(String dia, String status1, String status2);//ver pedidos

	public Pedido findByNomeAndDataAndStatusNotAndStatusNot(String nome, String dia, String status1, String status2);
}
