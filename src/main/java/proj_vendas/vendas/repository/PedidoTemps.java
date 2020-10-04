package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.PedidoTemp;

public interface PedidoTemps extends JpaRepository<PedidoTemp, Long>{

	public List<PedidoTemp> findByStatusAndData(String string, String dia);

	public PedidoTemp findByNome(String nome);

	public List<PedidoTemp> findByDataAndStatusOrDataAndStatus(String dia, String string, String dia2, String string2);

	public PedidoTemp findByComanda(Long comanda);
}
