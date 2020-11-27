package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Funcionario;

@Transactional(readOnly = true)
public interface Funcionarios extends JpaRepository<Funcionario, Long>{

	public List<Funcionario> findByNomeContainingOrCelular(String nome, String celular);
	
	public Funcionario findByCpf(String cpf);

	public Funcionario findByCelular(String celular);
}
