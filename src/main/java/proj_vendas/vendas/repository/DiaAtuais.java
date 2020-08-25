package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.DiaAtual;

public interface DiaAtuais extends JpaRepository<DiaAtual, Long>{
	
}
