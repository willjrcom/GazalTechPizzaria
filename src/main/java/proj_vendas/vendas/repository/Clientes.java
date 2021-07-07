package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.cadastros.Cliente;

@Transactional(readOnly = true) //evitar duplo acesso ao banco
@Repository
public interface Clientes extends JpaRepository<Cliente, Long>{

	public Cliente findByCodEmpresaAndCpf(Long codEmpresa, String cpf);

	public Cliente findByCodEmpresaAndCelular(Long codEmpresa, Long celular);

	public List<Cliente> findByCodEmpresa(Long codEmpresa);

	public List<Cliente> findByCodEmpresaAndNomeContainingOrCodEmpresaAndCelular(Long codEmpresa, String nome, Long codEmpresa2, Long celular);
	
	@Query("SELECT COUNT(u) FROM Cliente u WHERE u.codEmpresa=:cod")
    public int totalClientes(@Param("cod") Long codEmpresa);
	 
	@Query("SELECT nome, contPedidos FROM Cliente u WHERE u.codEmpresa=:cod AND u.contPedidos != 0 ORDER BY u.contPedidos DESC")
	public List<String> top10Clientes(@Param("cod") Long codEmpresa);

}
