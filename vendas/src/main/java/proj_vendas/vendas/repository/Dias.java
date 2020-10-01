package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import proj_vendas.vendas.model.Dia;

public interface Dias extends JpaRepository<Dia, Long>{

	@Query("SELECT u FROM Dia u WHERE u.id = 1")
	public Dia buscarId1();
}
