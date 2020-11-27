package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Cliente;

@Transactional(readOnly = true) //evitar duplo acesso ao banco
public interface Clientes extends JpaRepository<Cliente, Long>{
	
	public Cliente findByCelular(String celular);

	public List<Cliente> findByNomeContainingOrCelular(String nome, String celular);

	public Cliente findByCpf(String cpf);
}
