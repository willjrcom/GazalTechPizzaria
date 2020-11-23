package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Funcionario;

@Transactional(readOnly = true)
public interface Funcionarios extends JpaRepository<Funcionario, Long>{

	public List<Funcionario> findByNomeContaining(String nome);

	public List<Funcionario> findByNomeContainingOrCelularContainingOrCpfContainingOrEmailOrEnderecoRuaContainingOrEnderecoNContainingOrEnderecoBairroContaining(
			String nome, String nome2, String nome3, String nome4, String nome5, String nome6, String nome7);
	
	public Funcionario findByCpf(String cpf);

	public Funcionario findByCelular(String celular);
}
