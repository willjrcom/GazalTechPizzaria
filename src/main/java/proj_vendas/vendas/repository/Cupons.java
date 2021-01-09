package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Cupom;

@Transactional(readOnly = true)
public interface Cupons extends JpaRepository<Cupom, Long>{

	public List<Cupom> findByCodEmpresa(int codEmpresa);
}
