package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.cadastros.Empresa;

@Transactional(readOnly = true)
@Repository
public interface Empresas extends JpaRepository<Empresa, Long>{
	
	public Empresa findByCodEmpresa(Long codEmpresa);

	@Query("select id, codEmpresa, celular, email from Empresa")
	public List<String> mostrarTodos();
	
	public List<Empresa> findByCnpj(String cnpj);
}
