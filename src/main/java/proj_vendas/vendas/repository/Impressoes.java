package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.ImpressaoMatricial;

@Transactional(readOnly = true)
public interface Impressoes extends JpaRepository<ImpressaoMatricial, Long>{

	//public ImpressaoMatricial findByImpressao(String impressaoCompleta);

	public List<ImpressaoMatricial> findByCodEmpresa(int codEmpresa);

}
