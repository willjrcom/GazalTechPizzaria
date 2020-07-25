package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.Cliente;

public interface Clientes extends JpaRepository<Cliente, Long>{

	public List<Cliente> findByNomeContaining(String nome);
	
	public Cliente findByCelular(String celular);
}
