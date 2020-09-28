package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import proj_vendas.vendas.model.Empresa;

public interface Empresas extends JpaRepository<Empresa, Long>{

	@Query("SELECT u FROM Empresa u WHERE u.id = 1")
	public Empresa buscarId1();
}
