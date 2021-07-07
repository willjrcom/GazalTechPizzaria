package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.log.LogUsuario;

@Transactional(readOnly = true)
@Repository
public interface LogUsuarios extends JpaRepository<LogUsuario, Long>{

}
