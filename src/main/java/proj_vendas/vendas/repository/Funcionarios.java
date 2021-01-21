package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Funcionario;

@Transactional(readOnly = true)
public interface Funcionarios extends JpaRepository<Funcionario, Long>{

	public Funcionario findByCodEmpresaAndCpf(int codEmpresa, String cpf);

	public Funcionario findByCodEmpresaAndCelular(int codEmpresa, String celular);

	public List<Funcionario> findByCodEmpresaAndCargoOrCodEmpresaAndCargoOrCodEmpresaAndCargo(int codEmpresa, String cargo, int codEmpresa1, String cargo1, int codEmpresa2, String cargo2);
	
	public List<Funcionario> findByCodEmpresa(int codEmpresa);

	public List<Funcionario> findByCodEmpresaAndNomeContainingOrCodEmpresaAndCelular(int codEmpresa, String nome, int codEmpresa2, String celular);

	@Query("SELECT COUNT(u) FROM Funcionario u WHERE u.codEmpresa=:cod")
    public int totalFuncionarios(@Param("cod") int codEmpresa);

}
