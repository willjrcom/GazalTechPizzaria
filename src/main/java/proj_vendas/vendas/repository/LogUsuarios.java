package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.LogUsuario;

@Transactional(readOnly = true)
public interface LogUsuarios extends JpaRepository<LogUsuario, Long>{

}
