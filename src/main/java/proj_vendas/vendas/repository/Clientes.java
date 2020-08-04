package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.Cliente;

public interface Clientes extends JpaRepository<Cliente, Long>{

	public List<Cliente> findByNomeContaining(String nome);
	
	public Cliente findByCelular(String celular);

	public List<Cliente> findByNomeContainingOrCelularContaining(String nome, String celular);

	public List<Cliente> findByNomeContainingOrCelularContainingOrEnderecoRuaContainingOrEnderecoNContainingOrEnderecoBairroContainingOrEnderecoCidadeContaining(
			String nome, String nome2, String nome3, String nome4, String nome5, String nome6);
}
