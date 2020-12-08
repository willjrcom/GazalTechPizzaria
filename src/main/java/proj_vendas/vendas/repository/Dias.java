package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Dia;

@Transactional(readOnly = true)
public interface Dias extends JpaRepository<Dia, Long>{
	
	public Dia findByCodEmpresa(int codEmpresa);
}
