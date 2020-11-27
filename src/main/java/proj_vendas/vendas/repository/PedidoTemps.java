package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.PedidoTemp;

@Transactional(readOnly = true)
public interface PedidoTemps extends JpaRepository<PedidoTemp, Long>{

	public List<PedidoTemp> findByStatusAndData(String string, String dia);

	public List<PedidoTemp> findByStatus(String string);
	
	public List<PedidoTemp> findByComanda(long comanda);

	@Transactional(readOnly = false)
	public void deleteByData(String dia);// apagar no fechamento
}
