package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.empresa.Pagamento;

@Transactional(readOnly = true)
@Repository
public interface Pagamentos extends JpaRepository<Pagamento, Long>{

	public List<Pagamento> findByData(String data);
}
