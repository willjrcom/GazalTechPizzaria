package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Dado;

@Transactional(readOnly = true)
@Repository
public interface Dados extends JpaRepository<Dado, Long>{

	public Dado findByCodEmpresaAndData(int codEmpresa, String data);

	public List<Dado> findByCodEmpresa(int codEmpresa);
	
	public List<Dado> findByCodEmpresaAndTrocoFinalOrCodEmpresaAndTrocoInicio(int codEmpresa, float trocoI, int codEmpresa2, float trocoF);

	public List<Dado> findByCodEmpresaAndTrocoInicioNotLikeAndTrocoFinalNotLike(int codEmpresa, float trocoIN, float trocoFN);

}
