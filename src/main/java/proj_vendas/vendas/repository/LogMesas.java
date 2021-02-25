package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.LogMesa;

@Transactional(readOnly = true)
@Repository
public interface LogMesas extends JpaRepository<LogMesa, Long>{

	List<LogMesa> findByCodEmpresa(int codEmpresa);

}
