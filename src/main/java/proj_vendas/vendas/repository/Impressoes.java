package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import proj_vendas.vendas.model.ImpressaoMatricial;

public interface Impressoes extends JpaRepository<ImpressaoMatricial, Long>{

	public ImpressaoMatricial findByImpressao(String impressaoCompleta);

}
