package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Empresa;

@Transactional(readOnly = true)
public interface Empresas extends JpaRepository<Empresa, Long>{
	
	public Empresa findByCodEmpresa(int codEmpresa);
}
