package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.cadastros.FichaTecnica;

@Transactional(readOnly = true) //evitar duplo acesso ao banco
@Repository
public interface FichaTecnicas extends JpaRepository<FichaTecnica, Long>{

	public FichaTecnica findByCodEmpresa(Long codEmpresa);
}
