package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Dado;

@Transactional(readOnly = true)
public interface Dados extends JpaRepository<Dado, Long>{

	public Dado findByCodEmpresaAndData(int codEmpresa, String data);

	public List<Dado> findByCodEmpresaAndTrocoFinalOrCodEmpresaAndTrocoInicio(int codEmpresa, double trocoI, int codEmpresa2, double trocoF);

	public List<Dado> findByCodEmpresaAndTrocoInicioNotLikeAndTrocoFinalNotLike(int codEmpresa, double trocoIN, double trocoFN);
}
