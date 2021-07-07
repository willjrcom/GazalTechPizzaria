package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.cadastros.Funcionario;

@Transactional(readOnly = true)
@Repository
public interface Funcionarios extends JpaRepository<Funcionario, Long>{

	public Funcionario findByCodEmpresaAndCpf(Long codEmpresa, String cpf);

	public Funcionario findByCodEmpresaAndCelular(Long codEmpresa, String celular);

	public List<Funcionario> findByCodEmpresaAndCargo(Long codEmpresa, String string);

	public List<Funcionario> findByCodEmpresaAndCargoOrCodEmpresaAndCargoOrCodEmpresaAndCargo(Long codEmpresa, String cargo, Long codEmpresa1, String cargo1, Long codEmpresa2, String cargo2);
	
	public List<Funcionario> findByCodEmpresa(Long codEmpresa);

	public List<Funcionario> findByCodEmpresaAndNomeContainingOrCodEmpresaAndCelular(Long codEmpresa, String nome, Long codEmpresa2, String celular);

	@Query("select nome from Funcionario u where u.codEmpresa=:cod AND u.cargo = 'GARCON' OR u.codEmpresa=:cod AND u.cargo = 'GERENTE' OR u.codEmpresa=:cod AND u.cargo = 'ATENDENTE'")
	public List<String> mostrarGarcons(@Param("cod") Long codEmpresa);
	
	@Query("SELECT COUNT(u) FROM Funcionario u WHERE u.codEmpresa=:cod")
    public int totalFuncionarios(@Param("cod") Long codEmpresa);
}
