package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Pedido;

@Transactional(readOnly = true)
public interface Pedidos extends JpaRepository<Pedido, Long>{
	
	public Pedido findByCodEmpresaAndDataAndNomeAndStatusNotAndStatusNot(int codEmpresa, String data, String nome, String statusNot, String statusNot2);
	
	public List<Pedido> findByCodEmpresaAndDataAndStatus(int codEmpresa, String data, String status);

	public List<Pedido> findByCodEmpresaAndDataAndEnvioNotAndStatusOrCodEmpresaAndDataAndEnvioAndStatus(int codEmpresa, String data, String envio, String statusNot, int codEmpresa2, String data2, String envio2, String status2);

	public List<Pedido> findByCodEmpresaAndDataAndEnvioAndStatus(int codEmpresa, String data, String envio, String status);

	public List<Pedido> findByCodEmpresaAndDataAndStatusNotAndStatusNot(int codEmpresa, String data, String statusNot, String statusNot2);
}
