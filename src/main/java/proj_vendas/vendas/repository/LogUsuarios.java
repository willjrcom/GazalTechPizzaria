package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.LogUsuario;

public interface LogUsuarios extends JpaRepository<LogUsuario, Long>{

}
