package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Salario;

@Transactional(readOnly = true)
public interface Salarios extends JpaRepository<Salario, Long>{

	public List<Salario> findByIdFuncionarioAndData(Long idFuncionario, String data);
}
