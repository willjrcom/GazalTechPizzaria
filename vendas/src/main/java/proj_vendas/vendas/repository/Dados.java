package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.Dado;

public interface Dados extends JpaRepository<Dado, Long>{

	public Dado findByData(String data);

	public List<Dado> findByTrocoFinalOrTrocoInicio(double i, double j);
}
