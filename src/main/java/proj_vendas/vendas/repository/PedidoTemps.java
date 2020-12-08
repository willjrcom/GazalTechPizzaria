package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.PedidoTemp;

@Transactional(readOnly = true)
public interface PedidoTemps extends JpaRepository<PedidoTemp, Long>{

	public List<PedidoTemp> findByCodEmpresaAndDataAndStatus(int codEmpresa, String data, String status);

	public List<PedidoTemp> findByCodEmpresaAndStatus(int codEmpresa, String status);


	public List<PedidoTemp> findByCodEmpresa(int codEmpresa);

	public List<PedidoTemp> findByCodEmpresaAndDataAndComanda(int codEmpresa, String dia, Long comanda);
}
