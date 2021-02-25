package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Dia;

@Transactional(readOnly = true)
@Repository
public interface Dias extends JpaRepository<Dia, Long>{
	
	public Dia findByCodEmpresa(int codEmpresa);
}
