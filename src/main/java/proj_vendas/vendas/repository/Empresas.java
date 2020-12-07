package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Empresa;

@Transactional(readOnly = true)
public interface Empresas extends JpaRepository<Empresa, Long>{

	//@Query("SELECT u FROM Empresa u WHERE u.id = 1")
	//public Empresa buscarId1();

	public Empresa findByCodEmpresa(int codEmpresa);
}
