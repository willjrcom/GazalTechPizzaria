package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Endereco;

@Transactional(readOnly = true)
@Repository
public interface Enderecos extends JpaRepository<Endereco, Long>{

	public List<Endereco> findByCodEmpresa(int codEmpresa);
	
	@Query("SELECT bairro, taxa FROM Endereco u WHERE u.codEmpresa=:cod")
	public List<String> buscarEnderecos(@Param("cod") int codEmpresa);
}
