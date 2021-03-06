package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.empresa.Duvida;

@Transactional(readOnly = true)
@Repository
public interface Duvidas extends JpaRepository<Duvida, Long>{

	Duvida findByCodigo(int codigo);
}
