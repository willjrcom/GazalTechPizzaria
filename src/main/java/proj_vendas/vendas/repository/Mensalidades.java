package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.empresa.Mensalidade;

@Transactional(readOnly = true)
@Repository
public interface Mensalidades extends JpaRepository<Mensalidade, Long>{

}
