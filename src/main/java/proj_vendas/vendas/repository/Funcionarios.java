package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.Funcionario;

public interface Funcionarios extends JpaRepository<Funcionario, Long>{

	public List<Funcionario> findByNomeContaining(String nome);
}
