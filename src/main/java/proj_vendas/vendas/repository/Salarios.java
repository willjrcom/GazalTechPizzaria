package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Salario;

@Transactional(readOnly = true)
@Repository
public interface Salarios extends JpaRepository<Salario, Long>{

	public List<Salario> findByCodEmpresaAndIdFuncionarioAndData(int codEmpresa, Long id, String data);
}
