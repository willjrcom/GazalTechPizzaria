package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Dado;

@Transactional(readOnly = true)
public interface Dados extends JpaRepository<Dado, Long>{

	public Dado findByData(String data);

	public List<Dado> findByTrocoFinalOrTrocoInicio(double i, double j);

	public List<Dado> findByTrocoInicioNotLikeAndTrocoFinalNotLike(double i, double j);
}
