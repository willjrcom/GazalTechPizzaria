package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.LogMesa;

@Transactional(readOnly = true)
public interface LogMesas extends JpaRepository<LogMesa, Long>{

}
