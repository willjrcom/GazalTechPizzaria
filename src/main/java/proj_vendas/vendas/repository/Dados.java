package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.empresa.Dado;

@Transactional(readOnly = true)
@Repository
public interface Dados extends JpaRepository<Dado, Long>{

	public Dado findByCodEmpresaAndData(Long codEmpresa, String data);

	public List<Dado> findByCodEmpresa(Long codEmpresa);

	public List<Dado> findByCodEmpresaAndTrocoFinal(Long codEmpresa, float trocoFinal);

	public List<Dado> findByCodEmpresaAndDataBetween(Long codEmpresa, String dataInicio, String dataFinal);

	@Query("SELECT data FROM Dado u WHERE u.codEmpresa=:cod AND u.trocoFinal = 0")
	public List<String> findByDiasEmAberto(@Param("cod") Long codEmpresa);
}
