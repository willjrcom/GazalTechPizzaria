package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.impressora.ImpressaoMatricial;

@Transactional(readOnly = true)
@Repository
public interface Impressoes extends JpaRepository<ImpressaoMatricial, Long>{

	public List<ImpressaoMatricial> findByCodEmpresaAndSetor(Long codEmpresa, String setor);

	public List<ImpressaoMatricial> findByCodEmpresa(Long codEmpresa);

}
